console.log("Dashboard JS loaded");

// Elemen-elemen yang sering dipakai
const timeFilter = document.querySelector("#time-filter");
const timeFilterLabel = document.querySelector("#time-filter-label");
const altitudeCanvas = document.querySelector("#altitude-chart");
const soilStatusLabel = document.querySelector("#soil-status-label");

// Fungsi buat generate data dummy altitude
function generateAltitudeData(range) {
  // range bisa: "1h", "6h", "24h", "7d"
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
    labels.push(`T${i + 1}`);
    // ketinggian random 10-60 meter
    data.push(10 + Math.round(Math.random() * 50));
  }

  return { labels, data };
}

// Inisialisasi chart
let altitudeChart;

function initChart(range) {
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

// Update label filter waktu
function updateTimeLabel(range) {
  let text = "";
  switch (range) {
    case "1h":
      text = "1 Jam Terakhir";
      break;
    case "6h":
      text = "6 Jam Terakhir";
      break;
    case "24h":
      text = "24 Jam Terakhir";
      break;
    case "7d":
      text = "7 Hari Terakhir";
      break;
  }
  timeFilterLabel.textContent = text;
}

// Simulasi status kelayakan tanah
function updateSoilStatus() {
  const nilai = Math.random(); // 0–1
  if (nilai > 0.4) {
    soilStatusLabel.textContent = "Layak Tanam";
    soilStatusLabel.className =
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700";
  } else {
    soilStatusLabel.textContent = "Tidak Layak Tanam";
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
