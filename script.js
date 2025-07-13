const apiKey = "2d069609f2c436cd56d7104cac4f0cf8";

let map;
let marker;

function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (city === "") {
    document.getElementById("weatherResult").innerHTML = "❗ Please enter a city name.";
    return;
  }
  fetchWeather(city);
}

function getWeatherByLocation() {
  navigator.geolocation.getCurrentPosition((pos) => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    fetchWeatherByCoords(lat, lon);
  }, () => {
    document.getElementById("weatherResult").innerHTML = "❌ Location permission denied.";
  });
}

function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      displayWeather(data);
      fetchForecast(data.coord.lat, data.coord.lon);
      showMap(data.coord.lat, data.coord.lon);
    })
    .catch(() => {
      document.getElementById("weatherResult").innerHTML = "❌ City not found!";
    });
}

function fetchWeatherByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      displayWeather(data);
      fetchForecast(lat, lon);
      showMap(lat, lon);
    });
}

function displayWeather(data) {
  const result = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <p>🌡️ <strong>${data.main.temp} °C</strong></p>
    <p>🌥️ ${data.weather[0].description}</p>
    <p>💧 Humidity: ${data.main.humidity}%</p>
    <p>💨 Wind: ${data.wind.speed} m/s</p>
  `;
  document.getElementById("weatherResult").innerHTML = result;
}

function fetchForecast(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const forecastContainer = document.getElementById("forecastResult");
      forecastContainer.innerHTML = "";

      for (let i = 0; i < data.list.length; i += 8) {
        const item = data.list[i];
        const date = new Date(item.dt * 1000);
        const forecastItem = `
          <div class="forecast-item">
            <p><strong>${date.toDateString().slice(0, 10)}</strong></p>
            <p>🌡️ ${item.main.temp} °C</p>
            <p>${item.weather[0].main}</p>
          </div>
        `;
        forecastContainer.innerHTML += forecastItem;
      }
    });
}

function showMap(lat, lon) {
  if (!map) {
    map = L.map('map').setView([lat, lon], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    marker = L.marker([lat, lon]).addTo(map);
  } else {
    map.setView([lat, lon], 10);
    marker.setLatLng([lat, lon]);
  }
}

// Dark mode toggle
document.getElementById('themeToggle').addEventListener('change', function () {
  document.body.classList.toggle('dark', this.checked);
});
