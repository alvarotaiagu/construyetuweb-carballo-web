# construyetuweb.es — web nueva

Sustituye a `https://construyetuweb.es/` (Incomedia WebSite X5, sin CMS).
Diseñador web en Carballo (A Coruña).

**Previsualización:** https://alvarotaiagu.github.io/construyetuweb-carballo-web/

Es una preview, no el sitio definitivo: lleva `canonical` al dominio real y se marca
`noindex` cuando se sirve desde `github.io`, para no competir en Google con
construyetuweb.es mientras ahí siga la web antigua.

**Concepto: «Wireframe» — del boceto a la web.** La página se construye delante del
visitante: primero cajas grises con etiquetas mono (`HEADER`, `H1`, `IMG`, `CTA`) y cotas
en píxeles; después se rellenan de color, las líneas de texto falso se sustituyen por el
texto real y la tipografía pasa de mono a sans. Cada sección repite el gesto al cruzar el
30 % del viewport, y no vuelve atrás.

Primera plantilla del sector **diseño web / agencia pequeña** en la carpeta. Distinta de
Calidade Systems («Traza», pistas de circuito), Astrobots («Piezas», ensamblaje) y Más que
Tinta («Cartucho», niveles CMYK).

---

## Estructura

```
index.html                  portada (hero, qué hacemos, packs, tiendas, responsive,
                            gráfico, proceso, clientes, soporte, ayudas, CTA, contacto)
privacidad.html             aviso legal + política de privacidad (texto heredado)
cookies.html                política de cookies (empieza por lo que guarda esta web)
soporte/software.html       descargas de asistencia remota, fuera de la portada
404.html                    + red de seguridad JS del mapa de 301
_redirects / .htaccess      mapa de 301 para hosting estático y Apache
css/style.css   js/main.js
assets/img/                 fotografía de archivo, ya corregida de color
assets/logos/               logo recreado en SVG + logos de los 9 clientes
scripts/grade-photos.py     el color grading, reejecutable
INVENTARIO.md               URL antigua → contenido → sección nueva → 301
screenshots/                verificación con Playwright
```

Sin build. Se sube tal cual.

## Paleta y tipografía

| | |
|---|---|
| Lienzo | `#FFFFFF` |
| Gris de boceto | `#D5DAE1` |
| Marino (del logo) | `#1F3A93` |
| Azul claro (del logo) | `#4A90D9` |
| Amarillo de anotación | `#FFE270` — solo etiquetas y notas |
| Mono | IBM Plex Mono — todo lo que es «boceto» |
| Sans | Inter — todo lo «renderizado» |

Modo claro siempre. No hay modo oscuro y no se ofrece.

## Movimiento

La web es el porfolio: la animación tiene que demostrar el oficio, no decorar.

- **Pasada de render.** Al entrar una sección, una línea de escaneo marino la recorre de
  arriba abajo y el contenido se renderiza escalonado según su altura: se lee como un
  render pintando la página, no como un fundido.
- **Demo de responsive** (`#responsive`). Una maqueta de navegador se estrecha de 1440 a
  390 px con el scroll. El reflow **no está simulado**: `.rz__frame` es un
  `container-type:inline-size` y la mini-web usa `@container`, que es exactamente la
  técnica que se está vendiendo. Por debajo de 760 px no cabe encoger, así que el scrub se
  apaga, se quita el recorrido vacío y se le dice al visitante que él mismo es la demo.
- **Baraja de packs.** Las tres tarjetas van contiguas y se pegan con `top` escalonado
  (18 px por tarjeta); el recorrido lo da un `::after` dentro del `<ul>`, no un margen
  —un margen abre huecos en vez de apilar—. La tarjeta de abajo se encoge al 94 %.
  Medido: 1260 px de scroll con dos tarjetas pegadas, 420 px con las tres.
- **Marquee reactivo**: acelera y se inclina con la velocidad del scroll.
- Parallax en las fotos, char-reveal de mono a sans, botones magnéticos y contador real.
- **Herramientas de diseñador**: lectura de coordenadas junto al cursor y overlay de la
  rejilla de maquetación (botón o tecla `G`).

Con `prefers-reduced-motion: reduce` todo nace ya renderizado: no hay fase de boceto, el
sticky-stack se vuelve estático y el contador se pinta directamente en 9. El contenido
nunca depende del movimiento.

Sin canvas, sin partículas, sin código cayendo.

## Verificación (Playwright)

- Sin errores de consola, sin peticiones fallidas, sin IDs duplicados, un solo `<h1>`,
  ninguna imagen sin `alt`.
- **Las 12 URLs antiguas + `/blog/x5feed.php` resuelven. Ninguna acaba en 404.**
- 400 px: sin desbordamiento horizontal; el hero es de una columna y la cota dice
  «390 × 780 px», no «1440 × 720».
- El aviso de cookies **se cierra de verdad** (`.ck` no usa `display:flex`, así que
  `[hidden]` manda).
- El mapa: **cero peticiones a Google antes de pulsar el botón**; el iframe se construye
  al hacer clic.
- ~60 fps recorriendo la página entera con scrub, parallax y marquee a la vez;
  **cero tareas largas** durante el scroll.
- Sin desbordamiento horizontal en 1600 / 1440 / 1100 / 760 / 400 px.

---

# LO QUE FALTA

Nada de esto está inventado en la web: todo aparece como marcador visible.

## Hay que confirmar con el cliente

| Marcador | Qué se necesita |
|---|---|
| `[CONFIRMAR NOMBRE VISIBLE]` | La web firma «By Víctor Serén», pero el titular legal de `privacidad.html` es **JOSE ANTONIO GOMEZ ESMORIS** (CIF 79332753A). ¿Quién firma públicamente? |
| `[CONFIRMAR SI ATIENDE EN LA TIENDA BEEP O SOLO ONLINE]` | Google da Rúa Vázquez de Parga 76 (coincide con el domicilio del aviso legal), pero en la foto ese local es la tienda BEEP Carballo. Su propia web solo decía «15100 Carballo». |
| `[PRECIO PENDIENTE]` × 6 | No hay ni un precio publicado: 2 packs de web + 3 de tienda + diseño gráfico. |
| `[VALORACIÓN GOOGLE PENDIENTE]` | No hay valoración visible en la ficha. |
| `[PROGRAMAS VIGENTES A CONFIRMAR]` | Qué ayudas a la digitalización están abiertas hoy, y si es agente digitalizador del Kit Digital. |
| `[CONFIRMAR SI SIGUE VIGENTE LA OBLIGACIÓN DE PUBLICIDAD]` | El cartel Igape/UE del pie viene de la web anterior. Si la obligación venció, el bloque se retira entero. |
| `[CAPTURAS DE CLIENTES — REQUIEREN PERMISO]` | El bloque «antes/después» no se ha hecho: hace falta autorización de cada cliente. |
| `[CONFIRMAR QUÉ ARCHIVO SE USA HOY]` | `soporte/software.html` ofrece `distant-desktop.exe` y `ROMServer.exe`, igual que antes, sin versión ni fecha. |
| `[TEXTO LEGAL A VALIDAR]` | El aviso legal se ha trasladado literal; la web nueva no pone cookies de terceros salvo el mapa bajo demanda, y eso no estaba contemplado. |
| `[FORMULARIO: FALTA DESTINO]` | No hay servidor de envío. Hoy el formulario abre el correo del visitante con el mensaje escrito, y lo dice. |
| `[SERVIR TIPOGRAFÍAS EN LOCAL — A DECIDIR]` | Las tipografías vienen de Google Fonts. Si se quiere cero conexiones externas, se alojan en el dominio. |

## Contradicción encontrada en la web actual

**Cuentas de e-mail del pack superior.** `index.html` anunciaba «hasta 20 cuentas» en el
bloque *Tienda online / Web corporativa*; `servicios.html` dice «hasta 10» en Web Premium.
Se ha publicado el dato de `servicios.html`, que es la página específica del servicio.
Conviene confirmar cuál es el bueno.

## Clientes con la web caída (comprobado el 2026-09-17)

- **reformasdeinterior-rc.es** — el dominio no resuelve (SERVFAIL también en DNS público).
- **galibach.es** — el DNS resuelve a Cloudflare pero el servidor no responde (timeout).

Los dos se muestran con su logotipo y la etiqueta «web no disponible», con el enlace
desactivado. Si vuelven, basta con convertir el `<div class="cli cli--off">` en un `<a>`.

## No se ha reproducido, a propósito

- **El blog**: tres entradas en lorem ipsum firmadas «admin | 17/4/2015».
- **subvenciones.html**: convocatoria Igape **de 2020** (COVID-19). Sustituida por un
  bloque breve «Ayudas a la digitalización» con el marcador correspondiente.
- **pagos.html**: un cobro suelto a un cliente («Alejo — pagos — 30,00 €»).
- **acceso.html**: página vacía.

## Fotografía

**No hay generador de imágenes en el entorno**, así que la fotografía original que pedía el
encargo no se ha podido producir. En su lugar hay **fotografía de archivo de Pexels**,
elegida para el concepto y corregida de color con `scripts/grade-photos.py` (blancos
limpios, sesgo azul, un punto de amarillo en los altos, saturación al 86 %):

| Archivo | Pexels ID | Qué es |
|---|---|---|
| `mesa-trabajo.jpg` | 7120865 | Mesa cenital: portátil, cuaderno con bocetos, taza. Va dentro de la maqueta del hero. |
| `wireframe-papel.jpg` | 196645 | Wireframes impresos: cajas y rectángulos con aspa. Cierra «Cómo trabajamos». |
| `movil-responsive.jpg` | 11780441 | Móvil sobre bocetos de diseño en papel. Diseño gráfico. |
| `portatil-manos.jpg` | 5474290 | Manos cerrando un portátil, fondo blanco. Soporte. |

Descartadas a propósito: todas las de código verde sobre negro, las de «equipo sonriendo en
oficina» y una en la que se leía una web ajena de 2015 en la pantalla.

Los `raw-*.jpg` son los originales sin tocar; se pueden borrar al publicar.

## Logo

Recreado en SVG (`assets/logos/construyetuweb.svg`) a partir de
`/images/logo_ctweb-azul_v09fpyin.png` (268 × 50). Los cuatro azules están muestreados del
PNG original: `#004B99`, `#488DC6`, `#0C1049`, `#162983`. El wordmark conserva la C
mayúscula del logo real, aunque el nombre de la marca se escribe en minúsculas.

**Las piezas de puzle viven solo en el logo.** No son el motivo animado de la web: el
lenguaje aquí es el wireframe que se renderiza.

## Publicación

En GitHub Pages (preview) sale de la rama `main`, carpeta raíz, con `.nojekyll`. Como Pages
no aplica `_redirects` ni `.htaccess`, **el mapa de 301 lo resuelve `404.html`**: detecta si
cuelga de `/<repo>/` o de la raíz del dominio, inyecta un `<base>` y redirige. Verificado en
vivo: las 12 URLs antiguas resuelven también en la preview.

Para el dominio definitivo:

1. Subir la carpeta a la raíz del dominio.
2. Netlify/Vercel/Cloudflare leen `_redirects`; Apache lee `.htaccess`. Si el hosting no
   admite ninguno de los dos, `404.html` resuelve el salto en el navegador.
3. Mantener `/software/distant-desktop.exe` y `/software/ROMServer.exe` donde están.
4. Enviar el nuevo `sitemap.xml` a Search Console y vigilar las 301 unas semanas.
