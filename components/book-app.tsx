"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { 
  Search, Book, Code, X, 
  Calculator, FunctionSquare, Grid3x3, TrendingUp, GitBranch,
  ChevronRight, Sparkles, BookOpen, Terminal
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sectionsData, pythonFunctions, type Exercise, type Section } from "@/lib/exercises-data";
import { ExerciseCard } from "./exercise-card";
import { getSectionProgress, loadProgress } from "@/lib/progress";
import { CheckCircle2, Circle } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  "calculator": <Calculator className="w-5 h-5" />,
  "function-square": <FunctionSquare className="w-5 h-5" />,
  "grid-3x3": <Grid3x3 className="w-5 h-5" />,
  "trending-up": <TrendingUp className="w-5 h-5" />,
  "git-branch": <GitBranch className="w-5 h-5" />,
};

export function BookApp() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showFunctionsPanel, setShowFunctionsPanel] = useState(false);
  const [functionFilter, setFunctionFilter] = useState("");
  const [activeTab, setActiveTab] = useState("sections");
  const [progressRefresh, setProgressRefresh] = useState(0);

  // Refresh progress when going back from exercise
  const refreshProgress = useCallback(() => {
    setProgressRefresh(prev => prev + 1);
  }, []);

  const sectionProgress = useMemo(() => {
    // progressRefresh dependency forces recalculation
    void progressRefresh;
    const result: Record<string, { completed: number; total: number; percentage: number }> = {};
    sectionsData.forEach(section => {
      result[section.id] = getSectionProgress(
        section.id,
        section.exercises.map(e => e.id)
      );
    });
    return result;
  }, [progressRefresh]);

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sectionsData;
    
    const query = searchQuery.toLowerCase();
    return sectionsData.map(section => ({
      ...section,
      exercises: section.exercises.filter(ex => 
        ex.title.toLowerCase().includes(query) ||
        ex.description.toLowerCase().includes(query) ||
        ex.pythonFunctions.some(f => f.toLowerCase().includes(query)) ||
        ex.number.toLowerCase().includes(query)
      )
    })).filter(section => section.exercises.length > 0);
  }, [searchQuery]);

  const filteredFunctions = useMemo(() => {
    if (!functionFilter.trim()) return pythonFunctions;
    const query = functionFilter.toLowerCase();
    return pythonFunctions.filter(f => 
      f.name.toLowerCase().includes(query) ||
      f.description.toLowerCase().includes(query) ||
      f.category.toLowerCase().includes(query)
    );
  }, [functionFilter]);

  const totalExercises = sectionsData.reduce((acc, s) => acc + s.exercises.length, 0);
  const totalCompleted = Object.values(sectionProgress).reduce((acc, p) => acc + p.completed, 0);
  
  const groupedFunctions = useMemo(() => {
    const groups: Record<string, typeof pythonFunctions> = {};
    filteredFunctions.forEach(f => {
      if (!groups[f.category]) groups[f.category] = [];
      groups[f.category].push(f);
    });
    return groups;
  }, [filteredFunctions]);

  const currentSection = selectedSection 
    ? sectionsData.find(s => s.id === selectedSection) 
    : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                <Book className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Computacion y Calculo Numerico</h1>
                <p className="text-xs text-muted-foreground">Ejercicios interactivos con Python</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary" className="gap-1">
                  <BookOpen className="w-3 h-3" />
                  {sectionsData.length} secciones
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Code className="w-3 h-3" />
                  {totalExercises} ejercicios
                </Badge>
                {totalCompleted > 0 && (
                  <Badge variant="secondary" className="gap-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                    <CheckCircle2 className="w-3 h-3" />
                    {totalCompleted}/{totalExercises} completados
                  </Badge>
                )}
              </div>
              <Button 
                variant={showFunctionsPanel ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFunctionsPanel(!showFunctionsPanel)}
                className="gap-2"
              >
                <Terminal className="w-4 h-4" />
                <span className="hidden sm:inline">Funciones Python</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar ejercicios por titulo, descripcion o funcion Python..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base bg-card border-border"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-flex">
                <TabsTrigger value="sections" className="gap-2">
                  <BookOpen className="w-4 h-4" />
                  Secciones
                </TabsTrigger>
                <TabsTrigger value="all" className="gap-2">
                  <Code className="w-4 h-4" />
                  Todos los Ejercicios
                </TabsTrigger>
              </TabsList>

              {/* Sections View */}
              <TabsContent value="sections" className="space-y-4">
                {selectedExercise ? (
                  <div className="space-y-4">
                    <Button 
                      variant="ghost" 
                      onClick={() => { setSelectedExercise(null); refreshProgress(); }}
                      className="gap-2"
                    >
                      <ChevronRight className="w-4 h-4 rotate-180" />
                      Volver a {currentSection?.title || "secciones"}
                    </Button>
                    <ExerciseCard exercise={selectedExercise} expanded />
                  </div>
                ) : selectedSection && currentSection ? (
                  <div className="space-y-4">
                    <Button 
                      variant="ghost" 
                      onClick={() => setSelectedSection(null)}
                      className="gap-2"
                    >
                      <ChevronRight className="w-4 h-4 rotate-180" />
                      Volver a secciones
                    </Button>
                    
                    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            {iconMap[currentSection.icon] || <Calculator className="w-6 h-6" />}
                          </div>
                          <div>
                            <CardTitle className="text-xl">{currentSection.title}</CardTitle>
                            <p className="text-sm text-muted-foreground">{currentSection.exercises.length} ejercicios</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{currentSection.description}</p>
                      </CardContent>
                    </Card>

                    <div className="grid gap-4">
                      {currentSection.exercises.map((exercise) => {
                        const isCompleted = loadProgress().completedExercises.includes(exercise.id);
                        return (
                        <Card 
                          key={exercise.id} 
                          className="cursor-pointer hover:border-primary/50 transition-colors"
                          onClick={() => setSelectedExercise(exercise)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  {isCompleted && (
                                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                  )}
                                  <Badge variant="outline" className="text-xs">
                                    {exercise.number}
                                  </Badge>
                                  <Badge 
                                    variant={
                                      exercise.difficulty === 'básico' ? 'secondary' :
                                      exercise.difficulty === 'intermedio' ? 'default' : 'destructive'
                                    }
                                    className="text-xs"
                                  >
                                    {exercise.difficulty}
                                  </Badge>
                                  {exercise.useSuiteNumerica && (
                                    <Badge variant="outline" className="text-xs gap-1 text-accent border-accent">
                                      <Sparkles className="w-3 h-3" />
                                      Suite Numerica
                                    </Badge>
                                  )}
                                </div>
                                <h3 className="font-bold text-foreground mb-1 text-base">{exercise.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2 font-medium">{exercise.description}</p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {exercise.pythonFunctions.slice(0, 4).map((func) => (
                                    <Badge key={func} variant="secondary" className="text-xs font-mono">
                                      {func}
                                    </Badge>
                                  ))}
                                  {exercise.pythonFunctions.length > 4 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{exercise.pythonFunctions.length - 4}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            </div>
                          </CardContent>
                        </Card>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSections.map((section) => {
                      const progress = sectionProgress[section.id] || { completed: 0, total: section.exercises.length, percentage: 0 };
                      return (
                      <Card 
                        key={section.id}
                        className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group"
                        onClick={() => setSelectedSection(section.id)}
                      >
                        <CardContent className="p-5">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                              {iconMap[section.icon] || <Calculator className="w-6 h-6" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-foreground text-lg mb-1 line-clamp-2">{section.title}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-2 font-medium">{section.description}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="secondary" className="text-xs">
                                  {progress.completed}/{progress.total}
                                </Badge>
                                {progress.completed > 0 && (
                                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-[100px]">
                                    <div 
                                      className="h-full bg-green-500 dark:bg-green-400 rounded-full transition-all"
                                      style={{ width: `${progress.percentage}%` }}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                       </Card>
                      );
                    })}
                  </div>
                )}
              </TabsContent>

              {/* All Exercises View */}
              <TabsContent value="all" className="space-y-4">
                {selectedExercise ? (
                  <div className="space-y-4">
                    <Button 
                      variant="ghost" 
                      onClick={() => { setSelectedExercise(null); refreshProgress(); }}
                      className="gap-2"
                    >
                      <ChevronRight className="w-4 h-4 rotate-180" />
                      Volver a ejercicios
                    </Button>
                    <ExerciseCard exercise={selectedExercise} expanded />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredSections.map((section) => (
                      <div key={section.id}>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            {iconMap[section.icon] || <Calculator className="w-4 h-4" />}
                          </div>
                          <h2 className="font-semibold text-foreground">{section.title}</h2>
                          <Badge variant="secondary" className="text-xs ml-auto">
                            {section.exercises.length}
                          </Badge>
                        </div>
                        <div className="grid gap-3">
                          {section.exercises.map((exercise) => {
                            const isCompleted = loadProgress().completedExercises.includes(exercise.id);
                            return (
                            <Card 
                              key={exercise.id}
                              className="cursor-pointer hover:border-primary/50 transition-colors"
                              onClick={() => setSelectedExercise(exercise)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                  {isCompleted && (
                                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                  )}
                                  <Badge variant="outline" className="text-xs shrink-0">
                                    {exercise.number}
                                  </Badge>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-foreground truncate text-base">{exercise.title}</h3>
                                  </div>
                                  <Badge 
                                    variant={
                                      exercise.difficulty === 'básico' ? 'secondary' :
                                      exercise.difficulty === 'intermedio' ? 'default' : 'destructive'
                                    }
                                    className="text-xs shrink-0"
                                  >
                                    {exercise.difficulty}
                                  </Badge>
                                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                                </div>
                              </CardContent>
                            </Card>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Functions Sidebar */}
          {showFunctionsPanel && (
            <aside className="hidden lg:block w-80 shrink-0">
              <Card className="sticky top-24">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Terminal className="w-4 h-4" />
                    Funciones Python
                  </CardTitle>
                  <Input
                    type="text"
                    placeholder="Filtrar funciones..."
                    value={functionFilter}
                    onChange={(e) => setFunctionFilter(e.target.value)}
                    className="h-8 text-sm"
                  />
                </CardHeader>
                <CardContent className="max-h-[calc(100vh-220px)] overflow-y-auto space-y-4">
                  {Object.entries(groupedFunctions).map(([category, funcs]) => (
                    <div key={category}>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        {category}
                      </h4>
                      <div className="space-y-1">
                        {funcs.map((func) => (
                          <button
                            key={func.name}
                            className="w-full text-left p-2 rounded-md hover:bg-muted/50 transition-colors"
                            onClick={() => setSearchQuery(func.name.replace("()", ""))}
                          >
                            <code className="text-xs font-mono text-primary">{func.name}</code>
                            <p className="text-xs text-muted-foreground mt-0.5">{func.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
