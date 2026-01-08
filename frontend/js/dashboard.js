console.log("Dashboard JS loaded");

/* ===============================
   CONFIG
================================= */
const TELEMETRY_URL = "http://192.168.137.62:5000/telemetry";
const REFRESH_INTERVAL = 1000; // 1 second

/* ===============================
   DOM ELEMENTS
================================= */
const altitudeCanvas = document.getElementById("altitude-chart");
const timeFilter = document.getElementById("time-filter");
const timeFilterLabel = document.getElementById("time-filter-label");
<<<<<<< HEAD

const batteryLabel = document.getElementById("drone-battery");
const heightLabel = document.getElementById("drone-altitude");
const areaLabel = document.getElementById("drone-area");
=======
const soilStatusLabel = document.getElementById("soil-status-label");

// NEW: Orientation elements (Pitch / Yaw / Roll)
const pitchEl = document.getElementById("drone-pitch");
const yawEl = document.getElementById("drone-yaw");
const rollEl = document.getElementById("drone-roll");
>>>>>>> d20fdd52b5bf5f9157ee71176e1feb67c51f5d7f

/* ===============================
   STATE
================================= */
let altitudeChart = null;

/* ===============================
   HELPERS
================================= */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString();
<<<<<<< HEAD
}

/* ===============================
   FETCH TELEMETRY
================================= */
async function fetchTelemetry() {
  try {
    const res = await fetch(TELEMETRY_URL, { cache: "no-store" });
    return await res.json();
  } catch (err) {
    console.error("Telemetry fetch failed:", err);
    return [];
  }
}

/* ===============================
   UPDATE TEXT DATA
================================= */
function updateDerivedData(last) {
  if (!last?.attitude) return;

  const pitch = last.attitude.pitch;
  const roll = last.attitude.roll;
  const yaw = last.attitude.yaw;

  if (batteryLabel) batteryLabel.textContent = `${yaw.toFixed(1)}%`;
  if (heightLabel) heightLabel.textContent = `${roll.toFixed(2)} m`;
  if (areaLabel) areaLabel.textContent = `${yaw.toFixed(2)} m²`;
}

/* ===============================
   CHART INITIALIZATION
================================= */
function initChart() {
  if (!altitudeCanvas || typeof Chart === "undefined") return;

  altitudeChart = new Chart(altitudeCanvas, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Altitude (m)",
          data: [],
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      animation: false, // IMPORTANT for real-time
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: { beginAtZero: false },
      },
    },
  });
}

/* ===============================
   UPDATE DASHBOARD
================================= */
async function loadDashboard() {
  const telemetry = await fetchTelemetry();
  if (!telemetry.length || !altitudeChart) return;

  // Update chart
  altitudeChart.data.labels = telemetry.map(t =>
    formatTime(t.timestamp)
  );

  altitudeChart.data.datasets[0].data = telemetry.map(
    t => t.position.alt
  );

  altitudeChart.update("none");

  // Update UI labels (last data only)
  updateDerivedData(telemetry[telemetry.length - 1]);
}

/* ===============================
   TIME FILTER (OPTIONAL)
================================= */
function updateTimeLabel(range) {
  const map = {
    "1h": "Last 1 hour",
    "6h": "Last 6 hours",
    "24h": "Last 24 hours",
    "7d": "Last 7 days",
  };
  if (timeFilterLabel) {
    timeFilterLabel.textContent = map[range] || "Last 1 hour";
  }
}

if (timeFilter) {
  timeFilter.addEventListener("change", () => {
    updateTimeLabel(timeFilter.value);
    loadDashboard();
=======
}

/* ===============================
   FETCH TELEMETRY
================================= */
async function fetchTelemetry() {
  try {
    const res = await fetch(TELEMETRY_URL, { cache: "no-store" });
    return await res.json();
  } catch (err) {
    console.error("Telemetry fetch failed:", err);
    return [];
  }
}

/* ===============================
   UPDATE ORIENTATION (PITCH/YAW/ROLL)
================================= */
function updateOrientation(last) {
  if (!last?.attitude) return;
  if (!pitchEl || !yawEl || !rollEl) return;

  const pitch = Number(last.attitude.pitch ?? 0);
  const roll = Number(last.attitude.roll ?? 0);
  const yaw = Number(last.attitude.yaw ?? 0);

  pitchEl.textContent = `${pitch.toFixed(1)}°`;
  yawEl.textContent = `${yaw.toFixed(0)}°`;
  rollEl.textContent = `${roll.toFixed(1)}°`;
}

/* ===============================
   SOIL STATUS (SIMULATION)
   - optional: update from telemetry if you have soil data later
================================= */
function updateSoilStatus() {
  if (!soilStatusLabel) return;
  const nilai = Math.random();

  if (nilai > 0.4) {
    soilStatusLabel.textContent = "Suitable";
    soilStatusLabel.className =
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700";
  } else {
    soilStatusLabel.textContent = "Not Suitable";
    soilStatusLabel.className =
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700";
  }
}

/* ===============================
   CHART INITIALIZATION
================================= */
function initChart() {
  if (!altitudeCanvas || typeof Chart === "undefined") return;

  altitudeChart = new Chart(altitudeCanvas, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Altitude (m)",
          data: [],
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      animation: false, // IMPORTANT for real-time
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: { beginAtZero: false },
      },
    },
>>>>>>> d20fdd52b5bf5f9157ee71176e1feb67c51f5d7f
  });
}

/* ===============================
<<<<<<< HEAD
=======
   UPDATE DASHBOARD
================================= */
async function loadDashboard() {
  const telemetry = await fetchTelemetry();
  if (!telemetry.length) return;

  // Update chart
  if (altitudeChart) {
    altitudeChart.data.labels = telemetry.map((t) => formatTime(t.timestamp));
    altitudeChart.data.datasets[0].data = telemetry.map((t) =>
      Number(t.position?.alt ?? 0)
    );
    altitudeChart.update("none");
  }

  // Update UI labels using last telemetry data
  const last = telemetry[telemetry.length - 1];
  updateOrientation(last);

  // Soil status simulation: update every refresh
  updateSoilStatus();
}

/* ===============================
   TIME FILTER (OPTIONAL)
================================= */
function updateTimeLabel(range) {
  const map = {
    "1h": "Last 1 hour",
    "6h": "Last 6 hours",
    "24h": "Last 24 hours",
    "7d": "Last 7 days",
  };
  if (timeFilterLabel) {
    timeFilterLabel.textContent = map[range] || "Last 1 hour";
  }
}

if (timeFilter) {
  timeFilter.addEventListener("change", () => {
    updateTimeLabel(timeFilter.value);
    loadDashboard();
  });
}

/* ===============================
>>>>>>> d20fdd52b5bf5f9157ee71176e1feb67c51f5d7f
   START REAL-TIME LOOP
================================= */
initChart();
updateTimeLabel("1h");
loadDashboard();
<<<<<<< HEAD
setInterval(loadDashboard, REFRESH_INTERVAL);
=======
setInterval(loadDashboard, REFRESH_INTERVAL);
>>>>>>> d20fdd52b5bf5f9157ee71176e1feb67c51f5d7f
