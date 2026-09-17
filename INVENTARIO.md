# Inventario de migración — construyetuweb.es

Rastreo realizado el **2026-09-17** sobre `https://construyetuweb.es/` (Incomedia
WebSite X5, sin CMS). Origen de cada dato: sitemap.xml + las 12 URLs que declara.

`lastmod` de todas las URLs del sitemap: **2026-04-14** (fecha declarada por el
generador; no es la fecha real de redacción de los textos — el blog está fechado
en 2015 y subvenciones.html es de 2020).

---

## 1. Tabla URL antigua → contenido → destino → 301

| # | URL antigua | Qué contenía | Qué se usa | Sección nueva | Redirección 301 |
|---|---|---|---|---|---|
| 1 | `/index.html` | Portada: claim, ventajas de tener web, 3 packs resumidos | Las 9 ventajas literales, el pack **Tienda online / Web corporativa** (que solo está aquí, no en servicios.html), "registramos su dominio con el hosting de su elección" y la frase de servicio | Hero + `#que-hacemos` + `#packs` | `/` |
| 2 | `/servicios.html` | Web Básica, Web Premium, 3 packs de tienda, SSL/Hosting/e-mail, diseño gráfico | **Todo, literal** | `#packs` + `#tiendas` + `#grafico` | `/#packs` |
| 3 | `/clientes.html` | 9 logos con enlace a la web del cliente | Los 9 logos + URLs | `#clientes` | `/#clientes` |
| 4 | `/soporte-.html` | Asistencia informática remota (7 servicios), "Descargar software", "Pide cita" | Los 7 servicios + "Pide cita" (WhatsApp). La descarga **no** va en portada | `#soporte` | `/#soporte` |
| 5 | `/software.html` | Descarga de `distant-desktop.exe` y `ROMServer.exe` | Se conserva, pero en página secundaria con aviso | `/soporte/software.html` | `/soporte/software.html` |
| 6 | `/contacto.html` | Dirección ("15100 Carballo"), teléfono, e-mail, formulario + cláusula de privacidad | Datos + cláusula **literal** | `#contacto` | `/#contacto` |
| 7 | `/privacidad.html` | Aviso legal + política de privacidad (titular: JOSE ANTONIO GOMEZ ESMORIS) | **Íntegra, literal** | `/privacidad.html` | `/privacidad.html` |
| 8 | `/cookies.html` | Política de cookies genérica (tipos, desactivación por navegador) | Íntegra, adaptada a que la web nueva **no** usa cookies de terceros | `/cookies.html` | `/cookies.html` |
| 9 | `/subvenciones.html` | "SUBVENCIONES 2020" — ayudas Igape de internacionalización digital COVID-19, en gallego | **NO se reproduce** (caducada, 2020) | Bloque breve `#ayudas` con placeholder | `/#ayudas` |
| 10 | `/blog/` | 3 entradas en **lorem ipsum**, firmadas "admin | 17/4/2015" | **NO se reproduce** (no hay blog real) | — | `/` |
| 11 | `/pagos.html` | Un único producto suelto: "Alejo — pagos — 30,00 € (IVA incl.)" | **NO se reproduce** (cobro privado a un cliente) | — | `/#contacto` |
| 12 | `/acceso.html` | Vacía ("Gracias por visitarnos") | **NO se reproduce** | — | `/` |

Extra fuera de sitemap, enlazado desde la portada: `/blog/x5feed.php` → `/`.

**Ninguna URL antigua acaba en 404.** Las reglas están en `_redirects`,
`.htaccess` y `404.html` (fallback JS por si el hosting no admite reglas).

---

## 2. Contenido descartado y por qué

| Contenido | Motivo |
|---|---|
| `blog/` completo | Lorem ipsum, 3 entradas falsas de 2015. Publicarlo sería contenido basura. |
| `subvenciones.html` | Convocatoria **de 2020** (Igape, COVID-19). Reproducirla en 2026 induce a error. |
| `pagos.html` | Cobro puntual a un cliente concreto ("Alejo"). No es contenido público. |
| `acceso.html` | Página vacía. |
| Capturas de webs de clientes | `[CAPTURAS DE CLIENTES — REQUIEREN PERMISO]`. No se han incluido. |

---

## 3. Los 9 clientes (logo → URL → estado comprobado el 2026-09-17)

| Cliente | URL | Sector | Localidad | Estado |
|---|---|---|---|---|
| Cobetrans | `https://cobetrans.com/` | Transporte de mercancías (cooperativa) | Bergantiños (Carballo) | ✅ HTTP 200 |
| Constrovi, S.L. | `https://constrovi.com/` | Construcción y reformas | Bergantiños (tel. 981 753 2xx) | ✅ HTTP 200 |
| Didactic | `https://didactic.com.es/` | Software de gestión académica | — | ✅ HTTP 200 |
| Galibach | `https://galibach.es/` | Formación — Escola galega do sistema do Dr. Bach | — | ⚠️ **DNS resuelve, servidor no responde (timeout)** |
| Piscinas y Reparaciones | `https://piscinasyreparaciones.es/` | Piscinas, fontanería, impermeabilización | — | ✅ HTTP 200 |
| Reformas RC (Rogelio Cotelo Fandiño) | `https://reformasdeinterior-rc.es` | Reformas de interior | — | ❌ **Dominio no resuelve (SERVFAIL)** |
| Reforvibar | `https://reforvibar.es/` | Reformas, mantenimientos y jardinería | A Coruña (15008) | ✅ HTTP 200 |
| Viajes Val Miñor | `https://viajesvalminor.com` | Agencia de viajes | Sabarís, Baiona (Pontevedra) | ✅ HTTP 200 |
| Clínica Veterinaria Gran Vía | `https://www.veterinariagranvia.es` | Veterinaria | Rúa Gran Vía 194, Carballo | ✅ HTTP 200 |

Solo se ha visitado cada web para confirmar que está activa y anotar sector y
localidad. **No se ha copiado contenido de ninguna.**

### Comprobación de autoría (2026-09-17)

No se han dado por buenos los 9 clientes solo porque estén en `clientes.html`. Se ha
buscado en la web de cada cliente un crédito que apunte a construyetuweb.es:

| Cliente | Evidencia encontrada en SU web |
|---|---|
| Cobetrans | «By Víctor Serén» + enlace a construyetuweb.es |
| Constrovi | «By Víctor Serén» + enlace a construyetuweb.es |
| Piscinas y Reparaciones | «By Víctor Serén» + enlace a construyetuweb.es |
| Reforvibar | «Creado por: construyetuweb.es» + enlace |
| Veterinaria Gran Vía | «By Víctor Serén» + enlace a construyetuweb.es |
| Viajes Val Miñor | enlace a construyetuweb.es con «Víctor Serén» |
| Didactic | sin crédito visible, pero **mismo generador y versión exacta** que construyetuweb.es: `Incomedia WebSite X5 Pro 2022.2.11` |
| Galibach | no comprobable: la web no responde |
| Reformas RC | no comprobable: el dominio no resuelve |

Es decir: 7 de los 9 están corroborados en la propia web del cliente, no solo en la del
proveedor. Los 2 restantes están caídos y se muestran señalados como tales.

Los dos enlaces rotos se marcan en la web nueva como *"web no disponible"* y el
enlace se desactiva, en vez de mandar al visitante a un error.

---

## 4. Imágenes tomadas del sitio antiguo

| Fichero antiguo | Uso nuevo |
|---|---|
| `/images/logo_ctweb-azul_v09fpyin.png` (268×50) | Recreado en SVG: `assets/logos/construyetuweb.svg`. Colores muestreados del PNG original. |
| `/images/cartel.jpg` (909×190) | Banner de financiación del footer, recreado en SVG: `assets/logos/financiacion.svg` |
| `/images/igape.png`, `/images/xunta.png` | Fuente para el banner anterior |
| Los 9 logos de cliente | Descargados y optimizados en `assets/logos/clientes/` |

Descartadas por ser iconos genéricos de la plantilla WebSite X5:
`inicio.png`, `envelope.png`, `pushpin-1.png`, `1413463872_contact.png`,
`Whatsapp_blanco.png`, `Paginas_web.png`, `tiendas-online.png`,
`Diseno-grafico.png`, `soporte-infirmatico.png`, `soporte-remoto.jpg`.

---

## 5. Contradicciones encontradas en la web actual

1. **Titular legal ≠ firma**: `privacidad.html` identifica como titular a
   **JOSE ANTONIO GOMEZ ESMORIS**, CIF 79332753A, Calle Vázquez de Parga 76,
   15100 Carballo. Todas las páginas firman **"By Víctor Serén"**.
   → `[CONFIRMAR QUIÉN FIRMA PÚBLICAMENTE LA WEB]`
2. **Dirección**: la web solo dice "15100 Carballo"; el aviso legal y la ficha
   de Google dicen Vázquez de Parga 76 (local que en la foto de Google es la
   tienda BEEP Carballo). → `[CONFIRMAR SI ATIENDE EN LA TIENDA BEEP O SOLO ONLINE]`
3. **Logo**: el PNG pone "Construyetuweb.es" (C mayúscula); el `<title>` pone
   "construyetuweb.es". Se respeta cada uno en su sitio.


---

## 6. Contenido que SOLO está en index.html

`servicios.html` documenta Web Básica, Web Premium y los tres packs de tienda, pero **no**
el tercer bloque de la portada. Se recupera de `index.html`:

| Dato | Dónde estaba | Dónde está ahora |
|---|---|---|
| Pack **«Tienda online / Web corporativa»** | index.html, tercera tarjeta | 3ª tarjeta de `#packs` + `Service` en el JSON-LD |
| «Puede integrar funcionalidades a su web para que se adapte tanto a sus necesidades como a su presupuesto» | ídem | descripción de esa tarjeta |
| «Creación de hasta **20** cuentas de e-mail» | ídem | ítem de esa tarjeta |
| «Diseño responsive y acceso a RRSS» | ídem | ítem de esa tarjeta |
| «Registramos su dominio con **el hosting de su elección**» | index.html | paso 04 de `#proceso` |
| «Diseñamos y configuramos su sitio web o tienda online, con un servicio profesional y eficaz» | index.html | entradilla de `#que-hacemos` |
| Las 9 ventajas | index.html | bloque «Lo que gana el negocio» |
| «Todo lo que necesita su empresa» | servicios.html | cierre de `#grafico` |

**Corrección (2026-09-17).** En una versión anterior de este inventario se dio como
contradicción que index.html dijera «hasta 20 cuentas» y servicios.html «hasta 10».
No lo es: las 10 son de **Web Premium** y las 20 del pack **Tienda online / Web
corporativa**, que es otro. El error fue de lectura, no de la web del cliente.

Slogans de portada NO reutilizados, por decisión de tono («Aumente sus ventas con una
tienda online», «Nos adaptamos a sus necesidades», «La solución perfecta para su
negocio»): son copy genérico y el encargo pedía tono propio. Los datos concretos sí
están todos.
