// An object generated when the Start button is pressed.
function InitialEntry() {
	console.log("REACHED3");

	this.startDate = new Date();
	this.startTime = Date.now();
	// this.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	// Ask geolocation API for lat/lon
	this.currLat = "Loading...";
	this.currLon = "Loading...";
	console.log("(" + this.currLat + "," + this.currLon + ")");

	// navigator.geolocation.getCurrentPosition(function(position) {
	//   this.currLat = position.coords.latitude;
	//   this.currLon = position.coords.longitude;
	// });
	// Store into array

	// InitialEntry.instances.push(this);
	console.log("REACHED5");

}
InitialEntry.prototype.getStartDate = function() {
	return this.startDate;
};
InitialEntry.prototype.getStartPos = function() {
	return "Latitude: " + this.currLat + ", " + "Longitude: " + this.currLon;
};
InitialEntry.prototype.populateTimeAndLoc = function(startTimeCell, startLocCell) {
	// Ask geolocation API for lat/lon
	console.log("(" + this.currLat + "," + this.currLon + ")");

	console.log("REACHED4");
	var inst = this;
	if (this.currLat === "Loading..." || this.currLon === "Loading...") {
		navigator.geolocation.getCurrentPosition(function(position) {
			console.log("REACHED7");
			inst.currLat = position.coords.latitude;
			inst.currLon = position.coords.longitude;
			startTimeCell.textContent = inst.startTime;
			startLocCell.textContent = "(" + inst.currLat + "," + inst.currLon + ")";
		});
	}
	startTimeCell.textContent = this.startTime;
	startLocCell.textContent = "(" + this.currLat + "," + this.currLon + ")";
};
InitialEntry.instances = [];		// Stores all existing instances


// Working!!!
function createNewInitialEntry() {

	// Update button text
	var x = document.getElementById("Start_Stop_Button");
	x.innerHTML = "Stop";

	// Insert new row in our records table
	var table = document.getElementById("timesTable");
	var row = table.insertRow();
	row.length = 5;
	console.log("REACHED");

	// Generate new record object
	var newEntry = new InitialEntry();
	console.log("REACHED2");
	
	// Insert Start info cells
	var startTimeCell = row.insertCell(0);
	var startLocCell = row.insertCell(1);
	console.log("REACHED6");

	// Populate Start info
	newEntry.populateTimeAndLoc(startTimeCell, startLocCell);
	console.log("REACHED8");

	// for (var i = 0; i < row.length; i++) {
	// 	var newCell = row.insertCell(i);
	// 	newCell.textContent = "1";
	// 	newCell.style.textAlign = "center";	
	// 	getPosition(row, i);	// Async call for geolocation
	// }
	// row.insertCell(-1).textContent = "2";      
	// row.insertCell(-1).textContent = "3";      

}

// Works async
function getPosition(row, cellIndex) {
	navigator.geolocation.getCurrentPosition(function(position) {
			var targetCell = row.cells[cellIndex];
			targetCell.textContent = position.coords.latitude;
			console.log("CALLED!");
		});
}
document.getElementById("Start_Stop_Button").addEventListener("click", function() {
	createNewInitialEntry();
});

document.addEventListener("click", function(){
	document.getElementById("demo").innerHTML = "Hello World";
});



// An object generated when the Stop button is pressed.
// class EndEntry {
// 	constructor(initialEntry) {
// 		var endDate = new Date();
// 		this.endDate = endDate;
// 		this.endTime = startTime;
// 		this.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
// 		this.currLat = currLat;
// 		this.currLon = currLon;
// 		this.timeElapsed = endDate.getTime() - initialEntry.getStartDate().getTime();		// Expressed in milliseconds
//
// 		// Ask geolocation API for lat/lon
// 		navigator.geolocation.getCurrentPosition(function(position) {
// 		  this.currLat = position.coords.latitude;
// 		  this.currLon = position.coords.longitude;
// 		});
// 	}
// 	getEndDate() {
// 		return this.endDate;
// 	}
// 	getEndPos() {
// 		return "Latitude: " + this.currLat + ", " + "Longitude: " + this.currLon;
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

