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
  // Status / Badges
  // =====================================================
  "System Online": "Sistem Online",
  "Control Ready": "Kontrol Siap",
  "Simulation Mode": "Mode Simulasi",
  "Simulation Active": "Simulasi Aktif",
  "Simulation Data": "Data Simulasi",
  "Realtime": "Waktu nyata",
  "Online": "Online",
  "Active": "Aktif",
  "Auto-update": "Pembaruan otomatis",

  // =====================================================
  // Brand / Tagline
  // =====================================================
  "Drone Soil Monitoring (Simulation)": "Pemantauan Tanah Drone (Simulasi)",

  // =====================================================
  // Dashboard Page
  // =====================================================
  "Flight telemetry and soil suitability overview (simulation).":
    "Ringkasan telemetri penerbangan dan kesesuaian tanah (simulasi).",

  "Quick Actions": "Aksi Cepat",
  "Propeller Control": "Kontrol Baling-baling",
  "Open Live Camera": "Buka Kamera Langsung",

  // KPI Labels (old)
  "Battery": "Baterai",
  "Altitude": "Ketinggian",
  "Scanned Area": "Area Terpindai",

  // KPI Labels (new)
  "Pitch": "Pitch",
  "Yaw": "Yaw",
  "Roll": "Roll",
  "Drone tilt forward/backward": "Kemiringan drone maju/mundur",
  "Drone heading direction": "Arah hadap drone",
  "Drone tilt left/right": "Kemiringan drone kiri/kanan",

  "Soil Suitability": "Kesesuaian Tanah",
  "Suitable": "Sesuai",
  "Not Suitable": "Tidak Sesuai",

  // Chart & Filters
  "Altitude Chart": "Grafik Ketinggian",
  "Drone altitude over time (simulation).": "Ketinggian drone dari waktu ke waktu (simulasi).",
  "Time Range": "Rentang Waktu",
  "Last 1 hour": "1 jam terakhir",
  "Last 6 hours": "6 jam terakhir",
  "Last 24 hours": "24 jam terakhir",
  "Last 7 days": "7 hari terakhir",

  // Range variations (buat kasus "Rentang: Last 1 hour" belum kebagi)
  "Range:": "Rentang:",
  "Range :": "Rentang:",

  // Missing dashboard lines ✅
  "Status changes when you update the time filter (simulation).":
    "Status berubah saat kamu mengganti rentang waktu (simulasi).",

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
    "*Semua fitur adalah simulasi (hanya front-end).",

  // Insights
  "Insights & Recommendations": "Wawasan & Rekomendasi",
  "Suggested actions summary (simulation).": "Ringkasan saran tindakan (simulasi).",
  "Soil Condition": "Kondisi Tanah",
  "Recent Activity": "Aktivitas Terbaru",

  "Sector A1 scan completed": "Pemindaian sektor A1 selesai",
  "Telemetry update received": "Pembaruan telemetri diterima",
  "Monitoring route started": "Rute pemantauan dimulai",
  "Just now": "Baru saja",

  // =====================================================
  // Control Page
  // =====================================================
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
  "Action Log": "Log Aksi",
  "Latest actions appear at the top.": "Aksi terbaru muncul di paling atas.",
  "Tip: try A → B → All": "Tips: coba A → B → Semua",
  "Scroll to view history": "Scroll untuk lihat riwayat",

  // Missing control lines ✅
  "Status and log are generated by local JavaScript (js/control.js). There is no communication with real hardware.":
    "Status dan log dibuat oleh JavaScript lokal (js/control.js). Tidak ada komunikasi dengan perangkat keras asli.",

  "Safety Checklist": "Checklist Keamanan",
  "Ensure the area is safe before turning all propellers ON.":
    "Pastikan area aman sebelum menyalakan semua baling-baling.",
  "Use the action log to verify the latest command.":
    "Gunakan log aksi untuk memastikan perintah terakhir.",
  "If the simulation feels stuck, refresh the page.":
    "Jika simulasi terasa macet, refresh halaman.",

  "Front-Left motor": "Motor Depan-Kiri",
  "Front-Right motor": "Motor Depan-Kanan",
  "Rear-Left motor": "Motor Belakang-Kiri",
  "Rear-Right motor": "Motor Belakang-Kanan",

  // =====================================================
  // Live Page
  // =====================================================
  "Live": "Langsung",
  "Live Feed": "Siaran Langsung",
  "Camera": "Kamera",

  // Missing live lines ✅
  "Field view and soil status (simulation).":
    "Tampilan lahan dan status tanah (simulasi).",
  "Moisture, temperature, and suitability (randomized by JS).":
    "Kelembapan, suhu, dan kesesuaian (diacak oleh JS).",
  "Status updates on each refresh.":
    "Status diperbarui setiap kali refresh.",
  "Random data (simulation)":
    "Data acak (simulasi)",
  "Soil Moisture":
    "Kelembapan Tanah",

  "Quick Guide":
    "Panduan Cepat",

  // Variasi karena tanda kutip bisa beda-beda (smart quotes / normal quotes)
  "“LIVE” is a visual indicator only (simulation).":
    "“LIVE” hanya indikator visual (simulasi).",
  "\"LIVE\" is a visual indicator only (simulation).":
    "\"LIVE\" hanya indikator visual (simulasi).",

  "Click “Refresh Data” to update moisture/temperature.":
    "Klik “Refresh Data” untuk memperbarui kelembapan/suhu.",
  "Click \"Refresh Data\" to update moisture/temperature.":
    "Klik \"Refresh Data\" untuk memperbarui kelembapan/suhu.",

  "You can place a dummy video/image in the camera area.":
    "Kamu bisa memasang video/gambar dummy di area kamera.",

  "Farm Overview — Live Camera":
    "Gambaran Lahan — Kamera Langsung",
  "Camera stream is not connected yet (placeholder only).":
    "Streaming kamera belum terhubung (hanya placeholder).",

  // =====================================================
  // Settings Page
  // =====================================================
  "Appearance, language preference, and session (stored in localStorage).":
    "Tampilan, preferensi bahasa, dan sesi (disimpan di localStorage).",

  "Preferences are stored in": "Preferensi disimpan di",
  "(simulation).": "(simulasi).",

  "Switch themes for better comfort in bright/dark environments.":
    "Ganti tema agar lebih nyaman di lingkungan terang/gelap.",
  "Language preference is stored as a demo setting.":
    "Preferensi bahasa disimpan sebagai pengaturan demo.",
  "Logout is simulated (no real session token).":
    "Logout hanya simulasi (tidak ada token sesi nyata).",

  "Appearance": "Tampilan",
  "Choose a theme for the dashboard.": "Pilih tema untuk dashboard.",
  "Theme": "Tema",
  "Light": "Terang",
  "Bright look (default).": "Tampilan cerah (default).",
  "Great for daylight use.": "Cocok untuk penggunaan siang hari.",
  "Dark": "Gelap",
  "Comfortable low-light theme.": "Tema nyaman untuk kondisi gelap.",
  "Best for night mode.": "Terbaik untuk mode malam.",

  // IMPORTANT: because <code> breaks the text into multiple text nodes
  "Theme is stored in": "Tema disimpan di",
  "with key": "dengan key",

  "Language": "Bahasa",
  "Save a language preference (demo).": "Simpan preferensi bahasa (demo).",
  "Locale": "Bahasa",
  "This setting stores a preference and shows an alert (simulation).":
    "Pengaturan ini menyimpan preferensi dan menampilkan alert (simulasi).",

  "Session": "Sesi",
  "Simple sign-out action (simulation).": "Aksi keluar sederhana (simulasi).",
  "Auth": "Auth",
  "Log out": "Keluar",
  "Shows a message (no real token).": "Menampilkan pesan (tidak ada token nyata).",
  "Log Out": "Keluar",

  "Account Information": "Informasi Akun",
  "Demo account info (simulation).": "Info akun demo (simulasi).",
  "Profile": "Profil",
  "*You can replace this account info with your team members.":
    "*Kamu bisa mengganti info akun ini dengan anggota timmu.",

  "Role": "Peran",
  "Project": "Proyek",
  "Status": "Status",

  // Footer variants
  "AgroVision • Team 06 • Simulation Dashboard": "AgroVision • Tim 06 • Dashboard Simulasi",
  "AgroVision • Team 06 • Settings (Simulation)": "AgroVision • Tim 06 • Pengaturan (Simulasi)",
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
