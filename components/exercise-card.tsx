"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Editor from "@monaco-editor/react";
import { 
  Play, Lightbulb, Code, Copy, Check, 
  RotateCcw, Sparkles, BookOpen, Terminal, Loader2, LineChart, ImageIcon
} from "lucide-react";
import { type Exercise, SUITE_NUMERICA_CODE } from "@/lib/exercises-data";
import { useTheme } from "next-themes";

declare global {
  interface Window {
    loadPyodide: (options: { indexURL: string }) => Promise<any>;
  }
}

interface ExerciseCardProps {
  exercise: Exercise;
  expanded?: boolean;
}

export function ExerciseCard({ exercise, expanded = false }: ExerciseCardProps) {
  const [code, setCode] = useState(exercise.starterCode || "# Escribe tu codigo aqui\n");
  const [output, setOutput] = useState<string>("");
  const [graphImage, setGraphImage] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pyodide, setPyodide] = useState<any>(null);
  const [pyodideLoading, setPyodideLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("code");
  const pyodideRef = useRef<any>(null);
  const { theme } = useTheme();
  const [editorTheme, setEditorTheme] = useState("vs-light");

  useEffect(() => {
    setEditorTheme(theme === "dark" ? "vs-dark" : "vs-light");
  }, [theme]);

  // Load Pyodide
  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    if (pyodide) return pyodide;
    
    setPyodideLoading(true);
    try {
      await waitForPyodideScript();
      const pyodideModule = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/"
      });
      
      // Load numpy, scipy and matplotlib
      await pyodideModule.loadPackage(['numpy', 'scipy', 'matplotlib']);
      
      // Configure matplotlib for non-interactive backend
      await pyodideModule.runPythonAsync(`
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import io
import base64
`);
      
      pyodideRef.current = pyodideModule;
      setPyodide(pyodideModule);
      return pyodideModule;
    } catch (error) {
      console.error("Error loading Pyodide:", error);
      throw error;
    } finally {
      setPyodideLoading(false);
    }
  }, [pyodide]);

  // Load Pyodide script on component mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.hasOwnProperty('loadPyodide')) {
      const script = document.createElement('script');
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";
      script.async = true;
      script.id = "pyodide-script";
      document.head.appendChild(script);
    }
  }, []);

  const waitForPyodideScript = () => {
    return new Promise<void>((resolve, reject) => {
      if (typeof window !== 'undefined' && window.hasOwnProperty('loadPyodide')) {
        resolve();
        return;
      }
      const script = document.getElementById('pyodide-script');
      if (!script) {
        reject(new Error("Pyodide script not found"));
        return;
      }
      script.addEventListener('load', () => resolve());
      script.addEventListener('error', () => reject(new Error("Failed to load Pyodide script")));
      
      // Safety timeout
      setTimeout(() => reject(new Error("Timeout loading Pyodide script")), 10000);
    });
  };

  const runCode = async (codeToRun: string) => {
    setIsRunning(true);
    setOutput("");
    setGraphImage(null);
    
    try {
      const py = await loadPyodide();
      
      // Reset stdout/stderr and matplotlib
      await py.runPythonAsync(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
import matplotlib.pyplot as plt
plt.close('all')
_captured_graph_data = None
`);

      // Add Suite Numerica if needed
      let fullCode = codeToRun;
      if (exercise.useSuiteNumerica) {
        fullCode = SUITE_NUMERICA_CODE + "\n\n" + codeToRun;
      }

      // Replace plt.show() with our capture function
      fullCode = fullCode.replace(/plt\.show\(\)/g, `
# Capturar gráfico como imagen base64
buf = io.BytesIO()
plt.savefig(buf, format='png', dpi=100, bbox_inches='tight', facecolor='white')
buf.seek(0)
_captured_graph_data = base64.b64encode(buf.read()).decode('utf-8')
buf.close()
plt.close('all')
`);
      
      // Run the code
      try {
        await py.runPythonAsync(fullCode);
      } catch (pyError: any) {
        // Get stderr for Python errors
        const stderr = await py.runPythonAsync(`
err = sys.stderr.getvalue()
sys.stderr = StringIO()
err
`);
        throw new Error(stderr || pyError.message);
      }
      
      // Get output
      const stdout = await py.runPythonAsync(`
output = sys.stdout.getvalue()
sys.stdout = StringIO()
output
`);

      // Check for graph
      const graphData = await py.runPythonAsync(`_captured_graph_data`);
      
      if (graphData && graphData !== 'None') {
        setGraphImage(`data:image/png;base64,${graphData}`);
      }

      setOutput(stdout || (graphData ? "Grafico generado correctamente" : "Codigo ejecutado correctamente (sin salida de texto)"));
      
    } catch (error: any) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetCode = () => {
    setCode(exercise.starterCode || "# Escribe tu codigo aqui\n");
    setOutput("");
    setGraphImage(null);
  };

  const loadSolution = () => {
    setCode(exercise.solution);
  };

  if (!expanded) {
    return (
      <Card className="hover:border-primary/50 transition-colors cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Badge variant="outline" className="shrink-0">{exercise.number}</Badge>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground">{exercise.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{exercise.description}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {exercise.requiresGraph && (
                <Badge variant="outline" className="gap-1 text-accent border-accent">
                  <LineChart className="w-3 h-3" />
                </Badge>
              )}
              <Badge 
                variant={
                  exercise.difficulty === 'básico' ? 'secondary' :
                  exercise.difficulty === 'intermedio' ? 'default' : 'destructive'
                }
              >
                {exercise.difficulty}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant="outline">{exercise.number}</Badge>
              <Badge 
                variant={
                  exercise.difficulty === 'básico' ? 'secondary' :
                  exercise.difficulty === 'intermedio' ? 'default' : 'destructive'
                }
              >
                {exercise.difficulty}
              </Badge>
              {exercise.useSuiteNumerica && (
                <Badge variant="outline" className="gap-1 text-accent border-accent">
                  <Sparkles className="w-3 h-3" />
                  Suite Numerica
                </Badge>
              )}
              {exercise.requiresGraph && (
                <Badge variant="outline" className="gap-1 text-blue-600 border-blue-300 bg-blue-50">
                  <LineChart className="w-3 h-3" />
                  Grafico
                </Badge>
              )}
            </div>
            <CardTitle className="text-xl">{exercise.title}</CardTitle>
          </div>
        </div>
        <p className="text-muted-foreground mt-2">{exercise.description}</p>
        
        <div className="flex flex-wrap gap-1 mt-3">
          {exercise.pythonFunctions.map((func) => (
            <Badge key={func} variant="secondary" className="font-mono text-xs">
              {func}
            </Badge>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="code" className="gap-2">
              <Code className="w-4 h-4" />
              <span className="hidden sm:inline">Editor</span>
            </TabsTrigger>
            <TabsTrigger value="solution" className="gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Solucion</span>
            </TabsTrigger>
            <TabsTrigger value="explanation" className="gap-2">
              <Lightbulb className="w-4 h-4" />
              <span className="hidden sm:inline">Explicacion</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="code" className="space-y-4 mt-4">
            {/* Code Editor */}
            <div className="rounded-lg border border-border overflow-hidden">
              <div className="bg-muted/50 px-4 py-2 flex items-center justify-between border-b border-border">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Terminal className="w-4 h-4" />
                  Tu codigo
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetCode}
                    className="h-7 text-xs"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Reiniciar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(code)}
                    className="h-7 text-xs"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  </Button>
                </div>
              </div>
              <div className="h-96 border rounded-md overflow-hidden">
                <Editor
                  height="384px"
                  language="python"
                  theme={editorTheme}
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 4,
                    wordWrap: "on",
                    padding: { top: 12, bottom: 12 },
                    folding: true,
                    renderLineHighlight: "line",
                    contextmenu: true,
                    quickSuggestions: false,
                    suggestOnTriggerCharacters: false,
                  }}
                />
              </div>
            </div>

            {/* Run Button */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button 
                onClick={() => runCode(code)}
                disabled={isRunning || pyodideLoading}
                className="gap-2"
              >
                {isRunning || pyodideLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {pyodideLoading ? "Cargando Python..." : "Ejecutando..."}
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Ejecutar
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={loadSolution}
                className="gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Cargar solucion
              </Button>
              {exercise.requiresGraph && (
                <span className="text-xs text-muted-foreground flex items-center gap-1 ml-2">
                  <LineChart className="w-3 h-3" />
                  Este ejercicio genera graficos
                </span>
              )}
            </div>

            {/* Graph Output */}
            {graphImage && (
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="bg-blue-50 px-4 py-2 border-b border-border flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Grafico generado</span>
                </div>
                <div className="p-4 bg-white flex justify-center">
                  <img 
                    src={graphImage} 
                    alt="Grafico generado por matplotlib" 
                    className="max-w-full h-auto rounded border border-border"
                  />
                </div>
              </div>
            )}

            {/* Text Output */}
            {output && (
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="bg-muted/50 px-4 py-2 border-b border-border">
                  <span className="text-sm font-medium">Salida</span>
                </div>
                <div className="p-4 bg-background min-h-[100px] max-h-[400px] overflow-auto">
                  <pre className="whitespace-pre-wrap font-mono text-sm">{output}</pre>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="solution" className="space-y-4 mt-4">
            <div className="rounded-lg border border-border overflow-hidden">
              <div className="bg-muted/50 px-4 py-2 flex items-center justify-between border-b border-border">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  Solucion completa
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(exercise.solution)}
                  className="h-7 text-xs"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </Button>
              </div>
              <div className="h-[500px] border rounded-md overflow-hidden">
                <Editor
                  height="500px"
                  language="python"
                  theme={editorTheme}
                  value={exercise.solution}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 13,
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 4,
                    wordWrap: "on",
                    padding: { top: 12, bottom: 12 },
                    folding: true,
                    renderLineHighlight: "line",
                  }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button 
                onClick={() => runCode(exercise.solution)}
                disabled={isRunning || pyodideLoading}
                className="gap-2"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Ejecutando...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Ejecutar solucion
                  </>
                )}
              </Button>
              {exercise.requiresGraph && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <LineChart className="w-3 h-3" />
                  La solucion incluye graficos
                </span>
              )}
            </div>

            {/* Graph Output in Solution Tab */}
            {graphImage && (
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="bg-blue-50 px-4 py-2 border-b border-border flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Grafico generado</span>
                </div>
                <div className="p-4 bg-white flex justify-center">
                  <img 
                    src={graphImage} 
                    alt="Grafico generado por matplotlib" 
                    className="max-w-full h-auto rounded border border-border"
                  />
                </div>
              </div>
            )}

            {output && (
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="bg-muted/50 px-4 py-2 border-b border-border">
                  <span className="text-sm font-medium">Salida</span>
                </div>
                <div className="p-4 bg-background min-h-[100px] max-h-[400px] overflow-auto">
                  <pre className="whitespace-pre-wrap font-mono text-sm">{output}</pre>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="explanation" className="mt-4">
            <Card className="bg-accent/5 border-accent/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Por que esta solucion funciona</h4>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {exercise.explanation}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
