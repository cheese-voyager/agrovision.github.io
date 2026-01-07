console.log("Settings JS loaded");

const themeLightBtn = document.querySelector("#theme-light");
const themeDarkBtn = document.querySelector("#theme-dark");
const languageSelect = document.querySelector("#language-select");
const logoutBtn = document.querySelector("#logout-btn");

// Simpel: kita simpan preferensi di localStorage
function setTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("bg-slate-900", "text-slate-100");
    document.body.classList.remove("bg-slate-50", "text-slate-900");
  } else {
    document.body.classList.add("bg-slate-50", "text-slate-900");
    document.body.classList.remove("bg-slate-900", "text-slate-100");
  }
  localStorage.setItem("agrovision-theme", theme);
}

function loadTheme() {
  const theme = localStorage.getItem("agrovision-theme") || "light";
  setTheme(theme);
}

function setLanguage(lang) {
  localStorage.setItem("agrovision-lang", lang);
  alert("Bahasa di-set ke: " + (lang === "id" ? "Bahasa Indonesia" : "English") +
    " (simulasi, teks belum benar-benar diterjemahkan).");
}

function loadLanguage() {
  const lang = localStorage.getItem("agrovision-lang") || "id";
  if (languageSelect) {
    languageSelect.value = lang;
  }
}

// Event handler
if (themeLightBtn) {
  themeLightBtn.addEventListener("click", () => setTheme("light"));
}
if (themeDarkBtn) {
  themeDarkBtn.addEventListener("click", () => setTheme("dark"));
}
if (languageSelect) {
  languageSelect.addEventListener("change", () => setLanguage(languageSelect.value));
}
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    alert("Logout berhasil (simulasi). Di sistem nyata, ini akan menghapus token sesi.");
  });
}

// Inisialisasi di awal
loadTheme();
loadLanguage();
