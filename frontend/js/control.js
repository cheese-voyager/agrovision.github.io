console.log("Control Panel JS loaded");

const propButtons = document.querySelectorAll(".prop-btn");
const allButton = document.querySelector("#all-propellers");
const logList = document.querySelector("#log-list");

// Store each propeller state
const propellerStatus = {
  A: false,
  B: false,
  C: false,
  D: false,
};

function nowTime() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

function addLog(message) {
  if (!logList) return;
  const li = document.createElement("li");
  li.textContent = `[${nowTime()}] ${message}`;
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
    addLog(`Propeller ${prop} turned ${newStatus ? "ON" : "OFF"}`);
  });
});

// Event untuk All Propeller
if (allButton) {
  allButton.addEventListener("click", () => {
    // UX: if ALL are ON => turn OFF; otherwise turn ON all
    const values = Object.values(propellerStatus);
    const allOn = values.every(Boolean);
    const turnOn = !allOn;

    propButtons.forEach((btn) => {
      const prop = btn.getAttribute("data-prop");
      propellerStatus[prop] = turnOn;
      updateButtonVisual(btn, turnOn);
    });

    addLog(turnOn ? "All propellers turned ON" : "All propellers turned OFF");
  });
}
