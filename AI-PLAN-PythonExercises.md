# Plan de Mejoras — Ejercicios Python (Zero-Cost)

## Principio

100% gratis, sin APIs externas. Todo corre en el navegador con los recursos de Pyodide.
Cada feature se implementa de forma independiente y testeable.

---

## Feature A: Debug Asistido (Prioridad Alta)

### Objetivo
Mostrar errores amigables y sugerencias de solución cuando el código del estudiante falla, en vez de mostrar el traceback crudo de Python.

### Estrategia
Parser de tracebacks + mapa de patrones de error comunes + mensajes contextuales según el ejercicio.

### Implementación

```typescript
// lib/debug-assistant.ts

interface ErrorPattern {
  match: RegExp;
  message: string;
  suggestion?: string;
  category: 'type' | 'name' | 'index' | 'import' | 'syntax' | 'attribute' | 'math' | 'numpy';
}

const errorPatterns: ErrorPattern[] = [
  // --- Errores de importación ---
  {
    match: /ModuleNotFoundError: No module named '(\w+)'/,
    message: "El módulo '$1' no existe en Pyodide.",
    suggestion: "Verificá que el módulo esté disponible. En Pyodide: math, numpy, scipy, matplotlib.",
    category: 'import',
  },
  {
    match: /NameError: name '(\w+)' is not defined/,
    message: "La variable o función '$1' no está definida.",
    suggestion: "Revisá que esté definida antes de usarla, o que el nombre esté bien escrito (case-sensitive).",
    category: 'name',
  },

  // --- Errores de tipo ---
  {
    match: /TypeError: unsupported operand type\(s\) for \*.*'str'.*'float'/,
    message: "Estás multiplicando un string por un float.",
    suggestion: "Convertí el string a número: float(valor) o int(valor).",
    category: 'type',
  },
  {
    match: /TypeError:.*got an unexpected keyword argument/,
    message: "Pasaste un parámetro que la función no acepta.",
    suggestion: "Revisá la documentación de la función para ver los parámetros correctos.",
    category: 'type',
  },

  // --- Errores de índice ---
  {
    match: /IndexError: list index out of range/,
    message: "Estás accediendo a un índice que no existe en la lista.",
    suggestion: "Revisá que el índice sea menor a len(lista). Usá len()-1 como máximo.",
    category: 'index',
  },

  // --- Errores matemáticos ---
  {
    match: /ZeroDivisionError: division by zero/,
    message: "Estás dividiendo por cero.",
    suggestion: "Verificá que el divisor no sea 0 antes de dividir.",
    category: 'math',
  },
  {
    match: /ValueError: math domain error/,
    message: "Estás usando una función matemática con un valor inválido.",
    suggestion: "log() necesita un número positivo, sqrt() necesita un número >= 0.",
    category: 'math',
  },

  // --- Errores NumPy ---
  {
    match: /ValueError: operands could not be broadcast together/,
    message: "Los arrays tienen formas incompatibles.",
    suggestion: "Verificá que las formas de los arrays sean compatibles. Usá .shape para ver las dimensiones.",
    category: 'numpy',
  },
  {
    match: /AttributeError: '(\w+)' object has no attribute '(\w+)'/,
    message: "El objeto '$1' no tiene el atributo '$2'.",
    suggestion: "Revisá que estés usando el nombre correcto (case-sensitive).",
    category: 'attribute',
  },

  // --- Errores de sintaxis ---
  {
    match: /SyntaxError: invalid syntax/,
    message: "Hay un error de sintaxis en el código.",
    suggestion: "Revisá paréntesis, comas, dos puntos y sangría.",
    category: 'syntax',
  },
  {
    match: /IndentationError:.*expected an indented block/,
    message: "Falta sangría después de dos puntos (:).",
    suggestion: "Después de if/for/while/def, el bloque siguiente debe estar indentado.",
    category: 'syntax',
  },
]

interface DebugResult {
  message: string;
  suggestion?: string;
  category: string;
  line?: number;
}

function analyzeError(traceback: string): DebugResult {
  for (const pattern of errorPatterns) {
    const match = traceback.match(pattern.match)
    if (match) {
      const line = extractLineFromTraceback(traceback)
      return {
        message: pattern.message,
        suggestion: pattern.suggestion,
        category: pattern.category,
        line,
      }
    }
  }

  // Fallback genérico
  return {
    message: 'Error de ejecución. Revisá:',
    suggestion: '1. Tipos de datos\n2. Importaciones\n3. Parámetros de funciones',
    category: 'unknown',
  }
}

function extractLineFromTraceback(traceback: string): number | undefined {
  const lineMatch = traceback.match(/line (\d+)/)
  return lineMatch ? parseInt(lineMatch[1]) : undefined
}
```

### Integración con exercise-card.tsx

En el bloque catch de `runCode()`, en vez de:
```typescript
setOutput(`Error: ${error.message}`);
```

Usar:
```typescript
import { analyzeError } from '@/lib/debug-assistant'

// En el catch:
const debug = analyzeError(error.message)
setOutput(`❌ ${debug.message}\n💡 ${debug.suggestion || ''}`)
```

### Estimación
- ~2KB de código
- ~1-2 días de implementación
- ~20 patrones iniciales (expandibles)

---

## Feature B: Explicación Línea a Línea (Prioridad Media)

### Objetivo
Mostrar explicaciones contextuales del código del estudiante, línea por línea, para ayudar a entender qué hace cada parte.

### Estrategia
Pattern matching sobre el código del editor, con explicaciones predefinidas por tipo de línea. Se muestra como expandible debajo del editor.

### Implementación

```typescript
// lib/code-explainer.ts

interface ExplanationLine {
  line: number;
  code: string;
  explanation: string | null;
}

const linePatterns: Array<{ match: RegExp; desc: (m: RegExpMatchArray) => string }> = [
  { match: /^import (\w+)/, desc: (m) => `Importa el módulo ${m[1]}` },
  { match: /^from (\w+) import/, desc: (m) => `Importa funciones de ${m[1]}` },
  { match: /def (\w+)\((.*)\):/, desc: (m) => `Define la función ${m[1]}${m[2] ? ' con parámetros ' + m[2] : ''}` },
  { match: /^(\w+)\s*=\s*\[/, desc: (m) => `Crea una lista y la guarda en ${m[1]}` },
  { match: /np\.array\(/, desc: () => 'Crea un array de NumPy' },
  { match: /np\.linspace\(/, desc: () => 'Genera puntos equiespaciados' },
  { match: /np\.zeros\(/, desc: () => 'Crea un array lleno de ceros' },
  { match: /plt\.plot\(/, desc: () => 'Grafica una línea' },
  { match: /plt\.scatter\(/, desc: () => 'Grafica puntos dispersos' },
  { match: /plt\.xlabel\(/, desc: () => 'Etiqueta el eje X' },
  { match: /plt\.ylabel\(/, desc: () => 'Etiqueta el eje Y' },
  { match: /plt\.title\(/, desc: () => 'Agrega un título al gráfico' },
  { match: /plt\.show\(\)/, desc: () => 'Muestra el gráfico' },
  { match: /for (\w+) in range\(/, desc: (m) => `Itera ${m[1]} veces` },
  { match: /for (\w+) in (\w+):/, desc: (m) => `Itera sobre cada elemento de ${m[2]}` },
  { match: /if (.+):/, desc: (m) => `Condición: ${m[1]}` },
  { match: /return (.+)/, desc: (m) => `Devuelve ${m[1]}` },
  { match: /print\(/, desc: () => 'Muestra información en consola' },
]

function explainCode(code: string): ExplanationLine[] {
  const lines = code.split('\n')
  return lines.map((line, i) => ({
    line: i + 1,
    code: line,
    explanation: explainLine(line),
  })).filter(l => l.explanation !== null)
}

function explainLine(line: string): string | null {
  for (const pattern of linePatterns) {
    const m = line.match(pattern.match)
    if (m) return pattern.desc(m)
  }
  return null
}
```

### Integración con exercise-card.tsx

Nueva pestaña "Detalles" o sección expandible debajo del editor:
```tsx
const explanations = explainCode(code)
// Mostrar solo líneas que tienen explicación
// Renderizar como lista de ítems: línea → explicación
```

### Estimación
- ~2KB de código
- ~1 día de implementación
- ~15-20 patrones iniciales (expandibles)

---

## Feature C: Progreso y Sidebar Mejorada (Prioridad Media)

### Objetivo
Guardar qué ejercicios completó el estudiante y mostrar progreso visual en la interfaz.

### Estrategia
- localStorage para persistir progreso
- Badge de progreso por sección en el sidebar
- Indicador visual en cada ejercicio (check, pendiente)

### Implementación

```typescript
// lib/progress.ts

interface Progress {
  completedExercises: string[]; // IDs de ejercicios completados
  lastAccessed: string;         // ID del último ejercicio visto
  startedAt: string;            // Timestamp de primera vez
}

const STORAGE_KEY = 'python-exercises-progress'

function loadProgress(): Progress {
  if (typeof window === 'undefined') return getDefaultProgress()
  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) return getDefaultProgress()
  return JSON.parse(data)
}

function saveProgress(progress: Progress): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

function markExerciseCompleted(exerciseId: string): void {
  const progress = loadProgress()
  if (!progress.completedExercises.includes(exerciseId)) {
    progress.completedExercises.push(exerciseId)
    saveProgress(progress)
  }
}

function getSectionProgress(sectionId: string, totalExercises: number): number {
  const progress = loadProgress()
  const completed = progress.completedExercises.filter(id => id.startsWith(sectionId)).length
  return totalExercises > 0 ? completed / totalExercises : 0
}

function getDefaultProgress(): Progress {
  return {
    completedExercises: [],
    lastAccessed: '',
    startedAt: new Date().toISOString(),
  }
}
```

### Cambios en UI

1. **exercise-card.tsx** - Botón "Marcar como completado" después de ejecutar exitosamente
2. **book-app.tsx / sidebar** - Mostrar badge con % por sección:
   ```
   Algebra (8/15)
   Ecuaciones (3/10)
   ```
3. **exercise-card.tsx** - Indicador visual (check verde) si ya está completado

### Estimación
- ~3KB de código
- ~2-3 días de implementación
- localStorage (sin backend)

---

## Feature D: Variantes de Ejercicios (Prioridad Baja, Futuro)

### Objetivo
Generar variantes de ejercicios existentes cambiando constantes numéricas, para que el estudiante pueda practicar el mismo concepto con datos diferentes.

### Estrategia
Templates paramétricos para ejercicios matemáticos. No refactorizar la estructura existente - agregar un campo opcional `variants` a los exercises.

### Implementación conceptual

```typescript
// Ejemplo: ejercicio de resolver ecuación cuadrática
{
  id: '4.11',
  title: 'Resolución de Ecuación Cuadrática',
  variantParams: {
    a: () => Math.floor(Math.random() * 5) + 1,
    b: () => Math.floor(Math.random() * 10) - 5,
    c: () => Math.floor(Math.random() * 5) + 1,
  },
  generateVariant: (params) => ({
    description: `Resolvé x² + ${params.b}x + ${params.c} = 0`,
    starterCode: `import math\n\na = ${params.a}\nb = ${params.b}\nc = ${params.c}\n\n# Calculá las raíces\n`,
  }),
}
```

### Estimación
- Solo para ejercicios de álgebra y ecuaciones
- ~3-4 días de implementación
- Requiere evaluar las soluciones automáticamente (no solo ejecutar)

---

## Roadmap

| Fase | Feature | Esfuerzo | Dependencias |
|------|---------|----------|--------------|
| 1 | Debug Asistido (Feature A) | 1-2 días | Ninguna |
| 2 | Explicación Línea a Línea (Feature B) | 1 día | Ninguna |
| 3 | Progreso y Sidebar (Feature C) | 2-3 días | Feature A (para marcar completado) |
| 4 | Variantes de Ejercicios (Feature D) | 3-4 días | Feature C (para tracking) |

**Total**: ~7-10 días, $0 en costos de API

---

## Recursos para Investigar

- **localStorage + React hooks**: `useLocalStorage` hook pattern
- **Monaco Editor diagnostics**: https://microsoft.github.io/monaco-editor/docs.html
- **Pyodide error handling**: https://pyodide.org/en/stable/usage/api/js/
- **shadcn/ui components**: https://ui.shadcn.com (ya instalado)
- **Radix Progress**: Ya en el proyecto
- **Tailwind animations**: para transiciones de progreso
