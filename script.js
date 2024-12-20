$(document).ready(function () {
  const apiKey = "fc598b6a4d65a95e4d481065c9123c43";

  // Function to fetch weather data from OpenWeather API
  function fetchWeather(city) {
    const queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      // Display current weather and 5-day forecast
      displayCurrentWeather(response);
      displayForecast(response);
    });
  }

  // Function to display current weather information
  function displayCurrentWeather(data) {
    const currentWeather = data.list[0];
    const weatherIcon = `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`;
    const weatherHTML = `
        <h2>${data.city.name} (${dayjs().format("M/D/YYYY")})</h2>
        <img src="${weatherIcon}" alt="Weather icon">
        <p>Temp: ${currentWeather.main.temp} °F</p>
        <p>Wind: ${currentWeather.wind.speed} MPH</p>
        <p>Humidity: ${currentWeather.main.humidity} %</p>
      `;
    $("#current-weather").html(weatherHTML);
  }

  // Function to display 5-day weather forecast
  function displayForecast(data) {
    let forecastHTML = "";
    for (let i = 1; i < data.list.length; i += 8) {
      const day = data.list[i];
      const weatherIcon = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
      forecastHTML += `
          <div>
            <h3>${dayjs(day.dt_txt).format("M/D/YYYY")}</h3>
            <img src="${weatherIcon}" alt="Weather icon">
            <p>Temp: ${day.main.temp} °F</p>
            <p>Wind: ${day.wind.speed} MPH</p>
            <p>Humidity: ${day.main.humidity} %</p>
          </div>
        `;
    }
    $("#forecast").html(forecastHTML);
  }

  // Function to save search history to localStorage
  function saveSearchHistory(city) {
    let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    if (!searchHistory.includes(city)) {
      searchHistory.push(city);
      localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
      updateSearchHistory();
    }
  }

  // Function to update search history display
  function updateSearchHistory() {
    const searchHistory =
      JSON.parse(localStorage.getItem("searchHistory")) || [];
    $("#search-history").html("");
    searchHistory.forEach(function (city) {
      const cityButton = $("<button>").text(city).addClass("city-btn");
      $("#search-history").append(cityButton);
    });
  }

  // Event listener for search button
  $("#search-btn").on("click", function () {
    const city = $("#city-input").val().trim();
    if (city) {
      fetchWeather(city);
      saveSearchHistory(city);
      $("#city-input").val("");
    }
  });

  // Event listener for search history buttons
  $("#search-history").on("click", ".city-btn", function () {
    const city = $(this).text();
    fetchWeather(city);
  });

  // Initial call to update search history display
  updateSearchHistory();
});
