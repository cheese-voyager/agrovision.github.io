(() => {
  "use strict";

  console.log("Dashboard JS loaded");

  /* ===============================
     CONFIG
  ================================= */
  const API_BASE = "http://192.168.137.6:5000";
  const ENDPOINT_LATEST = `${API_BASE}/get_attitude`; // expected: { pitch,yaw,roll,altitude,soil_status,timestamp? }
  const REFRESH_INTERVAL = 500; // ms (lebih aman dari 100ms biar ga ngegas)

  /* ===============================
     DOM ELEMENTS
  ================================= */
  const altitudeCanvas = document.getElementById("altitude-chart");
  const timeFilter = document.getElementById("time-filter");
  const timeFilterLabel = document.getElementById("time-filter-label");

  const droneStatusEl = document.getElementById("drone-status");
  const droneStatusDot = document.getElementById("drone-status-dot");

  const soilStatusLabel = document.getElementById("soil-status-label");

  const pitchEl = document.getElementById("drone-pitch");
  const yawEl = document.getElementById("drone-yaw");
  const rollEl = document.getElementById("drone-roll");

  const peakAltEl = document.getElementById("peak-alt");
  const avgAltEl = document.getElementById("avg-alt");
  const stabilityEl = document.getElementById("stability-label");

  /* ===============================
     STATE
  ================================= */
  let altitudeChart = null;
  let points = []; // { t: Date, alt: number }
  let timer = null;

  /* ===============================
     HELPERS
  ================================= */
  function setOnline(isOnline) {
    if (droneStatusEl) droneStatusEl.textContent = isOnline ? "Online" : "Offline";
    if (droneStatusDot) {
      droneStatusDot.className = isOnline
        ? "inline-flex h-2 w-2 rounded-full bg-emerald-500"
        : "inline-flex h-2 w-2 rounded-full bg-rose-500";
    }
  }

  function formatTime(ts) {
    try {
      return new Date(ts).toLocaleTimeString();
    } catch {
      return new Date().toLocaleTimeString();
    }
  }

  function rangeToMaxPoints(range) {
    // Ini “window” chart, bukan history 1 jam beneran (karena endpoint history belum pasti).
    // Kalau backend kamu punya endpoint history, nanti kita bisa ganti jadi fetch series.
    const map = {
      "1h": 120,   // ~1 menit kalau refresh 500ms
      "6h": 240,
      "24h": 360,
      "7d": 480,
    };
    return map[range] || 120;
  }

  function updateTimeLabel(range) {
    const map = {
      "1h": "Last 1 hour",
      "6h": "Last 6 hours",
      "24h": "Last 24 hours",
      "7d": "Last 7 days",
    };
    if (timeFilterLabel) timeFilterLabel.textContent = map[range] || "Last 1 hour";
  }

  function setSoilStatus(value) {
    if (!soilStatusLabel) return;

    const v = String(value ?? "").trim();
    const isSuitable = v.toLowerCase() === "suitable" || v.toLowerCase() === "good";

    soilStatusLabel.textContent = v || "—";
    soilStatusLabel.className = isSuitable
      ? "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
      : "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300";
  }

  function setOrientation({ pitch, yaw, roll }) {
    if (pitchEl) pitchEl.textContent = Number.isFinite(pitch) ? `${pitch.toFixed(1)}°` : "—";
    if (yawEl) yawEl.textContent = Number.isFinite(yaw) ? `${yaw.toFixed(0)}°` : "—";
    if (rollEl) rollEl.textContent = Number.isFinite(roll) ? `${roll.toFixed(1)}°` : "—";
  }

  function computeStats(values) {
    if (!values.length) return { peak: null, avg: null, stability: null };

    let peak = -Infinity;
    let sum = 0;
    for (const v of values) {
      if (v > peak) peak = v;
      sum += v;
    }
    const avg = sum / values.length;

    // very simple “stability”: based on average absolute difference
    let diffSum = 0;
    for (let i = 1; i < values.length; i++) {
      diffSum += Math.abs(values[i] - values[i - 1]);
    }
    const avgDiff = values.length > 1 ? diffSum / (values.length - 1) : 0;

    let stability = "Good";
    if (avgDiff > 2.5) stability = "Unstable";
    else if (avgDiff > 1.2) stability = "Fair";

    return { peak, avg, stability };
  }

  /* ===============================
     CHART
  ================================= */
  function initChart() {
    if (!altitudeCanvas || typeof Chart === "undefined") return;

    const ctx = altitudeCanvas.getContext("2d");
    altitudeChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "Altitude (m)",
            data: [],
            fill: false,
            tension: 0.35,
            borderWidth: 2,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        animation: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: false },
        },
      },
    });
  }

  function renderChart() {
    if (!altitudeChart) return;

    const labels = points.map((p) => formatTime(p.t));
    const values = points.map((p) => p.alt);

    altitudeChart.data.labels = labels;
    altitudeChart.data.datasets[0].data = values;
    altitudeChart.update("none");

    const { peak, avg, stability } = computeStats(values);

    if (peakAltEl) peakAltEl.textContent = peak == null ? "—" : `≈ ${peak.toFixed(1)} m`;
    if (avgAltEl) avgAltEl.textContent = avg == null ? "—" : `≈ ${avg.toFixed(1)} m`;
    if (stabilityEl) stabilityEl.textContent = stability || "—";
  }

  /* ===============================
     FETCH + LOOP
  ================================= */
  async function fetchLatest() {
    const res = await fetch(ENDPOINT_LATEST, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  async function tick() {
    try {
      const data = await fetchLatest();

      setOnline(true);

      const pitch = Number(data.pitch);
      const yaw = Number(data.yaw);
      const roll = Number(data.roll);
      setOrientation({
        pitch: Number.isFinite(pitch) ? pitch : NaN,
        yaw: Number.isFinite(yaw) ? yaw : NaN,
        roll: Number.isFinite(roll) ? roll : NaN,
      });

      setSoilStatus(data.soil_status);

      const altitude = Number(data.altitude);
      const ts = data.timestamp ? data.timestamp : Date.now();

      if (Number.isFinite(altitude)) {
        points.push({ t: ts, alt: altitude });

        const maxPoints = rangeToMaxPoints(timeFilter ? timeFilter.value : "1h");
        if (points.length > maxPoints) points = points.slice(points.length - maxPoints);
      }

      renderChart();
    } catch (err) {
      console.error("Telemetry fetch failed:", err);
      setOnline(false);
    }
  }

  function start() {
    initChart();
    updateTimeLabel(timeFilter ? timeFilter.value : "1h");

    if (timeFilter) {
      timeFilter.addEventListener("change", () => {
        updateTimeLabel(timeFilter.value);
        // optional: reset chart window on range change
        const maxPoints = rangeToMaxPoints(timeFilter.value);
        if (points.length > maxPoints) points = points.slice(points.length - maxPoints);
        renderChart();
      });
    }

    // first tick now
    tick();

    // loop
    if (timer) clearInterval(timer);
    timer = setInterval(tick, REFRESH_INTERVAL);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
