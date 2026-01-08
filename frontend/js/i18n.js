// js/i18n.js
// Lightweight client-side i18n for the AgroVision static frontend.
// - Stores locale in localStorage key: agrovision-lang
// - Applies translations by replacing common UI text nodes (no backend required)

(function () {
  "use strict";

  const STORAGE_KEY = "agrovision-lang";
  const DEFAULT_LOCALE = "en";

  // NOTE:
  // This approach intentionally avoids modifying a lot of HTML by using a
  // conservative text-node replacement. If you want a more scalable approach,
  // switch to data-i18n attributes and key-based dictionaries.
  const DICTS = {
    en: {},
    id: {
      // Navigation
      "Dashboard": "Dasbor",
      "Control Panel": "Panel Kontrol",
      "Live Camera": "Kamera Langsung",
      "Settings": "Pengaturan",
      "Menu": "Menu",
      "Back": "Kembali",

      // Status / badges
      "System Online": "Sistem Online",
      "Control Ready": "Kontrol Siap",
      "Simulation Mode": "Mode Simulasi",
      "Simulation Active": "Simulasi Aktif",
      "Simulation Data": "Data Simulasi",
      "Realtime": "Waktu nyata",
      "Online": "Online",
      "Active": "Aktif",

      // Brand tagline
      "Drone Soil Monitoring (Simulation)": "Pemantauan Tanah Drone (Simulasi)",

      // Dashboard
      "Quick Actions": "Aksi Cepat",
      "Propeller Control": "Kontrol Baling-baling",
      "Open Live Camera": "Buka Kamera Langsung",
      "Flight telemetry and soil suitability overview (simulation).":
        "Ringkasan telemetri penerbangan dan kesesuaian tanah (simulasi).",
      "Battery": "Baterai",
      "Altitude": "Ketinggian",
      "Scanned Area": "Area Terpindai",
      "Soil Suitability": "Kesesuaian Tanah",
      "Suitable": "Sesuai",
      "Not Suitable": "Tidak Sesuai",
      "Time Range": "Rentang Waktu",
      "Last 1 hour": "1 jam terakhir",
      "Last 6 hours": "6 jam terakhir",
      "Last 24 hours": "24 jam terakhir",
      "Last 7 days": "7 hari terakhir",
      "Insights & Recommendations": "Wawasan & Rekomendasi",
      "Recent Activity": "Aktivitas Terbaru",

      // Control
      "Button simulation to control drone propellers (no hardware connection).":
        "Simulasi tombol untuk mengontrol baling-baling drone (tanpa koneksi hardware).",
      "Click to toggle": "Klik untuk ubah",
      "Propeller Controls": "Kontrol Baling-baling",
      "Default state is OFF. Click a card to toggle.": "Status awal OFF. Klik kartu untuk ubah.",
      "Manual Toggle": "Ubah Manual",
      "All Propellers": "Semua Baling-baling",
      "Click to toggle all propellers at once.": "Klik untuk mengubah semua baling-baling sekaligus.",
      "Bulk Toggle": "Ubah Massal",
      "Fast": "Cepat",
      "Auto log": "Log otomatis",
      "Note": "Catatan",
      "Action Log": "Log Aksi",
      "Latest actions appear at the top.": "Aksi terbaru muncul di paling atas.",
      "Tip: try A → B → All": "Tips: coba A → B → Semua",
      "Scroll to view history": "Scroll untuk lihat riwayat",

      // Live
      "Live": "Langsung",
      "Live Feed": "Siaran Langsung",
      "Camera": "Kamera",

      // Settings
      "Appearance": "Tampilan",
      "Language": "Bahasa",
      "Session": "Sesi",
      "Account Information": "Informasi Akun",
      "Log Out": "Keluar",
      "Role": "Peran",
      "Project": "Proyek",
      "Status": "Status",
    },
  };

  function safeGet(key) {
    try {
      return localStorage.getItem(key);
    } catch (_e) {
      return null;
    }
  }

  function safeSet(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (_e) {
      return false;
    }
  }

  function normalizeLocale(locale) {
    return locale === "id" ? "id" : "en";
  }

  function resolveLocale() {
    const saved = safeGet(STORAGE_KEY);
    if (saved) return normalizeLocale(saved);
    // default heuristic
    const nav = (navigator.language || "").toLowerCase();
    if (nav.startsWith("id")) return "id";
    return DEFAULT_LOCALE;
  }

  function shouldSkipNode(node) {
    if (!node || !node.parentElement) return true;
    const el = node.parentElement;
    // Skip inside these tags
    const skipTags = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE", "TEXTAREA"]);
    if (skipTags.has(el.tagName)) return true;
    // Skip if any ancestor opts out
    if (el.closest && el.closest("[data-no-i18n], .no-i18n")) return true;
    return false;
  }

  function applyTextReplacements(dict) {
    if (!dict || !Object.keys(dict).length) return;

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        if (!node || !node.nodeValue) return NodeFilter.FILTER_REJECT;
        if (shouldSkipNode(node)) return NodeFilter.FILTER_REJECT;
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach((node) => {
      const raw = node.nodeValue;
      const trimmed = raw.trim();
      const replacement = dict[trimmed];
      if (!replacement) return;
      // Preserve surrounding whitespace
      node.nodeValue = raw.replace(trimmed, replacement);
    });
  }

  function applyDocumentTitle(dict) {
    if (!dict) return;
    const t = document.title;
    if (!t) return;
    // Replace the known page words in title
    const parts = ["Dashboard", "Control Panel", "Live Camera", "Settings"];
    let out = t;
    parts.forEach((p) => {
      if (out.includes(p) && dict[p]) out = out.replace(p, dict[p]);
    });
    document.title = out;
  }

  function applyLocale(locale) {
    const loc = normalizeLocale(locale);
    document.documentElement.setAttribute("lang", loc);

    if (loc === "id") {
      const dict = DICTS.id;
      applyDocumentTitle(dict);
      applyTextReplacements(dict);
    }
  }

  function getLocale() {
    return normalizeLocale(safeGet(STORAGE_KEY) || resolveLocale());
  }

  function setLocale(locale, { reload = true } = {}) {
    const loc = normalizeLocale(locale);
    safeSet(STORAGE_KEY, loc);

    // Because we are doing text-node replacements, the cleanest way to switch
    // back to English is a full reload.
    if (reload) {
      try {
        window.location.reload();
      } catch (_e) {
        // as a fallback, apply in-place
        applyLocale(loc);
      }
      return;
    }

    applyLocale(loc);
  }

  function init() {
    const loc = resolveLocale();
    applyLocale(loc);
  }

  // Expose small API for settings.js
  window.AgroVisionI18N = {
    STORAGE_KEY,
    getLocale,
    setLocale,
    applyLocale,
    resolveLocale,
  };

  // Init after DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
