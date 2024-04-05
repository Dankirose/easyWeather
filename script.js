// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key} link

// 1eb4d6e612ee0e110e24ba230e7bc642 my api key

const APIKEY = "1eb4d6e612ee0e110e24ba230e7bc642";
const APIUrl = "https://api.openweathermap.org/data/2.5/weather";
const finder = document.querySelector(".finder");
const API_KEY_IPFI = "at_OWugFOrCc2JqaEYsirjAf14ynIVFE";
const form = document.querySelector("form");
async function getWeather() {
  const city = document.getElementById("cityInput").value;
  const requestUrl = `${APIUrl}?q=${city}&appid=${APIKEY}&units=metric`;
  try {
    const response = await fetch(requestUrl);
    if (!response.ok) {
      throw new Error("City not found");
    }
    const data = await response.json();

    finder.innerHTML = `
      <img src="https://openweathermap.org/img/wn/${
        data.weather[0].icon
      }.png" alt="#">
      <div>
      <p class='temp'>${Math.ceil(data.main.temp)}°C</p>
      <h2>Weather in ${city}</h2>
      <p>${data.weather[0].description}</p>
      <button class='change'>Change City</button>
      </div>
    `;
    const changeCityBtn = finder.querySelector(".change");
    changeCityBtn.addEventListener("click", function () {
      renderSearch();
    });
  } catch (error) {
    finder.innerHTML = `
      <div>
      <h2>Ooops. Something went wrong.</h2>
      <p>${error.message}</p>
      <button class='change'>Try Again</button>
      </div>
    `;
    changeCityBtn = finder.querySelector(".change");
    changeCityBtn.addEventListener("click", function () {
      renderSearch();
    });
  }
}

function renderSearch() {
  finder.innerHTML = `
      <form action="#">
      <input type="text" id="cityInput" placeholder="Enter city" />
      <button onclick="getWeather()">FIND</button>
      </form>
  `;
}

navigator.geolocation.getCurrentPosition(
  async (position) => {
    const lat = position.coords.latitude;
    const long = position.coords.longitude;
    const response = await fetch(
      `${APIUrl}?lat=${lat}&lon=${long}&appid=${APIKEY}&units=metric`
    );
    if (response.ok) {
      const data = await response.json();
      const city = data.name;
      updateWeatherDisplay(city, data);
    } else {
      const data = await response.json();
      const city = data.name;
      errorWeatherDisplay(city, data);
    }
  },
  (err) => errorWeatherDisplay()
);

function updateWeatherDisplay(city, data) {
  finder.innerHTML = `
    <img src="https://openweathermap.org/img/wn/${
      data.weather[0].icon
    }.png" alt="#">
    <div>
      <p class='temp'>${Math.ceil(data.main.temp)}°C</p>
      <h2>Weather in ${city}</h2>
      <p> ${data.weather[0].description}</p>
      <button class='change'>Change City</button>
    </div>
  `;
  const changeCityBtn = finder.querySelector(".change");
  changeCityBtn.addEventListener("click", function () {
    renderSearch();
  });
}

async function errorWeatherDisplay() {
  const requestUrl2 = await fetch(
    `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY_IPFI}`
  );
  const ipData = await requestUrl2.json();
  console.log(ipData);
  const lat = ipData.location.lat;
  const long = ipData.location.lng;
  const response = await fetch(
    `${APIUrl}?lat=${lat}&lon=${long}&appid=${APIKEY}&units=metric`
  );
  const data = await response.json();
  const city = data.name;
  updateWeatherDisplay(city, data);
}

const cityInput = document.getElementById("cityInput");
cityInput.addEventListener("submit", function (e) {
  e.preventDefault();
  getWeather();
});
