const apiKey = "6521415cb1d9cc9d9f2e19624987cc73";
const $citySearch = document.querySelector("#city-search");
const $searchBtn = $("#search-button");
const $currentWeather = $("#forecastList[0]-weather");
const $fiveDayForecast = $("#five-day-forecast");
const $cityResults = $("#city-results");
let forecastList = [];
let cityHistory = [];


function weatherApi(cityKey, isAdd) {
    cityKey = toTitleCase(cityKey);
    let coordinateUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityKey + "&limit=1&appid=" + apiKey;
    let lat = "";
    let long = "";
    fetch(coordinateUrl).then(function(response) {
        if (response.ok) {
            response.json().then((data)=> {
                lat = data[0].lat;
                long = data[0].lon;
                let weatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&units=imperial&exclude=minutely,hourly,alerts&appid=" + apiKey;
                fetch(weatherUrl).then(function(response){
                    if (response.ok) {
                        response.json().then((data)=> {
                             // Get the data we need
                            weatherData(data, cityKey);
                            if (isAdd === true) saveHistory(cityKey);
                            localStorageSave(cityKey);  
                        })                
                    }
                    else alert("Error! No weather.");
                })

            })
        }
        else alert("Error! No coordinates.");      
    })
}
function weatherData(data, cityKey) {
    forecastList[0] = new weather;
    let index = data.current;
    let icon = index.weather[0].icon;
    forecastList[0].icon = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
    forecastList[0].temp = index.temp;
    forecastList[0].wind = index.wind_speed;
    forecastList[0].humidity = index.humidity;
    forecastList[0].Uv = index.uvi;
    forecastList[0].cityName = cityKey;
    forecastList[0].date = moment().format('MM/DD/YY, h:mm a');
    console.log(forecastList[0]);
    forecastList[0].color = forecastList[0].getUvColor();
    forecastList[0].appendCurrentWeather();
    for (let i = 1; i < 6; i++) {
        index = data.daily[i];
        forecastList[i] = new weather;
        let icon = index.weather[0].icon;
        forecastList[i].icon = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
        forecastList[i].temp = index.temp.day;
        forecastList[i].wind = index.wind_speed;
        forecastList[i].humidity = index.humidity;
        forecastList[i].Uv = index.uvi;
        forecastList[i].cityName = cityKey;
        forecastList[i].date = moment().add(i,'d').format('MM/DD/YY');
        forecastList[i].appendForecastWeather(i);
        console.log(forecastList[i]);
    }
}

class weather {
    getUvColor() {
        if (this.Uv <= 3) return "uv-favorable";
        if (this.Uv <= 6) return "uv-moderate";
        if (this.Uv > 6) return "uv-severe";
    }

    appendCurrentWeather() {
        let currentWeather = $('#current-weather');
        let color = this.getUvColor();
        currentWeather.children('h1').empty().append(this.cityName + " " + this.date).append(' <img src=' + this.icon + ' />');
        currentWeather.children('h2').empty();
        currentWeather.children('h2')[0].append('Temp: ' + this.temp + '°F');
        currentWeather.children('h2')[1].append('Wind: ' + this.wind + ' MPH');
        currentWeather.children('h2')[2].append('Humidity: ' + this.humidity + ' %');
        currentWeather.children('h3').empty().append('UV Index: ' + this.Uv).addClass(color); 
    }
    appendForecastWeather(i) {
        let forecast = $('#forecast' + i);
        forecast.empty();
        forecast.append('<h2>', '<h3>', '<h3>', '<h3>');
        forecast.children('h2').append(this.date).append(' <img src=' + this.icon + ' />');
        forecast.children('h3')[0].append('Temp: ' + this.temp + '°F');
        forecast.children('h3')[1].append('Wind: ' + this.wind + ' MPH');
        forecast.children('h3')[2].append('Humidity: ' + this.humidity + ' %');
    }
}

function saveHistory(cityKey) {
    cityHistory.unshift(cityKey); // add to the beginning of the list
    $cityResults.empty();
    for (let i = 0; i < cityHistory.length; i++) {
        $cityResults.append('<button>').children('button')[i].append(cityHistory[i]);

    }
}

function createList(cityKey){
    cityHistory.unshift(cityKey); //add to the beginning of the list
    $cityResults.empty(); //empty current button list
    for (let i = 0; i < cityHistory.length; i++){
        $cityResults.append("<button>").children("button")[i].append(cityHistory[i]);
    }
}

function loadFunc(){
    let cityKey = JSON.parse(localStorage.getItem("current"));
    if (cityKey != null) weatherApi(cityKey,false);
    else weatherApi("Kansas City", false);
    let tempList = JSON.parse(localStorage.getItem("list"));
    if (tempList != null){
        for (let j = 0; j < tempList.length; j++){
            createList(tempList[j]);
        }
    }
}

function localStorageSave(currentCity){
    localStorage.setItem("current",JSON.stringify(currentCity));
    localStorage.setItem("list",JSON.stringify(cityHistory));
}

function getKey(event){
    event.preventDefault(); 
    let cityKey = $citySearch.value.trim();
    if (cityKey){ //viable string
        weatherApi(cityKey, true);
        $citySearch.value = ""; //set to default
    }
    else alert("Please enter a viable city!");
}

function historyClick(event) {
    event.preventDefault();
    let cityKey = event.target.innerHTML;
    console.log(cityKey);
    if (cityKey){
        weatherApi(cityKey, false);
    }
    else alert("Please enter a viable city!");
}

function toTitleCase(str) {
    var words = str.split(' ');
    var titleCaseWords = [];
  
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      titleCaseWords.push(word[0].toUpperCase() + word.slice(1).toLowerCase());
    }
    return titleCaseWords.join(' ');
}

loadFunc();
$($cityResults).on("click", historyClick);
$($searchBtn).on("click", getKey);