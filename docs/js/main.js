// js/main.js

// Global helpers shared across pages
(function () {
  "use strict";

  console.log("AgroVision loaded!");

  const STORAGE_KEY = "agrovision-theme";

  function getSavedTheme() {
    try {
      const t = localStorage.getItem(STORAGE_KEY);
      if (t === "light" || t === "dark") return t;
    } catch (e) {
      /* ignore */
    }
    return null;
  }

  function getSystemTheme() {
    try {
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    } catch (e) {
      /* ignore */
    }
    return "light";
  }

  function resolveTheme() {
    return getSavedTheme() || getSystemTheme();
  }

  // Inline SVG icons (no emoji)
  function sunIconSvg() {
    return `
      <svg aria-hidden="true" viewBox="0 0 24 24" class="h-5 w-5" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="4"></circle>
        <path d="M12 2v2"></path><path d="M12 20v2"></path>
        <path d="M4.93 4.93l1.41 1.41"></path><path d="M17.66 17.66l1.41 1.41"></path>
        <path d="M2 12h2"></path><path d="M20 12h2"></path>
        <path d="M4.93 19.07l1.41-1.41"></path><path d="M17.66 6.34l1.41-1.41"></path>
      </svg>
    `.trim();
  }

  function moonIconSvg() {
    return `
      <svg aria-hidden="true" viewBox="0 0 24 24" class="h-5 w-5" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3c.2 0 .4 0 .6.02A7 7 0 0 0 21 12.79z"></path>
      </svg>
    `.trim();
  }

  function updateThemeToggles(theme) {
    const isDark = theme === "dark";

    document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(isDark));
      btn.setAttribute("title", isDark ? "Switch to Light" : "Switch to Dark");

      // Backward-compatible:
      // If the HTML has <span data-theme-icon>...</span>, we inject SVG into it.
      const icon = btn.querySelector("[data-theme-icon]");
      if (icon) {
        icon.innerHTML = isDark ? moonIconSvg() : sunIconSvg();
      }

      // Optional hint label if present
      const hint = btn.querySelector("[data-theme-hint]");
      if (hint) hint.textContent = isDark ? "Dark" : "Light";
    });
  }

  function applyTheme(theme, { persist = true } = {}) {
    const t = theme === "dark" ? "dark" : "light";
    const root = document.documentElement;

    root.classList.toggle("dark", t === "dark");
    root.setAttribute("data-theme", t);
    root.style.colorScheme = t;

    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, t);
      } catch (e) {
        /* ignore */
      }
    }

    updateThemeToggles(t);

    // Let other page scripts react (Settings page highlight, etc.)
    try {
      window.dispatchEvent(new CustomEvent("agrovision:themechange", { detail: { theme: t } }));
    } catch (e) {
      /* ignore */
    }

    return t;
  }

  function getTheme() {
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  }

  function setTheme(theme) {
    return applyTheme(theme, { persist: true });
  }

  function toggleTheme() {
    return setTheme(getTheme() === "dark" ? "light" : "dark");
  }

  function applyThemeFromStorage() {
    // Don’t overwrite storage on load — just reflect it.
    return applyTheme(resolveTheme(), { persist: false });
  }

  // Expose small API for other scripts (settings.js)
  window.AgroVisionTheme = {
    STORAGE_KEY,
    getTheme,
    setTheme,
    toggleTheme,
    applyThemeFromStorage,
  };

  // Init theme (in case page didn’t run the early head script)
  applyThemeFromStorage();

  // Click handler for any theme toggle button
  document.addEventListener(
    "click",
    (evt) => {
      const btn = evt.target && evt.target.closest ? evt.target.closest("[data-theme-toggle]") : null;
      if (!btn) return;
      evt.preventDefault();
      toggleTheme();
    },
    { passive: false }
  );

  // Keep theme in sync across tabs
  window.addEventListener("storage", (e) => {
    if (e && e.key === STORAGE_KEY) applyThemeFromStorage();
  });

  // -----------------------------
  // Mobile menu toggle
  // -----------------------------
  const mobileMenuButton = document.querySelector("#mobile-menu-button");
  const mobileMenu = document.querySelector("#mobile-menu");

  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add("hidden");
  }

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });

    // Close when clicking a link inside the drawer
    mobileMenu.addEventListener("click", (evt) => {
      const target = evt.target;
      if (target && target.closest && target.closest("a[href]")) {
        closeMobileMenu();
      }
    });

    // Close on Escape
    window.addEventListener("keydown", (evt) => {
      if (evt.key === "Escape") closeMobileMenu();
    });
  }
})();
