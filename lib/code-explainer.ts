export interface ExplanationLine {
  line: number;
  code: string;
  explanation: string;
}

interface LinePattern {
  match: RegExp;
  desc: (m: RegExpMatchArray) => string;
}

const linePatterns: LinePattern[] = [
  // Importaciones
  { match: /^import (\w+)/, desc: (m) => `Importa el módulo ${m[1]}` },
  { match: /^from (\w+) import/, desc: (m) => `Importa funciones del módulo ${m[1]}` },

  // Funciones
  { match: /^def (\w+)\((.*)\):/, desc: (m) => `Define la función ${m[1]}${m[2] ? ' con parámetros: ' + m[2] : ''}` },
  { match: /return (.+)/, desc: (m) => `Devuelve el valor: ${m[1]}` },
  { match: /^class (\w+)/, desc: (m) => `Define la clase ${m[1]}` },

  // Asignaciones comunes
  { match: /^(\w+)\s*=\s*\[\]/, desc: (m) => `Crea una lista vacía llamada ${m[1]}` },
  { match: /^(\w+)\s*=\s*\{}/, desc: (m) => `Crea un diccionario vacío llamado ${m[1]}` },
  { match: /^(\w+)\s*=\s*(.+)$/, desc: (m) => `Asigna ${m[2]} a la variable ${m[1]}` },

  // NumPy
  { match: /np\.array\(/, desc: () => 'Crea un array de NumPy' },
  { match: /np\.linspace\(/, desc: () => 'Genera puntos equiespaciados entre dos valores' },
  { match: /np\.arange\(/, desc: () => 'Genera una secuencia de números con paso definido' },
  { match: /np\.zeros\(/, desc: () => 'Crea un array lleno de ceros' },
  { match: /np\.ones\(/, desc: () => 'Crea un array lleno de unos' },
  { match: /np\.dot\(/, desc: () => 'Calcula el producto punto entre arrays' },
  { match: /np\.cross\(/, desc: () => 'Calcula el producto vectorial' },
  { match: /np\.linalg\.det\(/, desc: () => 'Calcula el determinante de una matriz' },
  { match: /np\.linalg\.inv\(/, desc: () => 'Calcula la inversa de una matriz' },
  { match: /np\.linalg\.solve\(/, desc: () => 'Resuelve un sistema de ecuaciones lineales Ax = b' },
  { match: /np\.linalg\.eig\(/, desc: () => 'Calcula autovalores y autovectores' },
  { match: /np\.polyfit\(/, desc: () => 'Ajusta un polinomio por mínimos cuadrados' },
  { match: /np\.poly1d\(/, desc: () => 'Crea una función polinómica evaluable' },
  { match: /np\.roots\(/, desc: () => 'Encuentra las raíces de un polinomio' },
  { match: /np\.meshgrid\(/, desc: () => 'Crea una grilla 2D de coordenadas' },
  { match: /np\.linalg\.matrix_power\(/, desc: () => 'Eleva una matriz a una potencia' },
  { match: /np\.sqrt\(/, desc: () => 'Calcula la raíz cuadrada' },
  { match: /np\.exp\(/, desc: () => 'Calcula la exponencial (e^x)' },
  { match: /np\.log\(/, desc: () => 'Calcula el logaritmo natural' },
  { match: /np\.sin\(/, desc: () => 'Calcula el seno' },
  { match: /np\.cos\(/, desc: () => 'Calcula el coseno' },

  // Matplotlib
  { match: /plt\.plot\(/, desc: () => 'Grafica una línea' },
  { match: /plt\.scatter\(/, desc: () => 'Grafica puntos dispersos' },
  { match: /plt\.bar\(/, desc: () => 'Grafica barras' },
  { match: /plt\.xlabel\(/, desc: () => 'Etiqueta el eje X del gráfico' },
  { match: /plt\.ylabel\(/, desc: () => 'Etiqueta el eje Y del gráfico' },
  { match: /plt\.title\(/, desc: () => 'Agrega un título al gráfico' },
  { match: /plt\.legend\(/, desc: () => 'Muestra la leyenda del gráfico' },
  { match: /plt\.grid\(/, desc: () => 'Muestra la cuadrícula en el gráfico' },
  { match: /plt\.show\(\)/, desc: () => 'Muestra el gráfico en pantalla' },
  { match: /plt\.figure\(/, desc: () => 'Crea una nueva ventana de gráfico' },
  { match: /plt\.subplot\(/, desc: () => 'Crea un subgráfico dentro de la ventana' },
  { match: /plt\.savefig\(/, desc: () => 'Guarda el gráfico como imagen' },
  { match: /plt\.fill_between\(/, desc: () => 'Rellena el área entre dos curvas' },
  { match: /plt\.text\(/, desc: () => 'Agrega texto en una posición del gráfico' },
  { match: /plt\.annotate\(/, desc: () => 'Agrega una anotación con flecha' },
  { match: /plt\.axhline\(/, desc: () => 'Dibuja una línea horizontal' },
  { match: /plt\.axvline\(/, desc: () => 'Dibuja una línea vertical' },
  { match: /plt\.pie\(/, desc: () => 'Grafica un gráfico circular' },
  { match: /plt\.xlim\(/, desc: () => 'Define los límites del eje X' },
  { match: /plt\.ylim\(/, desc: () => 'Define los límites del eje Y' },
  { match: /plt\.style\.use\(/, desc: () => 'Cambia el estilo visual del gráfico' },

  // SciPy
  { match: /integrate\.quad\(/, desc: () => 'Calcula una integral definida numéricamente' },
  { match: /integrate\.solve_ivp\(/, desc: () => 'Resuelve una ecuación diferencial ordinaria (EDO)' },
  { match: /optimize\.fsolve\(/, desc: () => 'Encuentra la raíz de una ecuación no lineal' },
  { match: /optimize\.root_scalar\(/, desc: () => 'Busca raíz de una función escalar' },

  // SuiteNumericaMaster
  { match: /SuiteNumericaMaster\.punto_fijo\(/, desc: () => 'Busca raíz por iteración de punto fijo: x = g(x)' },
  { match: /SuiteNumericaMaster\.newton\(/, desc: () => 'Busca raíz por método de Newton-Raphson' },
  { match: /SuiteNumericaMaster\.biseccion\(/, desc: () => 'Busca raíz por método de bisección' },
  { match: /SuiteNumericaMaster\.euler\(/, desc: () => 'Resuelve EDO por método de Euler' },
  { match: /SuiteNumericaMaster\.interpolacion_lagrange\(/, desc: () => 'Crea polinomio interpolador de Lagrange' },
  { match: /SuiteNumericaMaster\.regresion_polinomial\(/, desc: () => 'Ajusta polinomio por mínimos cuadrados' },
  { match: /SuiteNumericaMaster\.edo_pvi\(/, desc: () => 'Resuelve problema de valor inicial para EDOs' },

  // Estructura de control
  { match: /^for (\w+) in range\(/, desc: (m) => `Bucle que repite ${m[1]} veces` },
  { match: /^for (\w+) in (\w+):/, desc: (m) => `Itera sobre cada elemento de ${m[2]}` },
  { match: /^while (.+):/, desc: (m) => `Bucle que se repite mientras: ${m[1]}` },
  { match: /^if (.+):/, desc: (m) => `Condición: se ejecuta si ${m[1]}` },
  { match: /^elif (.+):/, desc: (m) => `Sino, si se cumple: ${m[1]}` },
  { match: /^else:/, desc: () => 'Si no se cumple ninguna condición anterior' },

  // Funciones built-in
  { match: /print\(/, desc: () => 'Muestra información en la consola/salida' },
  { match: /input\(/, desc: () => 'Lee datos del usuario' },
  { match: /len\(/, desc: () => 'Devuelve la longitud de una secuencia' },
  { match: /range\(/, desc: () => 'Genera una secuencia de números' },
  { match: /abs\(/, desc: () => 'Calcula el valor absoluto' },
  { match: /round\(/, desc: () => 'Redondea un número' },
  { match: /sum\(/, desc: () => 'Suma todos los elementos' },
  { match: /max\(/, desc: () => 'Devuelve el valor máximo' },
  { match: /min\(/, desc: () => 'Devuelve el valor mínimo' },
  { match: /zip\(/, desc: () => 'Combina dos secuencias en pares' },
  { match: /enumerate\(/, desc: () => 'Itera con índice y valor' },

  // Math
  { match: /math\.sin\(/, desc: () => 'Calcula el seno (en radianes)' },
  { match: /math\.cos\(/, desc: () => 'Calcula el coseno (en radianes)' },
  { match: /math\.tan\(/, desc: () => 'Calcula la tangente (en radianes)' },
  { match: /math\.log\(/, desc: () => 'Calcula el logaritmo natural' },
  { match: /math\.log10\(/, desc: () => 'Calcula el logaritmo en base 10' },
  { match: /math\.sqrt\(/, desc: () => 'Calcula la raíz cuadrada' },
  { match: /math\.exp\(/, desc: () => 'Calcula la exponencial (e^x)' },
  { match: /math\.pi/, desc: () => 'Constante π (3.14159...)' },
  { match: /math\.e/, desc: () => 'Constante e (2.71828...)' },
  { match: /math\.radians\(/, desc: () => 'Convierte grados a radianes' },
  { match: /math\.degrees\(/, desc: () => 'Convierte radianes a grados' },

  // Strings
  { match: /\.format\(/, desc: () => 'Formatea un string con valores' },
  { match: /f"[^"]*\{[^}]+\}/, desc: () => 'String con formato (f-string): inserta valores entre llaves' },
  { match: /\.split\(/, desc: () => 'Divide un string en una lista' },
  { match: /\.join\(/, desc: () => 'Une una lista de strings en uno solo' },
  { match: /\.upper\(/, desc: () => 'Convierte a mayúsculas' },
  { match: /\.lower\(/, desc: () => 'Convierte a minúsculas' },

  // Comprensiones y expresiones
  { match: /\[.+\s+for\s+.+\s+in\s+.+\]/, desc: () => 'Comprensión de lista: crea una lista de forma concisa' },
  { match: /\{.+\s+for\s+.+\s+in\s+.+\}/, desc: () => 'Comprensión de diccionario' },
  { match: /lambda/, desc: () => 'Función anónima (sin nombre)' },
]

function explainLine(line: string): string | null {
  // Ignorar líneas vacías y comentarios simples
  const trimmed = line.trim()
  if (!trimmed || trimmed === '' || trimmed === 'pass') return null
  if (trimmed.startsWith('#') && !trimmed.startsWith('#!')) {
    return trimmed.length < 3 ? null : `Comentario: ${trimmed.slice(1).trim()}`
  }

  for (const pattern of linePatterns) {
    const m = trimmed.match(pattern.match)
    if (m) return pattern.desc(m)
  }
  return null
}

export function explainCode(code: string): ExplanationLine[] {
  const lines = code.split('\n')
  const explanations: ExplanationLine[] = []

  lines.forEach((line, i) => {
    const explanation = explainLine(line)
    if (explanation) {
      explanations.push({
        line: i + 1,
        code: line,
        explanation,
      })
    }
  })

  return explanations
}
