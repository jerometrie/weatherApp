function transformData(data) {
	
	let result = [];

	result = filterElements(data.list);

	return result;
}


function filterElements(list) {
	
	let temp = [];

	// Add formated date and hour to the list's object elements
	for(let i = 0; i < list.length; i++) {
		list[i].date = convertUnixDate(list[i].dt);
		list[i].hour = convertUnixTime(list[i].dt);
	}

	// Add the 1st element to temp and delete it from list
	temp.push(list[0]);
	list.shift();

	// Filter the rest of the list to only keep weather at 14:00
	for(let i = 0; i < list.length; i++) {
		if(list[i].hour == "14:00") {

			temp.push(list[i]);
		}
	}

	return temp;
}

function convertUnixDate(timestamp) {
	return (new Date(timestamp * 1000).toLocaleDateString());
}

function convertUnixTime(timestamp) {
	let temp = new Date(timestamp * 1000);
	temp = "0" + temp.getHours();
	temp = temp.slice(-2);
	return (temp + ":00");
}


export {transformData};

