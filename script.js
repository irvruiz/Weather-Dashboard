// grabbing HTML elements
var inputText = document.getElementById("inputCity")
var button = document.getElementById("button-addon2");
var fiveDay = document.getElementById("five_day")
var weatherDetail = document.getElementById("weather_detail")
var resultList = document.getElementById("resultList")
var btnClear = document.getElementById("clear");

// global assignments
var finalValue = [];
var currentDate = new Date();
let month = currentDate.getMonth();
let year = currentDate.getFullYear();
let date = currentDate.getDate();


let today = `${month}/${date}/${year}`;

let dateDisplay = document.createTextNode(today)


let savedCities = localStorage.getItem('savedCities') ? JSON.parse(localStorage.getItem('savedCities')) : []

// displays local storage items on webpage
for (let i = 0; i < savedCities.length; i++) {
    createItemFromStorage(savedCities[i])
}


// Added the event listener when the submit button is pressed
button.addEventListener("click", function () {

    var inputGlobal = inputText.value;
    if (inputGlobal === "") {
        alert("Please enter a city name")
        return
    }
    fetchingFiveDay(inputGlobal);
    fetchingCurrentLocation(inputGlobal);

})

function createItemFromStorage(value) {

    var btn_city = document.createElement("button")
    btn_city.classList.add("btn-secondary")
    if (value === "") {

        return
    }
    btn_city.textContent = value;
    resultList.appendChild(btn_city)
    var buttonPress = document.getElementsByClassName("btn-secondary");

    buttonPressing(buttonPress);

}

function buttonPressing(buttonPress) {
    for (let i = 0; i < buttonPress.length; i++) {
        buttonPress[i].addEventListener("click", function (event) {
            fetchingFiveDay(event.target.textContent)
            fetchingCurrentLocation(event.target.textContent)
        })
    }

}
// Validate location
function validateCity(data) {
    let city = document.querySelector('#inputCity').value


    if (localStorage.getItem('savedCities')) {

        savedCities = JSON.parse(localStorage.getItem('savedCities'))
    }

    let flag = false;
    for (let i = 0; i < savedCities.length; i++) {
        if (savedCities[i] === city) {

            flag = true;
            break;

        }

    }
    if (flag === false) {
        savedCities.push(city)
        localStorage.setItem('savedCities', JSON.stringify(savedCities))
        createItemFromStorage(city)
    }

    finalValue = data;
    return data;

}

function NotACity() {
   var flag=  alert("This City doesn't exist")
   
    return;
}
// fetching data to display five day forcast
function fetchingFiveDay(input) {
    const myKey = "8d16f28b545852d623de7ad3baf04f51";

    fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + input + "&cnt=5" + "&units=imperial" + "&appid=" + myKey)

        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.cod === "404") {
                NotACity()

            }
            else {
                return validateCity(data)
            }

        })
        .then(function (data) {

            fiveDay.textContent = "";
            for (let i = 0; i < data.list.length; i++) {

                var dt = data.list[i].dt_txt
                var temp = data.list[i].main.temp
                var humid = data.list[i].main.humidity
                var icon = data.list[i].weather[0].icon

                let tempString = `http://openweathermap.org/img/wn/${icon}.png`
                var wind = data.list[i].wind.speed;
                let creatElemtn = $(`<div class="col-2">
                <div class="card">
                <div class="card-body" style = "background-color: #8BC6EC;
                background-image: linear-gradient(135deg, #8BC6EC 0%, #9599E2 100%);
                ">
                    <h5 class="card-title">${dt}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${temp}°F</h6>
                    <p class="card-text"><img src = "${tempString}"/></p>
                    <p class="card-text">${humid}%</p>
                    <p class="card-text">${wind}MPH</p>
                </div>
               </div>
               </div>`)


                creatElemtn.appendTo(fiveDay)

            }

        })

}

// fetching data for currentLocation
function fetchingCurrentLocation(input) {
    const myKey = "8d16f28b545852d623de7ad3baf04f51";

    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + input + "&appid=" + myKey + "&units=imperial")

        .then(function (response) {
            return response.json();
        })
        .then(function (data) {


            return data;

        })


        .then(function (data) {
            let lat = data.coord.lat;
            let lon = data.coord.lon;
            fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + myKey + "&units=imperial")
                .then(function (response) {
                    return response.json();
                })

                .then(function (uvData) {
                    weatherDetail.textContent = "";



                    var pTagName = document.createElement("h1")
                    var pTagTemp = document.createElement("p")
                    var pTagWind = document.createElement("p")
                    var pTagHumidity = document.createElement("p")
                    var pTagUVParent = document.createElement("div")
                    var pTagUVText = document.createElement("p")
                    var pTagUV = document.createElement("p")
                    var img = document.createElement("img")

                    pTagUVParent.classList.add("pTagUVParent")
                    pTagUVText.textContent = "UVI : ";
                    pTagUV.textContent = uvData.current.uvi
                    if (uvData.current.uvi < 2) {
                        pTagUV.classList.add("greenBox")
                    }
                    else if (uvData.current.uvi > 2 && uvData.current.uvi <= 5) {
                        pTagUV.classList.add("yellowBox")
                    }
                    else if (uvData.current.uvi > 5 && uvData.current.uvi <= 7)
                        pTagUV.classList.add("orangeBox")
                    else if (uvData.current.uvi > 7 && uvData.current.uvi <= 10) {
                        pTagUV.classList.add("redBox")

                    }
                    else {
                        pTagUV.classList.add("purpleBox")
                    }

                    var icon = data.weather[0].icon

                    let displayIcon = `http://openweathermap.org/img/wn/${icon}.png`
                    img.src = displayIcon;


                    pTagName.textContent = data.name + " " + today
                    
                   
                    pTagTemp.textContent = "Temp : " + data.main.temp + "°F"
                    pTagWind.textContent = "wind : " + data.wind.speed + "MPH";
                    pTagHumidity.textContent = "Humidity : " + data.main.humidity + "%";
                    pTagUVParent.appendChild(pTagUVText)
                    pTagUVParent.appendChild(pTagUV)

                    weatherDetail.appendChild(pTagName)
                    weatherDetail.appendChild(pTagTemp)
                    weatherDetail.appendChild(pTagWind)
                    weatherDetail.appendChild(pTagHumidity)
                    weatherDetail.appendChild(pTagUVParent)
                    weatherDetail.appendChild(img)


                    return;
                })

        })

}

btnClear.addEventListener("click", function () {
    localStorage.clear()
    location.reload();
})