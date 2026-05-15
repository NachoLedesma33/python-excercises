export interface Exercise {
    id: string;
    number: string;
    title: string;
    description: string;
    pythonFunctions: string[];
    solution: string;
    explanation: string;
    difficulty: 'básico' | 'intermedio' | 'avanzado';
    starterCode?: string;
    useSuiteNumerica?: boolean;
    requiresGraph?: boolean;
}

export interface Section {
    id: string;
    title: string;
    chapter: string;
    description: string;
    icon: string;
    exercises: Exercise[];
}

// Código de la Suite Numérica Master para incluir en ejercicios avanzados
export const SUITE_NUMERICA_CODE = `import numpy as np
import matplotlib.pyplot as plt
from scipy import integrate, optimize, linalg

class SuiteNumericaMaster:
    """Suite numérica universal para ingeniería."""
    
    @staticmethod
    def evaluar_funcion(f, x):
        """Evalúa una función en uno o varios puntos."""
        return np.asarray(f(x))
    
    @staticmethod
    def punto_fijo(g, x0, tol=1e-6, max_iter=100):
        """Iteración de punto fijo: x_{n+1} = g(x_n)"""
        x = x0
        for _ in range(max_iter):
            x_new = g(x)
            if abs(x_new - x) < tol:
                return x_new
            x = x_new
        raise RuntimeError("Punto fijo no convergió")
    
    @staticmethod
    def newton(f, df, x0, tol=1e-6, max_iter=100):
        """Método de Newton-Raphson para f(x)=0"""
        x = x0
        for _ in range(max_iter):
            fx = f(x)
            dfx = df(x)
            if dfx == 0:
                raise ZeroDivisionError(f"Derivada cero en x={x}")
            x_new = x - fx / dfx
            if abs(x_new - x) < tol:
                return x_new
            x = x_new
        raise RuntimeError("Newton no convergió")
    
    @staticmethod
    def biseccion(f, a, b, tol=1e-6, max_iter=100):
        """Método de bisección para f(x)=0 en [a,b]"""
        if f(a) * f(b) > 0:
            raise ValueError("f(a) y f(b) deben tener signos opuestos")
        for _ in range(max_iter):
            c = (a + b) / 2
            if abs(f(c)) < tol or (b - a) / 2 < tol:
                return c
            if f(c) * f(a) < 0:
                b = c
            else:
                a = c
        return (a + b) / 2
    
    @staticmethod
    def producto_vectorial(u, v):
        return np.cross(u, v)
    
    @staticmethod
    def determinante(A):
        return np.linalg.det(A)
    
    @staticmethod
    def inversa(A):
        return np.linalg.inv(A)
    
    @staticmethod
    def resolver_sistema_lineal(A, B):
        return np.linalg.solve(A, B)
    
    @staticmethod
    def autovalores_autovectores(A):
        return np.linalg.eig(A)
    
    @staticmethod
    def interpolacion_lagrange(x, y):
        """Devuelve función del polinomio interpolador de Lagrange."""
        x = np.asarray(x)
        y = np.asarray(y)
        n = len(x)
        def polinomio(xi):
            xi = np.asarray(xi)
            resultado = np.zeros_like(xi, dtype=float)
            for i in range(n):
                L = np.ones_like(xi)
                for j in range(n):
                    if j != i:
                        L *= (xi - x[j]) / (x[i] - x[j])
                resultado += y[i] * L
            return resultado
        return polinomio
    
    @staticmethod
    def regresion_polinomial(x, y, grado):
        """Ajuste por mínimos cuadrados."""
        coefs = np.polyfit(x, y, grado)
        pol = np.poly1d(coefs)
        return coefs, pol
    
    @staticmethod
    def edo_pvi(sistema, t_span, y0, t_eval=None):
        """Resuelve problema de valor inicial para EDOs."""
        if t_eval is None:
            t_eval = np.linspace(t_span[0], t_span[1], 500)
        sol = integrate.solve_ivp(sistema, t_span, y0, t_eval=t_eval)
        return sol
`;

export const sectionsData: Section[] = [
    // ==================== SECCIÓN 1: ÁLGEBRA, POLINOMIOS Y FUNCIONES ====================
    {
        id: "algebra-polinomios",
        title: "Álgebra, Polinomios y Funciones Básicas",
        chapter: "Cap. 2-4",
        description: "Evaluación de expresiones, funciones matemáticas, geometría básica y tablas de verdad",
        icon: "calculator",
        exercises: [
            {
                id: "2.13",
                number: "Ejemplo 2.13",
                title: "Tablas de Verdad",
                description: "Genera una tabla de verdad para la expresión lógica (p AND q) OR (NOT p). Evalúa todas las combinaciones posibles de p y q.",
                pythonFunctions: ["for", "range()", "bool", "and", "or", "not", "print()"],
                solution: `# Tabla de verdad para (p AND q) OR (NOT p)
print("p\\tq\\tp AND q\\tNOT p\\t(p AND q) OR (NOT p)")
print("-" * 50)

for p in [True, False]:
    for q in [True, False]:
        p_and_q = p and q
        not_p = not p
        resultado = p_and_q or not_p
        print(f"{p}\\t{q}\\t{p_and_q}\\t{not_p}\\t{resultado}")`,
                explanation: "Una tabla de verdad muestra todas las combinaciones posibles de valores de verdad para las variables proposicionales. Usamos dos bucles anidados para generar las 4 combinaciones de p y q (True/True, True/False, False/True, False/False). Los operadores lógicos de Python (and, or, not) evalúan las expresiones compuestas.",
                difficulty: "básico",
                starterCode: `# Genera la tabla de verdad para (p AND q) OR (NOT p)
# Usa bucles for para iterar sobre True y False

`
            },
            {
                id: "3.1",
                number: "Ejercicio 3.1",
                title: "Evaluación de Seno",
                description: "Asigna a la variable x el valor 2.5 y calcula el seno de x. El seno es una función trigonométrica fundamental.",
                pythonFunctions: ["import math", "math.sin()", "variables"],
                solution: `import math

x = 2.5
resultado = math.sin(x)
print(f"sin({x}) = {resultado}")
print(f"Redondeado: {resultado:.2f}")`,
                explanation: "La función math.sin() calcula el seno de un ángulo dado en radianes. Para x = 2.5 radianes (aproximadamente 143°), el seno es aproximadamente 0.5985. En Python, math.sin() usa la implementación de alta precisión de la biblioteca estándar de C.",
                difficulty: "básico",
                starterCode: `import math

x = 2.5
# Calcula el seno de x
`
            },
            {
                id: "3.2",
                number: "Ejercicio 3.2",
                title: "Logaritmo Natural",
                description: "Asigna a la variable x el valor 10 y calcula el logaritmo natural (ln) de x.",
                pythonFunctions: ["import math", "math.log()", "variables"],
                solution: `import math

x = 10
logaritmo = math.log(x)
print(f"ln({x}) = {logaritmo}")
print(f"Verificación: e^{logaritmo:.2f} = {math.exp(logaritmo):.2f}")`,
                explanation: "El logaritmo natural (ln) es el logaritmo en base e (número de Euler ≈ 2.71828). math.log(x) devuelve el valor y tal que e^y = x. Para x = 10, ln(10) ≈ 2.3026. Esta función es la inversa de la exponencial e^x.",
                difficulty: "básico",
                starterCode: `import math

x = 10
# Calcula el logaritmo natural de x
`
            },
            {
                id: "3.3",
                number: "Ejercicio 3.3",
                title: "Raíz Cuadrada",
                description: "Asigna a la variable x el valor 25 y calcula su raíz cuadrada.",
                pythonFunctions: ["import math", "math.sqrt()", "** (exponenciación)"],
                solution: `import math

x = 25
raiz1 = math.sqrt(x)
raiz2 = x ** 0.5  # Método alternativo

print(f"sqrt({x}) usando math.sqrt(): {raiz1}")
print(f"sqrt({x}) usando x**0.5: {raiz2}")
print(f"Verificación: {raiz1}² = {raiz1**2}")`,
                explanation: "La raíz cuadrada de un número x es el valor y tal que y² = x. En Python hay dos formas: math.sqrt(x) y x**0.5 (usando exponenciación). Ambas dan el mismo resultado. Para 25, la raíz es exactamente 5.0.",
                difficulty: "básico",
                starterCode: `import math

x = 25
# Calcula la raíz cuadrada de dos formas diferentes
`
            },
            {
                id: "3.4",
                number: "Ejercicio 3.4",
                title: "Polinomio de Cuarto Grado",
                description: "Evalúa el polinomio P(x) = x⁴ + x³ + 2x² - x en x = 3. Los polinomios son expresiones algebraicas fundamentales.",
                pythonFunctions: ["** (exponenciación)", "operadores aritméticos", "variables"],
                solution: `x = 3

# Método directo
P = x**4 + x**3 + 2*x**2 - x
print(f"P({x}) = {x}⁴ + {x}³ + 2·{x}² - {x}")
print(f"P({x}) = {x**4} + {x**3} + {2*x**2} - {x}")
print(f"P({x}) = {P}")

# Método Horner (más eficiente)
P_horner = x*(x*(x*(x + 1) + 2) - 1)
print(f"\\nVerificación con Horner: {P_horner}")`,
                explanation: "El polinomio P(x) = x⁴ + x³ + 2x² - x se evalúa sustituyendo x = 3. Calculamos: 81 + 27 + 18 - 3 = 123. El método de Horner reescribe el polinomio para minimizar operaciones: P(x) = x(x(x(x + 1) + 2) - 1), reduciendo multiplicaciones.",
                difficulty: "básico",
                starterCode: `x = 3

# Evalúa el polinomio P(x) = x⁴ + x³ + 2x² - x
`
            },
            {
                id: "4.11",
                number: "Ejercicio 4.11",
                title: "Área y Volumen de Cilindro",
                description: "Calcula el área superficial total (2πr² + 2πrh) y el volumen (πr²h) de un cilindro con radio r = 5 y altura h = 3.",
                pythonFunctions: ["import math", "math.pi", "** (exponenciación)", "f-strings"],
                solution: `import math

r = 5  # radio
h = 3  # altura

# Área superficial total: 2πr² + 2πrh = 2πr(r + h)
area_tapas = 2 * math.pi * r**2
area_lateral = 2 * math.pi * r * h
area_total = area_tapas + area_lateral

# Volumen: πr²h
volumen = math.pi * r**2 * h

print("=== CILINDRO ===")
print(f"Radio: {r}, Altura: {h}")
print(f"\\nÁrea de las tapas: 2πr² = {area_tapas:.4f}")
print(f"Área lateral: 2πrh = {area_lateral:.4f}")
print(f"Área total: {area_total:.4f}")
print(f"\\nVolumen: πr²h = {volumen:.4f}")`,
                explanation: "El cilindro tiene dos tapas circulares (área = πr² cada una) y una superficie lateral (área = 2πrh, que es el perímetro de la base por la altura). El área total es 2πr² + 2πrh = 2πr(r+h). El volumen es el área de la base por la altura: πr²h.",
                difficulty: "básico",
                starterCode: `import math

r = 5  # radio
h = 3  # altura

# Calcula área superficial y volumen
`
            },
            {
                id: "7.1",
                number: "Ejercicio 7.1",
                title: "Área de Triángulo por Trigonometría",
                description: "Calcula el área de un triángulo conociendo dos lados a = 5 y b = 7, y el ángulo θ = 60° entre ellos. Usa la fórmula A = (1/2)·a·b·sin(θ).",
                pythonFunctions: ["import math", "math.sin()", "math.radians()", "f-strings"],
                solution: `import math

a = 5  # primer lado
b = 7  # segundo lado
theta_grados = 60  # ángulo entre los lados en grados

# Convertir a radianes (math.sin espera radianes)
theta_rad = math.radians(theta_grados)

# Área = (1/2) * a * b * sin(θ)
area = 0.5 * a * b * math.sin(theta_rad)

print("=== TRIÁNGULO ===")
print(f"Lado a: {a}")
print(f"Lado b: {b}")
print(f"Ángulo θ: {theta_grados}°")
print(f"\\nsin({theta_grados}°) = {math.sin(theta_rad):.4f}")
print(f"\\nÁrea = (1/2)·{a}·{b}·sin({theta_grados}°)")
print(f"Área = {area:.4f} unidades²")`,
                explanation: "Cuando conocemos dos lados y el ángulo entre ellos, el área se calcula como A = ½ab·sin(θ). Es importante convertir grados a radianes con math.radians() porque las funciones trigonométricas de Python trabajan en radianes. Para θ = 60°, sin(60°) = √3/2 ≈ 0.866.",
                difficulty: "intermedio",
                starterCode: `import math

a = 5
b = 7
theta_grados = 60

# Convierte a radianes y calcula el área
`
            },
            {
                id: "7.2",
                number: "Ejercicio 7.2",
                title: "Ley de los Cosenos",
                description: "Calcula el tercer lado de un triángulo usando la ley de los cosenos: c² = a² + b² − 2ab·cos(θ). Para a = 8, b = 6, θ = 45°.",
                pythonFunctions: ["import math", "math.cos()", "math.radians()", "**"],
                solution: `import math

a = 8
b = 6
theta_grados = 45

theta_rad = math.radians(theta_grados)
c_squared = a**2 + b**2 - 2*a*b*math.cos(theta_rad)
c = math.sqrt(c_squared)

print("=== LEY DE LOS COSENOS ===")
print(f"Lado a: {a}, Lado b: {b}, Angulo: {theta_grados}°")
print(f"c² = a² + b² − 2ab·cos(θ)")
print(f"c² = {a}² + {b}² − 2·{a}·{b}·cos({theta_grados}°)")
print(f"c² = {a**2} + {b**2} − {2*a*b*math.cos(theta_rad):.4f}")
print(f"c² = {c_squared:.4f}")
print(f"c = {c:.4f}")`,
                explanation: "La ley de los cosenos generaliza el teorema de Pitágoras para triángulos no rectángulos. Cuando θ = 90°, cos(θ) = 0 y se reduce a c² = a² + b² (Pitágoras). Para θ < 90°, el triángulo es acutángulo; para θ > 90°, es obtusángulo.",
                difficulty: "intermedio",
                starterCode: `import math

a = 8
b = 6
theta_grados = 45

# Calcula el tercer lado usando la ley de los cosenos
`
            },
            {
                id: "7.3",
                number: "Ejercicio 7.3",
                title: "Distancia entre Dos Puntos 3D",
                description: "Calcula la distancia entre los puntos P1(1, 2, 3) y P2(4, 5, 6) usando la fórmula d = √((x₂−x₁)² + (y₂−y₁)² + (z₂−z₁)²).",
                pythonFunctions: ["import math", "math.sqrt()", "**"],
                solution: `import math

P1 = (1, 2, 3)
P2 = (4, 5, 6)

dx = P2[0] - P1[0]
dy = P2[1] - P1[1]
dz = P2[2] - P1[2]

distancia = math.sqrt(dx**2 + dy**2 + dz**2)

print("=== DISTANCIA EN 3D ===")
print(f"P1: {P1}")
print(f"P2: {P2}")
print(f"dx = {dx}, dy = {dy}, dz = {dz}")
print(f"d = √({dx}² + {dy}² + {dz}²)")
print(f"d = √({dx**2} + {dy**2} + {dz**2})")
print(f"d = {distancia:.2f}")`,
                explanation: "La distancia euclidiana en 3D es la generalización del teorema de Pitágoras. En 2D: d = √(dx² + dy²). En 3D agregamos dz². Esto representa la longitud del segmento que une los dos puntos en el espacio tridimensional.",
                difficulty: "básico",
                starterCode: `import math

P1 = (1, 2, 3)
P2 = (4, 5, 6)

# Calcula la distancia
`
            },
            {
                id: "8.1",
                number: "Ejercicio 8.1",
                title: "Conversión de Temperatura",
                description: "Convierte 100°C a Fahrenheit usando F = C × 9/5 + 32 y a Kelvin usando K = C + 273.15.",
                pythonFunctions: ["operadores aritméticos", "print()", "f-strings"],
                solution: `C = 100

F = C * 9/5 + 32
K = C + 273.15

print("=== CONVERSIONES DE TEMPERATURA ===")
print(f"{C}°C = {F:.2f}°F")
print(f"{C}°C = {K:.2f}K")

# Conversión inversa: Fahrenheit a Celsius
F2 = 98.6
C2 = (F2 - 32) * 5/9
print(f"\n{F2}°F = {C2:.2f}°C (temperatura corporal)")`,
                explanation: "Las fórmulas de conversión de temperatura son transformaciones lineales. El punto de congelación del agua es 0°C = 32°F = 273.15K. El punto de ebullición es 100°C = 212°F = 373.15K. La escala Kelvin es absoluta (no tiene valores negativos).",
                difficulty: "básico",
                starterCode: `C = 100

# Convierte a Fahrenheit y Kelvin
`
            },
            {
                id: "8.2",
                number: "Ejercicio 8.2",
                title: "Interest Compuesto",
                description: "Calcula el monto final de $1000 invertido al 5% anual durante 10 años con capitalización anual: M = P(1 + r)^t.",
                pythonFunctions: ["** (potenciación)", "operadores aritméticos", "f-strings"],
                solution: `P = 1000  # Capital inicial
r = 0.05  # Tasa anual (5%)
t = 10    # Años

M = P * (1 + r)**t
intereses = M - P

print("=== INTERES COMPUESTO ===")
print("Capital inicial: " + str(P))
print("Tasa anual: " + str(r*100) + "%")
print("Periodo: " + str(t) + " años")
print("\nMonto final: " + str(round(M, 2)))
print("Intereses ganados: " + str(round(intereses, 2)))

# Con fórmula logarítmica para encontrar tiempo
M_objetivo = 2000
t_necesario = math.log(M_objetivo/P) / math.log(1 + r)
print("\nPara duplicar a " + str(M_objetivo) + ": " + str(round(t_necesario, 1)) + " años")`,
                explanation: "El interés compuesto grows exponencialmente porque los intereses generan más intereses. La fórmula M = P(1+r)^t muestra que el crecimiento es exponencial en el tiempo. Para tasas pequeñas y períodos largos, el efecto es significativo.",
                difficulty: "básico",
                starterCode: `P = 1000
r = 0.05
t = 10

# Calcula el monto final
`
            },
            {
                id: "9.1",
                number: "Ejercicio 9.1",
                title: "Progressión Aritmética",
                description: "Calcula la suma de los primeros 50 números naturales y el término n-ésimo. Para una PA con a₁ = 1 y d = 1.",
                pythonFunctions: ["operadores aritméticos", "range()", "for"],
                solution: `a1 = 1   # Primer término
d = 1    # Diferencia
n = 50   # Cantidad de términos

# Término n-ésimo: an = a1 + (n-1)*d
an = a1 + (n-1) * d
print("=== PROGRESION ARITMETICA ===")
print(f"a₁ = {a1}, d = {d}, n = {n}")
print(f"Término {n}: a₅₀ = {an}")

# Suma: Sn = n*(a1 + an)/2
Sn = n * (a1 + an) / 2
print(f"Suma de los primeros {n} números: S₅₀ = {Sn}")

# Verificación con bucle
suma = sum(i for i in range(1, n+1))
print(f"Verificación: {suma}")`,
                explanation: "Una progresión aritmética (PA) tiene diferencia constante entre términos consecutivos. La fórmula del término n-ésimo es aₙ = a₁ + (n−1)d. La suma de los primeros n términos es Sₙ = n(a₁ + aₙ)/2. Para números naturales: 1+2+...+n = n(n+1)/2.",
                difficulty: "básico",
                starterCode: `a1 = 1
d = 1
n = 50

# Calcula el término 50 y la suma
`
            },
            {
                id: "9.2",
                number: "Ejercicio 9.2",
                title: "Progressión Geométrica",
                description: "Calcula la suma de los primeros 10 términos de una PG con a₁ = 2 y razón r = 3. Usa Sₙ = a₁(rⁿ−1)/(r−1).",
                pythonFunctions: ["** (potenciación)", "operadores aritméticos", "for"],
                solution: `a1 = 2   # Primer término
r = 3    # Razón
n = 10   # Cantidad de términos

# Suma de PG: Sn = a1*(r^n - 1)/(r - 1)
Sn = a1 * (r**n - 1) / (r - 1)
print("=== PROGRESION GEOMETRICA ===")
print(f"a₁ = {a1}, razón r = {r}, n = {n}")

# Término n-ésimo
an = a1 * r**(n-1)
print(f"Término {n}: a₁₀ = {an}")
print(f"Suma: S₁₀ = {Sn:.2f}")

# Verificación con bucle
suma = sum(a1 * r**i for i in range(n))
print(f"Verificación: {suma:.2f}")`,
                explanation: "Una progresión geométrica (PG) tiene razón constante entre términos. La fórmula del término n-ésimo es aₙ = a₁·rⁿ⁻¹. La suma de los primeros n términos es Sₙ = a₁(rⁿ−1)/(r−1) para r ≠ 1. Las PG crecen exponencialmente si r > 1.",
                difficulty: "intermedio",
                starterCode: `a1 = 2
r = 3
n = 10

# Calcula la suma de los primeros 10 términos
`
            },
            {
                id: "10.1",
                number: "Ejercicio 10.1",
                title: "Factorial y Combinaciones",
                description: "Calcula 5! (factorial) y las combinaciones C(5,2) = 5!/(2!·3!). También binomial: (a+b)⁵.",
                pythonFunctions: ["for", "range()", "math.factorial()", "operadores"],
                solution: `import math

n = 5
r = 2

# Factorial: n! = n * (n-1) * ... * 1
factorial = 1
for i in range(1, n+1):
    factorial *= i

print("=== FACTORIAL Y COMBINACIONES ===")
print(f"5! = {factorial}")

# Combinaciones: C(n,r) = n! / (r! * (n-r)!)
combinaciones = math.factorial(n) // (math.factorial(r) * math.factorial(n-r))
print(f"C({n},{r}) = {combinaciones}")

# Permutaciones: P(n,r) = n! / (n-r)!
permutaciones = math.factorial(n) // math.factorial(n-r)
print(f"P({n},{r}) = {permutaciones}")

# Coeficientes binomiales (a+b)^n
print(f"\nCoeficientes de (a+b)⁵:")
for k in range(n+1):
    coef = math.factorial(n) // (math.factorial(k) * math.factorial(n-k))
    print(f"  a{5-k}b{k}: {coef}")`,
                explanation: "El factorial n! cuenta el número de formas de ordenar n elementos. Las combinaciones C(n,r) cuentan subconjuntos de tamaño r sin importar orden. Las permutaciones P(n,r) consideran el orden. Los coeficientes binomiales aparecen en el desarrollo de (a+b)ⁿ.",
                difficulty: "intermedio",
                starterCode: `import math

n = 5
r = 2

# Calcula factorial, combinaciones y permutaciones
`
            }
        ]
    },

    // ==================== SECCIÓN 2: ECUACIONES NO LINEALES (RAÍCES) ====================
    {
        id: "ecuaciones-raices",
        title: "Ecuaciones No Lineales (Raíces)",
        chapter: "Cap. 11",
        description: "Métodos numéricos para encontrar raíces: punto fijo, Newton-Raphson, bisección",
        icon: "function-square",
        exercises: [
            {
                id: "11.1",
                number: "Ejemplo 11.1",
                title: "Punto Fijo: f(x) = e⁻ˣ − x",
                description: "Encuentra la raíz de f(x) = e⁻ˣ − x usando el método de iteración de punto fijo. Reescribe como x = g(x) = e⁻ˣ.",
                pythonFunctions: ["import math", "math.exp()", "while", "abs()", "iteración"],
                solution: `import math

def f(x):
    return math.exp(-x) - x

def g(x):
    """Función de iteración: x = e⁻ˣ"""
    return math.exp(-x)

def punto_fijo(g, x0, tol=1e-6, max_iter=100):
    """Método de punto fijo"""
    x = x0
    print(f"{'Iter':<6}{'x_n':<20}{'g(x_n)':<20}{'|x_{n+1} - x_n|':<20}")
    print("-" * 66)
    
    for i in range(max_iter):
        x_new = g(x)
        error = abs(x_new - x)
        print(f"{i:<6}{x:<20.10f}{x_new:<20.10f}{error:<20.10e}")
        
        if error < tol:
            print(f"\\nConvergencia alcanzada en {i+1} iteraciones")
            return x_new
        x = x_new
    
    raise RuntimeError("No convergió")

# Ejecutar
x0 = 0.5
raiz = punto_fijo(g, x0)
print(f"\\nRaíz encontrada: x = {raiz:.10f}")
print(f"Verificación: f({raiz:.2f}) = {f(raiz):.2e}")`,
                explanation: "CÓMO IDENTIFICAR QUÉ USAR: El enunciado dice 'punto fijo' y 'f(x) = e⁻ˣ − x = 0'. Esto indica que debes despejar x para obtener x = g(x).\n\nFUNCIONES NECESARIAS:\n• math.exp(-x): Para calcular e⁻ˣ. Se identifica porque el enunciado tiene 'e^(-x)'.\n• math.exp(): Observa que hay una exponencial en la fórmula.\n• Bucles (while/for): El método es iterativo, necesitas repetir hasta convergencia.\n• abs(): Para calcular el error |xₙ₊₁ − xₙ|. Se identifica porque el enunciado menciona 'tolerancia'.\n\nPOR QUÉ FUNCIONA: Transformas f(x) = 0 en x = g(x). Para f(x) = e⁻ˣ − x = 0, despejas x = e⁻ˣ. Partiendo de x₀, iteras xₙ₊₁ = g(xₙ) hasta que |xₙ₊₁ − xₙ| < tolerancia. La convergencia depende de que |g'(x)| < 1 cerca de la raíz. La raíz es aproximadamente 0.567143.",
                difficulty: "intermedio",
                starterCode: `import math

def f(x):
    return math.exp(-x) - x

def g(x):
    return math.exp(-x)

# Implementa el método de punto fijo
`
            },
            {
                id: "11.3",
                number: "Ejemplo 11.3",
                title: "Raíces de Polinomio Cúbico",
                description: "Encuentra las tres raíces del polinomio f(x) = 2x³ − 12x² + 17x − 5 usando el método de Newton-Raphson con diferentes valores iniciales.",
                pythonFunctions: ["numpy.roots()", "derivadas", "Newton-Raphson", "bucles"],
                solution: `import numpy as np

def f(x):
    return 2*x**3 - 12*x**2 + 17*x - 5

def df(x):
    """Derivada: f'(x) = 6x² - 24x + 17"""
    return 6*x**2 - 24*x + 17

def newton(f, df, x0, tol=1e-8, max_iter=100):
    """Método de Newton-Raphson"""
    x = x0
    for i in range(max_iter):
        fx = f(x)
        dfx = df(x)
        if abs(dfx) < 1e-12:
            raise ValueError("Derivada muy pequeña")
        x_new = x - fx / dfx
        if abs(x_new - x) < tol:
            return x_new, i+1
        x = x_new
    return x, max_iter

# Encontrar las tres raíces con diferentes x0
print("=== Raíces de f(x) = 2x³ - 12x² + 17x - 5 ===\\n")

valores_iniciales = [0.5, 1.5, 5.0]
raices = []

for x0 in valores_iniciales:
    raiz, iters = newton(f, df, x0)
    raices.append(raiz)
    print(f"x0 = {x0}: raíz = {raiz:.2f} ({iters} iteraciones)")
    print(f"  Verificación: f({raiz:.2f}) = {f(raiz):.2e}\\n")

# Verificar con numpy
coefs = [2, -12, 17, -5]
raices_numpy = np.roots(coefs)
print("Raíces con numpy.roots():", raices_numpy)`,
                explanation: "CÓMO IDENTIFICAR QUÉ USAR: El enunciado dice 'Newton-Raphson' y es un polinomio. También menciona 'diferentes valores iniciales' lo que indica que hay múltiples raíces.\n\nFUNCIONES NECESARIAS:\n• **operator (pow o **): Para calcular x³, x². Se identifica porque es un polinomio.\n• Definir f(x): El polinomio es 2x³ − 12x² + 17x − 5, usas operadores aritméticos.\n• Definir df(x): Newton-Raphson requiere derivada. Derivas manualmente: 6x² − 24x + 17.\n• Bucles (for/while): Iteras hasta convergencia.\n• numpy.roots(): El enunciado menciona encontrar las tres raíces de un polinomio.\n\nPOR QUÉ FUNCIONA: Newton-Raphson usa la fórmula xₙ₊₁ = xₙ − f(xₙ)/f'(xₙ). La derivada f'(x) = 6x² − 24x + 17. Diferentes valores iniciales convergen a diferentes raíces. Las tres raíces son aproximadamente: x₁ ≈ 0.385, x₂ ≈ 1.294, x₃ ≈ 4.321. numpy.roots() encuentra todas las raíces directamente.",
                difficulty: "avanzado",
                starterCode: `import numpy as np

def f(x):
    return 2*x**3 - 12*x**2 + 17*x - 5

def df(x):
    # Calcula la derivada
    pass

# Implementa Newton-Raphson y encuentra las 3 raíces
`
            },
            {
                id: "11.2",
                number: "Ejercicio 11.2",
                title: "Raíces de f(x) = 2sin(√x) − x",
                description: "Localiza y calcula las raíces de f(x) = 2sin(√x) − x. Primero grafica la función para identificar aproximadamente dónde están las raíces.",
                pythonFunctions: ["numpy", "matplotlib", "math.sin()", "math.sqrt()", "bisección"],
                solution: `import numpy as np
import math

def f(x):
    if x < 0:
        return float('nan')
    return 2 * math.sin(math.sqrt(x)) - x

def biseccion(f, a, b, tol=1e-6, max_iter=100):
    """Método de bisección"""
    if f(a) * f(b) > 0:
        raise ValueError("f(a) y f(b) deben tener signos opuestos")
    
    for i in range(max_iter):
        c = (a + b) / 2
        fc = f(c)
        
        if abs(fc) < tol or (b - a) / 2 < tol:
            return c, i+1
        
        if f(a) * fc < 0:
            b = c
        else:
            a = c
    
    return (a + b) / 2, max_iter

print("=== Raíces de f(x) = 2sin(√x) - x ===\\n")

# Buscar raíces en diferentes intervalos
# Raíz trivial x = 0
print(f"Raíz trivial: x = 0, f(0) = {f(0)}")

# Buscar otra raíz cerca de x = 2
try:
    raiz, iters = biseccion(f, 1.5, 2.5)
print(f"\\nRaíz encontrada: x = {raiz:.2f}")
print(f"Iteraciones: {iters}")
print(f"Verificación: f({raiz:.2f}) = {f(raiz):.2e}")
except ValueError as e:
    print(f"Error: {e}")

# Evaluar en varios puntos para ver comportamiento
print("\\nTabla de valores:")
for x in [0, 0.5, 1, 1.5, 2, 2.5, 3]:
    print(f"f({x}) = {f(x):.6f}")`,
                explanation: "La función f(x) = 2sin(√x) − x tiene raíz trivial en x = 0 (ya que sin(0) = 0). Otra raíz está cerca de x ≈ 1.9. El método de bisección divide el intervalo por la mitad repetidamente, garantizando convergencia si f(a) y f(b) tienen signos opuestos.",
                difficulty: "intermedio",
                starterCode: `import math

def f(x):
    return 2 * math.sin(math.sqrt(x)) - x

# Implementa bisección y encuentra las raíces
`
            },
            {
                id: "11.4",
                number: "Ejercicio 11.4",
                title: "Primera Raíz Positiva",
                description: "Encuentra la primera raíz positiva de f(x) = sin(x) + cos(1 + x²) − 1.",
                pythonFunctions: ["math.sin()", "math.cos()", "Newton-Raphson", "derivada numérica"],
                solution: `import math

def f(x):
    return math.sin(x) + math.cos(1 + x**2) - 1

def df_numerica(f, x, h=1e-8):
    """Derivada numérica por diferencias centradas"""
    return (f(x + h) - f(x - h)) / (2 * h)

def newton_numerico(f, x0, tol=1e-8, max_iter=100):
    """Newton con derivada numérica"""
    x = x0
    print(f"{'Iter':<6}{'x':<18}{'f(x)':<18}")
    print("-" * 42)
    
    for i in range(max_iter):
        fx = f(x)
        dfx = df_numerica(f, x)
        print(f"{i:<6}{x:<18.10f}{fx:<18.10e}")
        
        if abs(dfx) < 1e-12:
            raise ValueError("Derivada muy pequeña")
        
        x_new = x - fx / dfx
        
        if abs(x_new - x) < tol:
            return x_new, i+1
        x = x_new
    
    return x, max_iter

print("=== Primera raíz positiva de f(x) = sin(x) + cos(1+x²) - 1 ===\\n")

# Buscar valores donde cambia signo
print("Exploración inicial:")
for x in [0, 0.2, 0.4, 0.6, 0.8, 1.0]:
    print(f"f({x}) = {f(x):.6f}")

print("\\nAplicando Newton desde x0 = 0.5:")
raiz, iters = newton_numerico(f, 0.5)
print(f"\\nRaíz: x = {raiz:.2f}")
print(f"Verificación: f({raiz:.2f}) = {f(raiz):.2e}")`,
                explanation: "Primero exploramos la función para encontrar un cambio de signo. La derivada f'(x) = cos(x) − 2x·sin(1+x²) es complicada, así que usamos derivada numérica con diferencias centradas: f'(x) ≈ (f(x+h) − f(x−h))/(2h). La primera raíz positiva está cerca de x ≈ 0.48.",
                difficulty: "avanzado",
                starterCode: `import math

def f(x):
    return math.sin(x) + math.cos(1 + x**2) - 1

# Implementa Newton con derivada numérica
`
            },
            {
                id: "11.6",
                number: "Ejercicio 11.6",
                title: "Profundidad en Tanque Esférico",
                description: "Un tanque esférico de radio R tiene volumen V = (πh²/3)(3R − h) cuando está lleno hasta altura h. Para R = 3m y V = 30m³, encuentra h.",
                pythonFunctions: ["math.pi", "bisección", "ecuación no lineal", "ingeniería"],
                solution: `import math

def volumen_esfera_parcial(h, R):
    """Volumen de casquete esférico: V = (πh²/3)(3R - h)"""
    return (math.pi * h**2 / 3) * (3*R - h)

def ecuacion(h, R, V_objetivo):
    """f(h) = V(h) - V_objetivo = 0"""
    return volumen_esfera_parcial(h, R) - V_objetivo

def biseccion(f, a, b, args=(), tol=1e-8, max_iter=100):
    """Bisección con argumentos adicionales"""
    for i in range(max_iter):
        c = (a + b) / 2
        fc = f(c, *args)
        
        if abs(fc) < tol or (b - a) / 2 < tol:
            return c, i+1
        
        if f(a, *args) * fc < 0:
            b = c
        else:
            a = c
    return (a + b) / 2, max_iter

# Datos del problema
R = 3.0  # metros
V_objetivo = 30.0  # metros cúbicos

print("=== TANQUE ESFÉRICO ===")
print(f"Radio R = {R} m")
print(f"Volumen objetivo V = {V_objetivo} m³")
print(f"Volumen máximo (esfera completa) = {4/3 * math.pi * R**3:.2f} m³")

# El rango válido de h es [0, 2R]
h_max = 2 * R
V_max = volumen_esfera_parcial(h_max, R)
print(f"h máximo = {h_max} m (V = {V_max:.2f} m³)")

# Resolver
print("\\nBuscando h tal que V(h) = 30 m³...")
h_sol, iters = biseccion(ecuacion, 0.1, h_max, args=(R, V_objetivo))

print(f"\\nSOLUCIÓN:")
print(f"Profundidad h = {h_sol:.2f} m")
print(f"Iteraciones: {iters}")
print(f"\\nVerificación:")
print(f"V({h_sol:.2f}) = {volumen_esfera_parcial(h_sol, R):.2f} m³")`,
                explanation: "Este es un problema de ingeniería real. La fórmula V = (πh²/3)(3R − h) relaciona el volumen con la altura del líquido en un tanque esférico. Despejamos h resolviendo la ecuación no lineal V(h) − 30 = 0 usando bisección en el intervalo [0, 2R]. La solución es h ≈ 2.027 m.",
                difficulty: "avanzado",
                starterCode: `import math

R = 3.0  # radio en metros
V_objetivo = 30.0  # volumen en m³

def volumen_esfera_parcial(h, R):
    return (math.pi * h**2 / 3) * (3*R - h)

# Resuelve para encontrar h
`,
                useSuiteNumerica: true
            },
            {
                id: "11.7",
                number: "Ejercicio 11.7",
                title: "Método de la Secante",
                description: "Implementa el método de la secante para encontrar la raíz de f(x) = x³ − x − 1. Usa x₀ = 0 y x₁ = 1.",
                pythonFunctions: ["** (potenciación)", "bucles", "abs()"],
                solution: `def f(x):
    return x**3 - x - 1

def secante(f, x0, x1, tol=1e-6, max_iter=50):
    print(f"{'Iter':<6}{'x0':<15}{'x1':<15}{'x2':<15}{'|x2-x1|':<15}")
    print("-" * 66)
    
    for i in range(max_iter):
        f0, f1 = f(x0), f(x1)
        if f1 - f0 == 0:
            raise ZeroDivisionError("División por cero en método de secante")
        
        x2 = x1 - f1 * (x1 - x0) / (f1 - f0)
        error = abs(x2 - x1)
        print(f"{i+1:<6}{x0:<15.6f}{x1:<15.6f}{x2:<15.6f}{error:<15.6e}")
        
        if error < tol:
            return x2, i+1
        
        x0, x1 = x1, x2
    
    raise RuntimeError("No convergió")

raiz, iteraciones = secante(f, 0, 1)
print(f"\nRaíz encontrada: x = {raiz:.2f}")
print(f"Iteraciones: {iteraciones}")`,
                explanation: "CÓMO IDENTIFICAR QUÉ USAR: El enunciado dice 'método de la secante' y tiene una ecuación polinómica x³ − x − 1 = 0.\n\nFUNCIONES NECESARIAS:\n• ** (potenciación): Para x³. Se identifica porque hay término x³.\n• Bucles (for/while): El método es iterativo.\n• abs(): Para el error |x₂−x₁|.\n\nPOR QUÉ FUNCIONA: El método de la secante usa la fórmula: x₂ = x₁ − f(x₁)·(x₁−x₀)/(f(x₁)−f(x₀)). A diferencia de Newton, no requiere la derivada. Necesita dos puntos iniciales. La raíz de x³ − x − 1 ≈ 1.3247.",
                difficulty: "intermedio",
                starterCode: `def f(x):
    return x**3 - x - 1

# Implementa el método de la secante
x0 = 0
x1 = 1

# Iteraciones
`
            },
            {
                id: "11.8",
                number: "Ejercicio 11.8",
                title: "Comparación de Métodos",
                description: "Compara la convergencia de bisección, punto fijo y Newton para f(x) = x² − 2 = 0 (raíz √2 ≈ 1.4142).",
                pythonFunctions: ["math.sqrt()", "while", "for", "abs()"],
                solution: `import math

f = lambda x: x**2 - 2
df = lambda x: 2*x

# Bisección
def biseccion(f, a, b, tol=1e-6):
    for i in range(100):
        c = (a+b)/2
        if abs(f(c)) < tol or (b-a)/2 < tol:
            return c, i+1
        if f(a)*f(c) < 0:
            b = c
        else:
            a = c
    return c, 100

# Newton
def newton(f, df, x0, tol=1e-6):
    x = x0
    for i in range(100):
        fx = f(x)
        if abs(fx) < tol:
            return x, i+1
        x = x - fx/df(x)
    return x, 100

# Comparar
raiz_bis, iter_bis = biseccion(f, 0, 2)
raiz_newton, iter_newton = newton(f, df, 1)
raiz_exacta = math.sqrt(2)

print("=== COMPARACION DE METODOS ===")
print(f"Raíz exacta: {raiz_exacta:.2f}")
print(f"\nBisección: x = {raiz_bis:.2f}, iter = {iter_bis}")
print(f"Newton: x = {raiz_newton:.2f}, iter = {iter_newton}")`,
                explanation: "CÓMO IDENTIFICAR QUÉ USAR: El enunciado dice 'comparar' y menciona 'bisección', 'punto fijo' y 'Newton'. Esto indica implementar múltiples métodos y comparar su convergencia.\n\nFUNCIONES NECESARIAS:\n• lambda: Para definir funciones cortas f(x) y df(x).\n• math.sqrt(): Para el valor exacto.\n• Bucles: Para las iteraciones de cada método.\n\nPOR QUÉ FUNCIONA: Los tres métodos resuelven x² − 2 = 0. Bisección es más lento (más iteraciones) pero seguro. Newton converge más rápido (menos iteraciones) pero necesita derivada. El punto fijo depende de la función g(x) elegida.",
                difficulty: "intermedio",
                starterCode: `import math

f = lambda x: x**2 - 2
df = lambda x: 2*x

# Implementa bisección y Newton, luego compara
`
            },
            {
                id: "11.9",
                number: "Ejercicio 11.9",
                title: "Raíz de Función Trigonométrica",
                description: "Encuentra la raíz positiva de f(x) = cos(x) − x³ en el intervalo [0, 1]. Usa el método de bisección.",
                pythonFunctions: ["math.cos()", "while", "for", "abs()"],
                solution: `import math

def f(x):
    return math.cos(x) - x**3

a, b = 0, 1
tol = 1e-8

print("=== BISECCION: cos(x) - x^3 = 0 ===")
for i in range(100):
    c = (a + b) / 2
    fc = f(c)
    
    if abs(fc) < tol or (b - a) / 2 < tol:
        print(f"\nConvergencia en iteración {i+1}")
        print(f"Raíz: x = {c:.10f}")
        print(f"Verificación: f({c:.10f}) = {fc:.2e}")
        break
    
    if f(a) * fc < 0:
        b = c
    else:
        a = c`,
                explanation: "CÓMO IDENTIFICAR QUÉ USAR: El enunciado tiene 'cos(x)' y 'x³', y dice 'bisección' con intervalo [0, 1].\n\nFUNCIONES NECESARIAS:\n• math.cos(): Para cos(x). Se identifica en la fórmula.\n• ** (potenciación): Para x³.\n• math.pi: Puede ser útil para intervalos relacionados con π.\n\nPOR QUÉ FUNCIONA: La función cos(x) − x³ tiene raíz en el intervalo [0, 1] porque f(0) = 1 > 0 y f(1) = cos(1) − 1 ≈ −0.46 < 0. La raíz es aproximadamente 0.865.",
                difficulty: "básico",
                starterCode: `import math

def f(x):
    return math.cos(x) - x**3

a = 0
b = 1

# Implementa bisección
`
            },
            {
                id: "11.10",
                number: "Ejercicio 11.10",
                title: "Newton con Convergencia Lenta",
                description: "Usa Newton para encontrar la raíz de f(x) = x⁵ − x − 1 partiendo de x₀ = 1.5. Observa la convergencia.",
                pythonFunctions: ["** (potenciación)", "derivada", "while"],
                solution: `def f(x):
    return x**5 - x - 1

def df(x):
    return 5*x**4 - 1

x = 1.5
tol = 1e-8
max_iter = 50

print("=== NEWTON: x^5 - x - 1 = 0 ===")
print(f"{'Iter':<6}{'x':<20}{'f(x)':<20}{'Error':<20}")
print("-" * 66)

for i in range(max_iter):
    fx = f(x)
    error = abs(fx)
    print(f"{i+1:<6}{x:<20.10f}{fx:<20.10e}{error:<20.10e}")
    
    if error < tol:
        print(f"\nConvergencia en {i+1} iteraciones")
        print(f"Raíz: {x:.10f}")
        break
    
    x = x - fx / df(x)
else:
    print("No convergió en el máximo de iteraciones")`,
                explanation: "CÓMO IDENTIFICAR QUÉ USAR: El enunciado dice 'Newton' y tiene un polinomio de grado 5 x⁵ − x − 1.\n\nFUNCIONES NECESARIAS:\n• **: Para calcular x⁵.\n• Derivada manual: df(x) = 5x⁴ − 1.\n• Bucles: Iterar hasta convergencia.\n\nPOR QUÉ FUNCIONA: Newton-Raphson converge cuadráticamente (el error se cuadra cada iteración) cuando la raíz es simple. Pero si la derivada cerca de la raíz es pequeña, la convergencia puede ser lenta. La raíz es aproximadamente 1.178.",
                difficulty: "intermedio",
                starterCode: `def f(x):
    return x**5 - x - 1

def df(x):
    return 5*x**4 - 1

x = 1.5
tol = 1e-8

# Itera con Newton
`
            }
        ]
    },

    // ==================== SECCIÓN 3: SISTEMAS DE ECUACIONES Y MATRICES ====================
    {
        id: "sistemas-matrices",
        title: "Sistemas de Ecuaciones y Matrices",
        chapter: "Cap. 12",
        description: "Álgebra lineal: sistemas de ecuaciones, determinantes, inversas, autovalores y autovectores",
        icon: "grid-3x3",
        exercises: [
            {
                id: "12.4",
                number: "Ejemplo 12.4",
                title: "Producto Vectorial",
                description: "Calcula el producto vectorial (producto cruz) entre los vectores u = [1, 2, 3] y v = [4, 5, 6] en R³.",
                pythonFunctions: ["numpy", "np.array()", "np.cross()", "vectores"],
                solution: `import numpy as np

u = np.array([1, 2, 3])
v = np.array([4, 5, 6])

# Producto vectorial u × v
producto = np.cross(u, v)

print("=== PRODUCTO VECTORIAL ===")
print(f"u = {u}")
print(f"v = {v}")
print(f"\\nu × v = {producto}")

# Cálculo manual para verificar
# (u × v)_i = u_j*v_k - u_k*v_j (permutación cíclica)
manual = np.array([
    u[1]*v[2] - u[2]*v[1],  # i: 2*6 - 3*5 = -3
    u[2]*v[0] - u[0]*v[2],  # j: 3*4 - 1*6 = 6
    u[0]*v[1] - u[1]*v[0]   # k: 1*5 - 2*4 = -3
])
print(f"\\nVerificación manual: {manual}")

# Propiedades
print(f"\\nPropiedades:")
print(f"u · (u × v) = {np.dot(u, producto):.0f} (debe ser 0)")
print(f"v · (u × v) = {np.dot(v, producto):.0f} (debe ser 0)")
print(f"|u × v| = {np.linalg.norm(producto):.4f}")`,
                explanation: "El producto vectorial u × v da un vector perpendicular a ambos. Se calcula con la regla del determinante: (u₂v₃-u₃v₂, u₃v₁-u₁v₃, u₁v₂-u₂v₁). Para u=[1,2,3] y v=[4,5,6]: u × v = [-3, 6, -3]. El resultado es perpendicular a u y v (productos punto = 0).",
                difficulty: "intermedio",
                starterCode: `import numpy as np

u = np.array([1, 2, 3])
v = np.array([4, 5, 6])

# Calcula el producto vectorial
`
            },
            {
                id: "12.7",
                number: "Ejemplo 12.7",
                title: "Determinante e Inversa",
                description: "Calcula el determinante y la inversa de la matriz A = [[1,2,3],[4,5,6],[7,8,10]]. Verifica si es invertible.",
                pythonFunctions: ["numpy", "np.linalg.det()", "np.linalg.inv()", "matrices"],
                solution: `import numpy as np

A = np.array([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 10]
])

print("=== DETERMINANTE E INVERSA ===")
print("Matriz A:")
print(A)

# Determinante
det_A = np.linalg.det(A)
print(f"\\ndet(A) = {det_A:.2f}")

if abs(det_A) < 1e-10:
    print("La matriz es SINGULAR (no invertible)")
else:
    print("La matriz es NO SINGULAR (invertible)")
    
    # Inversa
    A_inv = np.linalg.inv(A)
    print("\\nInversa de A:")
    print(np.round(A_inv, 6))
    
    # Verificación: A * A^(-1) = I
    producto = A @ A_inv
    print("\\nVerificación A · A⁻¹:")
    print(np.round(producto, 10))

# Ejemplo de matriz singular
print("\\n" + "="*40)
print("Ejemplo de matriz SINGULAR:")
B = np.array([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]  # Fila 3 = Fila 1 + Fila 2
])
print(B)
print(f"det(B) = {np.linalg.det(B):.10f}")`,
                explanation: "El determinante indica si una matriz es invertible (det ≠ 0). Para A con última fila [7,8,10], det(A) = -3, así que es invertible. Si la última fila fuera [7,8,9], las filas serían linealmente dependientes y det = 0 (singular). La inversa satisface A·A⁻¹ = I.",
                difficulty: "intermedio",
                starterCode: `import numpy as np

A = np.array([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 10]
])

# Calcula determinante e inversa
`
            },
            {
                id: "12.2",
                number: "Ejercicio 12.2",
                title: "Sistema de Ecuaciones Lineales",
                description: "Resuelve el sistema: 2x + y - z = 8, -3x - y + 2z = -11, -2x + y + 2z = -3. Usa matrices y verifica la solución.",
                pythonFunctions: ["numpy", "np.linalg.solve()", "np.dot()", "sistemas lineales"],
                solution: `import numpy as np

# Sistema: Ax = b
# 2x + y - z = 8
# -3x - y + 2z = -11
# -2x + y + 2z = -3

A = np.array([
    [2, 1, -1],
    [-3, -1, 2],
    [-2, 1, 2]
])

b = np.array([8, -11, -3])

print("=== SISTEMA DE ECUACIONES LINEALES ===")
print("2x + y - z = 8")
print("-3x - y + 2z = -11")
print("-2x + y + 2z = -3")
print("\\nMatriz de coeficientes A:")
print(A)
print(f"\\nVector b: {b}")

# Verificar si tiene solución única
det_A = np.linalg.det(A)
print(f"\\ndet(A) = {det_A:.4f}")

if abs(det_A) > 1e-10:
    # Resolver
    x = np.linalg.solve(A, b)
    
    print("\\n=== SOLUCIÓN ===")
    print(f"x = {x[0]:.2f}")
    print(f"y = {x[1]:.2f}")
    print(f"z = {x[2]:.2f}")
    
    # Verificación
    print("\\n=== VERIFICACIÓN ===")
    resultado = A @ x
    print(f"A · x = {resultado}")
    print(f"b     = {b}")
    print(f"\\n¿A·x = b? {np.allclose(resultado, b)}")
    
    # También con inversa
    A_inv = np.linalg.inv(A)
    x_inv = A_inv @ b
    print(f"\\nUsando x = A⁻¹·b: {x_inv}")
else:
    print("El sistema no tiene solución única (matriz singular)")`,
                explanation: "Un sistema Ax = b se resuelve con x = A⁻¹b o usando np.linalg.solve() que es más eficiente y estable. Primero verificamos que det(A) ≠ 0. La solución es x = 2, y = 3, z = -1. Verificamos sustituyendo en las ecuaciones originales.",
                difficulty: "intermedio",
                starterCode: `import numpy as np

A = np.array([
    [2, 1, -1],
    [-3, -1, 2],
    [-2, 1, 2]
])

b = np.array([8, -11, -3])

# Resuelve el sistema y verifica
`
            },
            {
                id: "12.4b",
                number: "Sección 12.4",
                title: "Autovalores y Autovectores",
                description: "Calcula los autovalores y autovectores de la matriz A = [[4,-2,1],[-2,4,-2],[1,-2,4]]. Verifica que Av = λv.",
                pythonFunctions: ["numpy", "np.linalg.eig()", "autovalores", "autovectores"],
                solution: `import numpy as np

A = np.array([
    [4, -2, 1],
    [-2, 4, -2],
    [1, -2, 4]
])

print("=== AUTOVALORES Y AUTOVECTORES ===")
print("Matriz A:")
print(A)

# Calcular autovalores y autovectores
autovalores, autovectores = np.linalg.eig(A)

print("\\n=== AUTOVALORES ===")
for i, lam in enumerate(autovalores):
    print(f"λ_{i+1} = {lam:.2f}")

print("\\n=== AUTOVECTORES ===")
print("(columnas de la matriz)")
print(np.round(autovectores, 6))

# Verificación: A·v = λ·v
print("\\n=== VERIFICACIÓN: A·v = λ·v ===")
for i in range(len(autovalores)):
    v = autovectores[:, i]
    lam = autovalores[i]
    
    Av = A @ v
    lam_v = lam * v
    
    print(f"\\nAutovalor λ_{i+1} = {lam:.4f}")
    print(f"Autovector v_{i+1} = {np.round(v, 4)}")
    print(f"A·v_{i+1}  = {np.round(Av, 4)}")
    print(f"λ_{i+1}·v_{i+1} = {np.round(lam_v.real, 4)}")
    print(f"¿Iguales? {np.allclose(Av, lam_v)}")

# Propiedades
print("\\n=== PROPIEDADES ===")
print(f"Suma de autovalores = {sum(autovalores):.4f}")
print(f"Traza de A = {np.trace(A):.4f} (deben ser iguales)")
print(f"Producto de autovalores = {np.prod(autovalores):.4f}")
print(f"det(A) = {np.linalg.det(A):.4f} (deben ser iguales)")`,
                explanation: "Los autovalores λ y autovectores v satisfacen Av = λv. Para esta matriz simétrica, los autovalores son reales: λ₁ ≈ 7, λ₂ ≈ 4, λ₃ ≈ 1. La suma de autovalores = traza(A) = 12. El producto de autovalores = det(A) = 28. Los autovectores son ortogonales por ser A simétrica.",
                difficulty: "avanzado",
                starterCode: `import numpy as np

A = np.array([
    [4, -2, 1],
    [-2, 4, -2],
    [1, -2, 4]
])

# Calcula autovalores y autovectores
`,
                useSuiteNumerica: true
            },
            {
                id: "12.8",
                number: "Ejercicio 12.8",
                title: "Norma y Producto Interno de Vectores",
                description: "Calcula la norma (magnitud) del vector v = [3, 4, 0] y el producto interno con u = [1, 2, 3].",
                pythonFunctions: ["numpy", "np.linalg.norm()", "np.dot()"],
                solution: `import numpy as np

v = np.array([3, 4, 0])
u = np.array([1, 2, 3])

norma_v = np.linalg.norm(v)
producto = np.dot(u, v)

print("=== NORMA Y PRODUCTO INTERNO ===")
print(f"v = {v}")
print(f"u = {u}")
print(f"\n|v| = {norma_v}")
print(f"u · v = {producto}")

# Verificación manual
norma_manual = np.sqrt(sum(v**2))
print(f"\nVerificación |v|: {norma_manual}")`,
                explanation: "CÓMO IDENTIFICAR QUÉ USAR: El enunciado menciona 'norma', 'producto interno', 'vectores'. Esto indica usar álgebra lineal.\n\nFUNCIONES NECESARIAS:\n• np.array(): Crear vectores. Se identifica porque hay vectores.\n• np.linalg.norm(): Para la norma euclidiana.\n• np.dot(): Para el producto punto.\n\nPOR QUÉ FUNCIONA: La norma de un vector es su longitud: |v| = √(v₁² + v₂² + ...). El producto interno u·v = Σ uᵢvᵢ. Para v = [3,4,0], |v| = 5 (triángulo 3-4-5).",
                difficulty: "básico",
                starterCode: `import numpy as np

v = np.array([3, 4, 0])
u = np.array([1, 2, 3])

# Calcula norma y producto interno
`
            },
            {
                id: "12.9",
                number: "Ejercicio 12.9",
                title: "Sistema 3x3 con numpy.linalg.solve",
                description: "Resuelve el sistema: 2x + y + z = 5, x + 2y + z = 6, x + y + 2z = 7.",
                pythonFunctions: ["numpy", "np.linalg.solve()", "np.array()"],
                solution: `import numpy as np

# Matriz de coeficientes A*x = B
A = np.array([
    [2, 1, 1],
    [1, 2, 1],
    [1, 1, 2]
])
B = np.array([5, 6, 7])

# Resolver sistema
x = np.linalg.solve(A, B)

print("=== SISTEMA 3x3 ===")
print("Ecuaciones:")
print("  2x + y + z = 5")
print("  x + 2y + z = 6")
print("  x + y + 2z = 7")
print(f"\nSolución: x = {x[0]:.4f}, y = {x[1]:.4f}, z = {x[2]:.4f}")

# Verificación
print("\nVerificación:")
print(f"  2({x[0]:.4f}) + {x[1]:.4f} + {x[2]:.4f} = {2*x[0] + x[1] + x[2]:.4f}")
print(f"  {x[0]:.4f} + 2({x[1]:.4f}) + {x[2]:.4f} = {x[0] + 2*x[1] + x[2]:.4f}")`,
                explanation: "CÓMO IDENTIFICAR QUÉ USAR: El enunciado dice 'sistema' con 3 ecuaciones y 3 variables. La palabra 'resuelve' indica usar un solver.\n\nFUNCIONES NECESARIAS:\n• np.array(): Para la matriz de coeficientes y vector de términos independientes.\n• np.linalg.solve(): Resuelve sistemas lineales Ax = B.\n\nPOR QUÉ FUNCIONA: El sistema se escribe como Ax = B donde A es la matriz de coeficientes, x es el vector de incógnitas y B es el vector de términos independientes. La solución es x = A⁻¹B.",
                difficulty: "básico",
                starterCode: `import numpy as np

A = np.array([
    [2, 1, 1],
    [1, 2, 1],
    [1, 1, 2]
])
B = np.array([5, 6, 7])

# Resuelve el sistema
`
            },
            {
                id: "12.10",
                number: "Ejercicio 12.10",
                title: "Autovalores y Autovectores",
                description: "Calcula los autovalores y autovectores de la matriz A = [[4, 2], [1, 3]].",
                pythonFunctions: ["numpy", "np.linalg.eig()", "np.array()"],
                solution: `import numpy as np

A = np.array([[4, 2], [1, 3]])

autovalores, autovectores = np.linalg.eig(A)

print("=== AUTOVALORES Y AUTOVECTORES ===")
print(f"Matriz A =\\n{A}")
print(f"\nAutovalores: {autovalores}")
print(f"Autovectores (columnas):\\n{autovectores}")

# Verificación: A*v = λ*v
for i in range(2):
    lambda_i = autovalores[i]
    v_i = autovectores[:, i]
    Av = A @ v_i
    lambda_v = lambda_i * v_i
    print(f"\nVerificación λ={lambda_i:.4f}:")
    print(f"  A·v = {Av}")
    print(f"  λ·v = {lambda_v}")`,
                explanation: "CÓMO IDENTIFICAR QUÉ USAR: El enunciado dice 'autovalores' y 'autovectores', y menciona una matriz específica.\n\nFUNCIONES NECESARIAS:\n• np.array(): Para la matriz.\n• np.linalg.eig(): Calcula autovalores y autovectores.\n• @ (producto matriz-vector): Para verificar.\n\nPOR QUÉ FUNCIONA: Un autovector v de una matriz A satisface Av = λv donde λ es el autovalor. Para A = [[4,2],[1,3]], los autovalores son aproximadamente 4.79 y 2.21.",
                difficulty: "intermedio",
                starterCode: `import numpy as np

A = np.array([[4, 2], [1, 3]])

# Calcula autovalores y autovectores
`
            },
            {
                id: "12.11",
                number: "Ejercicio 12.11",
                title: "Inversa de Matriz 2x2",
                description: "Calcula la inversa de A = [[3, 1], [1, 2]] y verifica que A·A⁻¹ = I.",
                pythonFunctions: ["numpy", "np.linalg.inv()", "np.eye()"],
                solution: `import numpy as np

A = np.array([[3, 1], [1, 2]])

A_inv = np.linalg.inv(A)
identidad = np.eye(2)

producto = A @ A_inv

print("=== INVERSA DE MATRIZ ===")
print(f"A =\\n{A}")
print(f"A⁻¹ =\\n{A_inv}")
print(f"\nA · A⁻¹ =\\n{producto}")

# Verificación
error = np.max(np.abs(producto - identidad))
print(f"\nError máximo: {error:.2e}")`,
                explanation: "CÓMO IDENTIFICAR QUÉ USAR: El enunciado dice 'inversa' y 'verifica' con identidad. Esto indica usar np.linalg.inv().\n\nFUNCIONES NECESARIAS:\n• np.linalg.inv(): Calcula la matriz inversa.\n• np.eye(): Crea matriz identidad.\n• @: Producto de matrices.\n\nPOR QUÉ FUNCIONA: La inversa A⁻¹ cumple A·A⁻¹ = I (identidad). Para una matriz 2x2 [[a,b],[c,d]], la inversa es (1/(ad-bc))[[d,-b],[-c,a]].",
                difficulty: "básico",
                starterCode: `import numpy as np

A = np.array([[3, 1], [1, 2]])

# Calcula la inversa
`
            },
            {
                id: "12.12",
                number: "Ejercicio 12.12",
                title: "Determinante e Invertibilidad",
                description: "Calcula el determinante de A = [[1, 2], [3, 4]] y determina si es invertible.",
                pythonFunctions: ["numpy", "np.linalg.det()"],
                solution: `import numpy as np

A = np.array([[1, 2], [3, 4]])
det_A = np.linalg.det(A)

print("=== DETERMINANTE ===")
print(f"Matriz A =\\n{A}")
print(f"det(A) = {det_A}")

if abs(det_A) > 1e-10:
    print("\nLa matriz ES invertible (det ≠ 0)")
    A_inv = np.linalg.inv(A)
    print(f"A⁻¹ =\\n{A_inv}")
else:
    print("\nLa matriz NO es invertible (det = 0)")`,
                explanation: "CÓMO IDENTIFICAR QUÉ USAR: El enunciado dice 'determinante' y 'invertibilidad'.\n\nFUNCIONES NECESARIAS:\n• np.linalg.det(): Calcula el determinante.\n\nPOR QUÉ FUNCIONA: Una matriz es invertible si y solo si su determinante es no nulo. Para A 2x2 = [[a,b],[c,d]], det = ad - bc = 1·4 - 2·3 = -2.",
                difficulty: "básico",
                starterCode: `import numpy as np

A = np.array([[1, 2], [3, 4]])

# Calcula el determinante
`
            }
        ]
    },

    // ==================== SECCIÓN 4: INTERPOLACIÓN, REGRESIÓN Y GEOMETRÍA ====================
    {
        id: "interpolacion-regresion",
        title: "Interpolación, Regresión y Curvas",
        chapter: "Cap. 9, 13-14",
        description: "Interpolación polinómica, regresión por mínimos cuadrados, curvas paramétricas",
        icon: "trending-up",
        exercises: [
            {
                id: "9.2",
                number: "Ejercicio 9.2",
                title: "Cicloide Paramétrica",
                description: "Grafica la cicloide definida por x(φ) = r(φ − sen(φ)), y(φ) = r(1 − cos(φ)) para r = 1 y φ ∈ [0, 4π].",
                pythonFunctions: ["numpy", "matplotlib", "np.sin()", "np.cos()", "plt.plot()"],
                solution: `import numpy as np
import matplotlib.pyplot as plt

# Parámetros
r = 1  # radio
phi = np.linspace(0, 4*np.pi, 1000)  # parámetro

# Ecuaciones paramétricas de la cicloide
x = r * (phi - np.sin(phi))
y = r * (1 - np.cos(phi))

# Graficar
plt.figure(figsize=(12, 4))
plt.plot(x, y, 'b-', linewidth=2)
plt.title('Cicloide: x = r(φ - sin φ), y = r(1 - cos φ)')
plt.xlabel('x')
plt.ylabel('y')
plt.axis('equal')
plt.grid(True, alpha=0.3)

# Marcar puntos especiales (cúspides)
cuspides_phi = np.array([0, 2*np.pi, 4*np.pi])
cuspides_x = r * (cuspides_phi - np.sin(cuspides_phi))
cuspides_y = r * (1 - np.cos(cuspides_phi))
plt.plot(cuspides_x, cuspides_y, 'ro', markersize=10, label='Cúspides')
plt.legend()

plt.tight_layout()
plt.show()

print("La cicloide es la curva trazada por un punto")
print("en el borde de un círculo que rueda sin deslizar.")
print(f"\\nRadio r = {r}")
print(f"Período en x: 2πr = {2*np.pi*r:.4f}")
print(f"Altura máxima: 2r = {2*r}")`,
                explanation: "La cicloide es la trayectoria de un punto en el borde de un círculo que rueda. Las ecuaciones x = r(φ - sin φ) y y = r(1 - cos φ) generan arcos con cúspides donde el punto toca el suelo (φ = 0, 2π, 4π...). Es famosa por ser la solución al problema de la braquistócrona.",
                difficulty: "intermedio",
                starterCode: `import numpy as np
import matplotlib.pyplot as plt

r = 1
phi = np.linspace(0, 4*np.pi, 1000)

# Define las ecuaciones paramétricas y grafica
`
            },
            {
                id: "13.2",
                number: "Ejercicio 13.2",
                title: "Interpolación de Lagrange",
                description: "Dado los puntos (0,1), (1,3), (2,2), (3,5), encuentra el polinomio interpolador de Lagrange y evalúalo en x = 1.5.",
                pythonFunctions: ["numpy", "interpolación", "polinomio de Lagrange", "matplotlib"],
                solution: `import numpy as np
import matplotlib.pyplot as plt

# Datos
x_datos = np.array([0, 1, 2, 3])
y_datos = np.array([1, 3, 2, 5])

def lagrange(x_datos, y_datos, x):
    """Interpolación de Lagrange"""
    n = len(x_datos)
    resultado = 0
    
    for i in range(n):
        # Calcular L_i(x)
        L_i = 1
        for j in range(n):
            if j != i:
                L_i *= (x - x_datos[j]) / (x_datos[i] - x_datos[j])
        resultado += y_datos[i] * L_i
    
    return resultado

# Evaluar en x = 1.5
x_eval = 1.5
y_eval = lagrange(x_datos, y_datos, x_eval)

print("=== INTERPOLACIÓN DE LAGRANGE ===")
print("\\nPuntos dados:")
for xi, yi in zip(x_datos, y_datos):
    print(f"  ({xi}, {yi})")

print(f"\\nP({x_eval}) = {y_eval:.2f}")

# Graficar
x_plot = np.linspace(-0.5, 3.5, 200)
y_plot = [lagrange(x_datos, y_datos, xi) for xi in x_plot]

plt.figure(figsize=(10, 6))
plt.plot(x_plot, y_plot, 'b-', label='Polinomio de Lagrange', linewidth=2)
plt.plot(x_datos, y_datos, 'ro', markersize=10, label='Puntos dados')
plt.plot(x_eval, y_eval, 'g^', markersize=12, label=f'P({x_eval}) = {y_eval:.3f}')
plt.xlabel('x')
plt.ylabel('y')
plt.title('Interpolación Polinómica de Lagrange')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

# Mostrar fórmula
print("\\nFórmula de Lagrange:")
print("P(x) = Σ y_i · L_i(x)")
print("donde L_i(x) = Π(x - x_j)/(x_i - x_j) para j ≠ i")`,
                explanation: "La interpolación de Lagrange construye un polinomio que pasa exactamente por todos los puntos dados. Para n puntos, el polinomio tiene grado n-1. Cada L_i(x) es un polinomio base que vale 1 en x_i y 0 en los demás puntos. Para x = 1.5, el valor interpolado es aproximadamente 2.0625.",
                difficulty: "avanzado",
                starterCode: `import numpy as np

x_datos = np.array([0, 1, 2, 3])
y_datos = np.array([1, 3, 2, 5])

def lagrange(x_datos, y_datos, x):
    # Implementa la interpolación de Lagrange
    pass

# Evalúa en x = 1.5
`,
                useSuiteNumerica: true
            },
            {
                id: "14.1",
                number: "Ejercicio 14.1",
                title: "Regresión Lineal",
                description: "Ajusta una recta y = ax + b a los datos: x = [1,2,3,4,5], y = [2.1, 3.9, 6.2, 7.8, 10.1]. Calcula el coeficiente de correlación R².",
                pythonFunctions: ["numpy", "np.polyfit()", "regresión", "mínimos cuadrados", "R²"],
                solution: `import numpy as np
import matplotlib.pyplot as plt

# Datos experimentales
x = np.array([1, 2, 3, 4, 5])
y = np.array([2.1, 3.9, 6.2, 7.8, 10.1])

# Regresión lineal: y = ax + b
coefs = np.polyfit(x, y, 1)  # grado 1
a, b = coefs

# Valores predichos
y_pred = a * x + b

# Coeficiente de determinación R²
y_mean = np.mean(y)
SS_tot = np.sum((y - y_mean)**2)  # Suma total de cuadrados
SS_res = np.sum((y - y_pred)**2)  # Suma residual de cuadrados
R2 = 1 - SS_res / SS_tot

print("=== REGRESIÓN LINEAL ===")
print("\\nDatos:")
print(f"x = {x}")
print(f"y = {y}")
print(f"\\nModelo: y = ax + b")
print(f"a (pendiente) = {a:.2f}")
print(f"b (ordenada) = {b:.2f}")

print(f"\\nCoeficiente R² = {R2:.3f}")
print(f"Correlación R = {np.sqrt(R2):.3f}")

# Tabla de valores
print("\\n{'x':<8}{'y real':<12}{'y pred':<12}{'error':<12}")
print("-" * 44)
for xi, yi, yp in zip(x, y, y_pred):
    print(f"{xi:<8}{yi:<12.4f}{yp:<12.4f}{yi-yp:<12.4f}")

# Graficar
plt.figure(figsize=(10, 6))
plt.scatter(x, y, color='red', s=100, label='Datos', zorder=5)
x_line = np.linspace(0, 6, 100)
plt.plot(x_line, a*x_line + b, 'b-', linewidth=2, 
         label=f'Regresión: y = {a:.3f}x + {b:.3f}')
plt.xlabel('x')
plt.ylabel('y')
plt.title(f'Regresión Lineal (R² = {R2:.4f})')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()`,
                explanation: "La regresión lineal encuentra la mejor recta y = ax + b que minimiza la suma de errores cuadráticos. np.polyfit() usa el método de mínimos cuadrados. R² mide qué tan bien el modelo explica la variabilidad de los datos: R² = 1 es ajuste perfecto, R² = 0 significa que el modelo no explica nada.",
                difficulty: "intermedio",
                starterCode: `import numpy as np

x = np.array([1, 2, 3, 4, 5])
y = np.array([2.1, 3.9, 6.2, 7.8, 10.1])

# Realiza la regresión lineal y calcula R²
`
            },
            {
                id: "14.3",
                number: "Ejercicio 14.3",
                title: "Regresión Polinomial",
                description: "Ajusta un polinomio de grado 2 y otro de grado 3 a los datos: x = [0,1,2,3,4], y = [1,1.8,1.3,2.5,6.3]. Compara cuál ajusta mejor.",
                pythonFunctions: ["numpy", "np.polyfit()", "np.poly1d()", "comparación de modelos"],
                solution: `import numpy as np
import matplotlib.pyplot as plt

# Datos
x = np.array([0, 1, 2, 3, 4])
y = np.array([1, 1.8, 1.3, 2.5, 6.3])

def calcular_R2(y_real, y_pred):
    SS_tot = np.sum((y_real - np.mean(y_real))**2)
    SS_res = np.sum((y_real - y_pred)**2)
    return 1 - SS_res / SS_tot

# Regresión grado 2
coefs2 = np.polyfit(x, y, 2)
poly2 = np.poly1d(coefs2)
y_pred2 = poly2(x)
R2_2 = calcular_R2(y, y_pred2)

# Regresión grado 3
coefs3 = np.polyfit(x, y, 3)
poly3 = np.poly1d(coefs3)
y_pred3 = poly3(x)
R2_3 = calcular_R2(y, y_pred3)

print("=== REGRESIÓN POLINOMIAL ===")
print("\\nDatos:")
for xi, yi in zip(x, y):
    print(f"  ({xi}, {yi})")

print("\\n=== GRADO 2 ===")
print(f"Coeficientes: {coefs2}")
print(f"P₂(x) = {coefs2[0]:.4f}x² + {coefs2[1]:.4f}x + {coefs2[2]:.4f}")
print(f"R² = {R2_2:.3f}")

print("\\n=== GRADO 3 ===")
print(f"Coeficientes: {coefs3}")
print(f"P₃(x) = {coefs3[0]:.4f}x³ + {coefs3[1]:.4f}x² + {coefs3[2]:.4f}x + {coefs3[3]:.4f}")
print(f"R² = {R2_3:.3f}")

print("\\n=== COMPARACIÓN ===")
if R2_3 > R2_2:
    print(f"El polinomio de grado 3 ajusta mejor (R² = {R2_3:.4f} > {R2_2:.4f})")
else:
    print(f"El polinomio de grado 2 ajusta mejor (R² = {R2_2:.4f} > {R2_3:.4f})")

# Graficar
x_plot = np.linspace(-0.5, 4.5, 200)

plt.figure(figsize=(12, 5))
plt.scatter(x, y, color='red', s=100, label='Datos', zorder=5)
plt.plot(x_plot, poly2(x_plot), 'b-', linewidth=2, 
         label=f'Grado 2 (R² = {R2_2:.4f})')
plt.plot(x_plot, poly3(x_plot), 'g--', linewidth=2, 
         label=f'Grado 3 (R² = {R2_3:.4f})')
plt.xlabel('x')
plt.ylabel('y')
plt.title('Comparación de Regresión Polinomial')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()`,
                explanation: "Comparamos polinomios de diferentes grados para ver cuál ajusta mejor los datos. El grado 3 siempre tendrá R² mayor o igual que el grado 2 (más parámetros = mejor ajuste). Sin embargo, un grado muy alto puede causar sobreajuste. Para estos datos, el grado 3 captura mejor la curvatura.",
                difficulty: "avanzado",
                starterCode: `import numpy as np

x = np.array([0, 1, 2, 3, 4])
y = np.array([1, 1.8, 1.3, 2.5, 6.3])

# Ajusta polinomios de grado 2 y 3, compara R²
`,
                useSuiteNumerica: true
            },
            {
                id: "14.7",
                number: "Ejercicio 14.7",
                title: "Interpolación de Lagrange - Predicción de Temperatura",
                description: "Usa interpolación de Lagrange con los datos de temperatura T = [20, 22, 25, 28] en tiempos t = [0, 1, 2, 3] para predecir la temperatura en t = 1.5.",
                pythonFunctions: ["numpy", "polinomios", "interpolación"],
                solution: `import numpy as np

# Datos: temperatura vs tiempo
t_datos = np.array([0, 1, 2, 3])
T_datos = np.array([20, 22, 25, 28])

def lagrange(x_eval, x_datos, y_datos):
    n = len(x_datos)
    resultado = 0
    for i in range(n):
        termino = y_datos[i]
        for j in range(n):
            if i != j:
                termino *= (x_eval - x_datos[j]) / (x_datos[i] - x_datos[j])
        resultado += termino
    return resultado

t_eval = 1.5
T_eval = lagrange(t_eval, t_datos, T_datos)

print("=== INTERPOLACION DE LAGRANGE ===")
print(f"Tiempos: {t_datos}")
print(f"Temperaturas: {T_datos}")
print(f"\nTemperatura en t = {t_eval}: T = {T_eval:.2f}")

# Graficar
t_plot = np.linspace(0, 3, 100)
T_plot = [lagrange(ti, t_datos, T_datos) for ti in t_plot]

import matplotlib.pyplot as plt
plt.figure(figsize=(8, 5))
plt.plot(t_plot, T_plot, 'b-', label='Interpolante')
plt.plot(t_datos, T_datos, 'ro', markersize=10, label='Datos')
plt.plot(t_eval, T_eval, 'g*', markersize=15, label=f'T({t_eval})')
plt.xlabel('Tiempo (h)')
plt.ylabel('Temperatura (°C)')
plt.legend()
plt.grid(True)
plt.show()`,
                explanation: "CÓMO IDENTIFICAR QUÉ USAR: El enunciado dice 'interpolación de Lagrange', usa la palabra 'predecir' y hay datos discretos.\n\nFUNCIONES NECESARIAS:\n• np.array(): Para los datos.\n• Bucles: Para implementar el polinomio de Lagrange.\n• matplotlib: Para graficar.\n\nPOR QUÉ FUNCIONA: El polinomio de Lagrange pasa exactamente por todos los puntos dados. Para n+1 puntos, el polinomio es de grado n. En t = 1.5, interpolate entre los puntos conocidos.",
                difficulty: "intermedio",
                starterCode: `import numpy as np

t_datos = np.array([0, 1, 2, 3])
T_datos = np.array([20, 22, 25, 28])

def lagrange(x_eval, x_datos, y_datos):
    # Implementa el polinomio de Lagrange
    pass

t_eval = 1.5

# Calcula la temperatura
`
            },
            {
                id: "14.8",
                number: "Ejercicio 14.8",
                title: "Ajuste Lineal - Crecimiento Poblacional",
                description: "Ajusta los datos de población P = [100, 150, 230, 350] en años t = [0, 5, 10, 15] con una regresión lineal y calcula la población proyectada para t = 20.",
                pythonFunctions: ["numpy", "np.polyfit()", "np.poly1d()", "regresión"],
                solution: `import numpy as np

t = np.array([0, 5, 10, 15])
P = np.array([100, 150, 230, 350])

# Ajuste lineal (grado 1)
coeffs = np.polyfit(t, P, 1)
polinomio = np.poly1d(coeffs)

print("=== REGRESION LINEAL ===")
print(f"Datos: t = {t}, P = {P}")
print(f"Ajuste: P = {coeffs[0]:.2f}·t + {coeffs[1]:.2f}")

# Proyección para t = 20
P_proyectado = polinomio(20)
print(f"\nPoblación proyectada para t = 20: {P_proyectado:.1f}")

# Coeficiente R²
P_pred = polinomio(t)
SS_res = np.sum((P - P_pred)**2)
SS_tot = np.sum((P - np.mean(P))**2)
R2 = 1 - SS_res / SS_tot
print(f"R² = {R2:.4f}")`,
                explanation: "CÓMO IDENTIFICAR QUÉ USAR: El enunciado dice 'ajuste', 'regresión', 'proyectada'. Las palabras clave indican encontrar una relación lineal.\n\nFUNCIONES NECESARIAS:\n• np.polyfit(): Ajuste polinomial.\n• np.poly1d(): Crear función polinómica.\n• numpy para cálculos.\n\nPOR QUÉ FUNCIONA: La regresión lineal encuentra la mejor línea P = at + b que minimiza la suma de errores al cuadrado. El coeficiente R² indica qué tan bien ajusta (1 = perfecto).",
                difficulty: "básico",
                starterCode: `import numpy as np

t = np.array([0, 5, 10, 15])
P = np.array([100, 150, 230, 350])

# Ajusta una línea y proyecta
`
            },
            {
                id: "14.9",
                number: "Ejercicio 14.9",
                title: "Gráfico de Funciones Trigonométricas",
                description: "Grafica las funciones sin(x), cos(x) y tan(x) en el intervalo [0, 2π] en subgráficos separados.",
                pythonFunctions: ["numpy", "np.sin()", "np.cos()", "np.tan()", "plt.subplot()"],
                solution: `import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 2*np.pi, 500)

# Evitar discontinuidades de tan(x)
x_tan = np.linspace(0.1, 2*np.pi - 0.1, 500)

fig, axes = plt.subplots(1, 3, figsize=(14, 4))

# sin(x)
axes[0].plot(x, np.sin(x), 'b-', linewidth=2)
axes[0].set_title('sin(x)')
axes[0].grid(True, alpha=0.3)
axes[0].axhline(y=0, color='k', linewidth=0.5)

# cos(x)
axes[1].plot(x, np.cos(x), 'r-', linewidth=2)
axes[1].set_title('cos(x)')
axes[1].grid(True, alpha=0.3)
axes[1].axhline(y=0, color='k', linewidth=0.5)

# tan(x)
axes[2].plot(x_tan, np.tan(x_tan), 'g-', linewidth=2)
axes[2].set_title('tan(x)')
axes[2].set_ylim(-5, 5)
axes[2].grid(True, alpha=0.3)
axes[2].axhline(y=0, color='k', linewidth=0.5)

plt.tight_layout()
plt.show()`,
                explanation: "CÓMO IDENTIFICAR QUÉ USAR: El enunciado dice 'gráfico', menciona 'sin', 'cos', 'tan' y 'subgráficos'.\n\nFUNCIONES NECESARIAS:\n• np.sin(), np.cos(), np.tan(): Funciones trigonométricas.\n• plt.subplot(): Múltiples gráficos.\n• np.linspace(): Intervalo de x.\n\nPOR QUÉ FUNCIONA: Las funciones trigonométricas son periódicas. sin y cos tienen período 2π, tan tiene período π. Se usa un intervalo reducido para tan(x) para evitar las discontinuidades en ±π/2.",
                difficulty: "básico",
                starterCode: `import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 2*np.pi, 500)

# Grafica sin, cos y tan en subgráficos
`
            },
            {
                id: "14.10",
                number: "Ejercicio 14.10",
                title: "Curva de Bezier Cuadrática",
                description: "Grafica una curva de Bézier cuadrática con puntos de control P0=(0,0), P1=(1,2), P2=(2,0).",
                pythonFunctions: ["numpy", "matplotlib", "np.linspace()"],
                solution: `import numpy as np
import matplotlib.pyplot as plt

P0 = np.array([0, 0])
P1 = np.array([1, 2])
P2 = np.array([2, 0])

t = np.linspace(0, 1, 100)

# Curva de Bézier cuadrática: B(t) = (1-t)²P0 + 2(1-t)tP1 + t²P2
x = (1-t)**2 * P0[0] + 2*(1-t)*t * P1[0] + t**2 * P2[0]
y = (1-t)**2 * P0[1] + 2*(1-t)*t * P1[1] + t**2 * P2[1]

plt.figure(figsize=(8, 5))
plt.plot(x, y, 'b-', linewidth=2, label='Curva Bézier')
plt.plot(P0[0], P0[1], 'ro', markersize=10, label='P0')
plt.plot(P1[0], P1[1], 'go', markersize=10, label='P1')
plt.plot(P2[0], P2[1], 'ro', markersize=10, label='P2')
plt.plot([P0[0], P1[0], P2[0]], [P0[1], P1[1], P2[1]], 'k--', alpha=0.5, label='Polígono de control')

plt.xlabel('x')
plt.ylabel('y')
plt.legend()
plt.title('Curva de Bézier Cuadrática')
plt.grid(True, alpha=0.3)
plt.axis('equal')
plt.show()`,
                explanation: "CÓMO IDENTIFICAR QUÉ USAR: El enunciado dice 'Bézier' y tiene puntos de control. Las curvas paramétricas requieren interpolación.\n\nFUNCIONES NECESARIAS:\n• np.linspace(): Parámetro t en [0,1].\n• plt.plot(): Graficar curva y puntos.\n• Operaciones con arrays: Calcular la curva.\n\nPOR QUÉ FUNCIONA: Las curvas de Bézier usan polinomios para controlar la forma. La curva cuadrática tiene 3 puntos de control y está definida por B(t) = (1−t)²P₀ + 2(1−t)tP₁ + t²P₂.",
                difficulty: "intermedio",
                starterCode: `import numpy as np
import matplotlib.pyplot as plt

P0 = np.array([0, 0])
P1 = np.array([1, 2])
P2 = np.array([2, 0])

t = np.linspace(0, 1, 100)

# Calcula la curva de Bézier cuadrática
`
            }
        ]
    },

    // ==================== SECCIÓN 5: ECUACIONES DIFERENCIALES ====================
    {
        id: "ecuaciones-diferenciales",
        title: "Ecuaciones Diferenciales",
        chapter: "Cap. 15-16",
        description: "EDOs: problemas de valor inicial (PVI) y valor en la frontera (PVF)",
        icon: "git-branch",
        exercises: [
            {
                id: "15.1",
                number: "Ejercicio 15.1",
                title: "Método de Euler",
                description: "Resuelve y' = −2y con y(0) = 1 en [0, 2] usando el método de Euler con h = 0.1. Compara con la solución exacta y = e⁻²ᵗ.",
                pythonFunctions: ["numpy", "método de Euler", "EDO", "matplotlib"],
                solution: `import numpy as np
import matplotlib.pyplot as plt

def euler(f, y0, t_span, h):
    """Método de Euler para y' = f(t, y)"""
    t_start, t_end = t_span
    t = np.arange(t_start, t_end + h, h)
    y = np.zeros(len(t))
    y[0] = y0
    
    for i in range(len(t) - 1):
        y[i+1] = y[i] + h * f(t[i], y[i])
    
    return t, y

# Ecuación: y' = -2y
def f(t, y):
    return -2 * y

# Solución exacta: y = e^(-2t)
def exacta(t):
    return np.exp(-2 * t)

# Parámetros
y0 = 1
t_span = (0, 2)
h = 0.1

# Resolver con Euler
t_euler, y_euler = euler(f, y0, t_span, h)

# Solución exacta
t_exact = np.linspace(0, 2, 200)
y_exact = exacta(t_exact)
y_exact_puntos = exacta(t_euler)

# Calcular error
error = np.abs(y_euler - y_exact_puntos)

print("=== MÉTODO DE EULER ===")
print(f"EDO: y' = -2y")
print(f"Condición inicial: y(0) = {y0}")
print(f"Intervalo: {t_span}")
print(f"Paso h = {h}")

print("\\n{'t':<8}{'Euler':<15}{'Exacta':<15}{'Error':<15}")
print("-" * 53)
for i in range(0, len(t_euler), 2):
    print(f"{t_euler[i]:<8.2f}{y_euler[i]:<15.6f}{y_exact_puntos[i]:<15.6f}{error[i]:<15.2e}")

print(f"\\nError máximo: {max(error):.4f}")
print(f"Error en t=2: {error[-1]:.4f}")

# Graficar
plt.figure(figsize=(12, 5))

plt.subplot(1, 2, 1)
plt.plot(t_exact, y_exact, 'b-', linewidth=2, label='Solución exacta')
plt.plot(t_euler, y_euler, 'ro-', markersize=6, label=f'Euler (h={h})')
plt.xlabel('t')
plt.ylabel('y')
plt.title("Comparación: Euler vs Exacta")
plt.legend()
plt.grid(True, alpha=0.3)

plt.subplot(1, 2, 2)
plt.semilogy(t_euler, error, 'g^-', markersize=6)
plt.xlabel('t')
plt.ylabel('Error absoluto (log)')
plt.title('Error del método de Euler')
plt.grid(True, alpha=0.3)

plt.tight_layout()
plt.show()`,
                explanation: "CÓMO IDENTIFICAR QUÉ USAR: El enunciado dice 'método de Euler' y menciona 'EDO' (ecuación diferencial ordinaria), 'y' = −2y, 'y(0) = 1', e '[0, 2]'. Esto indica resolver una EDO con condición inicial.\n\nFUNCIONES NECESARIAS:\n• ** (potencia): Para calcular y², t². Se identifica en las fórmulas.\n• numpy.linspace: Para crear el intervalo de tiempo [0, 2]. Se identifica porque dice 'en [0, 2]' y necesitas evaluar en múltiples puntos.\n• math.exp: Para la solución exacta e⁻²ᵗ. Se identifica porque la EDO tiene exponencial.\n• Listas/arrays: Para almacenar los valores de t e y.\n• Bucles (for): Para implementar el método iterativo.\n\nPOR QUÉ FUNCIONA: El método de Euler es el más simple para EDOs: yₙ₊₁ = yₙ + h·f(tₙ, yₙ). Para y' = −2y, la solución exacta es y = e⁻²ᵗ. Euler tiene error O(h), así que con h = 0.1 el error crece con t. Pasos más pequeños dan mejor precisión pero más cálculos.",
                difficulty: "intermedio",
                starterCode: `import numpy as np

def euler(f, y0, t_span, h):
    # Implementa el método de Euler
    pass

def f(t, y):
    return -2 * y

# Resuelve y compara con la solución exacta
`
            },
            {
                id: "15.3",
                number: "Ejercicio 15.3",
                title: "PVI con scipy.solve_ivp",
                description: "Resuelve el oscilador armónico amortiguado: y″ + 0.5y′ + 4y = 0, con y(0) = 1, y′(0) = 0 en [0, 10]. Usa scipy.integrate.solve_ivp.",
                pythonFunctions: ["scipy.integrate.solve_ivp", "sistema de EDOs", "oscilador"],
                solution: `import numpy as np
from scipy.integrate import solve_ivp
import matplotlib.pyplot as plt

def sistema(t, Y):
    """
    y'' + 0.5y' + 4y = 0
    Sistema: y1 = y, y2 = y'
    y1' = y2
    y2' = -0.5*y2 - 4*y1
    """
    y1, y2 = Y
    dy1 = y2
    dy2 = -0.5*y2 - 4*y1
    return [dy1, dy2]

# Condiciones iniciales
y0 = 1      # y(0)
dy0 = 0     # y'(0)
Y0 = [y0, dy0]

# Intervalo
t_span = (0, 10)
t_eval = np.linspace(0, 10, 500)

# Resolver
sol = solve_ivp(sistema, t_span, Y0, t_eval=t_eval, method='RK45')

print("=== OSCILADOR ARMÓNICO AMORTIGUADO ===")
print("EDO: y'' + 0.5y' + 4y = 0")
print(f"y(0) = {y0}, y'(0) = {dy0}")
print(f"\\nMétodo: RK45 (Runge-Kutta 4/5)")
print(f"Puntos evaluados: {len(sol.t)}")

# Parámetros del oscilador
gamma = 0.5  # coeficiente de amortiguamiento
omega0 = 2   # frecuencia natural (sqrt(4))
omega = np.sqrt(omega0**2 - (gamma/2)**2)  # frecuencia amortiguada

print(f"\\nParámetros físicos:")
print(f"  γ (amortiguamiento) = {gamma}")
print(f"  ω₀ (frecuencia natural) = {omega0}")
print(f"  ω (frecuencia amortiguada) = {omega:.4f}")
print(f"  Período ≈ {2*np.pi/omega:.4f}")

# Graficar
fig, axes = plt.subplots(2, 2, figsize=(14, 10))

# Posición vs tiempo
axes[0,0].plot(sol.t, sol.y[0], 'b-', linewidth=2)
axes[0,0].set_xlabel('t')
axes[0,0].set_ylabel('y(t)')
axes[0,0].set_title('Posición vs Tiempo')
axes[0,0].grid(True, alpha=0.3)

# Envolvente
envelope = np.exp(-gamma/2 * sol.t)
axes[0,0].plot(sol.t, envelope, 'r--', alpha=0.5, label='Envolvente')
axes[0,0].plot(sol.t, -envelope, 'r--', alpha=0.5)
axes[0,0].legend()

# Velocidad vs tiempo
axes[0,1].plot(sol.t, sol.y[1], 'g-', linewidth=2)
axes[0,1].set_xlabel('t')
axes[0,1].set_ylabel("y'(t)")
axes[0,1].set_title('Velocidad vs Tiempo')
axes[0,1].grid(True, alpha=0.3)

# Diagrama de fase
axes[1,0].plot(sol.y[0], sol.y[1], 'purple', linewidth=1.5)
axes[1,0].plot(sol.y[0][0], sol.y[1][0], 'go', markersize=10, label='Inicio')
axes[1,0].plot(sol.y[0][-1], sol.y[1][-1], 'ro', markersize=10, label='Final')
axes[1,0].set_xlabel('y')
axes[1,0].set_ylabel("y'")
axes[1,0].set_title('Diagrama de Fase')
axes[1,0].legend()
axes[1,0].grid(True, alpha=0.3)

# Energía
E = 0.5*sol.y[1]**2 + 2*sol.y[0]**2  # E = 0.5*v² + 0.5*k*x²
axes[1,1].plot(sol.t, E, 'orange', linewidth=2)
axes[1,1].set_xlabel('t')
axes[1,1].set_ylabel('Energía')
axes[1,1].set_title('Energía vs Tiempo (decae por amortiguamiento)')
axes[1,1].grid(True, alpha=0.3)

plt.tight_layout()
plt.show()`,
                explanation: "Una EDO de orden 2 se convierte en un sistema de 2 EDOs de orden 1. El oscilador amortiguado tiene solución y(t) = Ae^(−γt/2)cos(ωt + φ). scipy.solve_ivp usa métodos adaptativos como RK45. El diagrama de fase (y vs y′) muestra una espiral hacia el origen debido al amortiguamiento.",
                difficulty: "avanzado",
                starterCode: `import numpy as np
from scipy.integrate import solve_ivp

def sistema(t, Y):
    # y'' + 0.5y' + 4y = 0
    # Convierte a sistema de primer orden
    pass

Y0 = [1, 0]  # y(0) = 1, y'(0) = 0

# Resuelve con solve_ivp
`,
                useSuiteNumerica: true
            },
            {
                id: "15.5",
                number: "Ejercicio 15.5",
                title: "Sistema de Lotka-Volterra",
                description: "Simula el modelo depredador-presa de Lotka-Volterra: x′ = αx − βxy, y′ = δxy − γy, con α=1.5, β=1, δ=1, γ=3, x(0)=10, y(0)=5.",
                pythonFunctions: ["scipy.integrate.solve_ivp", "sistema no lineal", "ecología"],
                solution: `import numpy as np
from scipy.integrate import solve_ivp
import matplotlib.pyplot as plt

def lotka_volterra(t, Z, alpha, beta, delta, gamma):
    """
    Sistema Lotka-Volterra (depredador-presa)
    x' = αx - βxy   (presas)
    y' = δxy - γy   (depredadores)
    """
    x, y = Z
    dxdt = alpha*x - beta*x*y
    dydt = delta*x*y - gamma*y
    return [dxdt, dydt]

# Parámetros
alpha = 1.5   # tasa de crecimiento presas
beta = 1      # tasa de depredación
delta = 1     # eficiencia de conversión
gamma = 3     # tasa de muerte depredadores

# Condiciones iniciales
x0 = 10  # presas
y0 = 5   # depredadores
Z0 = [x0, y0]

# Resolver
t_span = (0, 15)
t_eval = np.linspace(0, 15, 1000)

sol = solve_ivp(
    lotka_volterra, t_span, Z0, 
    args=(alpha, beta, delta, gamma),
    t_eval=t_eval, method='RK45'
)

print("=== MODELO LOTKA-VOLTERRA ===")
print("Sistema depredador-presa")
print(f"\\nParámetros:")
print(f"  α = {alpha} (crecimiento presas)")
print(f"  β = {beta} (depredación)")
print(f"  δ = {delta} (conversión)")
print(f"  γ = {gamma} (muerte depredadores)")
print(f"\\nCondiciones iniciales:")
print(f"  Presas x(0) = {x0}")
print(f"  Depredadores y(0) = {y0}")

# Puntos de equilibrio
x_eq = gamma / delta
y_eq = alpha / beta
print(f"\\nPunto de equilibrio no trivial:")
print(f"  x* = {x_eq}, y* = {y_eq}")

# Graficar
fig, axes = plt.subplots(1, 3, figsize=(15, 5))

# Población vs tiempo
axes[0].plot(sol.t, sol.y[0], 'b-', linewidth=2, label='Presas (x)')
axes[0].plot(sol.t, sol.y[1], 'r-', linewidth=2, label='Depredadores (y)')
axes[0].set_xlabel('Tiempo')
axes[0].set_ylabel('Población')
axes[0].set_title('Poblaciones vs Tiempo')
axes[0].legend()
axes[0].grid(True, alpha=0.3)

# Diagrama de fase
axes[1].plot(sol.y[0], sol.y[1], 'green', linewidth=1.5)
axes[1].plot(x0, y0, 'ko', markersize=10, label='Inicio')
axes[1].plot(x_eq, y_eq, 'r*', markersize=15, label=f'Equilibrio ({x_eq},{y_eq})')
axes[1].set_xlabel('Presas (x)')
axes[1].set_ylabel('Depredadores (y)')
axes[1].set_title('Diagrama de Fase')
axes[1].legend()
axes[1].grid(True, alpha=0.3)

# Campo vectorial
x_grid = np.linspace(0.5, 20, 15)
y_grid = np.linspace(0.5, 10, 15)
X, Y = np.meshgrid(x_grid, y_grid)
U = alpha*X - beta*X*Y
V = delta*X*Y - gamma*Y
axes[2].quiver(X, Y, U, V, alpha=0.5)
axes[2].plot(sol.y[0], sol.y[1], 'green', linewidth=2)
axes[2].set_xlabel('Presas (x)')
axes[2].set_ylabel('Depredadores (y)')
axes[2].set_title('Campo Vectorial')
axes[2].set_xlim(0, 20)
axes[2].set_ylim(0, 10)

plt.tight_layout()
plt.show()`,
                explanation: "El modelo Lotka-Volterra describe interacciones depredador-presa. Las presas crecen exponencialmente (αx) pero son cazadas (βxy). Los depredadores aumentan al comer (δxy) pero mueren naturalmente (γy). Las soluciones son ciclos cerrados en el espacio de fases, mostrando oscilaciones periódicas en ambas poblaciones.",
                difficulty: "avanzado",
                starterCode: `import numpy as np
from scipy.integrate import solve_ivp

def lotka_volterra(t, Z, alpha, beta, delta, gamma):
    # Implementa el sistema
    pass

# Parámetros y condiciones iniciales
alpha, beta, delta, gamma = 1.5, 1, 1, 3
Z0 = [10, 5]

# Resuelve y grafica
`,
                useSuiteNumerica: true
            },
            {
                id: "16.1",
                number: "Ejercicio 16.1",
                title: "Problema de Valor en Frontera",
                description: "Resuelve el PVF: y″ = −y, con y(0) = 0 y y(π) = 0. Esto es un problema de autovalores (la solución es y = sin(x)).",
                pythonFunctions: ["scipy.integrate.solve_bvp", "PVF", "condiciones de frontera"],
                solution: `import numpy as np
from scipy.integrate import solve_bvp
import matplotlib.pyplot as plt

def ecuacion(x, y):
    """
    y'' = -y
    Sistema: y1 = y, y2 = y'
    y1' = y2
    y2' = -y1
    """
    return np.vstack((y[1], -y[0]))

def condiciones_frontera(ya, yb):
    """
    ya = y en x=0
    yb = y en x=π
    Condiciones: y(0) = 0, y(π) = 0
    """
    return np.array([ya[0], yb[0]])

# Malla inicial
x = np.linspace(0, np.pi, 50)

# Estimación inicial (importante para la convergencia)
# Sabemos que y = sin(x) es solución, pero usemos algo genérico
y_init = np.zeros((2, x.size))
y_init[0] = np.sin(x)  # estimación para y
y_init[1] = np.cos(x)  # estimación para y'

# Resolver
sol = solve_bvp(ecuacion, condiciones_frontera, x, y_init)

print("=== PROBLEMA DE VALOR EN FRONTERA ===")
print("EDO: y'' = -y")
print("Condiciones: y(0) = 0, y(π) = 0")
print(f"\\nConvergió: {sol.success}")
print(f"Mensaje: {sol.message}")

# Solución exacta
x_exact = np.linspace(0, np.pi, 200)
y_exact = np.sin(x_exact)

# Evaluar solución numérica en puntos finos
x_plot = np.linspace(0, np.pi, 200)
y_num = sol.sol(x_plot)[0]

# Error
error = np.abs(y_num - np.sin(x_plot))

print(f"\\nError máximo: {np.max(error):.2e}")

# Normalizar para comparar (la solución es única salvo constante)
# y = A*sin(x), normalizamos para que max(y) = 1
y_num_norm = y_num / np.max(np.abs(y_num)) if np.max(np.abs(y_num)) > 0 else y_num

print("\\nVerificación de condiciones de frontera:")
print(f"  y(0) = {sol.sol(0)[0]:.6e} (debe ser 0)")
print(f"  y(π) = {sol.sol(np.pi)[0]:.6e} (debe ser 0)")

# Graficar
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

axes[0].plot(x_plot, y_exact, 'b-', linewidth=3, label='Exacta: y = sin(x)')
axes[0].plot(x_plot, y_num_norm, 'r--', linewidth=2, label='Numérica (normalizada)')
axes[0].axhline(y=0, color='k', linewidth=0.5)
axes[0].set_xlabel('x')
axes[0].set_ylabel('y')
axes[0].set_title('Solución del PVF')
axes[0].legend()
axes[0].grid(True, alpha=0.3)

axes[1].semilogy(x_plot, error + 1e-16, 'g-', linewidth=2)
axes[1].set_xlabel('x')
axes[1].set_ylabel('Error absoluto')
axes[1].set_title('Error vs Solución Exacta')
axes[1].grid(True, alpha=0.3)

plt.tight_layout()
plt.show()

print("\\nNota: Este PVF tiene infinitas soluciones: y = A*sin(x) para cualquier A.")
print("solve_bvp encuentra una de ellas basándose en la estimación inicial.")`,
                explanation: "Un PVF especifica condiciones en ambos extremos del intervalo, no solo al inicio. La ecuación y″ = −y con y(0) = y(π) = 0 tiene solución y = A·sin(x). scipy.solve_bvp usa un método de colocación que requiere una estimación inicial. Este problema es especial porque tiene infinitas soluciones (cualquier múltiplo de sin(x)).",
                difficulty: "avanzado",
                starterCode: `import numpy as np
from scipy.integrate import solve_bvp

def ecuacion(x, y):
    # y'' = -y como sistema
    pass

def condiciones_frontera(ya, yb):
    # y(0) = 0, y(π) = 0
    pass

# Resuelve el PVF
`,
                useSuiteNumerica: true
            },
            {
                id: "16.2",
                number: "Ejercicio 16.2",
                title: "Método de Euler Mejorado (Heun)",
                description: "Implementa el método de Euler modificado (Heun) para resolver y' = 0.5y con y(0) = 1 en [0, 4].",
                pythonFunctions: ["numpy", "EDO", "método de Euler modificado"],
                solution: `import numpy as np
import matplotlib.pyplot as plt

def euler_mejorado(f, y0, t_span, h):
    t_start, t_end = t_span
    t = np.arange(t_start, t_end + h, h)
    y = np.zeros(len(t))
    y[0] = y0
    
    for i in range(len(t) - 1):
        k1 = f(t[i], y[i])
        k2 = f(t[i] + h, y[i] + h * k1)
        y[i+1] = y[i] + (h/2) * (k1 + k2)
    
    return t, y

f = lambda t, y: 0.5 * y
y0 = 1
t_span = (0, 4)
h = 0.1

t, y = euler_mejorado(f, y0, t_span, h)

# Solución exacta: y = e^(0.5t)
t_exact = np.linspace(0, 4, 200)
y_exact = np.exp(0.5 * t_exact)

print("=== METODO DE EULER MEJORADO (HEUN) ===")
print(f"y' = 0.5y, y(0) = 1")
print(f"h = {h}")
print(f"\nSolución en algunos puntos:")
for i in range(0, len(t), 5):
    print(f"t = {t[i]:.1f}, y = {y[i]:.2f}")

plt.figure(figsize=(10, 5))
plt.plot(t_exact, y_exact, 'b-', linewidth=2, label='Exacta: y = e^(0.5t)')
plt.plot(t, y, 'ro-', markersize=4, label='Euler Mejorado')
plt.xlabel('t')
plt.ylabel('y')
plt.legend()
plt.grid(True, alpha=0.3)
plt.title('Método de Euler Mejorado')
plt.show()`,
                explanation: "CÓMO IDENTIFICAR QUÉ USAR: El enunciado dice 'Euler modificado' o 'Heun', y tiene una EDO simple y' = 0.5y.\n\nFUNCIONES NECESARIAS:\n• numpy: Para crear arrays y cálculos.\n• Bucles: Para las iteraciones.\n• lambda: Para definir f(t,y).\n\nPOR QUÉ FUNCIONA: El método de Euler usa yₙ₊₁ = yₙ + h·f(tₙ,yₙ). Euler mejorado promedia dos pendientes: k₁ = f(tₙ,yₙ) y k₂ = f(tₙ₊₁,yₙ+h·k₁). Luego yₙ₊₁ = yₙ + (h/2)(k₁+k₂). Es más preciso que Euler.",
                difficulty: "intermedio",
                starterCode: `import numpy as np
import matplotlib.pyplot as plt

def euler_mejorado(f, y0, t_span, h):
    # Implementa el método de Euler modificado
    pass

f = lambda t, y: 0.5 * y
y0 = 1

# Resuelve la EDO
`
            },
            {
                id: "16.3",
                number: "Ejercicio 16.3",
                title: "Sistema de EDOs - Carrera de Infectivos",
                description: "Modela la propagación de un virus con el modelo SI: I' = βSI, S' = −βSI, con S(0)=99, I(0)=1, β=0.01.",
                pythonFunctions: ["scipy.integrate.solve_ivp", "sistema de EDOs"],
                solution: `import numpy as np
from scipy.integrate import solve_ivp
import matplotlib.pyplot as plt

def modelo_SI(t, y, beta):
    S, I = y
    dSdt = -beta * S * I
    dIdt = beta * S * I
    return [dSdt, dIdt]

beta = 0.01
S0 = 99
I0 = 1
y0 = [S0, I0]

t_span = (0, 50)
t_eval = np.linspace(0, 50, 500)

sol = solve_ivp(modelo_SI, t_span, y0, t_eval=t_eval, args=(beta,))

print("=== MODELO SI (Susceptibles-Infectados) ===")
print(f"β = {beta}, S(0) = {S0}, I(0) = {I0}")
print(f"\nPoblación final: S = {sol.y[0,-1]:.2f}, I = {sol.y[1,-1]:.2f}")

plt.figure(figsize=(10, 5))
plt.plot(sol.t, sol.y[0], 'b-', linewidth=2, label='Susceptibles (S)')
plt.plot(sol.t, sol.y[1], 'r-', linewidth=2, label='Infectados (I)')
plt.xlabel('Tiempo')
plt.ylabel('Población')
plt.legend()
plt.grid(True, alpha=0.3)
plt.title('Modelo SI - Propagación de Virus')
plt.show()`,
                explanation: "CÓMO IDENTIFICAR QUÉ USAR: El enunciado dice 'sistema de EDOs' y tiene dos variables S e I que interactúan.\n\nFUNCIONES NECESARIAS:\n• solve_ivp: Resolver sistema de EDOs.\n• args: Pasar parámetros adicionales.\n\nPOR QUÉ FUNCIONA: El modelo SI tiene dos ecuaciones acopladas. Los susceptibles (S) se infectan al contacto con感染ados (I) a tasa β. Los Infectados no se recuperan en este modelo simple.",
                difficulty: "avanzado",
                starterCode: `import numpy as np
from scipy.integrate import solve_ivp

def modelo_SI(t, y, beta):
    S, I = y
    # Implementa las ecuaciones
    pass

beta = 0.01
y0 = [99, 1]

# Resuelve el sistema
`
            },
            {
                id: "16.4",
                number: "Ejercicio 16.4",
                title: "EDO de Segundo Orden - Péndulo Simple",
                description: "Resuelve la ecuación del péndulo simple: θ'' + (g/L)sin(θ) = 0, con θ(0)=π/4, θ'(0)=0, L=1, g=9.8.",
                pythonFunctions: ["scipy.integrate.solve_ivp", "sistema de EDOs"],
                solution: `import numpy as np
from scipy.integrate import solve_ivp
import matplotlib.pyplot as plt

g = 9.8
L = 1

def pendulo(t, y, g, L):
    theta, omega = y
    dtheta = omega
    domega = -(g/L) * np.sin(theta)
    return [dtheta, domega]

y0 = [np.pi/4, 0]  # θ(0) = π/4, ω(0) = 0
t_span = (0, 10)
t_eval = np.linspace(0, 10, 500)

sol = solve_ivp(pendulo, t_span, y0, t_eval=t_eval, args=(g, L))

print("=== PENDULO SIMPLE ===")
print(f"g = {g}, L = {L}")
print(f"θ(0) = π/4 = {np.pi/4:.4f} rad")
print(f"\nPeríodo aproximado: analizar los picos")

plt.figure(figsize=(10, 5))
plt.plot(sol.t, sol.y[0], 'b-', linewidth=2)
plt.xlabel('Tiempo (s)')
plt.ylabel('θ (rad)')
plt.title('Péndulo Simple - Oscilaciones')
plt.grid(True, alpha=0.3)
plt.show()`,
                explanation: "CÓMO IDENTIFICAR QUÉ USAR: El enunciado dice 'EDO de segundo orden' y tiene 'péndulo'. Esto indica convertir a sistema de primer orden.\n\nFUNCIONES NECESARIAS:\n• solve_ivp: Resolver el sistema.\n• np.sin(): Función trigonométrica.\n\nPOR QUÉ FUNCIONA: Una EDO de segundo orden θ'' = f(t,θ,θ') se convierte a sistema: θ' = ω, ω' = f(t,θ,ω). Para péndulo: θ' = ω, ω' = −(g/L)sin(θ).",
                difficulty: "avanzado",
                starterCode: `import numpy as np
from scipy.integrate import solve_ivp

g = 9.8
L = 1

def pendulo(t, y, g, L):
    theta, omega = y
    # Convierte a sistema de primer orden
    pass

y0 = [np.pi/4, 0]

# Resuelve
`
            },
            {
                id: "16.5",
                number: "Ejercicio 16.5",
                title: "Método de Runge-Kutta 4 (RK4)",
                description: "Implementa el método RK4 para resolver y' = y − x² + 1 con y(0) = 0.5 en [0, 2].",
                pythonFunctions: ["numpy", "Runge-Kutta 4", "EDO"],
                solution: `import numpy as np
import matplotlib.pyplot as plt

def rk4(f, y0, t_span, h):
    t_start, t_end = t_span
    t = np.arange(t_start, t_end + h, h)
    y = np.zeros(len(t))
    y[0] = y0
    
    for i in range(len(t) - 1):
        k1 = f(t[i], y[i])
        k2 = f(t[i] + h/2, y[i] + h*k1/2)
        k3 = f(t[i] + h/2, y[i] + h*k2/2)
        k4 = f(t[i] + h, y[i] + h*k3)
        
        y[i+1] = y[i] + (h/6)*(k1 + 2*k2 + 2*k3 + k4)
    
    return t, y

f = lambda t, y: y - t**2 + 1
y0 = 0.5
t_span = (0, 2)
h = 0.1

t, y = rk4(f, y0, t_span, h)

# Solución exacta: y = x² + 2x + 1 - e^x
t_exact = np.linspace(0, 2, 200)
y_exact = t_exact**2 + 2*t_exact + 1 - np.exp(t_exact)

print("=== RUNGE-KUTTA 4 (RK4) ===")
print(f"y' = y - x² + 1, y(0) = 0.5, h = {h}")

plt.figure(figsize=(10, 5))
plt.plot(t_exact, y_exact, 'b-', linewidth=2, label='Exacta')
plt.plot(t, y, 'ro-', markersize=3, label='RK4')
plt.xlabel('t')
plt.ylabel('y')
plt.legend()
plt.grid(True, alpha=0.3)
plt.title('Método Runge-Kutta 4')
plt.show()`,
                explanation: "CÓMO IDENTIFICAR QUÉ USAR: El enunciado dice 'Runge-Kutta 4' o 'RK4'. Es un método de mayor orden que Euler.\n\nFUNCIONES NECESARIAS:\n• Bucles: Para las iteraciones.\n• numpy: Para cálculos.\n\nPOR QUÉ FUNCIONA: RK4 usa 4 evaluaciones de la pendiente por paso:\nk₁ = f(t,y)\nk₂ = f(t+h/2, y+h·k₁/2)\nk₃ = f(t+h/2, y+h·k₂/2)\nk₄ = f(t+h, y+h·k₃)\nyₙ₊₁ = yₙ + (h/6)(k₁ + 2k₂ + 2k₃ + k₄)\nEs preciso de orden 4 (error O(h⁴)).",
                difficulty: "avanzado",
                starterCode: `import numpy as np
import matplotlib.pyplot as plt

def rk4(f, y0, t_span, h):
    # Implementa el método RK4
    pass

f = lambda t, y: y - t**2 + 1
y0 = 0.5

# Resuelve
`
            }
        ]
    }
];

// Lista de todas las funciones Python usadas en el libro
export const pythonFunctions: { name: string; description: string; category: string }[] = [
    // Funciones básicas
    { name: "print()", description: "Muestra información en la consola", category: "Básicas" },
    { name: "input()", description: "Lee entrada del usuario", category: "Básicas" },
    { name: "type()", description: "Devuelve el tipo de un objeto", category: "Básicas" },
    { name: "len()", description: "Devuelve la longitud de una secuencia", category: "Básicas" },
    { name: "range()", description: "Genera una secuencia de números", category: "Básicas" },
    { name: "abs()", description: "Valor absoluto", category: "Básicas" },
    { name: "round()", description: "Redondea un número", category: "Básicas" },
    { name: "sum()", description: "Suma elementos de una secuencia", category: "Básicas" },
    { name: "max()", description: "Máximo de una secuencia", category: "Básicas" },
    { name: "min()", description: "Mínimo de una secuencia", category: "Básicas" },

    // Módulo math
    { name: "math.sin()", description: "Seno (radianes)", category: "math" },
    { name: "math.cos()", description: "Coseno (radianes)", category: "math" },
    { name: "math.tan()", description: "Tangente (radianes)", category: "math" },
    { name: "math.exp()", description: "Exponencial e^x", category: "math" },
    { name: "math.log()", description: "Logaritmo natural", category: "math" },
    { name: "math.log10()", description: "Logaritmo base 10", category: "math" },
    { name: "math.sqrt()", description: "Raíz cuadrada", category: "math" },
    { name: "math.pi", description: "Constante π", category: "math" },
    { name: "math.e", description: "Constante e", category: "math" },
    { name: "math.radians()", description: "Convierte grados a radianes", category: "math" },
    { name: "math.degrees()", description: "Convierte radianes a grados", category: "math" },

    // NumPy
    { name: "np.array()", description: "Crea un arreglo NumPy", category: "NumPy" },
    { name: "np.linspace()", description: "Genera puntos equiespaciados", category: "NumPy" },
    { name: "np.arange()", description: "Genera secuencia con paso", category: "NumPy" },
    { name: "np.zeros()", description: "Arreglo de ceros", category: "NumPy" },
    { name: "np.ones()", description: "Arreglo de unos", category: "NumPy" },
    { name: "np.dot()", description: "Producto punto", category: "NumPy" },
    { name: "np.cross()", description: "Producto vectorial", category: "NumPy" },
    { name: "np.linalg.det()", description: "Determinante de matriz", category: "NumPy" },
    { name: "np.linalg.inv()", description: "Inversa de matriz", category: "NumPy" },
    { name: "np.linalg.solve()", description: "Resuelve sistema lineal", category: "NumPy" },
    { name: "np.linalg.eig()", description: "Autovalores y autovectores", category: "NumPy" },
    { name: "np.polyfit()", description: "Ajuste polinomial", category: "NumPy" },
    { name: "np.poly1d()", description: "Crea función polinómica", category: "NumPy" },
    { name: "np.roots()", description: "Raíces de polinomio", category: "NumPy" },

    // SciPy
    { name: "optimize.root_scalar()", description: "Busca raíz de función escalar", category: "SciPy" },
    { name: "optimize.fsolve()", description: "Resuelve sistema no lineal", category: "SciPy" },
    { name: "integrate.solve_ivp()", description: "Resuelve PVI de EDO", category: "SciPy" },
    { name: "integrate.solve_bvp()", description: "Resuelve PVF de EDO", category: "SciPy" },
    { name: "integrate.quad()", description: "Integración numérica", category: "SciPy" },

    // Matplotlib
    { name: "plt.plot()", description: "Grafica líneas", category: "Matplotlib" },
    { name: "plt.scatter()", description: "Grafica puntos dispersos", category: "Matplotlib" },
    { name: "plt.xlabel()", description: "Etiqueta eje X", category: "Matplotlib" },
    { name: "plt.ylabel()", description: "Etiqueta eje Y", category: "Matplotlib" },
    { name: "plt.title()", description: "Título del gráfico", category: "Matplotlib" },
    { name: "plt.legend()", description: "Muestra leyenda", category: "Matplotlib" },
    { name: "plt.grid()", description: "Muestra cuadrícula", category: "Matplotlib" },
    { name: "plt.show()", description: "Muestra el gráfico", category: "Matplotlib" },
    { name: "plt.subplot()", description: "Crea subgráficos", category: "Matplotlib" },
    { name: "plt.figure()", description: "Crea nueva figura", category: "Matplotlib" },

    // Métodos numéricos (SuiteNumericaMaster)
    { name: "punto_fijo()", description: "Iteración de punto fijo x = g(x)", category: "Métodos Numéricos" },
    { name: "newton()", description: "Método de Newton-Raphson", category: "Métodos Numéricos" },
    { name: "biseccion()", description: "Método de bisección", category: "Métodos Numéricos" },
    { name: "euler()", description: "Método de Euler para EDOs", category: "Métodos Numéricos" },
    { name: "lagrange()", description: "Interpolación de Lagrange", category: "Métodos Numéricos" },
    { name: "regresion_lineal()", description: "Regresión por mínimos cuadrados", category: "Métodos Numéricos" },
];
