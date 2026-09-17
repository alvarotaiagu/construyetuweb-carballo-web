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
| 1 | `/index.html` | Portada: claim, ventajas de tener web, 3 packs resumidos | Claim, lista de 9 ventajas, packs (versión ampliada de servicios.html) | Hero + `#que-hacemos` + `#packs` | `/` |
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
| "Hasta 20 cuentas de E-mail" (index.html) | Contradice servicios.html (10 en Premium). Se usa el dato de servicios.html, que es la página específica. Ver §5. |
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

1. **Cuentas de e-mail del pack superior**: `index.html` anuncia "hasta 20
   cuentas" en el bloque *Tienda online / Web corporativa*; `servicios.html`
   dice "hasta 10" en Web Premium. Se ha usado el de `servicios.html`.
   → `[CONFIRMAR Nº DE CUENTAS DE E-MAIL DEL PACK SUPERIOR]`
2. **Titular legal ≠ firma**: `privacidad.html` identifica como titular a
   **JOSE ANTONIO GOMEZ ESMORIS**, CIF 79332753A, Calle Vázquez de Parga 76,
   15100 Carballo. Todas las páginas firman **"By Víctor Serén"**.
   → `[CONFIRMAR QUIÉN FIRMA PÚBLICAMENTE LA WEB]`
3. **Dirección**: la web solo dice "15100 Carballo"; el aviso legal y la ficha
   de Google dicen Vázquez de Parga 76 (local que en la foto de Google es la
   tienda BEEP Carballo). → `[CONFIRMAR SI ATIENDE EN LA TIENDA BEEP O SOLO ONLINE]`
4. **Logo**: el PNG pone "Construyetuweb.es" (C mayúscula); el `<title>` pone
   "construyetuweb.es". Se respeta cada uno en su sitio.
