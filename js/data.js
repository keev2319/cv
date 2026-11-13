/**
 * CONTENIDO DEL CV
 * ------------------------------------------------------------------
 * Edita este archivo para escribir tu currículum. No hace falta tocar
 * el HTML ni el CSS. Los campos de texto aceptan acentos y caracteres
 * especiales; los campos de fecha son texto libre.
 *
 * Para publicar tu CV solo necesitas reemplazar los datos de ejemplo.
 * ------------------------------------------------------------------
 */

window.CV_DATA = {
  meta: {
    lang: "es",
    title: "Kevin Soto · Ing. Admin tenologias de la información",
    description:
      "Currículum de Kevin Soto, desarrolladora frontend senior especializada en interfaces accesibles, sistemas de diseño y rendimiento web.",
    updated: "Octubre 2026",
  },

  profile: {
    name: "Kevin Soto",
    role: "Desarrolladora Frontend Senior",
    tagline:
      "Diseño y construyo interfaces claras, rápidas y accesibles. Ocho años traduciendo problemas complejos en productos digitales que la gente disfruta usar.",
    location: "Cuautitlan, Mexico",
    email: "kevinsotoortiz0@gmail.com",
    phone: "+52 5571725487",
    website: "https://tudominio.com",
    availability: "Disponible para nuevos proyectos",
    // Ruta a una foto, por ejemplo "assets/foto.jpg". Vacío = monograma.
    photo: "",
    socials: [
      { label: "GitHub", icon: "github", url: "https://github.com/keev2319" },
      { label: "LinkedIn", icon: "linkedin", url: "https://www.linkedin.com/in/kevin-osvaldo-soto-ortiz-3146a23a0/" },
    ],
  },

  stats: [
    { value: "1+", label: "Años de experiencia" },
    { value: "10+", label: "Proyectos entregados" },
    { value: "3", label: "Equipos acompañados" },
  ],

  about: [
    "Soy estudiante de séptimo semestre de Ingeniería en Tecnologías de la Información en la Universidad Tecnológica de México (UNITEC), en la Ciudad de México. Actualmente trabajo en BOSCH como soporte TI dando servicio a un almacén y a oficinas, y me interesa mucho automatizar procesos para ahorrar tiempo y costos",
    "Busco una oportunidad donde pueda seguir creciendo en infraestructura, redes y automatización de procesos. Me gustaría trabajar en un equipo que me permita proponer mejoras, aprender de gente con más experiencia y aplicar lo que estudio en problemas reales",
  ],

  experience: [
    {
      role: "Senior Frontend Engineer",
      company: "Nova Studio",
      companyUrl: "https://example.com",
      location: "Madrid · Remoto",
      start: "2022",
      end: null, // null = puesto actual
      summary:
        "Lidero el desarrollo frontend de una plataforma SaaS usada por más de 120.000 personas.",
      bullets: [
        "Diseñé y mantuve el sistema de diseño Atlas: 40+ componentes accesibles documentados en Storybook y adoptados por cuatro equipos de producto.",
        "Reduje el tiempo de carga inicial un 38 % mediante code-splitting, optimización de imágenes y renderizado incremental.",
        "Impulsé una cultura de calidad con pruebas end-to-end en Playwright y revisiones de accesibilidad integradas en CI.",
      ],
      tech: ["React", "TypeScript", "Next.js", "Storybook", "Playwright"],
    },
    {
      role: "Frontend Developer",
      company: "Lumen Labs",
      companyUrl: "https://example.com",
      location: "Barcelona",
      start: "2019",
      end: "2022",
      summary:
        "Desarrollé la interfaz de una suite de herramientas analíticas para equipos de marketing.",
      bullets: [
        "Migré una aplicación legacy de jQuery a React y TypeScript sin interrumpir el servicio, reduciendo el código mantenido un 45 %.",
        "Implementé gráficos interactivos con D3 y listas virtualizadas para manejar conjuntos de más de 50.000 filas.",
        "Colaboré con diseño en la definición de un lenguaje visual que unificó tres productos de la empresa.",
      ],
      tech: ["React", "TypeScript", "D3.js", "SASS"],
    },
    {
      role: "Junior Web Developer",
      company: "Estudio Píxel",
      companyUrl: "https://example.com",
      location: "Valencia",
      start: "2017",
      end: "2019",
      summary: "",
      bullets: [
        "Construí sitios corporativos y tiendas online con HTML, CSS y JavaScript, trabajando directamente con clientes.",
        "Introduje un flujo de trabajo con Git y despliegues automatizados que redujo los errores de publicación.",
      ],
      tech: ["HTML", "CSS", "JavaScript", "WordPress"],
    },
  ],

  projects: [
    {
      name: "Atlas Design System",
      type: "Sistema de diseño",
      description:
        "Librería de componentes accesibles y tokens de diseño para cuatro marcas. Documentación viva, pruebas visuales y entrega continua.",
      tech: ["React", "TypeScript", "Storybook", "Design tokens"],
      url: "https://example.com/atlas",
    },
    {
      name: "Ruta Clara",
      type: "Producto digital",
      description:
        "Aplicación para planificar viajes de proximidad con rutas sostenibles, mapas colaborativos y recomendaciones locales.",
      tech: ["Next.js", "Mapbox", "PostgreSQL", "Tailwind"],
      url: "https://example.com/ruta-clara",
    },
  ],

  education: [
    {
      degree: "Grado en Ingeniería Informática",
      school: "Universidad Politécnica de Madrid",
      location: "Madrid",
      start: "2013",
      end: "2017",
      note: "Especialidad en Ingeniería del Software · Matrícula de honor en el TFG.",
    },
    {
      degree: "Máster en Diseño de Interacción",
      school: "IED Madrid",
      location: "Madrid",
      start: "2018",
      end: "2019",
      note: "Proyecto final sobre accesibilidad en servicios públicos digitales.",
    },
  ],

  skills: [
    {
      group: "Frontend",
      items: [
        "HTML semántico",
        "CSS moderno",
        "JavaScript",
        "TypeScript",
        "React",
        "Next.js",
        "Astro",
      ],
    },
    {
      group: "Diseño y calidad",
      items: ["Figma", "Design systems", "WCAG 2.2", "Storybook", "Testing"],
    },
    {
      group: "Herramientas",
      items: ["Git", "Vite", "Playwright", "CI/CD"],
    },
  ],

  languages: [
    { name: "Español", level: "Nativo", proficiency: 5 },
    { name: "Inglés", level: "C1 · Avanzado", proficiency: 4 },
    { name: "Francés", level: "B1 · Intermedio", proficiency: 3 },
  ],

  certifications: [
    { title: "Web Accessibility Specialist (WAS)", issuer: "IAAP", year: "2024" },
    { title: "Professional Scrum Master I", issuer: "Scrum.org", year: "2022" },
  ],

  interests: ["Fotografía analógica", "Senderismo", "Cerámica", "Lectura"],
};
