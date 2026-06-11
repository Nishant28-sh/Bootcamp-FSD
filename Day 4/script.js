/* ============================================================
   NIMBUS WEATHER — script.js
   Uses OpenWeatherMap API (current + 5-day forecast)
   ============================================================ */

// ── API Config ─────────────────────────────────────────────
const API_KEY = "5219e12cf5854ffba185a297f0ab1a9f"; // ← Replace with your key
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// ── DOM References ──────────────────────────────────────────
const cityInput    = document.getElementById("cityInput");
const searchBtn    = document.getElementById("searchBtn");
const btnSpinner   = document.getElementById("btnSpinner");
const btnLabel     = searchBtn.querySelector(".btn-label");

const errorCard    = document.getElementById("errorCard");
const errorTitle   = document.getElementById("errorTitle");
const errorSub     = document.getElementById("errorSub");

const dashboard    = document.getElementById("dashboard");
const welcomeState = document.getElementById("welcomeState");

const historyRow   = document.getElementById("historyRow");
const historyChips = document.getElementById("historyChips");

const themeToggle  = document.getElementById("themeToggle");
const themeIcon    = document.getElementById("themeIcon");
const htmlEl       = document.documentElement;
const bgLayer      = document.getElementById("bgLayer");

// Current-weather fields
const cityName     = document.getElementById("cityName");
const countryCode  = document.getElementById("countryCode");
const updateTime   = document.getElementById("updateTime");
const tempMain     = document.getElementById("tempMain");
const conditionText = document.getElementById("conditionText");
const conditionDesc = document.getElementById("conditionDesc");
const feelsLike    = document.getElementById("feelsLike");
const tempMin      = document.getElementById("tempMin");
const tempMax      = document.getElementById("tempMax");
const weatherIconLarge = document.getElementById("weatherIconLarge");
const humidity     = document.getElementById("humidity");
const windSpeed    = document.getElementById("windSpeed");
const pressure     = document.getElementById("pressure");
const visibility   = document.getElementById("visibility");
const sunrise      = document.getElementById("sunrise");
const sunset       = document.getElementById("sunset");
const forecastRow  = document.getElementById("forecastRow");

// ── Weather Icon Map ────────────────────────────────────────
const WEATHER_ICONS = {
  Clear:        "☀️",
  Clouds:       "☁️",
  Rain:         "🌧️",
  Drizzle:      "🌦️",
  Thunderstorm: "⛈️",
  Snow:         "❄️",
  Mist:         "🌫️",
  Fog:          "🌫️",
  Haze:         "🌁",
  Dust:         "🌪️",
  Smoke:        "🌫️",
  Sand:         "🌪️",
  Ash:          "🌋",
  Squall:       "💨",
  Tornado:      "🌪️",
};

// ── Background Theme Palettes (orb colors per condition) ────
const WEATHER_PALETTES = {
  Clear:        { orb1: "#1a3b6e", orb2: "#0e2244", orb3: "#1d5fa8" },
  Clouds:       { orb1: "#2e3340", orb2: "#1c2030", orb3: "#3a3f4e" },
  Rain:         { orb1: "#0d2444", orb2: "#091630", orb3: "#0f3460" },
  Drizzle:      { orb1: "#0d2444", orb2: "#0a1e38", orb3: "#12305a" },
  Thunderstorm: { orb1: "#2d1b5e", orb2: "#1a0f3a", orb3: "#3d2474" },
  Snow:         { orb1: "#2a3f5e", orb2: "#1e304d", orb3: "#3c5578" },
  Mist:         { orb1: "#2c3440", orb2: "#1e2530", orb3: "#38414f" },
  Fog:          { orb1: "#2c3440", orb2: "#1e2530", orb3: "#38414f" },
  Haze:         { orb1: "#3b2e1e", orb2: "#2a1f10", orb3: "#4a3920" },
  Default:      { orb1: "#1a3b6e", orb2: "#0e2244", orb3: "#142d55" },
};

const WEATHER_PALETTES_LIGHT = {
  Clear:        { orb1: "#93c5fd", orb2: "#bfdbfe", orb3: "#dbeafe" },
  Clouds:       { orb1: "#d1d5db", orb2: "#e5e7eb", orb3: "#f3f4f6" },
  Rain:         { orb1: "#93c5fd", orb2: "#6ea8e8", orb3: "#a8c8f0" },
  Drizzle:      { orb1: "#a8c8f0", orb2: "#bfdbfe", orb3: "#93c5fd" },
  Thunderstorm: { orb1: "#c4b5fd", orb2: "#ddd6fe", orb3: "#ede9fe" },
  Snow:         { orb1: "#e0f2fe", orb2: "#bae6fd", orb3: "#f0f9ff" },
  Mist:         { orb1: "#d1d5db", orb2: "#e5e7eb", orb3: "#f9fafb" },
  Fog:          { orb1: "#d1d5db", orb2: "#e5e7eb", orb3: "#f9fafb" },
  Default:      { orb1: "#93c5fd", orb2: "#bfdbfe", orb3: "#dbeafe" },
};

// ── Theme Management ────────────────────────────────────────
function getCurrentTheme() {
  return htmlEl.getAttribute("data-theme") || "dark";
}

function applyTheme(theme) {
  htmlEl.setAttribute("data-theme", theme);
  themeIcon.textContent = theme === "dark" ? "☾" : "☼";
  localStorage.setItem("nimbus-theme", theme);
}

themeToggle.addEventListener("click", () => {
  const next = getCurrentTheme() === "dark" ? "light" : "dark";
  applyTheme(next);
  // Re-apply orbs for current condition if dashboard is visible
  if (!dashboard.hidden && currentCondition) {
    applyWeatherPalette(currentCondition);
  }
});

// Init theme from localStorage
const savedTheme = localStorage.getItem("nimbus-theme");
if (savedTheme) applyTheme(savedTheme);

// ── Background Palette ──────────────────────────────────────
let currentCondition = null;

function applyWeatherPalette(condition) {
  currentCondition = condition;
  const isDark = getCurrentTheme() === "dark";
  const palettes = isDark ? WEATHER_PALETTES : WEATHER_PALETTES_LIGHT;
  const p = palettes[condition] || palettes["Default"];
  const root = document.documentElement;
  root.style.setProperty("--orb1", p.orb1);
  root.style.setProperty("--orb2", p.orb2);
  root.style.setProperty("--orb3", p.orb3);
}

// ── Search History ──────────────────────────────────────────
const HISTORY_KEY = "nimbus-history";
const HISTORY_MAX = 5;

function getHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; }
  catch { return []; }
}

function saveToHistory(city) {
  let history = getHistory();
  // Remove duplicate, prepend
  history = history.filter(c => c.toLowerCase() !== city.toLowerCase());
  history.unshift(city);
  if (history.length > HISTORY_MAX) history = history.slice(0, HISTORY_MAX);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function renderHistory() {
  const history = getHistory();
  if (history.length === 0) {
    historyRow.hidden = true;
    return;
  }
  historyRow.hidden = false;
  historyChips.innerHTML = "";
  history.forEach(city => {
    const chip = document.createElement("button");
    chip.className = "chip";
    chip.textContent = city;
    chip.addEventListener("click", () => {
      cityInput.value = city;
      fetchWeather(city);
    });
    historyChips.appendChild(chip);
  });
}

// ── Loading & Error Helpers ─────────────────────────────────
function setLoading(loading) {
  searchBtn.disabled = loading;
  btnLabel.hidden = loading;
  btnSpinner.hidden = !loading;
}

function showError(title, sub) {
  errorTitle.textContent = title;
  errorSub.textContent = sub;
  errorCard.hidden = false;
  dashboard.hidden = true;
  welcomeState.hidden = true;
  // Animate re-show
  errorCard.style.animation = "none";
  requestAnimationFrame(() => { errorCard.style.animation = ""; });
}

function hideError() {
  errorCard.hidden = true;
}

// ── Format Helpers ──────────────────────────────────────────
function formatTime(unixTimestamp, timezoneOffset) {
  // timezoneOffset is in seconds
  const ms = (unixTimestamp + timezoneOffset) * 1000;
  const d = new Date(ms);
  // UTC hours/minutes since we baked in the offset
  const h = d.getUTCHours();
  const m = String(d.getUTCMinutes()).padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

function formatUpdateTime(unixTimestamp) {
  const d = new Date(unixTimestamp * 1000);
  return d.toLocaleString(undefined, {
    weekday: "short", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
}

function getDayName(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { weekday: "short" });
}

// Round to 1 decimal if needed, else integer
function fmt(num) {
  const n = Math.round(num);
  return n > 0 ? `+${n}` : `${n}`;
}

// ── Main Fetch ──────────────────────────────────────────────
async function fetchWeather(city) {
  if (!city.trim()) return;
  setLoading(true);
  hideError();

  try {
    // Fetch current weather and forecast in parallel
    const [currentRes, forecastRes] = await Promise.all([
      fetch(`${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`),
      fetch(`${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`)
    ]);

    // Handle HTTP errors
    if (!currentRes.ok) {
      if (currentRes.status === 404) {
        showError("City not found", `"${city}" doesn't match any known location. Try a different spelling or nearby city.`);
      } else if (currentRes.status === 401) {
        showError("Invalid API key", "Please check your OpenWeatherMap API key in script.js.");
      } else {
        showError("Something went wrong", `Server responded with status ${currentRes.status}. Try again shortly.`);
      }
      setLoading(false);
      return;
    }

    const current  = await currentRes.json();
    const forecast = await forecastRes.json();

    renderCurrentWeather(current);
    renderForecast(forecast);

    // Save valid search to history
    saveToHistory(current.name);
    renderHistory();

    welcomeState.hidden = true;
    dashboard.hidden = false;
    dashboard.style.animation = "none";
    requestAnimationFrame(() => { dashboard.style.animation = ""; });

  } catch (err) {
    console.error(err);
    showError("Network error", "Could not reach the weather service. Please check your connection.");
  } finally {
    setLoading(false);
  }
}

// ── Render Current Weather ──────────────────────────────────
function renderCurrentWeather(data) {
  const condition = data.weather[0].main;
  const tz = data.timezone; // offset in seconds

  cityName.textContent    = data.name;
  countryCode.textContent = data.sys.country;
  updateTime.textContent  = `Updated ${formatUpdateTime(data.dt)}`;
  tempMain.textContent    = Math.round(data.main.temp);
  conditionText.textContent = condition;
  conditionDesc.textContent = data.weather[0].description;
  feelsLike.textContent   = `${Math.round(data.main.feels_like)}°C`;
  tempMin.textContent     = `${Math.round(data.main.temp_min)}°`;
  tempMax.textContent     = `${Math.round(data.main.temp_max)}°`;
  weatherIconLarge.textContent = WEATHER_ICONS[condition] || "🌤";

  humidity.textContent    = `${data.main.humidity}%`;
  windSpeed.textContent   = `${Math.round(data.wind.speed * 3.6)} km/h`; // m/s → km/h
  pressure.textContent    = `${data.main.pressure} hPa`;
  visibility.textContent  = data.visibility ? `${(data.visibility / 1000).toFixed(1)} km` : "—";
  sunrise.textContent     = formatTime(data.sys.sunrise, tz);
  sunset.textContent      = formatTime(data.sys.sunset, tz);

  // Update background palette
  applyWeatherPalette(condition);
}

// ── Render 5-Day Forecast ───────────────────────────────────
function renderForecast(data) {
  // API returns 3-hour intervals → pick one per day at ~noon
  const dailyMap = {};

  data.list.forEach(item => {
    const date = item.dt_txt.split(" ")[0]; // "YYYY-MM-DD"
    const hour = parseInt(item.dt_txt.split(" ")[1]);

    if (!dailyMap[date]) {
      dailyMap[date] = item; // First entry of the day
    }
    // Prefer the entry closest to 12:00
    if (Math.abs(hour - 12) < Math.abs(
      parseInt(dailyMap[date].dt_txt.split(" ")[1]) - 12
    )) {
      dailyMap[date] = item;
    }
  });

  const days = Object.entries(dailyMap).slice(1, 6); // Skip today, take 5

  forecastRow.innerHTML = "";
  days.forEach(([dateStr, item], idx) => {
    const condition = item.weather[0].main;
    const icon = WEATHER_ICONS[condition] || "🌤";
    const card = document.createElement("div");
    card.className = "forecast-card";
    card.style.animationDelay = `${idx * 0.07}s`;
    card.innerHTML = `
      <span class="forecast-day">${getDayName(dateStr)}</span>
      <span class="forecast-icon">${icon}</span>
      <span class="forecast-desc">${item.weather[0].description}</span>
      <div class="forecast-temps">
        <span class="forecast-high">${Math.round(item.main.temp_max)}°</span>
        <span class="forecast-low">${Math.round(item.main.temp_min)}°</span>
      </div>
    `;
    forecastRow.appendChild(card);
  });
}

// ── Event Listeners ─────────────────────────────────────────
searchBtn.addEventListener("click", () => {
  fetchWeather(cityInput.value.trim());
});

cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") fetchWeather(cityInput.value.trim());
});

// ── Init ────────────────────────────────────────────────────
renderHistory();

// Auto-search if last searched city exists
const lastHistory = getHistory();
if (lastHistory.length > 0) {
  cityInput.value = lastHistory[0];
  fetchWeather(lastHistory[0]);
}