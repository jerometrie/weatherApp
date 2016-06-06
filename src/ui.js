import { transformData } from "./transformData";

let ui = {

	renderPage(info) {

		// HTML elements
		let $map = document.querySelector("#map");
		let $town = document.querySelector("#town");
		let $right = document.querySelector("#right");

		// Build the map
		let img = new Image();
		img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + info.city.coord.lat + "," + info.city.coord.lon + "&zoom=13&size=350x350&sensor=false";

		// Display the map
		if($map.hasChildNodes()) {
			$map.removeChild($map.childNodes[0]);
		}
		$map.appendChild(img);

		// Display the town
		$town.innerHTML = info.city.name;

		// Build the weather elements' array
		let weatherElements = transformData(info);
		
		// Insert the weather elements in the DOM
		while($right.hasChildNodes()) {
			$right.removeChild($right.firstChild);
		}
		
		for(let i = 0; i < 5; i++) {
			$right.appendChild(weatherElementTemplate(weatherElements[i]));
		}
		
		// Add Bootstrap classes to the elements
		let weatherDivs = document.querySelectorAll(".weatherElement");
		weatherDivs[0].classList.add("col-xs-12", "todaysWeather");
		for(let i = 1; i < weatherDivs.length; i++) {
			weatherDivs[i].classList.add("col-xs-12", "col-sm-3");
		}
	},

	renderError(error) {
		let $errorMessage = document.querySelector("#errorMessage");
		$errorMessage.innerHTML = error;
	},

	changeTemp() {

		//Change the unit
		let temperatures = document.querySelectorAll(".tempC, .tempF");
		let buttons = document.querySelectorAll("button");

		for(let i = 0; i < temperatures.length; i++) {
			if(temperatures[i].classList.contains("hidden")) {
				temperatures[i].classList.remove("hidden");
			}
			else {
				temperatures[i].classList.add("hidden");
			}
		}
		// Toggle the buttons's colour
		for(let i = 0; i < 2; i++) {
			if(buttons[i].classList.contains("button-highlight")) {
				buttons[i].classList.remove("button-highlight");
			}
			else {
				buttons[i].classList.add("button-highlight");
			}
		}
	

	}
};


function weatherElementTemplate(element) {

	let template = document.createElement("div");
	template.classList.add("weatherElement");
	let tempC = (element.main.temp - 273.15).toFixed(1);
	let tempF = (element.main.temp * 9 / 5 - 459.67).toFixed(1);
	template.innerHTML = `
	<p class="date">${element.date}</p>
	<p class="hour">${element.hour}</p>
	<i class="wi wi-owm-${element.weather[0].id}"></i>
	<p class="tempC">${tempC} °C</p>
	<p class="tempF hidden">${tempF} °F</p>
	<p class="desc">${element.weather[0].description}</p>
	`;

	return template;
}


export default ui;


