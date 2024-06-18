var baseURL = "https://statsapi.mlb.com/api/v1/";
var yr = new Date().getFullYear();
window.onload = function() {
	for (var i = 1901; i <= yr; i++) {
		var opt = document.createElement("option");
		opt.value = i;
		opt.innerText = i;
		document.getElementById("yr").appendChild(opt);
	}
}
function yrChange() {
	getData(baseURL+"venues/?season="+document.getElementById("yr").value+"&hydrate=location").then((val) => {
		console.log(val.venues);
		var venue = val.venues;
		document.getElementById("stadOut").innerHTML="<tr><th>Stadium</th><th>Location</th></tr>";
		for (var i = 0; i < venue.length; i++) {
			var row = document.createElement("tr");
			var stad = document.createElement("td");
			var loc = document.createElement("td");
			stad.innerHTML = "<a href=\"stadiums/?"+venue[i].id+"&season="+ document.getElementById("yr").value+"\">"+venue[i].name+"</a>";
			loc.innerText = venue[i].location.city+ ", ";
			if (venue[i].location.country != "USA") {
				loc.innerText+= venue[i].location.country;
			} else {
				loc.innerText+=  (venue[i].location.stateAbbrev || "");
			}
			row.append(stad,loc);
			document.getElementById("stadOut").appendChild(row);
		}
	});
}
async function getData(url) {
	var ret;
	var jso = await fetch(url);
	ret = await jso.json();
	return ret;
}