// js/i18n.js
// Lightweight client-side i18n for the AgroVision static frontend.
// - Stores locale in localStorage key: agrovision-lang
// - Applies translations by replacing common UI text nodes

(function () {
  "use strict";

  const STORAGE_KEY = "agrovision-lang";
  const DEFAULT_LOCALE = "en";

  const DICTS = {
    en: {},
    id: {
      // =====================================================
      // Navigation / Common
      // =====================================================
      "Dashboard": "Dasbor",
      "Control Panel": "Panel Kontrol",
      "Live Camera": "Kamera Langsung",
      "Settings": "Pengaturan",
      "Menu": "Menu",
      "Back": "Kembali",
      "Info": "Info",
      "Tips": "Tips",
      "Tip": "Tips",
      "Note": "Catatan",

      // =====================================================
      // Status / Badges (clean wording)
      // =====================================================
      "System Online": "Sistem Online",
      "Control Ready": "Kontrol Siap",
      "Simulation Mode": "Mode Kendali",
      "Simulation Active": "Aktif",
      "Simulation Data": "Data",
      "Realtime": "Waktu nyata",
      "Online": "Online",
      "Active": "Aktif",
      "Auto-update": "Pembaruan otomatis",
      "Ready": "Siap",

      // =====================================================
      // Brand / Tagline
      // =====================================================
      "Drone Soil Monitoring (Simulation)": "Pemantauan Tanah Drone",
      "Drone Soil Monitoring": "Pemantauan Tanah Drone",

      // =====================================================
      // Dashboard Page (clean wording)
      // =====================================================
      "Flight telemetry and soil suitability overview (simulation).":
        "Ringkasan telemetri penerbangan dan kesesuaian tanah.",
      "Flight telemetry and soil suitability overview.":
        "Ringkasan telemetri penerbangan dan kesesuaian tanah.",

      "Quick Actions": "Aksi Cepat",
      "Propeller Control": "Kontrol Baling-baling",
      "Open Live Camera": "Buka Kamera Langsung",

      "Battery": "Baterai",
      "Altitude": "Ketinggian",
      "Scanned Area": "Area Terpindai",

      "Pitch": "Pitch",
      "Yaw": "Yaw",
      "Roll": "Roll",
      "Drone tilt forward/backward": "Kemiringan drone maju/mundur",
      "Drone heading direction": "Arah hadap drone",
      "Drone tilt left/right": "Kemiringan drone kiri/kanan",

      "Soil Suitability": "Kesesuaian Tanah",
      "Suitable": "Sesuai",
      "Not Suitable": "Tidak Sesuai",

      "Altitude Chart": "Grafik Ketinggian",
      "Drone altitude over time (simulation).": "Ketinggian drone dari waktu ke waktu.",
      "Drone altitude over time.": "Ketinggian drone dari waktu ke waktu.",
      "Time Range": "Rentang Waktu",
      "Last 1 hour": "1 jam terakhir",
      "Last 6 hours": "6 jam terakhir",
      "Last 24 hours": "24 jam terakhir",
      "Last 7 days": "7 hari terakhir",
      "Range:": "Rentang:",
      "Range :": "Rentang:",

      "Status changes when you update the time filter (simulation).":
        "Status berubah saat kamu mengganti rentang waktu.",
      "Status changes when you update the time filter.":
        "Status berubah saat kamu mengganti rentang waktu.",

      "If Suitable, continue mapping priority areas.":
        "Jika Sesuai, lanjutkan pemetaan area prioritas.",
      "If Not Suitable, check irrigation and moisture levels.":
        "Jika Tidak Sesuai, periksa irigasi dan tingkat kelembapan.",
      "Take a pH sample for verification (optional).":
        "Ambil sampel pH untuk verifikasi (opsional).",

      "Peak Altitude": "Ketinggian Puncak",
      "Average Altitude": "Ketinggian Rata-rata",
      "Stability": "Stabilitas",
      "Good": "Baik",

      "*All features are simulation (front-end only).":
        "*Semua fitur berjalan di front-end.",

      "Insights & Recommendations": "Wawasan & Rekomendasi",
      "Suggested actions summary (simulation).": "Ringkasan saran tindakan.",
      "Suggested actions summary.": "Ringkasan saran tindakan.",
      "Soil Condition": "Kondisi Tanah",
      "Recent Activity": "Aktivitas Terbaru",

      "Sector A1 scan completed": "Pemindaian sektor A1 selesai",
      "Telemetry update received": "Pembaruan telemetri diterima",
      "Monitoring route started": "Rute pemantauan dimulai",
      "Just now": "Baru saja",

      // =====================================================
      // Control Page (clean wording)
      // =====================================================
      "Button simulation to control drone propellers.":
        "Kontrol tombol untuk mengendalikan baling-baling drone.",
      "Button simulation to control drone propellers (no hardware connection).":
        "Kontrol tombol untuk mengendalikan baling-baling drone.",
      "Click to toggle": "Klik untuk ubah",
      "Propeller Controls": "Kontrol Baling-baling",
      "Default state is OFF. Click a card to toggle.": "Status awal OFF. Klik kartu untuk ubah.",
      "Manual Toggle": "Ubah Manual",
      "All Propellers": "Semua Baling-baling",
      "Click to toggle all propellers at once.": "Klik untuk mengubah semua baling-baling sekaligus.",
      "Bulk Toggle": "Ubah Massal",
      "Fast": "Cepat",
      "Auto log": "Log otomatis",
      "Action Log": "Log Aksi",
      "Latest actions appear at the top.": "Aksi terbaru muncul di paling atas.",
      "Tip: try A → B → All": "Tips: coba A → B → Semua",
      "Scroll to view history": "Scroll untuk lihat riwayat",

      "Status and log are generated by local JavaScript (js/control.js). There is no communication with real hardware.":
        "Status dan log dibuat oleh JavaScript (js/control.js).",

      "Safety Checklist": "Checklist Keamanan",
      "Ensure the area is safe before turning all propellers ON.":
        "Pastikan area aman sebelum menyalakan semua baling-baling.",
      "Use the action log to verify the latest command.":
        "Gunakan log aksi untuk memastikan perintah terakhir.",
      "If the simulation feels stuck, refresh the page.":
        "Jika terasa macet, refresh halaman.",

      // =====================================================
      // Live Page (clean wording)
      // =====================================================
      "Field view and soil status (simulation).":
        "Tampilan lahan dan status tanah.",
      "Field view and soil status.":
        "Tampilan lahan dan status tanah.",
      "Moisture, temperature, and suitability (randomized by JS).":
        "Kelembapan, suhu, dan kesesuaian.",
      "Moisture, temperature, and suitability.":
        "Kelembapan, suhu, dan kesesuaian.",
      "Status updates on each refresh.": "Status diperbarui setiap kali refresh.",
      "Random data (simulation)": "Data",
      "Random data": "Data",
      "Soil Moisture": "Kelembapan Tanah",

      "Quick Guide": "Panduan Cepat",
      "“LIVE” is a visual indicator only (simulation).":
        "“LIVE” adalah indikator visual.",
      "\"LIVE\" is a visual indicator only (simulation).":
        "\"LIVE\" adalah indikator visual.",
      "Click “Refresh Data” to update moisture/temperature.":
        "Klik “Refresh Data” untuk memperbarui kelembapan/suhu.",
      "Click \"Refresh Data\" to update moisture/temperature.":
        "Klik \"Refresh Data\" untuk memperbarui kelembapan/suhu.",
      "You can place a dummy video/image in the camera area.":
        "Kamu bisa memasang video/gambar di area kamera.",

      // =====================================================
      // Settings Page (clean wording)
      // =====================================================
      "Appearance, language preference, and session (stored in localStorage).":
        "Tampilan, preferensi bahasa, dan sesi.",
      "Preferences are stored in": "Preferensi disimpan di",
      "(simulation).": "",

      "Switch themes for better comfort in bright/dark environments.":
        "Ganti tema agar lebih nyaman di lingkungan terang/gelap.",
      "Language preference is stored as a demo setting.":
        "Preferensi bahasa diterapkan di semua halaman.",
      "Logout is simulated (no real session token).":
        "Keluar akan menghapus sesi lokal.",

      "Appearance": "Tampilan",
      "Choose a theme for the dashboard.": "Pilih tema untuk dashboard.",
      "Theme": "Tema",
      "Light": "Terang",
      "Bright look (default).": "Tampilan cerah (default).",
      "Great for daylight use.": "Cocok untuk penggunaan siang hari.",
      "Dark": "Gelap",
      "Comfortable low-light theme.": "Tema nyaman untuk kondisi gelap.",
      "Best for night mode.": "Terbaik untuk mode malam.",

      "Theme is stored in": "Tema disimpan di",
      "with key": "dengan key",

      "Language": "Bahasa",
      "Save a language preference (demo).": "Simpan preferensi bahasa.",
      "Locale": "Bahasa",
      "This setting stores a preference and shows an alert (simulation).":
        "Pengaturan ini menyimpan preferensi bahasa.",

      "Session": "Sesi",
      "Simple sign-out action (simulation).": "Aksi keluar.",
      "Auth": "Auth",
      "Log out": "Keluar",
      "Shows a message (no real token).": "Menghapus sesi lokal.",
      "Log Out": "Keluar",

      "Account Information": "Informasi Akun",
      "Demo account info (simulation).": "Info akun.",
      "Profile": "Profil",
      "*You can replace this account info with your team members.":
        "*Kamu bisa mengganti info akun ini dengan data tim.",

      "Role": "Peran",
      "Project": "Proyek",
      "Status": "Status",

      // Footer variants (legacy cleanup)
      "AgroVision • Team 06 • Simulation Dashboard": "AgroVision • Tim 05",
      "AgroVision • Team 06 • Settings (Simulation)": "AgroVision • Tim 05 • Pengaturan",
      "AgroVision • Team 05 • Settings": "AgroVision • Tim 05 • Pengaturan",
      "AgroVision • Team 05 • Live Camera": "AgroVision • Tim 05 • Kamera Langsung",
      "AgroVision • Team 05 • Control Panel": "AgroVision • Tim 05 • Panel Kontrol",
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

    const nav = (navigator.language || "").toLowerCase();
    if (nav.startsWith("id")) return "id";
    return DEFAULT_LOCALE;
  }

  function shouldSkipNode(node) {
    if (!node || !node.parentElement) return true;
    const el = node.parentElement;

    const skipTags = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE", "TEXTAREA"]);
    if (skipTags.has(el.tagName)) return true;

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
      if (typeof replacement !== "string") return;

      // Preserve surrounding whitespace
      node.nodeValue = raw.replace(trimmed, replacement);
    });
  }

  function applyDocumentTitle(dict) {
    if (!dict) return;
    const t = document.title;
    if (!t) return;

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

    // For text-node replacement strategy, reload is the cleanest switch.
    if (reload) {
      try {
        window.location.reload();
      } catch (_e) {
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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
