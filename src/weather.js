let Weather = {

	getForecast(coordinates) {

		console.log("Coordinates pris par Weather.getForecast: ");
		console.log(coordinates);

		return new Promise( (resolve, reject) => {

			let uri = `http://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.long}&APPID=5c1f70f49a6ae15336b88b10a5ffb9c5`;
			console.log("Weather.getForecast URI pour appeler et retoruner info" + uri);
			let request = new XMLHttpRequest();

			request.open("GET", uri, true);
			request.onload = () => {
				if(request.status >= 200 && request.status < 400) {
					console.log("Weather.getForecast.resolve:");
					console.log(JSON.parse(request.response));
					resolve(JSON.parse(request.response));
				}
			};

			request.onerror = () => {
				reject(new Error("Sorry, something went wrong retrieving your weather forecast."));
			};

			request.send();
			
		});

	}
};

export default Weather;