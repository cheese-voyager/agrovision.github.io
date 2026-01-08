console.log("Control Panel JS loaded");

const propButtons = document.querySelectorAll(".prop-btn");
const allButton = document.querySelector("#all-propellers");
const logList = document.querySelector("#log-list");

// Simpan status tiap propeller
const propellerStatus = {
  A: false,
  B: false,
  C: false,
  D: false,
};

function addLog(message) {
  if (!logList) return;
  const li = document.createElement("li");
  li.textContent = message;
  logList.prepend(li); // prepend biar yang terbaru di atas
}

function updateButtonVisual(button, isOn) {
  const statusSpan = button.querySelector(".status-text");
  if (!statusSpan) return;

  if (isOn) {
    statusSpan.textContent = "ON";
    button.classList.remove("border", "bg-white");
    button.classList.add("bg-green-50", "border", "border-green-500");
  } else {
    statusSpan.textContent = "OFF";
    button.classList.remove("bg-green-50", "border-green-500");
    button.classList.add("bg-white", "border");
  }
}

// Event untuk tombol A–D
propButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const prop = btn.getAttribute("data-prop");
    const current = propellerStatus[prop];
    const newStatus = !current;
    propellerStatus[prop] = newStatus;

    updateButtonVisual(btn, newStatus);
    addLog(`Propeller ${prop} di-${newStatus ? "ON" : "OFF"}-kan`);
  });
});

// Event untuk All Propeller
if (allButton) {
  allButton.addEventListener("click", () => {
    // cek apakah sebagian besar OFF ? kalau iya -> ON semua, kalau tidak -> OFF semua
    const values = Object.values(propellerStatus);
    const onCount = values.filter((v) => v).length;
    const turnOn = onCount === 0;

    propButtons.forEach((btn) => {
      const prop = btn.getAttribute("data-prop");
      propellerStatus[prop] = turnOn;
      updateButtonVisual(btn, turnOn);
    });

    addLog(turnOn ? "Semua propeller ON" : "Semua propeller OFF");
  });
}
