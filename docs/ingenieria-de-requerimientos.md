# Ingeniería de requerimientos: Sistema de taquilla de cine

Caso de estudio 3 · Aplicación web con HTML, CSS y JavaScript

## 1. Introducción

### 1.1 Propósito
Este documento recoge los requerimientos del sistema de taquilla de un cine: qué debe hacer, bajo qué reglas y cómo se comprueba que funciona. Sirve de base para el diseño, la programación y las pruebas.

### 1.2 Alcance
El sistema es una aplicación web que se ejecuta en el navegador, sin servidor ni base de datos. Permite que un operador de taquilla inicie sesión, registre funciones, calcule la recaudación, cambie asientos con recargo por horario y consulte una gráfica de recaudaciones.

### 1.3 Definiciones
- **Recaudación total:** boletas vendidas × precio por boleta.
- **Tarifa base:** $12.000 COP por boleta.
- **Clave CINE:** palabra de seguridad que se pide para continuar registrando.
- **Recargo:** 5% sobre el valor base de la boleta en cambios de asiento entre 15:00 y 18:00.

## 2. Descripción general

- **Usuario:** operador de taquilla (un solo rol).
- **Entorno:** navegador web de escritorio o celular.
- **Restricciones:** solo HTML, CSS y JavaScript básico; sin librerías ni servidor; los datos viven en memoria mientras la página está abierta.
- **Supuestos:** el operador conoce el usuario y la contraseña; el navegador permite ventanas de diálogo (`prompt` y `alert`).

## 3. Requerimientos funcionales

| ID | Requerimiento | Prioridad |
|----|---------------|-----------|
| RF-01 | Al abrir la aplicación se muestra el login con usuario y contraseña. | Alta |
| RF-02 | El sistema acepta solo el usuario `Cinecali` con la contraseña `Estrenos`. | Alta |
| RF-03 | Si los datos son incorrectos se muestra un mensaje de error y el login sigue visible. | Alta |
| RF-04 | Si los datos son correctos se oculta el login y se muestra el panel principal. | Alta |
| RF-05 | El panel tiene un botón Salir que regresa al login y limpia sus campos. | Media |
| RF-06 | El panel solicita nombre de la película, sala, boletas vendidas y precio por boleta (tarifa base $12.000 precargada). | Alta |
| RF-07 | Se validan los campos: no pueden estar vacíos y boletas y precio deben ser mayores que cero. | Alta |
| RF-08 | El sistema calcula la recaudación total (boletas × precio). | Alta |
| RF-09 | Antes de mostrar el resultado se muestra un efecto de reloj de 2 segundos. | Media |
| RF-10 | Se muestran película, sala, boletas vendidas, tarifa base y recaudación total. | Alta |
| RF-11 | Al terminar el cálculo se pide la clave `CINE` en una ventana de diálogo. | Alta |
| RF-12 | Con la clave `CINE` se limpian los campos. Con otra palabra se emite una alerta y se regresa al login. | Alta |
| RF-13 | Cada recaudación calculada se guarda en un arreglo. | Alta |
| RF-14 | Los datos del arreglo se dibujan en una gráfica de líneas que se actualiza en cada registro. | Alta |
| RF-15 | El módulo de cambio de asiento solicita asiento actual, asiento nuevo y hora del cambio. | Alta |
| RF-16 | Si la hora está entre 15:00 y 18:00 se aplica un recargo del 5% sobre el valor base de la boleta. | Alta |
| RF-17 | Se muestran el valor base, el recargo y el total a pagar del cambio de asiento. | Alta |
| RF-18 | El operador puede capturar o cargar una foto de control y ver su vista previa. | Media |

## 4. Requerimientos no funcionales

| ID | Categoría | Requerimiento |
|----|-----------|---------------|
| RNF-01 | Usabilidad | Los campos tienen etiquetas y ejemplos de ayuda; los mensajes indican qué corregir. |
| RNF-02 | Diseño adaptable | La interfaz se ajusta a pantallas de 800 px o menos con una sola columna. |
| RNF-03 | Compatibilidad | Funciona en versiones actuales de Chrome, Edge, Firefox y Safari. |
| RNF-04 | Rendimiento | Toda acción responde de inmediato, salvo el efecto reloj, que dura 2 segundos. |
| RNF-05 | Mantenibilidad | El código separa estructura (HTML), estilo (CSS) y lógica (JavaScript) en archivos distintos, con nombres de funciones claros. |
| RNF-06 | Portabilidad | Se publica como sitio estático en GitHub Pages, sin instalación. |
| RNF-07 | Accesibilidad | Los campos tienen `label`, las imágenes tienen texto alternativo y el foco del teclado es visible. |
| RNF-08 | Seguridad | Limitación conocida: las credenciales están en el código del navegador. En un sistema real se validarían en un servidor. |

## 4.1 Reglas de negocio

| ID | Regla |
|----|-------|
| RN-01 | Usuario válido: `Cinecali`. Contraseña válida: `Estrenos` (distingue mayúsculas). |
| RN-02 | Tarifa base de la boleta: $12.000 COP. |
| RN-03 | Recaudación total = boletas vendidas × precio por boleta. |
| RN-04 | La clave de continuación es `CINE` exacta, en mayúsculas. Cualquier otra palabra, o cancelar, devuelve al login. |
| RN-05 | Cambio de asiento entre 15:00 y 18:00 (inclusive): recargo = 5% de $12.000 = $600. |
| RN-06 | Cambio de asiento fuera de ese horario: sin recargo. |

## 5. Casos de uso

### CU-01 Iniciar sesión
- **Actor:** operador.
- **Precondición:** la aplicación está abierta.
- **Flujo principal:** 1) El operador escribe usuario y contraseña. 2) Pulsa Iniciar sesión. 3) El sistema valida los datos. 4) Oculta el login y muestra el panel.
- **Flujo alterno:** en el paso 3, si los datos no coinciden, el sistema muestra el mensaje de error y el operador puede intentar de nuevo.
- **Postcondición:** el panel principal queda visible.

### CU-02 Registrar función
- **Actor:** operador.
- **Precondición:** sesión iniciada.
- **Flujo principal:** 1) Escribe película, sala y boletas; el precio ya trae $12.000. 2) Pulsa Calcular y registrar. 3) El sistema valida los campos. 4) Muestra el reloj durante 2 segundos. 5) Calcula y muestra la recaudación. 6) Guarda el valor en el arreglo y actualiza la gráfica.
- **Flujo alterno:** en el paso 3, si falta un dato o hay valores menores o iguales a cero, el sistema muestra un aviso y no calcula.
- **Postcondición:** la función queda registrada y aparece en la gráfica.

### CU-03 Continuar registro con clave
- **Actor:** operador.
- **Precondición:** se terminó un cálculo.
- **Flujo principal:** 1) El sistema abre una ventana pidiendo la clave. 2) El operador escribe `CINE`. 3) El sistema limpia los campos del formulario.
- **Flujo alterno:** si escribe otra palabra o cancela, el sistema muestra una alerta y regresa al login.
- **Postcondición:** el formulario queda listo para otra función, o la sesión se cierra.

### CU-04 Cambiar asiento
- **Actor:** operador.
- **Precondición:** sesión iniciada.
- **Flujo principal:** 1) Escribe asiento actual, asiento nuevo y hora. 2) Pulsa Cambiar asiento. 3) El sistema convierte la hora a minutos y revisa si está entre 15:00 y 18:00. 4) Calcula el recargo y el total. 5) Muestra el resultado.
- **Flujo alterno:** si falta algún dato, muestra un aviso y no calcula.
- **Postcondición:** el resultado del cambio queda visible.

### CU-05 Adjuntar foto de control
- **Actor:** operador.
- **Flujo principal:** 1) Pulsa Capturar / cargar foto. 2) Toma la foto o elige un archivo. 3) El sistema muestra la vista previa.

## 6. Datos que maneja el sistema

| Dato | Tipo | Descripción |
|------|------|-------------|
| `TARIFA` | Constante numérica | Tarifa base ($12.000). |
| `recaudaciones` | Arreglo de números | Recaudación de cada función registrada. |
| `calculando` | Booleano | Indica si el efecto reloj está en marcha. |

## 7. Matriz de trazabilidad

| Requerimientos | Función de JavaScript | Elementos de la interfaz |
|----------------|-----------------------|--------------------------|
| RF-01 a RF-04 | `iniciarSesion()` | `usuario`, `contrasena`, `errorLogin` |
| RF-05 | `volverAlLogin()` | Botón Salir |
| RF-06 a RF-10 | `calcularYRegistrar()` | `pelicula`, `sala`, `boletas`, `precio`, `reloj`, `resTotal` |
| RF-11, RF-12 | `continuarRegistro()` | Botón Continuar registro, `mensaje` |
| RF-13, RF-14 | `recaudaciones.push()`, `dibujarGrafica()` | `grafica` |
| RF-15 a RF-17 | `cambiarAsiento()` | `asientoActual`, `asientoNuevo`, `horaCambio`, `resTotalAsiento` |
| RF-18 | `mostrarFoto()` | `archivoFoto`, `vistaFoto` |

## 8. Plan de pruebas

| ID | Prueba | Entrada | Resultado esperado | Requerimiento |
|----|--------|---------|--------------------|---------------|
| CP-01 | Login correcto | Cinecali / Estrenos | Se muestra el panel | RF-02, RF-04 |
| CP-02 | Login incorrecto | Cinecali / 1234 | Mensaje de error, el login sigue visible | RF-03 |
| CP-03 | Salir | Pulsar Salir | Regresa al login con campos vacíos | RF-05 |
| CP-04 | Campos vacíos | Calcular sin datos | Aviso de completar campos | RF-07 |
| CP-05 | Valor inválido | Boletas = 0 | Aviso de valores mayores que cero | RF-07 |
| CP-06 | Cálculo | 50 boletas × $12.000 | $600.000 tras el reloj | RF-08, RF-09, RF-10 |
| CP-07 | Clave correcta | `CINE` | Campos limpios | RF-12 |
| CP-08 | Clave incorrecta | `cine` | Alerta y regreso al login | RF-12 |
| CP-09 | Gráfica | Registrar 3 funciones | Línea con 3 puntos F1, F2, F3 | RF-13, RF-14 |
| CP-10 | Cambio con recargo | 16:30 | Recargo $600, total $12.600 | RF-16, RF-17 |
| CP-11 | Cambio sin recargo | 10:00 | Recargo $0, total $12.000 | RF-16, RF-17 |
| CP-12 | Límite del horario | 15:00 y 18:00 | Recargo $600 en ambos | RF-16 |
| CP-13 | Foto | Elegir una imagen | Se muestra la vista previa | RF-18 |
| CP-14 | Celular | Pantalla de 400 px | Una sola columna, sin desbordes | RNF-02 |

## 9. Limitaciones y trabajo futuro

- Los datos no se guardan: al recargar la página se pierden.
- La validación de credenciales debería hacerse en un servidor.
- Se podría agregar un historial con películas y salas, y exportar los datos a Excel.
