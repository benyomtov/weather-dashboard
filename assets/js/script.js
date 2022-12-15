var searchButton = document.getElementById("search-button");

var today = dayjs();
var todayFormatted = today.format("MM/DD/YYYY");

var cityArray = [];

var savedArray = localStorage.getItem("saved-cities");
var savedArrayFormatted = JSON.parse(savedArray);

if (savedArray != null) {
    cityArray = savedArrayFormatted;
}

function loadSave() {

    var loadUserSearch = document.getElementById("search")
   
    for (var a = 0; a < cityArray.length; a++) {
        var thisCity = cityArray[a];
        var savedSearch = document.createElement("button");
        savedSearch.textContent = thisCity;
        var lineBreak = document.createElement("br");
        savedSearch.setAttribute("class", thisCity + " saved-searches");
        lineBreak.setAttribute("class", thisCity + " saved-searches");
        var previousSearchDiv = document.querySelector(".previous-search-div");
        previousSearchDiv.appendChild(savedSearch);
        previousSearchDiv.appendChild(lineBreak); 

        savedSearch.addEventListener("click", function(event) {
            event.stopPropagation;
    
            var reInput = this.textContent;
    
            loadUserSearch.value = reInput;
    
            getAPI(event);
        });
    }
}

loadSave();


function getAPI(event) {
    event.preventDefault();
    event.stopPropagation();

    

    var userSearch = document.getElementById("search");
    var userCity = userSearch.value;

    var requestURLCurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + userCity  + "&units=imperial&appid=9c912d68d286bd314c387d098a8da8ed";
    fetch(requestURLCurrent)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {

        var cityName = data.name;
        var cityAndDate = document.querySelector(".city-and-date");
        cityAndDate.textContent = cityName + " (" + todayFormatted + ")";

        var currentIcon = data.weather[0].icon;
        var currentIconDisplay = document.querySelector(".current-weather-icon");
        currentIconDisplay.setAttribute("src", "http://openweathermap.org/img/wn/" + currentIcon + ".png");

        var currentTemp = data.main.temp;
        var currentTempDisplay = document.getElementById("current-temp");
        currentTempDisplay.textContent = "Temp: " + currentTemp  + "\u00B0F";

        var currentWind = data.wind.speed;
        var currentWindDisplay = document.getElementById("current-wind");
        currentWindDisplay.textContent = "Wind: " + currentWind + " mph";

        var currentHumidity = data.main.humidity;
        var currentHumidityDisplay = document.getElementById("current-humidity");
        currentHumidityDisplay.textContent = "Humidity: " + currentHumidity + "%";


        var previousSearchDiv = document.querySelector(".previous-search-div");

        var savedSearch = document.createElement("button");
        var lineBreak = document.createElement("br");
        savedSearch.textContent = cityName;
        savedSearch.setAttribute("class", cityName + " saved-searches");
        lineBreak.setAttribute("class", cityName + " saved-searches");

        var savedSearches = document.querySelectorAll(".saved-searches");

        if (cityArray != false ) {
            for (var i = 0; i < savedSearches.length; i++) {
                if (savedSearches[i].textContent == cityName) {
                    
                    var cities = document.querySelectorAll("." + cityName);

                    for (var k = 0; k < cities.length; k++) {
                        cities[k].remove();
                    }
                }
            }
    
            cityArray = cityArray.filter(function(duplicateCity){ 
                 return !duplicateCity.includes(cityName); 
            });       
        }

        previousSearchDiv.appendChild(savedSearch);
        savedSearch.display = "block";
        previousSearchDiv.appendChild(lineBreak);
        lineBreak.display = "block";

        cityArray.push(cityName);
        var cityArrayFormatted = JSON.stringify(cityArray);
        localStorage.setItem("saved-cities", cityArrayFormatted);

        savedSearch.addEventListener("click", function(event) {
            event.stopPropagation;

            var reInput = this.textContent;

            userSearch.value = reInput;

            for (var j = 0; j < cityArray.length; j++) {
                
                if (cityArray[j] == reInput) {
                    function arrayRemove(arr, value) { 
        
                        return arr.filter(function(duplicateCity){ 
                            return duplicateCity != value; 
                        });
                    }

                    cityArray = arrayRemove(cityArray, reInput);
                    
                }
            }


            var cityArrayFormatted = JSON.stringify(cityArray);
            localStorage.setItem("saved-cities", cityArrayFormatted);

            getAPI(event);

            


            previousSearchDiv.removeChild(savedSearch);
            previousSearchDiv.removeChild(lineBreak);
        });

    });

    var requestURL5Day = "https://api.openweathermap.org/data/2.5/forecast?q=" + userCity + "&units=imperial&appid=0bd3a821fb583c379a71158b3c556358";
     fetch(requestURL5Day)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {

        var counter = 1;
        for (var i = 0; i < data.list.length; i += 8) {

            var thisDay = today.add(counter, "day");
            var thisDayFormatted = thisDay.format("MM/DD/YYYY");
            var thisDayDisplay = document.querySelector(".date-" + counter);
            thisDayDisplay.textContent = thisDayFormatted;

            var icon = data.list[i].weather[0].icon;
            var thisIconDisplay = document.querySelector(".weather-icon-" + counter);
            thisIconDisplay.setAttribute("src", "http://openweathermap.org/img/wn/" + icon + ".png");
            
            var temp = data.list[i].main.temp;
            var thisTempDisplay = document.getElementById("temp-" + counter);
            thisTempDisplay.textContent = "Temp: " + temp + "\u00B0F";

            var wind = data.list[i].wind.speed;
            var thisWindDisplay = document.getElementById("wind-" + counter);
            thisWindDisplay.textContent = "Wind: " + wind + " mph";

            var humidity = data.list[i].main.humidity;
            var thisHumidityDisplay = document.getElementById("humidity-" + counter);
            thisHumidityDisplay.textContent = "Humidity: " + humidity  + "%";

            counter++;
        }
    });

}

searchButton.addEventListener("click", getAPI);

var deleteButton = document.getElementById("delete-button");

deleteButton.addEventListener("click", function() {
    localStorage.clear();
    cityArray = [];
    var savedSearches = document.querySelectorAll(".saved-searches");
    for (var z = 0; z < savedSearches.length; z++) {
        savedSearches[z].remove();
    }

});



