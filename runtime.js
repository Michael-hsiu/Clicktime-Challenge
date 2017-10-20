// An object generated when the Start button is pressed.
function InitialEntry(row) {

	this.startDate = new Date();
	this.startTime = this.startDate.getHours() + ":" + this.startDate.getMinutes() + ":" + this.startDate.getSeconds();
	this.timeZone = this.calcTimeZone();
	// Ask geolocation API for lat/lon
	this.startLat = "Loading...";
	this.startLon = "Loading...";
	this.endLat = "Loading...";
	this.endLon = "Loading...";
	this.timeElapsed = 0;
	this.row = row;		// Row assigned to this entry

	this.endDate = null;
	this.endTime = -1;

	InitialEntry.instances.push(this);

}
InitialEntry.prototype.calcTimeZone = function() {
	var timeOffset = this.startDate.getTimezoneOffset();		// Offset from local time to UTC-0
	timeOffset = timeOffset / 60;	// Convert to UTC unit
	if (timeOffset < 0) {
		return "UTC+" + timeOffset;
	} else {
		return "UTC-" + timeOffset;
	}

};
InitialEntry.prototype.populateStartTimeAndLoc = function(startTimeCell, startLocCell) {

	// Ask geolocation API for lat/lon
	var inst = this;
	if (this.startLat === "Loading..." || this.startLon === "Loading...") {
		navigator.geolocation.getCurrentPosition(function(position) {
			inst.startLat = position.coords.latitude;
			inst.startLon = position.coords.longitude;
			startLocCell.textContent = "(" + inst.startLat.toFixed(4) + "," + inst.startLon.toFixed(4) + ")";
		});
	}
	// Initial text load for immediate visual feedback, may be overwritten by async loc request
	startTimeCell.textContent = this.startTime + "\n(" + this.timeZone + ")";
	startLocCell.textContent = "(Loading...,Loading...)";		// Indicator text that async call is occurring
};
InitialEntry.prototype.populateEndTimeAndLoc = function(endTimeCell, endLocCell, timeElapsedCell) {

	// Ask geolocation API for lat/lon
	var inst = this;

	// Async call to get end lat/lon
	navigator.geolocation.getCurrentPosition(function(position) {
		inst.endLat = position.coords.latitude;
		inst.endLon = position.coords.longitude;
		endLocCell.textContent = "(" + inst.endLat.toFixed(4) + "," + inst.endLon.toFixed(4) + ")";
	});

	// Initial text load for immediate visual feedback, may be overwritten by async loc request
	var endDate = new Date();
	this.endDate = endDate;
	this.endTime = this.endDate.getHours() + ":" + this.endDate.getMinutes() + ":" + this.endDate.getSeconds();
	endTimeCell.textContent = this.endTime + "\n(" + this.timeZone + ")";
	endLocCell.textContent = "(Loading...,Loading...)";		// Indicator text that async call is occurring

	// Calculate elapsed time
	this.timeElapsed = endDate - this.startDate;	// Get time elapsed in ms
	var timeFormatted = this.timeElapsed / 1000;	// First convert to seconds
	var timeString;
	if (timeFormatted % 60 < 10) {
		timeString = (Math.floor(timeFormatted / 60)) + ":0" + (Math.floor(timeFormatted) % 60);
	} else {
		timeString = (Math.floor(timeFormatted / 60)) + ":" + (Math.floor(timeFormatted) % 60);
	}
	timeElapsedCell.textContent = timeString;

};
InitialEntry.instances = [];		// Stores all existing instances

// Called when Stop button is pressed
function onStopButtonPressed() {

	// Update button text
	var x = document.getElementById("Start_Stop_Button");
	x.innerHTML = "Start";

	// Access most recent row and finish filling in its entries
	var lastIndex = InitialEntry.instances.length - 1;
	var currInst = InitialEntry.instances[lastIndex];
	var currRow = currInst.row;
	console.log("reached1");

	// Insert Start info cells
	var endTimeCell = currRow.insertCell(2);
	endTimeCell.style.textAlign = "center";
	var endLocCell = currRow.insertCell(3);
	endLocCell.style.textAlign = "center";
	var totalTimeCell = currRow.insertCell(4);
	totalTimeCell.style.textAlign = "center";
	console.log("reached2");

	currInst.populateEndTimeAndLoc(endTimeCell, endLocCell, totalTimeCell);
	console.log("reached3");

}
// Called when Start button is pressed
function onStartButtonPressed() {

	// Update button text
	var x = document.getElementById("Start_Stop_Button");
	x.innerHTML = "Stop";

	// Insert new row in our records table
	var table = document.getElementById("timesTable");
	var row = table.insertRow();
	// row.length = 5;

	// Generate new record object
	var newEntry = new InitialEntry(row);
	
	// Insert Start info cells
	var startTimeCell = row.insertCell(0);
	startTimeCell.style.textAlign = "center";
	var startLocCell = row.insertCell(1);
	startLocCell.style.textAlign = "center";

	// Populate Start info
	newEntry.populateStartTimeAndLoc(startTimeCell, startLocCell);

}

function onStartStopButtonPressed() {
	var x = document.getElementById("Start_Stop_Button");
	if (x.innerHTML === "Start/Stop" || x.innerHTML === "Start") {
		onStartButtonPressed();
	} else {
		onStopButtonPressed();
	}
}

// Works async
function getPosition(row, cellIndex) {
	navigator.geolocation.getCurrentPosition(function(position) {
			var targetCell = row.cells[cellIndex];
			targetCell.textContent = position.coords.latitude;
		});
}
document.getElementById("Start_Stop_Button").addEventListener("click", function() {
	onStartStopButtonPressed();
});


// An object generated when the Stop button is pressed.
// class EndEntry {
// 	constructor(initialEntry) {
// 		var endDate = new Date();
// 		this.endDate = endDate;
// 		this.endTime = startTime;
// 		this.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
// 		this.startLat = startLat;
// 		this.startLon = startLon;
// 		this.timeElapsed = endDate.getTime() - initialEntry.getStartDate().getTime();		// Expressed in milliseconds
//
// 		// Ask geolocation API for lat/lon
// 		navigator.geolocation.getCurrentPosition(function(position) {
// 		  this.startLat = position.coords.latitude;
// 		  this.startLon = position.coords.longitude;
// 		});
// 	}
// 	getEndDate() {
// 		return this.endDate;
// 	}
// 	getEndPos() {
// 		return "Latitude: " + this.startLat + ", " + "Longitude: " + this.startLon;
// 	}
// }


// var myRecord = { firstName:"Tom", lastName:"Smith", age:26} 
// var numeral2number = { "one":1, "two":2, "three":3}

// var i=0, key="";
// for (i=0; i < Object.keys( numeral2number).length; i++) {
//   key = Object.keys( numeral2number)[i];
//   alert('The numeral '+ key +' denotes the number '+ numeral2number[key]);
// }

// numeral2number["thirty two"] = 32; 
// delete numeral2number["thirty two"];

// function Person( first, last) {
//   this.firstName = first; 
//   this.lastName = last; 
// }

// Person.prototype.getInitials = function () {
//   return this.firstName.charAt(0) + this.lastName.charAt(0); 
// }


// for (var i = 0; i < row.length; i++) {
// 	var newCell = row.insertCell(i);
// 	newCell.textContent = "1";
// 	newCell.style.textAlign = "center";
// 	getPosition(row, i);	// Async call for geolocation
// }
// row.insertCell(-1).textContent = "2";
// row.insertCell(-1).textContent = "3";


