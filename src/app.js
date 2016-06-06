import Geolocator from "./geolocator";
import Weather from "./weather";
import ui from "./ui";


Geolocator.getPosition()			// passes { lat, long }
	.then(Weather.getForecast)		// passes an object made of OpenWeatherMap's JSON
	.then(ui.renderPage)
	.catch(ui.renderError);


// Add an event listener to the temperature unit buttons

let buttons = document.querySelector(".btn-group");

buttons.addEventListener("click", ui.changeTemp);

// Add an event listener if another town is searched

let submit = document.querySelector("#submit");

submit.addEventListener("click", function(event) {

	event.preventDefault();
	
	let input = document.querySelector("#inputField").value;
	
	// Check the validity of the value
	if(!input) {
		alert("Please enter a valid Town, Country.");
		return;
	}

	// Get latitude and longitude and refresh UI
	Geolocator.getPositionFromTown(input)
		.then(Weather.getForecast)
		.then(ui.renderPage)
		.catch(ui.renderError);

});




	





