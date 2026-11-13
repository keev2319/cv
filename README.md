# CV web · HTML + CSS + JavaScript

Base de currículum de una sola página, sin dependencias ni proceso de build. Todo el contenido vive en `js/data.js`.

## Ver el sitio

Abre `index.html` con doble clic. También puedes servirlo en local:

```bash
# Python
python -m http.server 8000

# Node (si tienes npx)
npx serve .
```

Y visita `http://localhost:8000`.

## Escribir tu CV

Edita **`js/data.js`**. Cada bloque está comentado:

| Campo | Qué contiene |
| --- | --- |
| `meta` | Título y descripción para buscadores, y fecha de actualización. |
| `profile` | Nombre, puesto, resumen, contacto, disponibilidad, foto y redes. |
| `stats` | Tres o cuatro cifras destacadas. Déjalo como `[]` para ocultarlas. |
| `about` | Párrafos de presentación (el primero se muestra como entradilla). |
| `experience` | Puestos de trabajo. `end: null` marca el puesto actual. |
| `projects` | Proyectos con descripción, tecnologías y enlace. |
| `education` | Formación reglada. |
| `skills` | Grupos de habilidades. |
| `languages` | Idiomas; `proficiency` va de 0 a 5. |
| `certifications` | Certificaciones y cursos. |
| `interests` | Aficiones. Déjalo como `[]` para ocultarlas. |

Las secciones vacías (por ejemplo, sin proyectos) se ocultan automáticamente, igual que sus enlaces en el menú.

Para las redes sociales se admiten los iconos `github`, `linkedin`, `instagram` y `globe`. Cualquier otro valor usa el icono de globo.

## Foto

Guarda una imagen en `assets/` y escribe su ruta en `profile.photo`, por ejemplo:

```js
photo: "assets/foto.jpg",
```

Si lo dejas vacío se muestra un monograma con tus iniciales. La imagen se muestra en blanco y negro y recupera el color al pasar el ratón.

## Personalizar el diseño

En `css/styles.css`, dentro de `:root`, están los colores y las tipografías:

```css
--accent: #1f5a4a;   /* color principal */
--bg: #f5f2ea;       /* fondo */
--font-display: ...; /* títulos */
--font-sans: ...;    /* texto */
```

El modo oscuro se controla con los mismos tokens en `[data-theme="dark"]`. El botón de tema recuerda la elección en `localStorage` y respeta la preferencia del sistema.

## Generar el PDF

Pulsa **Descargar CV** o **Guardar PDF**. Se abre el diálogo de impresión del navegador: elige «Guardar como PDF».

La hoja de estilos incluye un diseño específico para impresión en A4: oculta la navegación y los botones, reorganiza la columna lateral en dos columnas y evita cortar las entradas entre páginas.

## Publicar

Al ser archivos estáticos, puedes subirlos tal cual a GitHub Pages, Netlify, Vercel o Cloudflare Pages:

- **Netlify / Cloudflare Pages**: arrastra la carpeta.
- **GitHub Pages**: sube el proyecto a un repositorio y activa Pages desde *Settings → Pages*.

## Estructura

```
index.html          Estructura mínima y punto de entrada
css/styles.css      Estilos, responsive, modo oscuro e impresión
js/data.js          Todo el contenido editable
js/app.js           Renderizado e interacciones (tema, scroll, animaciones)
assets/favicon.svg  Icono del sitio
```

## Accesibilidad y detalles

- Navegación por teclado, enlace «Saltar al contenido» y foco visible.
- Respeta `prefers-reduced-motion` y `prefers-color-scheme`.
- HTML semántico y contraste cuidado en ambos temas.
- Sin frameworks, sin build y sin dependencias de JavaScript.
