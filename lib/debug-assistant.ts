interface ErrorPattern {
  match: RegExp;
  message: string;
  suggestion?: string;
  category: 'type' | 'name' | 'index' | 'import' | 'syntax' | 'attribute' | 'math' | 'numpy';
}

const errorPatterns: ErrorPattern[] = [
  // --- Importación ---
  {
    match: /ModuleNotFoundError: No module named '(\w+)'/,
    message: "El módulo '$1' no está disponible en este entorno.",
    suggestion: "Verificá que el módulo esté soportado. En Pyodide: math, numpy, scipy, matplotlib.",
    category: 'import',
  },
  {
    match: /ModuleNotFoundError: No module named 'lib'/,
    message: "No existe un módulo 'lib'.",
    suggestion: "Si usás SuiteNumericaMaster, no necesitás importarlo. Las funciones ya están disponibles.",
    category: 'import',
  },
  {
    match: /ImportError: cannot import name '(\w+)' from '(\w+)'/,
    message: "No se puede importar '$1' de '$2'.",
    suggestion: "Revisá que el nombre exista en el módulo (case-sensitive).",
    category: 'import',
  },

  // --- Nombre ---
  {
    match: /NameError: name '(\w+)' is not defined/,
    message: "La variable o función '$1' no está definida.",
    suggestion: "Definila antes de usarla, o revisá si el nombre está bien escrito.",
    category: 'name',
  },
  {
    match: /NameError: name '(\w+)' is not defined.*\n.*did you mean/,
    message: "La variable o función '$1' no está definida. ¿Quizás quisiste decir otro nombre?",
    suggestion: "Revisá la ortografía (Python distingue mayúsculas y minúsculas).",
    category: 'name',
  },

  // --- Tipo ---
  {
    match: /TypeError: unsupported operand type\(s\) for [\*\/\+\-].*'str'.*'float'/,
    message: "Estás operando entre un string y un número.",
    suggestion: "Convertí el string a número con float() o int().",
    category: 'type',
  },
  {
    match: /TypeError: unsupported operand type\(s\) for [\*\/\+\-].*'float'.*'str'/,
    message: "Estás operando entre un número y un string.",
    suggestion: "Convertí el string a número con float() o int().",
    category: 'type',
  },
  {
    match: /TypeError:.*got an unexpected keyword argument/,
    message: "Pasaste un parámetro que la función no acepta.",
    suggestion: "Revisá la documentación de la función para ver los parámetros correctos.",
    category: 'type',
  },
  {
    match: /TypeError:.*missing \d+ required positional argument/,
    message: "Faltan argumentos obligatorios en la llamada a la función.",
    suggestion: "Revisá cuántos parámetros necesita la función y pasalos todos.",
    category: 'type',
  },
  {
    match: /TypeError: '(\w+)' object is not callable/,
    message: "Estás tratando '$1' como una función, pero no lo es.",
    suggestion: "Verificá que no estés usando paréntesis() en una variable.",
    category: 'type',
  },

  // --- Índice ---
  {
    match: /IndexError: list index out of range/,
    message: "Estás accediendo a un índice que no existe en la lista.",
    suggestion: "El índice debe ser menor a len(lista). Usá lista[-1] para el último elemento.",
    category: 'index',
  },
  {
    match: /IndexError:.*index (\d+) is out of range for axis (\d+)/,
    message: "El índice está fuera del rango del array.",
    suggestion: "Revisá las dimensiones del array con .shape.",
    category: 'index',
  },

  // --- Matemáticas ---
  {
    match: /ZeroDivisionError: division by zero/,
    message: "Estás dividiendo por cero.",
    suggestion: "Verificá que el divisor no sea 0 antes de dividir.",
    category: 'math',
  },
  {
    match: /ValueError: math domain error/,
    message: "Valor inválido para una función matemática.",
    suggestion: "log() necesita un número positivo, sqrt() necesita un número >= 0.",
    category: 'math',
  },
  {
    match: /OverflowError:.*too large/,
    message: "El resultado es demasiado grande para ser representado.",
    suggestion: "Usá np.inf o verificá que los números no crezcan demasiado.",
    category: 'math',
  },

  // --- NumPy ---
  {
    match: /ValueError: operands could not be broadcast together/,
    message: "Los arrays tienen formas incompatibles para la operación.",
    suggestion: "Verificá que las formas sean compatibles. Usá .shape para ver las dimensiones.",
    category: 'numpy',
  },
  {
    match: /ValueError: shapes \((\d+),(\d+)\) and \((\d+),(\d+)\) not aligned/,
    message: "Las matrices no son compatibles para multiplicación.",
    suggestion: "Para multiplicar matrices, las columnas de la primera deben igualar las filas de la segunda.",
    category: 'numpy',
  },
  {
    match: /LinAlgError:.*singular matrix/,
    message: "La matriz es singular (no tiene inversa).",
    suggestion: "El determinante es 0. Verificá que la matriz no tenga filas linealmente dependientes.",
    category: 'numpy',
  },

  // --- Atributo ---
  {
    match: /AttributeError: '(\w+)' object has no attribute '(\w+)'/,
    message: "El objeto '$1' no tiene el atributo '$2'.",
    suggestion: "Revisá que estés usando el nombre correcto (case-sensitive).",
    category: 'attribute',
  },
  {
    match: /AttributeError: module '(\w+)' has no attribute '(\w+)'/,
    message: "El módulo '$1' no tiene el atributo '$2'.",
    suggestion: "Revisá el nombre de la función. Pyodide usa versiones específicas de cada librería.",
    category: 'attribute',
  },

  // --- Sintaxis ---
  {
    match: /SyntaxError: invalid syntax/,
    message: "Error de sintaxis.",
    suggestion: "Revisá paréntesis, comas, dos puntos (:) y sangría.",
    category: 'syntax',
  },
  {
    match: /SyntaxError: invalid syntax.*\n.*Did you forget/,
    message: "Error de sintaxis. ¿Olvidaste algo?",
    suggestion: "Revisá que no falte un paréntesis, coma o dos puntos.",
    category: 'syntax',
  },
  {
    match: /IndentationError:.*expected an indented block/,
    message: "Falta sangría después de dos puntos (:).",
    suggestion: "Después de if/for/while/def, el bloque siguiente debe estar indentado (4 espacios).",
    category: 'syntax',
  },
  {
    match: /TabError:.*inconsistent use of tabs and spaces/,
    message: "Mezclaste tabs y espacios para sangría.",
    suggestion: "Usá solo espacios (4 espacios por nivel) en todo el código.",
    category: 'syntax',
  },
]

export interface DebugResult {
  message: string;
  suggestion?: string;
  category: string;
  line?: number;
  rawTraceback: string;
}

function extractLineFromTraceback(traceback: string): number | undefined {
  // Buscar "line X" en el traceback
  const lineMatch = traceback.match(/line (\d+)/)
  if (lineMatch) return parseInt(lineMatch[1])

  // Buscar "File \"<exec>\", line X"
  const execMatch = traceback.match(/File "<exec>", line (\d+)/)
  if (execMatch) return parseInt(execMatch[1])

  return undefined
}

export function analyzeError(traceback: string): DebugResult {
  const line = extractLineFromTraceback(traceback)

  for (const pattern of errorPatterns) {
    const match = traceback.match(pattern.match)
    if (match) {
      return {
        message: pattern.message,
        suggestion: pattern.suggestion,
        category: pattern.category,
        line,
        rawTraceback: traceback,
      }
    }
  }

  // Fallback genérico
  return {
    message: 'Error de ejecución.',
    suggestion: 'Revisá:\n• Tipos de datos (números vs strings)\n• Importaciones faltantes\n• Parámetros de funciones',
    category: 'unknown',
    line,
    rawTraceback: traceback,
  }
}
