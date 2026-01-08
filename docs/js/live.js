console.log("Live Camera JS loaded");

const moistureSpan = document.querySelector("#live-soil-moisture");
const moistureBar = document.querySelector("#live-soil-moisture-bar");
const tempSpan = document.querySelector("#live-soil-temp");
const statusSpan = document.querySelector("#live-soil-status");
const refreshBtn = document.querySelector("#refresh-soil");

function refreshSoilData() {
  // Random demo data
  const moisture = 30 + Math.round(Math.random() * 50); // 30-80%
  const temp = 20 + Math.round(Math.random() * 10); // 20-30°C

  if (moistureSpan) moistureSpan.textContent = `${moisture}%`;
  if (moistureBar) moistureBar.style.width = `${moisture}%`;
  if (tempSpan) tempSpan.textContent = `${temp}°C`;

  if (!statusSpan) return;

  if (moisture >= 40 && moisture <= 70) {
    statusSpan.textContent = "Suitable";
    statusSpan.className =
      "inline-flex items-center px-2 py-1 rounded-full bg-green-50 text-green-700 font-semibold";
  } else {
    statusSpan.textContent = "Not Suitable";
    statusSpan.className =
      "inline-flex items-center px-2 py-1 rounded-full bg-red-50 text-red-700 font-semibold";
  }
}

if (refreshBtn) {
  refreshBtn.addEventListener("click", refreshSoilData);
}

// Run once on load
refreshSoilData();
