// Format Date Functions //
function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = hours12();

  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  function hours12() {
    return (date.getHours() + 24) % 12 || 12;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

// Forecast Element Functions //
function displayForecast() {
  let forecastElement = document.querySelector("#forecast");

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let forecastHTML = `<div class="row">`;
  days.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `
      <div class="col-2">
        <div class="weather-forecast-date">${day}</div>
        <img
          src="http://openweathermap.org/img/wn/50d@2x.png"
          alt=""
          width="36"
        />
        <div class="weather-forecast-temp">
          <span class="high-temp">18°</span>
          <span class="low-temp">12°</span>
        </div>
      </div>`;
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = `6c5702b8e0bdf208e797742914ea7cea`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}`;
  axios.get(apiUrl).then(displayForecast);
}

// Weather Overview Functions (Temperature, Description, City, Date) //
function displayTemperature(response) {
  let temperatureElement = document.querySelector(`#temperature`);
  temperatureElement.innerHTML = Math.round(response.data.main.temp);

  let cityElement = document.querySelector(`#city`);
  cityElement.innerHTML = response.data.name;

  let descriptionElement = document.querySelector(`#description`);
  descriptionElement.innerHTML = response.data.weather[0].description;

  let humidityElement = document.querySelector(`#humidity`);
  humidityElement.innerHTML = response.data.main.humidity;

  let windElement = document.querySelector(`#wind`);
  windElement.innerHTML = Math.round(response.data.wind.speed);

  let dateElement = document.querySelector("#date");
  dateElement.innerHTML = formatDate(response.data.dt * 1000);

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);

  fahrenheitTemperature = response.data.main.temp;
}

// Search Bar Functions //
function search(city) {
  let apiKey = `6c5702b8e0bdf208e797742914ea7cea`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

// Temperature Conversion Functions //
function displayCelsiusTemperature(event) {
  event.preventDefault();
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
  let celsiusTemperature = ((fahrenheitTemperature - 32) * 5) / 9;
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

let fahrenheitTemperature = null;

// Events and CTA's//
let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

search("Seattle");
