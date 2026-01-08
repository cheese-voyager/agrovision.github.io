console.log("Dashboard JS loaded");

// Common elements (guarded so the script won't error if the DOM changes)
const timeFilter = document.querySelector("#time-filter");
const timeFilterLabel = document.querySelector("#time-filter-label");
const altitudeCanvas = document.querySelector("#altitude-chart");
const soilStatusLabel = document.querySelector("#soil-status-label");

// Fungsi buat generate data dummy altitude
function generateAltitudeData(range) {
  // range: "1h", "6h", "24h", "7d"
  let points;

  switch (range) {
    case "1h":
      points = 10;
      break;
    case "6h":
      points = 20;
      break;
    case "24h":
      points = 24;
      break;
    case "7d":
      points = 14;
      break;
    default:
      points = 10;
  }

  const labels = [];
  const data = [];

  for (let i = 0; i < points; i++) {
    labels.push(`P${i + 1}`);
    // random altitude 10-60m
    data.push(10 + Math.round(Math.random() * 50));
  }

  return { labels, data };
}

// Inisialisasi chart
let altitudeChart;

function initChart(range) {
  if (!altitudeCanvas) return;
  if (typeof Chart === "undefined") {
    console.warn("Chart.js is not available. Make sure the CDN script is loaded.");
    return;
  }
  const { labels, data } = generateAltitudeData(range);

  if (altitudeChart) {
    altitudeChart.destroy();
  }

  altitudeChart = new Chart(altitudeCanvas, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Altitude (m)",
          data: data,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          ticks: {
            font: {
              size: 10,
            },
          },
        },
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

// Update time range label
function updateTimeLabel(range) {
  let text = "";
  switch (range) {
    case "1h":
      text = "Last 1 hour";
      break;
    case "6h":
      text = "Last 6 hours";
      break;
    case "24h":
      text = "Last 24 hours";
      break;
    case "7d":
      text = "Last 7 days";
      break;
    default:
      text = "Last 1 hour";
  }
  if (timeFilterLabel) timeFilterLabel.textContent = text;
}

// Simulate soil suitability
function updateSoilStatus() {
  if (!soilStatusLabel) return;
  const nilai = Math.random(); // 0–1
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

// Event: ketika dropdown ganti
if (timeFilter) {
  timeFilter.addEventListener("change", function () {
    const value = timeFilter.value;
    updateTimeLabel(value);
    initChart(value);
    updateSoilStatus();
  });
}

// Inisialisasi awal
initChart("1h");
updateTimeLabel("1h");
updateSoilStatus();
