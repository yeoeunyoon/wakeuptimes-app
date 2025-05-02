const clcBtn = document.getElementById("calc-btn");
const refreshBtn = document.getElementById("refresh-btn");
const returnBtn = document.getElementById("return-btn");
const wakeUpHoursDiv = document.getElementById("wakeup-hours-div");
const promptSection = document.getElementById("prompt-section");
const imageContainer = document.getElementById("img-container");
const resultSection = document.getElementById("result-section");
const themeToggle = document.getElementById("theme-toggle");
const bedtimeForm = document.getElementById("bedtime-form");
const bedtimeResult = document.getElementById("bedtime-result");
const bedtimeHoursDiv = document.getElementById("bedtime-hours-div");

// Theme toggle functionality
themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", newTheme);
  themeToggle.textContent = newTheme === "light" ? "🌙" : "☀️";
  localStorage.setItem("theme", newTheme);
});

// Load saved theme
const savedTheme = localStorage.getItem("theme") || "dark";
document.documentElement.setAttribute("data-theme", savedTheme);
themeToggle.textContent = savedTheme === "light" ? "🌙" : "☀️";

clcBtn.addEventListener("click", calcWakeUpTimes);
refreshBtn.addEventListener("click", calcWakeUpTimes);
returnBtn.addEventListener("click", () => {
  promptSection.classList.remove("hidden");
  imageContainer.classList.remove("hidden");
  resultSection.classList.add("hidden");
  bedtimeResult.classList.add("hidden");
});

// Bedtime calculation form submission
bedtimeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const wakeTime = document.getElementById("wake-time").value;
  if (wakeTime) {
    calcBedtimes(wakeTime);
  }
});

function calcWakeUpTimes() {
  const fallAsleepTime = new Date();
  fallAsleepTime.setMinutes(fallAsleepTime.getMinutes() + 14);

  const wakeUpTime = new Date(fallAsleepTime);
  wakeUpHoursDiv.innerHTML = "";
  for (let i = 1; i <= 6; i++) {
    wakeUpTime.setMinutes(wakeUpTime.getMinutes() + 90);
    const wakeUpTimeString = wakeUpTime.toLocaleTimeString("en-US", {
      timeStyle: "short",
    });
    const cycleDiv = document.createElement("div");
    cycleDiv.classList.add("cycle");
    cycleDiv.setAttribute("id", `cycle-${i}`);
    cycleDiv.textContent = wakeUpTimeString;
    wakeUpHoursDiv.appendChild(cycleDiv);
  }

  promptSection.classList.add("hidden");
  imageContainer.classList.add("hidden");
  resultSection.classList.remove("hidden");
}

function calcBedtimes(wakeTime) {
  const [hours, minutes] = wakeTime.split(":").map(Number);
  const wakeUpDate = new Date();
  wakeUpDate.setHours(hours, minutes, 0, 0);

  // If wake time is earlier than current time, assume it's for tomorrow
  if (wakeUpDate < new Date()) {
    wakeUpDate.setDate(wakeUpDate.getDate() + 1);
  }

  const bedtimeDate = new Date(wakeUpDate);
  bedtimeHoursDiv.innerHTML = "";

  // Calculate 6 bedtimes (6 cycles before wake time)
  for (let i = 6; i >= 1; i--) {
    bedtimeDate.setTime(wakeUpDate.getTime() - (i * 90 + 14) * 60000);
    const bedtimeString = bedtimeDate.toLocaleTimeString("en-US", {
      timeStyle: "short",
    });
    const cycleDiv = document.createElement("div");
    cycleDiv.classList.add("cycle");
    cycleDiv.setAttribute("id", `bedtime-${i}`);
    cycleDiv.textContent = bedtimeString;
    bedtimeHoursDiv.appendChild(cycleDiv);
  }

  bedtimeResult.classList.remove("hidden");
}