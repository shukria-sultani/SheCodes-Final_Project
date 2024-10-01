function refreshWeather(response) {
  let temperatureElement = document.querySelector("#temprature"); 
  let cityElement = document.querySelector("#cityname"); 
  let descriptionElement = document.querySelector(".description"); 
  let humidityElement = document.querySelector(".humidity"); 
  let windSpeedElement = document.querySelector(".wind"); 
  let iconElement = document.querySelector(".weatherIcon"); 

  let temperature = response.data.temperature.current;
  cityElement.innerHTML = response.data.city;
  descriptionElement.innerHTML = `${response.data.condition.description}`; 
  humidityElement.innerHTML = `Humidity: ${response.data.temperature.humidity}%`; 
  windSpeedElement.innerHTML = `Wind speed: ${response.data.wind.speed} m/s`; 
  temperatureElement.innerHTML = `Current: ${Math.round(temperature)}&deg;C`; 
  iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" class="weather-app-icon" />`; 
  getForecast(response.data.city); 
  showCurrentTime();
  
}

const showCurrentTime = ()=>{
    let currentTime = document.querySelector('.currentTime')
       let currentDate = new Date();
       let hour = currentDate.getHours();
       let minute = currentDate.getMinutes();
       let second = currentDate.getSeconds();
       let period = hour >= 12 ? 'PM' : 'AM';
       // Convert to 12-hour format
       hour = hour % 12 || 12; // Converts 0 to 12
       // Pad minutes and seconds with leading zeros
       minute = String(minute).padStart(2, '0');
       second = String(second).padStart(2, '0');
       currentTime.textContent = `${hour}:${minute}:${second} ${period}`;
}

function searchCity(city) {
  let apiKey = "b2a5adcct04b33178913oc335f405433"; 
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  
  axios.get(apiUrl)
      .then(refreshWeather)
      .catch(error => {
          console.error("Error fetching weather data:", error);
          alert("Could not fetch weather data. Please try again.");
      });
}

function handleSearchSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#searchbar");
  searchCity(searchInput.value);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}

function getForecast(city) {
  let apiKey = "b2a5adcct04b33178913oc335f405433"; 
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  
  axios.get(apiUrl)
      .then(displayForecast)
      .catch(error => {
          console.error("Error fetching forecast data:", error);
      });
}

function displayForecast(response) {
  let forecastHtml = "";
  let dailyForecasts = response.data.daily;

  if (dailyForecasts.length > 0) {
      forecastHtml += `
      <div class="weather-forecast-day">
          <div class="weather-forecast-date">Today</div>
          <div class="weather-forecast-temperature">
              <strong>High: ${Math.round(dailyForecasts[0].temperature.maximum)}º</strong>
          </div>
          <div class="weather-forecast-temperature">
              <strong>Low: ${Math.round(dailyForecasts[0].temperature.minimum)}º</strong>
          </div>
          <img src="${dailyForecasts[0].condition.icon_url}" class="weatherIcon" />
      </div>`;
  }

  for (let index = 1; index < Math.min(5, dailyForecasts.length); index++) {
      forecastHtml += `
      <div class="weather-forecast-day">
          <div class="weather-forecast-date">${formatDay(dailyForecasts[index].time)}</div>
          <div class="weather-forecast-temperature">
              <strong>High: ${Math.round(dailyForecasts[index].temperature.maximum)}ºC</strong>
          </div>
          <div class="weather-forecast-temperature">
              <strong>Low: ${Math.round(dailyForecasts[index].temperature.minimum)}ºC</strong>
          </div>
          <img src="${dailyForecasts[index].condition.icon_url}" class="weatherIcon" />
      </div>`;
  }

  let forecastElement = document.querySelector(".forcast"); 
  forecastElement.innerHTML = forecastHtml;
}

let searchFormElement = document.querySelector("form");
searchFormElement.addEventListener("submit", handleSearchSubmit);
searchCity("Bamian");