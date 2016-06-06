(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _geolocator = require("./geolocator");

var _geolocator2 = _interopRequireDefault(_geolocator);

var _weather = require("./weather");

var _weather2 = _interopRequireDefault(_weather);

var _ui = require("./ui");

var _ui2 = _interopRequireDefault(_ui);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var beginTime = +new Date();
console.log(beginTime);
console.time("timer");
_geolocator2.default.getPosition() // passes { lat, long }
.then(_weather2.default.getForecast) // passes an object made of OpenWeatherMap's JSON
.then(_ui2.default.renderPage).catch(_ui2.default.renderError);

var endTime = +new Date();
var elapsedTime = endTime - beginTime;
console.log(elapsedTime);
console.timeEnd("timer");
// Add an event listener to the temperature unit buttons

var buttons = document.querySelector(".btn-group");

buttons.addEventListener("click", _ui2.default.changeTemp);

// Add an event listener if another town is searched

var submit = document.querySelector("#submit");

submit.addEventListener("click", function (event) {

	event.preventDefault();

	var input = document.querySelector("#inputField").value;

	// Check the validity of the value
	if (!input) {
		alert("Please enter a valid Town, Country.");
		return;
	}

	// Get latitude and longitude and refresh UI
	_geolocator2.default.getPositionFromTown(input).then(_weather2.default.getForecast).then(_ui2.default.renderPage).catch(_ui2.default.renderError);
});

},{"./geolocator":2,"./ui":4,"./weather":5}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var Geolocator = {
	getPosition: function getPosition() {

		return new Promise(function (resolve, reject) {

			if (!navigator.geolocation) {
				reject("Sorry, your navigator does not support geolocation.");
			} else {
				navigator.geolocation.getCurrentPosition(function (position) {
					var lat = position.coords.latitude;
					var long = position.coords.longitude;
					resolve({ lat: lat, long: long });
				}, function () {
					reject("Sorry, we could not get your location.");
				});
			}
		});
	},
	getPositionFromTown: function getPositionFromTown(a) {

		return new Promise(function (resolve, reject) {

			// Format the address
			var address = a.split(",");

			for (var i = 0; i < address.length; i++) {
				address[i] = address[i].trim();
				address[i] = address[i].replace(" ", "+");
			}

			var addressURL = address.concat();

			// Build the URL and send the request
			var uri = "http://maps.googleapis.com/maps/api/geocode/json?address=" + addressURL + "&sensor=true";

			var request = new XMLHttpRequest();
			request.open("GET", uri, true);

			request.onload = function () {
				if (request.status >= 200 && request.status < 400) {

					var result = JSON.parse(request.response);
					var lat = result.results[0].geometry.location.lat;
					var long = result.results[0].geometry.location.lng;
					console.log("{lat, long} venant de getPositionFromTown:");
					console.log({ lat: lat, long: long });

					resolve({ lat: lat, long: long });
				}
			};

			request.onerror = function () {
				reject(new Error("Sorry, something went wrong retrieving the location you are looking for."));
			};

			request.send();
		});
	}
};

exports.default = Geolocator;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
function transformData(data) {

	var result = [];

	result = filterElements(data.list);

	return result;
}

function filterElements(list) {

	var temp = [];

	// Add formated date and hour to the list's object elements
	for (var i = 0; i < list.length; i++) {
		list[i].date = convertUnixDate(list[i].dt);
		list[i].hour = convertUnixTime(list[i].dt);
	}

	// Add the 1st element to temp and delete it from list
	temp.push(list[0]);
	list.shift();

	// Filter the rest of the list to only keep weather at 14:00
	for (var _i = 0; _i < list.length; _i++) {
		if (list[_i].hour == "14:00") {

			temp.push(list[_i]);
		}
	}

	return temp;
}

function convertUnixDate(timestamp) {
	return new Date(timestamp * 1000).toLocaleDateString();
}

function convertUnixTime(timestamp) {
	var temp = new Date(timestamp * 1000);
	temp = "0" + temp.getHours();
	temp = temp.slice(-2);
	return temp + ":00";
}

exports.transformData = transformData;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _transformData = require("./transformData");

var ui = {
	renderPage: function renderPage(info) {

		// HTML elements
		var $map = document.querySelector("#map");
		var $town = document.querySelector("#town");
		var $right = document.querySelector("#right");

		// Build the map
		var img = new Image();
		img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + info.city.coord.lat + "," + info.city.coord.lon + "&zoom=13&size=350x350&sensor=false";

		// Display the map
		if ($map.hasChildNodes()) {
			$map.removeChild($map.childNodes[0]);
		}
		$map.appendChild(img);

		// Display the town
		$town.innerHTML = info.city.name;

		// Build the weather elements' array
		var weatherElements = (0, _transformData.transformData)(info);

		// Insert the weather elements in the DOM
		while ($right.hasChildNodes()) {
			$right.removeChild($right.firstChild);
		}

		for (var i = 0; i < 5; i++) {
			$right.appendChild(weatherElementTemplate(weatherElements[i]));
		}

		// Add Bootstrap classes to the elements
		var weatherDivs = document.querySelectorAll(".weatherElement");
		weatherDivs[0].classList.add("col-xs-12", "todaysWeather");
		for (var _i = 1; _i < weatherDivs.length; _i++) {
			weatherDivs[_i].classList.add("col-xs-12", "col-sm-3");
		}
	},
	renderError: function renderError(error) {
		var $errorMessage = document.querySelector("#errorMessage");
		$errorMessage.innerHTML = error;
	},
	changeTemp: function changeTemp() {

		//Change the unit
		var temperatures = document.querySelectorAll(".tempC, .tempF");
		var buttons = document.querySelectorAll("button");

		for (var i = 0; i < temperatures.length; i++) {
			if (temperatures[i].classList.contains("hidden")) {
				temperatures[i].classList.remove("hidden");
			} else {
				temperatures[i].classList.add("hidden");
			}
		}
		// Toggle the buttons's colour
		for (var _i2 = 0; _i2 < 2; _i2++) {
			if (buttons[_i2].classList.contains("button-highlight")) {
				buttons[_i2].classList.remove("button-highlight");
			} else {
				buttons[_i2].classList.add("button-highlight");
			}
		}
	}
};

function weatherElementTemplate(element) {

	var template = document.createElement("div");
	template.classList.add("weatherElement");
	var tempC = (element.main.temp - 273.15).toFixed(1);
	var tempF = (element.main.temp * 9 / 5 - 459.67).toFixed(1);
	template.innerHTML = "\n\t<p class=\"date\">" + element.date + "</p>\n\t<p class=\"hour\">" + element.hour + "</p>\n\t<i class=\"wi wi-owm-" + element.weather[0].id + "\"></i>\n\t<p class=\"tempC\">" + tempC + " °C</p>\n\t<p class=\"tempF hidden\">" + tempF + " °F</p>\n\t<p class=\"desc\">" + element.weather[0].description + "</p>\n\t";

	return template;
}

exports.default = ui;

},{"./transformData":3}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var Weather = {
	getForecast: function getForecast(coordinates) {

		console.log("Coordinates pris par Weather.getForecast: ");
		console.log(coordinates);

		return new Promise(function (resolve, reject) {

			var uri = "http://api.openweathermap.org/data/2.5/forecast?lat=" + coordinates.lat + "&lon=" + coordinates.long + "&APPID=5c1f70f49a6ae15336b88b10a5ffb9c5";
			console.log("Weather.getForecast URI pour appeler et retoruner info" + uri);
			var request = new XMLHttpRequest();

			request.open("GET", uri, true);
			request.onload = function () {
				if (request.status >= 200 && request.status < 400) {
					console.log("Weather.getForecast.resolve:");
					console.log(JSON.parse(request.response));
					resolve(JSON.parse(request.response));
				}
			};

			request.onerror = function () {
				reject(new Error("Sorry, something went wrong retrieving your weather forecast."));
			};

			request.send();
		});
	}
};

exports.default = Weather;

},{}]},{},[1]);
