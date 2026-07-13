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
import { analyzeError, type DebugResult } from "@/lib/debug-assistant";
import { useTheme } from "next-themes";
import { AlertTriangle, ChevronDown, ChevronRight } from "lucide-react";

function formatTextWithMath(text: string): React.ReactNode {
  if (!text) return null;
  
  const parts = text.split(/(\[[^\]]+\])/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('[') && part.endsWith(']')) {
      const content = part.slice(1, -1);
      return (
        <span key={index} className="math-formula-inline mx-1">
          {content}
        </span>
      );
    }
    return part;
  });
}

function MathText({ text }: { text: string }) {
  return <>{formatTextWithMath(text)}</>;
}

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
  const [debugInfo, setDebugInfo] = useState<DebugResult | null>(null);
  const [showTraceback, setShowTraceback] = useState(false);
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
    setDebugInfo(null);
    setShowTraceback(false);
    
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
      const debug = analyzeError(error.message);
      setDebugInfo(debug);
      setOutput(`${debug.message}\n\n${debug.suggestion || ''}`);
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
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1"><MathText text={exercise.description} /></p>
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
        <p className="text-muted-foreground mt-2 exercise-desc"><MathText text={exercise.description} /></p>
        
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
              <div className={`rounded-lg border overflow-hidden ${debugInfo ? 'border-red-300 dark:border-red-800' : 'border-border'}`}>
                <div className={`px-4 py-2 border-b flex items-center gap-2 ${debugInfo ? 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800' : 'bg-muted/50 border-border'}`}>
                  {debugInfo ? (
                    <>
                      <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span className="text-sm font-medium text-red-800 dark:text-red-300">Error</span>
                    </>
                  ) : (
                    <span className="text-sm font-medium">Salida</span>
                  )}
                </div>
                <div className="p-4 bg-background min-h-[100px] max-h-[400px] overflow-auto">
                  <pre className={`whitespace-pre-wrap font-mono text-sm ${debugInfo ? 'text-red-700 dark:text-red-300' : ''}`}>{output}</pre>
                </div>
                {debugInfo && (
                  <div className="border-t border-red-200 dark:border-red-800">
                    <button
                      onClick={() => setShowTraceback(!showTraceback)}
                      className="w-full px-4 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 flex items-center gap-1"
                    >
                      {showTraceback ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                      {showTraceback ? 'Ocultar' : 'Mostrar'} traceback completo
                    </button>
                    {showTraceback && (
                      <div className="px-4 pb-4 bg-red-50 dark:bg-red-950/50 border-t border-red-200 dark:border-red-800">
                        <pre className="whitespace-pre-wrap font-mono text-xs text-red-600 dark:text-red-400 mt-2 overflow-auto max-h-[300px]">{debugInfo.rawTraceback}</pre>
                      </div>
                    )}
                  </div>
                )}
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
              <div className={`rounded-lg border overflow-hidden ${debugInfo ? 'border-red-300 dark:border-red-800' : 'border-border'}`}>
                <div className={`px-4 py-2 border-b flex items-center gap-2 ${debugInfo ? 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800' : 'bg-muted/50 border-border'}`}>
                  {debugInfo ? (
                    <>
                      <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span className="text-sm font-medium text-red-800 dark:text-red-300">Error en solucion</span>
                    </>
                  ) : (
                    <span className="text-sm font-medium">Salida</span>
                  )}
                </div>
                <div className="p-4 bg-background min-h-[100px] max-h-[400px] overflow-auto">
                  <pre className={`whitespace-pre-wrap font-mono text-sm ${debugInfo ? 'text-red-700 dark:text-red-300' : ''}`}>{output}</pre>
                </div>
                {debugInfo && (
                  <div className="border-t border-red-200 dark:border-red-800">
                    <button
                      onClick={() => setShowTraceback(!showTraceback)}
                      className="w-full px-4 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 flex items-center gap-1"
                    >
                      {showTraceback ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                      {showTraceback ? 'Ocultar' : 'Mostrar'} traceback completo
                    </button>
                    {showTraceback && (
                      <div className="px-4 pb-4 bg-red-50 dark:bg-red-950/50 border-t border-red-200 dark:border-red-800">
                        <pre className="whitespace-pre-wrap font-mono text-xs text-red-600 dark:text-red-400 mt-2 overflow-auto max-h-[300px]">{debugInfo.rawTraceback}</pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="explanation" className="mt-4 space-y-4">
            {/* Sección: Cómo identificar qué usar */}
            <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2">CÓMO IDENTIFICAR QUÉ USAR</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400 leading-relaxed">
                      Lee el enunciado y busca las palabras clave que indican qué funciones necesitas:
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-blue-700 dark:text-blue-400">
                      <li>• <strong>"punto fijo"</strong> → iteración, despejar x = g(x)</li>
                      <li>• <strong>"Newton-Raphson"</strong> → derivadas, fórmula iterativa</li>
                      <li>• <strong>"EDO" o "ecuación diferencial"</strong> → solve_ivp, Euler</li>
                      <li>• <strong>"raíces de polinomio"</strong> → numpy.roots()</li>
                      <li>• <strong>"graficar"</strong> → matplotlib.pyplot</li>
                      <li>• <strong>"interpolar"</strong> → Lagrange, spline</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sección: Funciones necesarias */}
            <Card className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-green-800 dark:text-green-300 mb-2">FUNCIONES QUE NECESITAS</h4>
                    <div className="flex flex-wrap gap-2">
                      {exercise.pythonFunctions.map((func, idx) => (
                        <span key={idx} className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm font-mono">
                          {func}
                        </span>
                      ))}
                    </div>
                    <p className="mt-3 text-sm text-green-700 dark:text-green-400">
                      Estas funciones se identifican mirando las fórmulas y palabras clave del enunciado.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sección: Por qué funciona */}
            <Card className="bg-accent/5 border-accent/20">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div className="explanation-content flex-1">
                    <h4 className="font-semibold text-foreground mb-3">EXPLICACIÓN DETALLADA</h4>
                    <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      <MathText text={exercise.explanation} />
                    </div>
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
