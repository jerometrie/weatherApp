let Geolocator = {

	getPosition() {


		return new Promise( (resolve, reject) => {

			if(!navigator.geolocation) {
				reject("Sorry, your navigator does not support geolocation.");
			}
			else {
					navigator.geolocation.getCurrentPosition( (position) => {
					let lat = position.coords.latitude;
					let long = position.coords.longitude;
					resolve( { lat, long } );
				},
				() => { reject("Sorry, we could not get your location."); } );
			}
		});	
	},

	getPositionFromTown(a) {

		return new Promise( (resolve, reject ) => {

			// Format the address
			let address = a.split(",");

			for(let i = 0; i < address.length; i++) {
				address[i] = address[i].trim();
				address[i] = address[i].replace(" ", "+");
			}

			let addressURL = address.concat();

			// Build the URL and send the request
			let uri = "http://maps.googleapis.com/maps/api/geocode/json?address=" + addressURL + "&sensor=true";
			
			let request = new XMLHttpRequest();
			request.open("GET", uri, true);

			request.onload = () => {
				if(request.status >= 200 && request.status < 400) {

					let result = JSON.parse(request.response);
					let lat = result.results[0].geometry.location.lat;
					let long = result.results[0].geometry.location.lng;
					console.log("{lat, long} venant de getPositionFromTown:")
					console.log({lat, long});

					resolve({lat, long});
				}
			};

			request.onerror = () => {
				reject(new Error("Sorry, something went wrong retrieving the location you are looking for."));
			};

			request.send();

		});




		
	}

};

export default Geolocator;

