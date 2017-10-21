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
	this.startTimeStr = "NaN";
	this.timeElapsedStr = "NaN";
	this.endTimeStr = "NaN";
	this.startLocStr = "NaN";
	this.endLocStr = "NaN";

	// Ask geolocation API for lat/lon
	this.startLat = "Loading...";
	this.startLon = "Loading...";
	this.endLat = "Loading...";
	this.endLon = "Loading...";
	this.startLocRetrieved = false;
	this.endLocRetrieved = false;
	this.saveInProgress = false;

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
	if (this.startLat === "Loading..." || this.startLon === "Loading...") {
		var inst = this;
		navigator.geolocation.getCurrentPosition(function(position) {
			inst.startLat = position.coords.latitude;
			inst.startLon = position.coords.longitude;
			inst.startLocStr = "(" + inst.startLat.toFixed(4) + "," + inst.startLon.toFixed(4) + ")";
			startLocCell.textContent = inst.startLocStr;
			inst.startLocRetrieved = true;		// In case this async call finishes AFTER end loc call
			if (inst.startLocRetrieved && inst.endLocRetrieved && !inst.saveInProgress) {
				inst.saveInProgress = true;		// Prevents duplicate saving, ensures all async info is here before saving.
				inst.saveEntry();
			}
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

	// Calculate elapsed time
	this.timeElapsed = endDate - this.startDate;	// Get time elapsed in ms
	var timeFormatted = this.timeElapsed / 1000;	// First convert to seconds
	var timeString;
	if (timeFormatted % 60 < 10) {
		timeString = (Math.floor(timeFormatted / 60)) + ":0" + (Math.floor(timeFormatted) % 60);
		this.timeElapsedStr = timeString;
	} else {
		timeString = (Math.floor(timeFormatted / 60)) + ":" + (Math.floor(timeFormatted) % 60);
		this.timeElapsedStr = timeString;
	}
	timeElapsedCell.textContent = timeString;

	// Ask geolocation API for lat/lon
	var inst = this;

	// Async call to get end lat/lon
	navigator.geolocation.getCurrentPosition(function(position) {
		inst.endLat = position.coords.latitude;
		inst.endLon = position.coords.longitude;
		inst.endLocStr = "(" + inst.endLat.toFixed(4) + "," + inst.endLon.toFixed(4) + ")";
		endLocCell.textContent = inst.endLocStr;
		inst.endLocRetrieved = true;
		if (inst.startLocRetrieved && inst.endLocRetrieved && !inst.saveInProgress) {
			inst.saveInProgress = true;		// Prevents duplicate saving, ensures all async info is here before saving.
			inst.saveEntry();
		}
	});
};
InitialEntry.prototype.saveEntry = function() {
	// Check if we have pre-existing rows
	var rowCount = localStorage.getItem("rowCount");
	if (rowCount === null) {
		localStorage.setItem("rowCount", 1);
	} else {
		rowCount = parseInt(rowCount) + 1;
		localStorage.setItem("rowCount", rowCount);
	}
	rowCount = parseInt(localStorage.getItem("rowCount"));
	// Convert object into k-v pairs
	localStorage.setItem("startDate" + rowCount, this.startDate);
	localStorage.setItem("startTime" + rowCount, this.startTime);
	localStorage.setItem("timeElapsed" + rowCount, this.timeElapsed);
	localStorage.setItem("endDate" + rowCount, this.endDate);
	localStorage.setItem("endTime" + rowCount, this.endTime);
	localStorage.setItem("startLat" + rowCount, this.startLat);
	localStorage.setItem("startLon" + rowCount, this.startLon);
	localStorage.setItem("endLat" + rowCount, this.endLat);
	localStorage.setItem("endLon" + rowCount, this.endLon);

	localStorage.setItem("startTimeStr" + rowCount, this.startTimeStr);
	localStorage.setItem("timeElapsedStr" + rowCount, this.timeElapsedStr);
	localStorage.setItem("endTimeStr" + rowCount, this.endTimeStr);
	localStorage.setItem("startLocStr" + rowCount, this.startLocStr);
	localStorage.setItem("endLocStr" + rowCount, this.endLocStr);
};
InitialEntry.instances = [];		// Stores all existing instances

// Called when Stop button is pressed
function onStopButtonPressed() {
	// console.log("OnStopButtonPressed");

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
	// localStorage.clear();
	// console.log("OnStartButtonPressed");

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

	// Generate new record object
	var newEntry = new InitialEntry(row);

	// Insert Start info cells
	var startTimeCell = row.insertCell(0);
	var startLocCell = row.insertCell(1);

	startTimeCell.style.textAlign = "center";
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

	var newEntry = new InitialEntry(null);	// Pushed onto our master list by its constructor
	newEntry.startDate = Date.parse(localStorage.getItem("startDate" + rowIndex));

	newEntry.timeElapsed = parseFloat(localStorage.getItem("timeElapsed" + rowIndex));
	newEntry.endDate = Date.parse(localStorage.getItem("endDate" + rowIndex));
	newEntry.endTime = parseFloat(localStorage.getItem("endTime" + rowIndex));
	newEntry.startLat = parseFloat(localStorage.getItem("startLat" + rowIndex));
	newEntry.startLon = parseFloat(localStorage.getItem("startLon" + rowIndex));
	newEntry.endLat = parseFloat(localStorage.getItem("endLat" + rowIndex));
	newEntry.endLon = parseFloat(localStorage.getItem("endLon" + rowIndex));

	newEntry.startTimeStr = localStorage.getItem("startTimeStr" + rowIndex);
	startTimeCell.textContent = newEntry.startTimeStr;

	newEntry.timeElapsedStr = localStorage.getItem("timeElapsedStr" + rowIndex);
	totalTimeCell.textContent = newEntry.timeElapsedStr;

	newEntry.endTimeStr = localStorage.getItem("endTimeStr" + rowIndex);
	endTimeCell.textContent = newEntry.endTimeStr;

	newEntry.startLocStr = localStorage.getItem("startLocStr" + rowIndex);
	startLocCell.textContent = newEntry.startLocStr;

	newEntry.endLocStr = localStorage.getItem("endLocStr" + rowIndex);
	endLocCell.textContent = newEntry.endLocStr;
}

function loadTable() {
	var rowCount = localStorage.getItem("rowCount");
	if (rowCount === null) {
		return;
	}
	// Else, generate our table
	rowCount = parseInt(rowCount);
	for (var i = 0; i < rowCount; i++) {
		createLoadRow(i+1);
	}
}

function clearRow(table, rowIndex) {
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

	table.deleteRow(-1);
}
function onResetTableButtonPressed() {
	// console.log("onResetTableButtonPressed");
	var rowCount = localStorage.getItem("rowCount");
	if (rowCount === null) {
		return;
	}
	// Else, clear our table storage
	var table = document.getElementById("timesTable");
	rowCount = parseInt(rowCount);
	for (var i = 0; i < rowCount; i++) {
		clearRow(table, i+1);
	}
	localStorage.removeItem("rowCount");
}

window.onload = function() {
	loadTable();
};