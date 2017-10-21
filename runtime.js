// An object generated when the Start button is pressed.
function InitialEntry(row) {

	// Time logic
	this.startDate = new Date();
	this.startTime = this.startDate.getHours() + ":" + this.startDate.getMinutes() + ":" + this.startDate.getSeconds();
	this.timeZone = this.calcTimeZone();
	this.timeElapsed = 0;
	this.endDate = null;
	this.endTime = -1;

	// Strings for easy save/load
	this.startTimeStr = "";
	this.timeElapsedStr = "";
	this.endTimeStr = "";
	this.startLocStr = "";
	this.endLocStr = "";

	// Ask geolocation API for lat/lon
	this.startLat = "Loading...";
	this.startLon = "Loading...";
	this.endLat = "Loading...";
	this.endLon = "Loading...";

	// Table logic
	this.row = row;		// Row assigned to this entry

	// Cache this instance
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

	// Initial text load for immediate visual feedback, may be overwritten by async loc request
	this.startTimeStr = this.startTime + "\n(" + this.timeZone + ")";
	startTimeCell.textContent = this.startTimeStr;
	startLocCell.textContent = "(Loading...,Loading...)";		// Indicator text that async call is occurring

	// Ask geolocation API for lat/lon
	var inst = this;
	if (this.startLat === "Loading..." || this.startLon === "Loading...") {
		navigator.geolocation.getCurrentPosition(function(position) {
			inst.startLat = position.coords.latitude;
			inst.startLon = position.coords.longitude;
			this.startLocStr = "(" + inst.startLat.toFixed(4) + "," + inst.startLon.toFixed(4) + ")";
			startLocCell.textContent = this.startLocStr;
		});
	}

};
InitialEntry.prototype.populateEndTimeAndLoc = function(endTimeCell, endLocCell, timeElapsedCell) {

	// Initial text load for immediate visual feedback, may be overwritten by async loc request
	var endDate = new Date();
	this.endDate = endDate;
	this.endTime = this.endDate.getHours() + ":" + this.endDate.getMinutes() + ":" + this.endDate.getSeconds();
	this.endTimeStr = this.endTime + "\n(" + this.timeZone + ")";
	endTimeCell.textContent = this.endTimeStr;
	endLocCell.textContent = "(Loading...,Loading...)";		// Indicator text that async call is occurring


	// Ask geolocation API for lat/lon
	var inst = this;

	// Async call to get end lat/lon
	navigator.geolocation.getCurrentPosition(function(position) {
		inst.endLat = position.coords.latitude;
		inst.endLon = position.coords.longitude;
		this.endLocStr = "(" + inst.endLat.toFixed(4) + "," + inst.endLon.toFixed(4) + ")";
		endLocCell.textContent = this.endLocStr;

		this.saveEntry();
	});


	// Calculate elapsed time
	this.timeElapsed = endDate - this.startDate;	// Get time elapsed in ms
	var timeFormatted = this.timeElapsed / 1000;	// First convert to seconds
	var timeString;
	if (timeFormatted % 60 < 10) {
		timeString = (Math.floor(timeFormatted / 60)) + ":0" + (Math.floor(timeFormatted) % 60);
	} else {
		timeString = (Math.floor(timeFormatted / 60)) + ":" + (Math.floor(timeFormatted) % 60);
	}
	this.timeElapsedStr = timeString;
	timeElapsedCell.textContent = timeString;

};
InitialEntry.prototype.saveEntry = function(){
	// Check if we have pre-existing rows
	console.log("GOT TO SAVE");
	var rowCount = localStorage.getItem("rowCount");
	if (rowCount === null) {
		console.log("ROWCOUNT NULL: " + rowCount);
		localStorage.setItem("rowCount", 1);
	} else {
		console.log("ROWCOUNT FOUND: " + rowCount);
		localStorage.setItem("rowCount", 1);
	}
	rowCount = localStorage.getItem("rowCount");
	console.log("ROWCOUNT: " + rowCount);
	// Convert object into k-v pairs
	console.log("GOT START");
	localStorage.setItem("startDate" + rowCount, this.startDate);
	console.log("GOT POST START");
	localStorage.setItem("startTime" + rowCount, this.startTime);
	localStorage.setItem("timeElapsed" + rowCount, this.timeElapsed);
	localStorage.setItem("endDate" + rowCount, this.endDate);
	localStorage.setItem("endTime" + rowCount, this.endTime);
	localStorage.setItem("startLat" + rowCount, this.startLat);
	localStorage.setItem("startLon" + rowCount, this.startLon);
	localStorage.setItem("endLat" + rowCount, this.endLat);
	localStorage.setItem("endLon" + rowCount, this.endLon);
	console.log("FINISHED SAVING");
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

	// Insert Start info cells
	var endTimeCell = currRow.insertCell(2);
	endTimeCell.style.textAlign = "center";
	var endLocCell = currRow.insertCell(3);
	endLocCell.style.textAlign = "center";
	var totalTimeCell = currRow.insertCell(4);
	totalTimeCell.style.textAlign = "center";

	currInst.populateEndTimeAndLoc(endTimeCell, endLocCell, totalTimeCell);

}
// Called when Start button is pressed
function onStartButtonPressed() {

	// Update button text
	var x = document.getElementById("Start_Stop_Button");
	x.innerHTML = "Stop";

	// Build new row using entry
	createNewRow();

}
function createNewRow() {
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


document.getElementById("Start_Stop_Button").addEventListener("click", function() {
	onStartStopButtonPressed();
});


function createLoadRow(rowIndex) {

	var table = document.getElementById("timesTable");
	var row = table.insertRow();

	var startTimeCell = row.insertCell(0);
	var startLocCell = row.insertCell(1);
	var endTimeCell = row.insertCell(2);
	var endLocCell = row.insertCell(3);
	var totalTimeCell = row.insertCell(4);

	startTimeCell.style.textAlign = "center";
	startLocCell.style.textAlign = "center";
	endTimeCell.style.textAlign = "center";
	endLocCell.style.textAlign = "center";
	totalTimeCell.style.textAlign = "center";

	console.log("LOADING ENTRY");
	var newEntry = new InitialEntry(null);	// Pushed onto our master list by its constructor
	newEntry.startDate = Date.parse(localStorage.getItem("startDate" + rowIndex));

	newEntry.timeElapsed = parseFloat(localStorage.getItem("timeElapsed" + rowIndex));
	newEntry.endDate = Date.parse(localStorage.getItem("endDate" + rowIndex));
	newEntry.endTime = parseFloat(localStorage.getItem("endTime" + rowIndex));
	newEntry.startLat = parseFloat(localStorage.getItem("startLat" + rowIndex));
	newEntry.startLon = parseFloat(localStorage.getItem("startLon" + rowIndex));
	newEntry.endLat = parseFloat(localStorage.getItem("endLat" + rowIndex));
	newEntry.endLon = parseFloat(localStorage.getItem("endLon" + rowIndex));

	startTimeCell.textContent = localStorage.getItem("startTimeStr" + rowIndex);
	console.log("STARTIMESTR: " + startTimeCell.textContent);
	totalTimeCell.textContent = localStorage.getItem("timeElapsedStr" + rowIndex);
	console.log("TIMEELAPSESTR: " + totalTimeCell.textContent);
	endTimeCell.textContent = localStorage.getItem("endTimeStr" + rowIndex);
	console.log("ENDTIMECELL: " + endTimeCell.textContent);
	startLocCell.textContent = localStorage.getItem("startLocStr" + rowIndex);
	endLocCell.textContent = localStorage.getItem("endLocStr" + rowIndex);

	console.log("FINISHED ENTRY");

}
function loadTable() {
	var rowCount = localStorage.getItem("rowCount");
	if (rowCount === null) {
		return;
	}
	console.log("LOADING TABLE");
	// Else, generate our table
	rowCount = Math.floor(parseFloat(rowCount));
	for (var i = 0; i < rowCount; i++) {
		createLoadRow(i+1);
	}
	console.log("FINISHED LOADING TABLE");


}
function clearRow(rowIndex) {
	// Convert object into k-v pairs
	localStorage.removeItem("startDate" + rowIndex);
	localStorage.removeItem("startTime" + rowIndex);
	localStorage.removeItem("timeElapsed" + rowIndex);
	localStorage.removeItem("endDate" + rowIndex);
	localStorage.removeItem("endTime" + rowIndex);
	localStorage.removeItem("startLat" + rowIndex);
	localStorage.removeItem("startLon" + rowIndex);
	localStorage.removeItem("endLat" + rowIndex);
	localStorage.removeItem("endLon" + rowIndex);

	localStorage.removeItem("startTimeStr" + rowIndex);
	localStorage.removeItem("timeElapsedStr" + rowIndex);
	localStorage.removeItem("endTimeStr" + rowIndex);
	localStorage.removeItem("startLocStr" + rowIndex);
	localStorage.removeItem("endLocStr" + rowIndex);

}
function clearTable() {
	var rowCount = localStorage.getItem("rowCount");
	if (rowCount === null) {
		return;
	}
	// Else, generate our table
	rowCount = Math.floor(parseFloat(rowCount));
	for (var i = 0; i < rowCount; i++) {
		clearRow(i+1);
	}
	localStorage.removeItem("rowCount");
}

window.onload = function() {
	console.log("RUNNING");
	loadTable();
};