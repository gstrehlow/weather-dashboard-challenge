const apiKey = "6521415cb1d9cc9d9f2e19624987cc73";
const $citySearch = $("#city-search");
const $searchBtn = $("#search-button");
const $currentWeather = $("#forecastList[0]-weather");
const $fiveDayForecast = $("#five-day-forecast");
let forecastList = [];


function weatherApi(cityKey) {
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
    for (let i = 1; i < 6; i++) {
        index = data.daily[i];
        forecastList[i] = new weather;
        let icon = index.weather[0].icon;
        forecastList[i].icon = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
        forecastList[i].temp = index.temp;
        forecastList[i].wind = index.wind_speed;
        forecastList[i].humidity = index.humidity;
        forecastList[i].Uv = index.uvi;
        forecastList[i].cityName = cityKey;
        forecastList[i].date = moment().add(i,'d').format('MM/DD/YY');
        forecastList[i].color = forecastList[i].getUvColor
        console.log(forecastList[i]);
    }
    
}

class weather {
    getUvColor() {
        if (this.Uv <= 3) return "uv-favorable";
        if (this.Uv <= 6) return "uv-moderate";
        if (this.Uv > 6) return "uv-severe";
    }

}

weatherApi("Lawrence");










































//  $($searchBtn).on("click", function(){console.log("click")} );