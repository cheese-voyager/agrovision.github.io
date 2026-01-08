console.log("Settings JS loaded");

const themeLightBtn = document.querySelector("#theme-light");
const themeDarkBtn = document.querySelector("#theme-dark");
const languageSelect = document.querySelector("#language-select");
const logoutBtn = document.querySelector("#logout-btn");

function setActiveThemeCard(theme) {
  const activeClasses = ["ring-2", "ring-green-500", "border-green-500"];
  const inactiveClasses = ["ring-0", "ring-transparent", "border-slate-200", "dark:border-slate-800"];

  const setCard = (btn, isActive) => {
    if (!btn) return;
    btn.setAttribute("aria-pressed", String(isActive));
    btn.classList.toggle("ring-2", isActive);
    btn.classList.toggle("ring-green-500", isActive);
    btn.classList.toggle("border-green-500", isActive);
  };

  setCard(themeLightBtn, theme === "light");
  setCard(themeDarkBtn, theme === "dark");

  // Clean up any accidental ring classes (for safety)
  if (theme === "light" && themeDarkBtn) {
    themeDarkBtn.classList.remove(...activeClasses);
  }
  if (theme === "dark" && themeLightBtn) {
    themeLightBtn.classList.remove(...activeClasses);
  }
  // Remove unused helper classes (if present)
  if (themeLightBtn) themeLightBtn.classList.remove(...inactiveClasses);
  if (themeDarkBtn) themeDarkBtn.classList.remove(...inactiveClasses);
}

// Persist theme and toggle dark mode (delegates to js/main.js if available)
function setTheme(theme) {
  const t = theme === "dark" ? "dark" : "light";
  if (window.AgroVisionTheme && typeof window.AgroVisionTheme.setTheme === "function") {
    window.AgroVisionTheme.setTheme(t);
    setActiveThemeCard(t);
    return;
  }

  // Fallback (should rarely be used)
  try {
    localStorage.setItem("agrovision-theme", t);
  } catch (e) {
    /* ignore */
  }
  document.documentElement.classList.toggle("dark", t === "dark");
  document.documentElement.setAttribute("data-theme", t);
  document.documentElement.style.colorScheme = t;
  setActiveThemeCard(t);
}

function loadTheme() {
  // Prefer reading the actual DOM state (because main.js may apply system pref)
  if (window.AgroVisionTheme && typeof window.AgroVisionTheme.getTheme === "function") {
    const t = window.AgroVisionTheme.getTheme();
    setActiveThemeCard(t);
    return;
  }

  let theme = "light";
  try {
    theme = localStorage.getItem("agrovision-theme") || "light";
  } catch (e) {
    /* ignore */
  }
  setTheme(theme);
}

function setLanguage(lang) {
  const locale = lang === "id" ? "id" : "en";
  // Save + apply via the global i18n helper (js/i18n.js)
  if (window.AgroVisionI18N && typeof window.AgroVisionI18N.setLocale === "function") {
    window.AgroVisionI18N.setLocale(locale, { reload: true });
    return;
  }

  // Fallback: persist only
  try {
    localStorage.setItem("agrovision-lang", locale);
  } catch (e) {
    /* ignore */
  }
  // Fallback UX: reload so other pages read the preference
  try {
    window.location.reload();
  } catch (e) {
    /* ignore */
  }
}

function loadLanguage() {
  let lang = "en";
  if (window.AgroVisionI18N && typeof window.AgroVisionI18N.getLocale === "function") {
    lang = window.AgroVisionI18N.getLocale();
  } else {
    try {
      lang = localStorage.getItem("agrovision-lang") || "en";
    } catch (e) {
      /* ignore */
    }
  }
  if (languageSelect) languageSelect.value = lang;
}

// Event handlers
if (themeLightBtn) themeLightBtn.addEventListener("click", () => setTheme("light"));
if (themeDarkBtn) themeDarkBtn.addEventListener("click", () => setTheme("dark"));
if (languageSelect) languageSelect.addEventListener("change", () => setLanguage(languageSelect.value));

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    const lang = (window.AgroVisionI18N && window.AgroVisionI18N.getLocale)
  ? window.AgroVisionI18N.getLocale()
  : "en";

if (lang === "id") {
  alert("Keluar (simulasi). Pada sistem nyata, ini akan menghapus token sesi Anda.");
} else {
  alert("Signed out (simulation). In a real system, this would clear your session token.");
}
  });
}

// Keep theme in sync if localStorage changes in another tab
window.addEventListener("storage", (e) => {
  if (!e) return;
  if (e.key === "agrovision-theme") loadTheme();
  if (e.key === "agrovision-lang") loadLanguage();
});

// Keep in sync if theme is changed via header toggle
window.addEventListener("agrovision:themechange", (e) => {
  try {
    const t = e && e.detail && e.detail.theme ? e.detail.theme : null;
    if (t) setActiveThemeCard(t);
  } catch (err) {
    /* ignore */
  }
});

// Init
loadTheme();
loadLanguage();
