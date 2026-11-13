/* ==========================================================================
   CV / PORTAFOLIO · KEVIN OSVALDO SOTO ORTIZ
   Interacciones: tema, filtros, copia de correo, impresión, navegación y
   animaciones de aparición. JavaScript Vanilla, sin dependencias.
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------------
     Referencias generales
     ------------------------------------------------------------------------ */

  const root = document.documentElement;
  const header = document.getElementById("site-header");
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const metaTheme = document.getElementById("theme-color");
  const menuToggle = document.getElementById("menu-toggle");
  const siteNav = document.getElementById("site-nav");
  const scrollBar = document.getElementById("scroll-bar");
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toast-message");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const THEME_KEY = "cv-theme";
  let toastTimer = null;
  let scrollTicking = false;

  /* ------------------------------------------------------------------------
     Utilidades
     ------------------------------------------------------------------------ */

  function getStoredTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (error) {
      return null;
    }
  }

  function storeTheme(value) {
    try {
      localStorage.setItem(THEME_KEY, value);
    } catch (error) {
      /* Si el almacenamiento está desactivado, el tema dura la visita. */
    }
  }

  function showToast(message) {
    if (!toast || !toastMessage) return;

    window.clearTimeout(toastTimer);
    toastMessage.textContent = message;
    toast.classList.add("is-visible");
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 2800);
  }

  /* ------------------------------------------------------------------------
     Tema claro / oscuro
     ------------------------------------------------------------------------ */

  function syncThemeUI() {
    const isDark = root.dataset.theme === "dark";

    if (themeIcon) {
      themeIcon.setAttribute("href", isDark ? "#icon-sun" : "#icon-moon");
    }

    if (themeToggle) {
      const label = isDark ? "Activar modo claro" : "Activar modo oscuro";
      themeToggle.setAttribute("aria-label", label);
      themeToggle.setAttribute("title", label);
      themeToggle.setAttribute("aria-pressed", String(isDark));
    }

    if (metaTheme) {
      metaTheme.setAttribute("content", isDark ? "#0d1210" : "#f7f6f1");
    }
  }

  function toggleTheme() {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = nextTheme;
    storeTheme(nextTheme);
    syncThemeUI();
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  syncThemeUI();

  /* Si el sistema cambia de tema y el usuario no ha elegido uno, lo seguimos. */
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  const handleSystemThemeChange = function (event) {
    if (getStoredTheme()) return;
    root.dataset.theme = event.matches ? "dark" : "light";
    syncThemeUI();
  };

  if (typeof systemTheme.addEventListener === "function") {
    systemTheme.addEventListener("change", handleSystemThemeChange);
  } else if (typeof systemTheme.addListener === "function") {
    systemTheme.addListener(handleSystemThemeChange);
  }

  /* ------------------------------------------------------------------------
     Menú móvil
     ------------------------------------------------------------------------ */

  function isMenuOpen() {
    return siteNav && siteNav.classList.contains("is-open");
  }

  function openMenu() {
    if (!siteNav || !menuToggle) return;
    siteNav.classList.add("is-open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Cerrar menú de navegación");

    const firstLink = siteNav.querySelector("a");
    if (firstLink) firstLink.focus();
  }

  function closeMenu(restoreFocus) {
    if (!siteNav || !menuToggle) return;
    const wasOpen = siteNav.classList.contains("is-open");
    siteNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú de navegación");

    if (wasOpen && restoreFocus) menuToggle.focus();
  }

  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", function () {
      if (isMenuOpen()) {
        closeMenu(false);
      } else {
        openMenu();
      }
    });

    siteNav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu(false);
    });

    document.addEventListener("click", function (event) {
      if (!isMenuOpen()) return;
      if (!header.contains(event.target)) closeMenu(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && isMenuOpen()) {
        closeMenu(true);
      }
    });

    const desktopQuery = window.matchMedia("(min-width: 921px)");
    const handleDesktopChange = function (event) {
      if (event.matches) closeMenu(false);
    };

    if (typeof desktopQuery.addEventListener === "function") {
      desktopQuery.addEventListener("change", handleDesktopChange);
    } else if (typeof desktopQuery.addListener === "function") {
      desktopQuery.addListener(handleDesktopChange);
    }

    window.addEventListener("beforeprint", function () {
      closeMenu(false);
    });
  }

  /* ------------------------------------------------------------------------
     Filtros de habilidades y proyectos
     Cada bloque tiene botones [data-filter] y tarjetas [data-category].
     ------------------------------------------------------------------------ */

  const filterBars = Array.from(document.querySelectorAll("[data-filter-group]"));

  filterBars.forEach(function (bar) {
    const targetId = bar.getAttribute("data-filter-target");
    const target = targetId ? document.getElementById(targetId) : null;
    const groupName = bar.getAttribute("data-filter-group");
    const status = document.querySelector('[data-filter-status="' + groupName + '"]');
    const buttons = Array.from(bar.querySelectorAll("[data-filter]"));
    const defaultButton = buttons.find(function (button) {
      return button.getAttribute("data-filter") === "all";
    });

    if (!target || !buttons.length) return;

    const cards = Array.from(target.querySelectorAll("[data-category]"));
    const noun = targetId === "projects-grid" ? "proyectos" : "categorías";

    function updateStatus(filter, visibleCount) {
      if (!status) return;
      status.textContent =
        filter === "all"
          ? cards.length + " " + noun
          : "Mostrando " + visibleCount + " de " + cards.length + " " + noun;
    }

    function applyFilter(filter, animate) {
      let visibleCount = 0;

      buttons.forEach(function (button) {
        const active = button.getAttribute("data-filter") === filter;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });

      cards.forEach(function (card) {
        const show = filter === "all" || card.getAttribute("data-category") === filter;
        card.hidden = !show;
        card.classList.remove("filter-enter");

        if (!show) return;

        visibleCount += 1;

        /* Una tarjeta que nunca llegó a ser observada también debe aparecer. */
        if (!card.classList.contains("is-visible")) {
          card.classList.add("is-visible");
        }

        if (animate) {
          void card.offsetWidth;
          card.classList.add("filter-enter");
          card.addEventListener(
            "animationend",
            function () {
              card.classList.remove("filter-enter");
            },
            { once: true }
          );
        }
      });

      updateStatus(filter, visibleCount);
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        const filter = button.getAttribute("data-filter") || "all";
        applyFilter(filter, true);
      });
    });

    /* Estado inicial, sin animación para no competir con el fade-in. */
    if (defaultButton) {
      applyFilter("all", false);
    }
  });

  /* ------------------------------------------------------------------------
     Copiar correo al portapapeles
     ------------------------------------------------------------------------ */

  function getEmailAddress() {
    const emailLink = document.querySelector('[data-email-link][href^="mailto:"]');
    if (!emailLink) return "";

    let value = emailLink.getAttribute("href").replace(/^mailto:/i, "").split("?")[0].trim();

    try {
      value = decodeURIComponent(value);
    } catch (error) {
      /* Si el valor no está codificado, se usa tal cual. */
    }

    return value;
  }

  function fallbackCopy(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.setAttribute("readonly", "");
    textArea.setAttribute("aria-hidden", "true");
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "1px";
    textArea.style.height = "1px";
    textArea.style.padding = "0";
    textArea.style.border = "0";
    textArea.style.opacity = "0";
    textArea.style.pointerEvents = "none";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, textArea.value.length);

    let copied = false;

    try {
      copied = document.execCommand("copy");
    } finally {
      textArea.remove();
    }

    if (!copied) {
      throw new Error("El navegador no permitió copiar el texto.");
    }
  }

  async function copyEmailToClipboard() {
    const email = getEmailAddress();
    if (!email) {
      showToast("No se encontró un correo para copiar.");
      return;
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(email);
        } catch (error) {
          fallbackCopy(email);
        }
      } else {
        fallbackCopy(email);
      }

      showToast("¡Correo copiado!");
      return true;
    } catch (error) {
      showToast("No se pudo copiar. Usa el enlace de correo.");
      return false;
    }
  }

  const copyButtons = Array.from(document.querySelectorAll("[data-copy-email]"));

  copyButtons.forEach(function (button) {
    button.addEventListener("click", async function () {
      const copied = await copyEmailToClipboard();
      if (!copied) return;

      const label = button.querySelector("[data-copy-label]");
      if (!label) return;

      if (!label.dataset.originalLabel) {
        label.dataset.originalLabel = label.textContent;
      }

      window.clearTimeout(button._copyFeedbackTimer);
      label.textContent = "¡Copiado!";

      button._copyFeedbackTimer = window.setTimeout(function () {
        label.textContent = label.dataset.originalLabel;
      }, 1900);
    });
  });

  /* ------------------------------------------------------------------------
     Descargar / imprimir el CV
     El navegador permite «Guardar como PDF» desde el diálogo de impresión.
     ------------------------------------------------------------------------ */

  document.querySelectorAll('[data-action="print"]').forEach(function (button) {
    button.addEventListener("click", function () {
      window.print();
    });
  });

  /* ------------------------------------------------------------------------
     Animación de aparición con IntersectionObserver
     ------------------------------------------------------------------------ */

  const revealElements = Array.from(document.querySelectorAll(".reveal"));

  if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
    revealElements.forEach(function (element) {
      element.classList.add("is-visible");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -7% 0px", threshold: 0.08 }
    );

    revealElements.forEach(function (element) {
      revealObserver.observe(element);
    });
  }

  /* ------------------------------------------------------------------------
     Barra de progreso, sombra de cabecera y sección activa
     ------------------------------------------------------------------------ */

  const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
  const navSections = navLinks
    .map(function (link) {
      const selector = link.getAttribute("href");
      return selector ? { link: link, section: document.querySelector(selector) } : null;
    })
    .filter(function (item) {
      return item && item.section;
    });

  function updateScrollState() {
    if (scrollBar) {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      scrollBar.style.transform = "scaleX(" + progress + ")";
    }

    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    }

    let activeId = "";

    if (navSections.length) {
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;

      if (atBottom) {
        activeId = navSections[navSections.length - 1].section.id;
      } else {
        const threshold = Math.max(96, window.innerHeight * 0.34);

        navSections.forEach(function (item) {
          if (item.section.getBoundingClientRect().top <= threshold) {
            activeId = item.section.id;
          }
        });
      }
    }

    navLinks.forEach(function (link) {
      const isActive = link.getAttribute("href") === "#" + activeId;
      if (isActive) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    scrollTicking = false;
  }

  function requestScrollUpdate() {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(updateScrollState);
  }

  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate);
  updateScrollState();

  /* ------------------------------------------------------------------------
     Detalles finales
     ------------------------------------------------------------------------ */

  const yearElement = document.getElementById("current-year");
  if (yearElement) yearElement.textContent = String(new Date().getFullYear());

  /* Recalcula posiciones si se cargan las fuentes y cambia la altura del texto. */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(requestScrollUpdate).catch(function () {
      /* No es necesario hacer nada si las fuentes no cargan. */
    });
  }
})();
