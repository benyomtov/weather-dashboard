var searchButton = document.getElementById("search-button");

//dayjs variables, sets up date format
var today = dayjs();
var todayFormatted = today.format("MM/DD/YYYY");

//sets initial city array
var cityArray = [];

//gets saved array from local storage and converts to array
var savedArray = localStorage.getItem("saved-cities");
var savedArrayFormatted = JSON.parse(savedArray);

//if there is save data, cityArray will have savedArray's contents
if (savedArray != null) {
    cityArray = savedArrayFormatted;
}

//prints sava data to page and sets button functionality
function loadSave() {

    var loadUserSearch = document.getElementById("search")
   
    for (var a = 0; a < cityArray.length; a++) {
        var thisCityUnformatted = cityArray[a];
        var thisCity = thisCityUnformatted.replace(/\s+/g, '');
        var savedSearch = document.createElement("button");
        savedSearch.textContent = thisCityUnformatted;
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

//function for add event listener on the search button, displays weather data and maintains storage
function getAPI(event) {

    //stops text from clearing and prevents event from triggering any other click events
    event.preventDefault();
    event.stopPropagation();

    //selects search textbox and gets user input
    var userSearch = document.getElementById("search");
    var userCity = userSearch.value;

    //fetch call that calls weather API
    var requestURLCurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + userCity  + "&units=imperial&appid=9c912d68d286bd314c387d098a8da8ed";
    fetch(requestURLCurrent)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {

        //gets specific data needed and prints current weather data
        var cityNameUnformatted = data.name;
        var cityName = cityNameUnformatted.replace(/\s+/g, '');
        var cityAndDate = document.querySelector(".city-and-date");
        cityAndDate.textContent = cityNameUnformatted + " (" + todayFormatted + ")";

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

        //container for saved searches
        var previousSearchDiv = document.querySelector(".previous-search-div");

        //creates saved search button and gives it a matching class
        var savedSearch = document.createElement("button");
        var lineBreak = document.createElement("br");
        savedSearch.textContent = cityNameUnformatted;
        savedSearch.setAttribute("class", cityName + " saved-searches");
        lineBreak.setAttribute("class", cityName + " saved-searches");

        //selects all saved search buttons
        var savedSearches = document.querySelectorAll(".saved-searches");

        //if there is data in cityArray, this statement removes all buttons with the same city as the search from the page
        if (cityArray != false ) {
            for (var i = 0; i < savedSearches.length; i++) {
                if (savedSearches[i].textContent == cityNameUnformatted) {
                    
                    var cities = document.querySelectorAll("." + cityName);

                    for (var k = 0; k < cities.length; k++) {
                        cities[k].remove();
                    }
                }
            }
            
            //takes out any strings in cityArray that are the same city as the search
            cityArray = cityArray.filter(function(duplicateCity){ 
                 return !duplicateCity.includes(cityNameUnformatted); 
            });       
        }

        //adds button for searched city to page
        previousSearchDiv.appendChild(savedSearch);
        savedSearch.display = "block";
        previousSearchDiv.appendChild(lineBreak);
        lineBreak.display = "block";

        //adds new search to array and sets in storage
        cityArray.push(cityNameUnformatted);
        var cityArrayFormatted = JSON.stringify(cityArray);
        localStorage.setItem("saved-cities", cityArrayFormatted);


        //adds click functionality to new button
        savedSearch.addEventListener("click", function(event) {
            
            //prevents event bubbling
            event.stopPropagation;

            //sets search text to contain previous search
            var reInput = this.textContent;
            userSearch.value = reInput;

            //filters cityArray and removes previous search from array
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

            //sends updated array to storage after conversion
            var cityArrayFormatted = JSON.stringify(cityArray);
            localStorage.setItem("saved-cities", cityArrayFormatted);

            //starts search function over again with saved search
            getAPI(event);

            //removes duplicate buttons
            previousSearchDiv.removeChild(savedSearch);
            previousSearchDiv.removeChild(lineBreak);
        });

    });

    //gets five-day forecast from API, displays on page
    var requestURL5Day = "https://api.openweathermap.org/data/2.5/forecast?q=" + userCity + "&units=imperial&appid=0bd3a821fb583c379a71158b3c556358";
     fetch(requestURL5Day)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {

        //for loop displays specified data in appropriate day boxes
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

//event listener for search button
searchButton.addEventListener("click", getAPI);

//code for clear search button
var deleteButton = document.getElementById("delete-button");

deleteButton.addEventListener("click", function() {
    localStorage.clear();
    cityArray = [];
    var savedSearches = document.querySelectorAll(".saved-searches");
    for (var z = 0; z < savedSearches.length; z++) {
        savedSearches[z].remove();
    }

});



