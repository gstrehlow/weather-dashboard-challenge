const apiKey = "6521415cb1d9cc9d9f2e19624987cc73";
const $citySearch = $("#city-search");
const $searchBtn = $("#search-button");
const $currentWeather = $("#current-weather");
const $fiveDayForecast = $("#five-day-forecast");

function weatherApi(cityKey) {
    var coordinateUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityKey + "&limit=1&appid=" + apiKey;
    fetch(coordinateUrl)
}












































$($searchBtn).on("click", function(){console.log("click")} );