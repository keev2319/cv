/* global CV_DATA */
(function () {
  "use strict";

  const data = window.CV_DATA;

  if (!data) {
    document.getElementById("contenido").innerHTML =
      '<div class="noscript"><p><strong>No se encontró el contenido del CV.</strong></p><p>Revisa que <code>js/data.js</code> se cargue antes que <code>js/app.js</code>.</p></div>';
    return;
  }

  const profile = data.profile || {};
  const meta = data.meta || {};
  const about = Array.isArray(data.about) ? data.about : [];
  const experience = Array.isArray(data.experience) ? data.experience : [];
  const projects = Array.isArray(data.projects) ? data.projects : [];
  const education = Array.isArray(data.education) ? data.education : [];
  const skills = Array.isArray(data.skills) ? data.skills : [];
  const languages = Array.isArray(data.languages) ? data.languages : [];
  const certifications = Array.isArray(data.certifications) ? data.certifications : [];
  const interests = Array.isArray(data.interests) ? data.interests : [];
  const stats = Array.isArray(data.stats) ? data.stats : [];
  const socials = Array.isArray(profile.socials) ? profile.socials : [];
  const themeKey = "cv-theme";

  /* ---------- Utilidades ---------- */

  const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, (char) => ESCAPES[char]);
  }

  function safeHref(url) {
    const value = String(url || "").trim();
    return /^(https?:\/\/|mailto:|tel:)/i.test(value) ? esc(value) : "#";
  }

  function safeImage(src) {
    const value = String(src || "").trim();
    if (!value || /^(javascript|data|vbscript):/i.test(value)) return "";
    return esc(value);
  }

  function prettyUrl(url) {
    return String(url || "")
      .replace(/^https?:\/\//i, "")
      .replace(/\/+$/, "");
  }

  function initials(name) {
    return String(name || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  const ICONS = {
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7.5 8.5 6 8.5-6"/>',
    phone:
      '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    globe:
      '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 4 9 14 14 0 0 1-4 9 14 14 0 0 1-4-9 14 14 0 0 1 4-9Z"/>',
    github:
      '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>',
    linkedin:
      '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
    instagram:
      '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>',
    moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/>',
    download:
      '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
    arrow: '<path d="M7 17 17 7"/><path d="M8 7h9v9"/>',
    arrowRight: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  };

  function icon(name) {
    const paths = ICONS[name] || ICONS.globe;
    return (
      '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true" focusable="false">' +
      paths +
      "</svg>"
    );
  }

  /* ---------- Bloques del CV ---------- */

  function socialsHTML() {
    if (!socials.length) return "";
    return (
      '<ul class="socials">' +
      socials
        .map(
          (social) =>
            '<li><a href="' +
            safeHref(social.url) +
            '" target="_blank" rel="noopener noreferrer" aria-label="' +
            esc(social.label) +
            '" title="' +
            esc(social.label) +
            '">' +
            icon(social.icon || "globe") +
            "</a></li>"
        )
        .join("") +
      "</ul>"
    );
  }

  function contactHTML() {
    const items = [];

    if (profile.email) {
      items.push(
        '<li><a href="mailto:' +
          esc(profile.email) +
          '">' +
          icon("mail") +
          "<span>" +
          esc(profile.email) +
          "</span></a></li>"
      );
    }

    if (profile.phone) {
      items.push(
        '<li><a href="tel:' +
          esc(String(profile.phone).replace(/[^\d+]/g, "")) +
          '">' +
          icon("phone") +
          "<span>" +
          esc(profile.phone) +
          "</span></a></li>"
      );
    }

    if (profile.location) {
      items.push("<li><span>" + icon("pin") + "<span>" + esc(profile.location) + "</span></span></li>");
    }

    if (profile.website) {
      items.push(
        '<li><a href="' +
          safeHref(profile.website) +
          '" target="_blank" rel="noopener noreferrer">' +
          icon("globe") +
          "<span>" +
          esc(prettyUrl(profile.website)) +
          "</span></a></li>"
      );
    }

    return items.length ? '<ul class="contact">' + items.join("") + "</ul>" : "";
  }

  function heroHTML() {
    const words = String(profile.name || "Tu nombre").trim().split(/\s+/);
    const firstName = words.shift() || "Tu";
    const lastName = words.join(" ");
    const nameMarkup = esc(firstName) + (lastName ? " <em>" + esc(lastName) + "</em>" : "");
    const photo = safeImage(profile.photo);

    const actions = [];
    if (profile.email) {
      actions.push(
        '<a class="btn btn--primary" href="mailto:' +
          esc(profile.email) +
          '">' +
          icon("mail") +
          "<span>Hablemos</span></a>"
      );
    }
    actions.push(
      '<button class="btn btn--ghost" type="button" data-print title="Abre el diálogo de impresión para guardar el CV como PDF">' +
        icon("download") +
        "<span>Descargar CV</span></button>"
    );

    return (
      '<section class="hero" id="inicio">' +
      '<div class="container hero__grid">' +
      '<div class="hero__content reveal">' +
      (profile.availability
        ? '<p class="status"><span class="status__dot"></span>' + esc(profile.availability) + "</p>"
        : "") +
      '<h1 class="hero__name">' +
      nameMarkup +
      "</h1>" +
      '<p class="hero__role">' +
      esc(profile.role) +
      "</p>" +
      (profile.tagline ? '<p class="hero__tagline">' + esc(profile.tagline) + "</p>" : "") +
      contactHTML() +
      '<div class="hero__actions">' +
      actions.join("") +
      socialsHTML() +
      "</div>" +
      "</div>" +
      '<figure class="portrait reveal' +
      (photo ? "" : " portrait--placeholder") +
      '">' +
      '<div class="portrait__frame">' +
      '<span class="portrait__initials" aria-hidden="true">' +
      esc(initials(profile.name) || "CV") +
      "</span>" +
      (photo
        ? '<img src="' + photo + '" alt="Retrato de ' + esc(profile.name) + '" loading="eager" onerror="this.remove()">'
        : "") +
      "</div>" +
      "<figcaption>" +
      esc(meta.updated || "Currículum actualizado") +
      "</figcaption>" +
      "</figure>" +
      "</div>" +
      "</section>"
    );
  }

  function statsHTML() {
    if (!stats.length) return "";
    return (
      '<section class="container stats-wrap reveal" aria-label="Datos destacados">' +
      '<ul class="stats">' +
      stats
        .map(
          (stat) =>
            '<li class="stat"><span class="stat__value">' +
            esc(stat.value) +
            '</span><span class="stat__label">' +
            esc(stat.label) +
            "</span></li>"
        )
        .join("") +
      "</ul>" +
      "</section>"
    );
  }

  function sectionHTML(section, index) {
    return (
      '<section class="section reveal" id="' +
      section.id +
      '" aria-labelledby="' +
      section.id +
      '-title">' +
      '<header class="section-head">' +
      '<p class="section-kicker"><span class="section-kicker__num">' +
      String(index + 1).padStart(2, "0") +
      '</span><span class="section-kicker__line" aria-hidden="true"></span>' +
      esc(section.kicker) +
      "</p>" +
      '<h2 class="section-title" id="' +
      section.id +
      '-title">' +
      esc(section.title) +
      "</h2>" +
      "</header>" +
      section.body +
      "</section>"
    );
  }

  function experienceHTML() {
    return experience
      .map((job) => {
        const current = !job.end;
        const bullets = Array.isArray(job.bullets)
          ? job.bullets.filter(Boolean).map((bullet) => "<li>" + esc(bullet) + "</li>").join("")
          : "";
        const tech = Array.isArray(job.tech)
          ? job.tech.filter(Boolean).map((item) => "<li>" + esc(item) + "</li>").join("")
          : "";
        const company = job.companyUrl
          ? '<a href="' +
            safeHref(job.companyUrl) +
            '" target="_blank" rel="noopener noreferrer">' +
            esc(job.company) +
            "</a>"
          : esc(job.company);

        return (
          '<article class="timeline-item">' +
          '<div class="item-head">' +
          "<div>" +
          '<h3 class="item-title">' +
          esc(job.role) +
          "</h3>" +
          '<p class="item-company">' +
          company +
          (job.location ? " <span>· " + esc(job.location) + "</span>" : "") +
          "</p>" +
          "</div>" +
          '<p class="item-period' +
          (current ? " item-period--current" : "") +
          '">' +
          esc(job.start) +
          " — " +
          esc(current ? "Actualidad" : job.end) +
          "</p>" +
          "</div>" +
          (job.summary ? '<p class="item-summary">' + esc(job.summary) + "</p>" : "") +
          (bullets ? '<ul class="bullets">' + bullets + "</ul>" : "") +
          (tech ? '<ul class="tags">' + tech + "</ul>" : "") +
          "</article>"
        );
      })
      .join("");
  }

  function projectsHTML() {
    return (
      '<div class="projects">' +
      projects
        .map((project) => {
          const tech = Array.isArray(project.tech)
            ? project.tech.filter(Boolean).map((item) => "<li>" + esc(item) + "</li>").join("")
            : "";
          const inner =
            '<div class="project__top"><div>' +
            (project.type ? '<p class="project__meta">' + esc(project.type) + "</p>" : "") +
            "<h3>" +
            esc(project.name) +
            "</h3>" +
            "</div>" +
            '<span class="project__arrow">' +
            icon("arrow") +
            "</span></div>" +
            "<p>" +
            esc(project.description) +
            "</p>" +
            (tech ? '<ul class="tags">' + tech + "</ul>" : "") +
            '<span class="project__cta">Ver proyecto ' +
            icon("arrowRight") +
            "</span>";

          if (!project.url) return '<article class="project">' + inner + "</article>";
          return (
            '<a class="project" href="' +
            safeHref(project.url) +
            '" target="_blank" rel="noopener noreferrer">' +
            inner +
            "</a>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function educationHTML() {
    return education
      .map(
        (item) =>
          '<article class="edu-item">' +
          '<p class="edu-period">' +
          esc(item.start) +
          " — " +
          esc(item.end) +
          "</p>" +
          "<div>" +
          '<h3 class="edu-title">' +
          esc(item.degree) +
          "</h3>" +
          '<p class="edu-place">' +
          esc(item.school) +
          (item.location ? " · " + esc(item.location) : "") +
          "</p>" +
          (item.note ? '<p class="edu-note">' + esc(item.note) + "</p>" : "") +
          "</div>" +
          "</article>"
      )
      .join("");
  }

  function buildSections() {
    const sections = [];

    if (about.length) {
      sections.push({
        id: "perfil",
        nav: "Perfil",
        kicker: "Quién soy",
        title: "Sobre mí",
        body:
          '<div class="prose">' +
          about
            .map((paragraph, index) => '<p' + (index === 0 ? ' class="lead"' : "") + ">" + esc(paragraph) + "</p>")
            .join("") +
          "</div>",
      });
    }

    if (experience.length) {
      sections.push({
        id: "experiencia",
        nav: "Experiencia",
        kicker: "Trayectoria",
        title: "Experiencia",
        body: experienceHTML(),
      });
    }

    if (projects.length) {
      sections.push({
        id: "proyectos",
        nav: "Proyectos",
        kicker: "Selección",
        title: "Proyectos",
        body: projectsHTML(),
      });
    }

    if (education.length) {
      sections.push({
        id: "formacion",
        nav: "Formación",
        kicker: "Estudios",
        title: "Formación",
        body: educationHTML(),
      });
    }

    return sections;
  }

  function asideHTML() {
    const blocks = [];

    if (skills.length) {
      blocks.push(
        '<section class="side-block reveal">' +
          '<h2 class="side-title">Habilidades</h2>' +
          skills
            .map(
              (group) =>
                '<div class="skill-group"><h3 class="skill-group__label">' +
                esc(group.group) +
                '</h3><ul class="chips">' +
                (Array.isArray(group.items)
                  ? group.items.map((item) => "<li>" + esc(item) + "</li>").join("")
                  : "") +
                "</ul></div>"
            )
            .join("") +
          "</section>"
      );
    }

    if (languages.length) {
      blocks.push(
        '<section class="side-block reveal">' +
          '<h2 class="side-title">Idiomas</h2>' +
          '<ul class="lang-list">' +
          languages
            .map((language) => {
              const level = Math.max(0, Math.min(5, Number(language.proficiency) || 0));
              const dots = Array.from({ length: 5 }, (_, index) => index < level ? '<span class="is-on"></span>' : "<span></span>").join("");
              return (
                '<li class="lang"><div class="lang__top"><span class="lang__name">' +
                esc(language.name) +
                '</span><span class="lang__level">' +
                esc(language.level) +
                '</span></div><div class="dots" role="img" aria-label="Nivel: ' +
                esc(language.level) +
                '">' +
                dots +
                "</div></li>"
              );
            })
            .join("") +
          "</ul></section>"
      );
    }

    if (certifications.length) {
      blocks.push(
        '<section class="side-block reveal">' +
          '<h2 class="side-title">Certificaciones</h2>' +
          '<ul class="cert-list">' +
          certifications
            .map(
              (certification) =>
                '<li class="cert"><span class="cert__title">' +
                esc(certification.title) +
                '</span><span class="cert__meta">' +
                esc(certification.issuer) +
                (certification.year ? " · " + esc(certification.year) : "") +
                "</span></li>"
            )
            .join("") +
          "</ul></section>"
      );
    }

    if (interests.length) {
      blocks.push(
        '<section class="side-block reveal">' +
          '<h2 class="side-title">Intereses</h2>' +
          '<ul class="chips">' +
          interests.map((interest) => "<li>" + esc(interest) + "</li>").join("") +
          "</ul></section>"
      );
    }

    return blocks.join("");
  }

  function mainHTML(sections) {
    const aside = asideHTML();

    return (
      heroHTML() +
      statsHTML() +
      '<div class="container layout' +
      (aside ? "" : " layout--solo") +
      '">' +
      '<div class="main-col">' +
      sections.map((section, index) => sectionHTML(section, index)).join("") +
      "</div>" +
      (aside ? '<aside class="side-col" aria-label="Información complementaria">' + aside + "</aside>" : "") +
      "</div>"
    );
  }

  function topbarHTML(sections) {
    const name = esc(profile.name || "Currículum");
    return (
      '<div class="container topbar__inner">' +
      '<a class="brand" href="#inicio" aria-label="Volver al inicio">' +
      '<span class="brand__mark" aria-hidden="true">' +
      esc(initials(profile.name) || "CV") +
      "</span>" +
      '<span class="brand__text"><span>' +
      name +
      '</span><span class="brand__role">' +
      esc(profile.role || "") +
      "</span></span>" +
      "</a>" +
      '<nav class="nav" aria-label="Secciones del currículum">' +
      sections.map((section) => '<a href="#' + section.id + '">' + esc(section.nav) + "</a>").join("") +
      "</nav>" +
      '<div class="topbar__actions">' +
      '<button class="icon-btn" id="theme-toggle" type="button" aria-label="Cambiar tema"></button>' +
      '<button class="btn btn--ghost btn--small" type="button" data-print title="Abre el diálogo de impresión para guardar el CV como PDF">' +
      icon("download") +
      '<span class="btn__label">Guardar PDF</span>' +
      "</button>" +
      "</div>" +
      "</div>" +
      '<div class="scroll-progress" aria-hidden="true"><span id="scroll-progress"></span></div>'
    );
  }

  function footerHTML() {
    const year = new Date().getFullYear();
    return (
      '<div class="container">' +
      '<p class="footer__kicker">Siguiente paso</p>' +
      '<h2 class="footer__title">¿Construimos algo <em>juntos</em>?</h2>' +
      (profile.email
        ? '<a class="footer__email" href="mailto:' +
          esc(profile.email) +
          '">' +
          icon("mail") +
          "<span>" +
          esc(profile.email) +
          "</span>" +
          icon("arrow") +
          "</a>"
        : "") +
      '<div class="footer__bottom">' +
      "<p>© " +
      year +
      " " +
      esc(profile.name || "") +
      "</p>" +
      socialsHTML() +
      "<p>Diseñado y construido con HTML, CSS y JavaScript.</p>" +
      "</div>" +
      "</div>"
    );
  }

  /* ---------- Tema claro / oscuro ---------- */

  function storedTheme() {
    try {
      return localStorage.getItem(themeKey);
    } catch (error) {
      return null;
    }
  }

  function updateThemeButton() {
    const button = document.getElementById("theme-toggle");
    const isDark = document.documentElement.dataset.theme === "dark";

    if (button) {
      button.innerHTML = icon(isDark ? "sun" : "moon");
      const label = isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro";
      button.setAttribute("aria-label", label);
      button.setAttribute("title", label);
    }

    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute("content", isDark ? "#111412" : "#f5f2ea");
  }

  function toggleTheme() {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(themeKey, next);
    } catch (error) {
      /* Sin almacenamiento: el tema solo dura la visita. */
    }
    updateThemeButton();
  }

  /* ---------- Interacciones ---------- */

  function initScrollProgress() {
    const bar = document.getElementById("scroll-progress");
    if (!bar) return;

    let ticking = false;

    function update() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      bar.style.transform = "scaleX(" + progress + ")";
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  function initScrollSpy(sections) {
    const links = Array.from(document.querySelectorAll(".nav a"));
    if (!links.length || !("IntersectionObserver" in window)) return;

    const map = new Map(
      sections
        .map((section) => {
          const element = document.getElementById(section.id);
          return element ? [element, section.id] : null;
        })
        .filter(Boolean)
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = map.get(entry.target);
          links.forEach((link) => {
            if (link.getAttribute("href") === "#" + id) {
              link.setAttribute("aria-current", "true");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    map.forEach((id, element) => observer.observe(element));
  }

  function initReveal() {
    const elements = Array.from(document.querySelectorAll(".reveal"));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, instance) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          instance.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    elements.forEach((element) => observer.observe(element));
  }

  function init() {
    document.documentElement.lang = meta.lang || "es";
    document.title = meta.title || profile.name + " · " + (profile.role || "Currículum");

    const description = document.querySelector('meta[name="description"]');
    if (description && meta.description) description.setAttribute("content", meta.description);

    const sections = buildSections();
    const topbar = document.getElementById("topbar");
    const footer = document.getElementById("site-footer");

    topbar.innerHTML = topbarHTML(sections);
    topbar.hidden = false;
    document.getElementById("contenido").innerHTML = mainHTML(sections);
    footer.innerHTML = footerHTML();
    footer.hidden = false;

    updateThemeButton();
    initScrollProgress();
    initScrollSpy(sections);
    initReveal();

    const themeButton = document.getElementById("theme-toggle");
    if (themeButton) themeButton.addEventListener("click", toggleTheme);

    const colorScheme = window.matchMedia("(prefers-color-scheme: dark)");
    if (colorScheme.addEventListener) {
      colorScheme.addEventListener("change", (event) => {
        if (storedTheme()) return;
        document.documentElement.dataset.theme = event.matches ? "dark" : "light";
        updateThemeButton();
      });
    }
  }

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-print]");
    if (trigger) window.print();
  });

  init();
})();
