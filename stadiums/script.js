var baseUrl = "https://statsapi.mlb.com";
var dims = ["leftLine","left","leftCenter","center","rightCenter","right","rightLine"];
var dimText = ["LF Line","LF","LC","CF","RC","RF","RF Line"];
var gamesTab;
window.onload = function() {
	gamesTab = document.getElementById("gamesTab");
	var que = window.location.search.substring(1);
	spl = que.split("&");
	
	getData(baseUrl+"/api/v1/venues/"+spl[0]+"?"+spl[1]+"&hydrate=location,fieldInfo").then((value) => {
		console.log(value);
		var stadium = value.venues[0];
		document.getElementById("stadName").innerText = value.venues[0].name + " ("+stadium.season+")";
		document.getElementById("location").innerText = value.venues[0].location.city + ",";
		if (value.venues[0].location.country == "USA") {
			document.getElementById("location").innerText+= " " + value.venues[0].location.stateAbbrev;
		} else {
			document.getElementById("location").innerText+= " " + value.venues[0].location.country;
		}
		getData(baseUrl + "/api/v1/schedule?sportId=1&venueIds="+spl[0]+"&"+spl[1]+"&hydrate=team").then((val) => {
			console.log(val);
			var g = val.dates.map(e => e.games);
			console.log(g);
			var gamesArr = [];
			while (g.length > 0) {
				gamesArr = gamesArr.concat(g[0]);
				g.shift();
			}
			var hT = [...new Set(gamesArr.map(e => e.teams.home.team.clubName))];
			console.log(hT);
			var homes = document.createElement("p");
			homes.innerText = "Home Teams: " + hT.join(", ");
			document.getElementById("location").after(homes);
			gamesTab.innerHTML="<tr><th>Date</th><th>Away</th><th>Home</th></tr>";
			for ( var i = 0; i < gamesArr.length; i++) {
				var row = document.createElement("tr");
				var date = document.createElement("td");
				var rd = document.createElement("td");
				var hm = document.createElement("td");
				date.innerHTML = "<a href=\"http://mlb.com/gameday/"+gamesArr[i].gamePk+"\" target=\"_blank\">"+gamesArr[i].officialDate + " " + (gamesArr[i].description || "") +"</a>";
				rd.innerHTML = gamesArr[i].teams.away.team.name + " " + gamesArr[i].teams.away.score;
				hm.innerHTML = gamesArr[i].teams.home.team.name + " " + gamesArr[i].teams.home.score;
				row.append(date,rd,hm);
				gamesTab.appendChild(row);
			}
			gamesTab.innerHTML = gamesTab.innerHTML.replaceAll("undefined", "&ndash;");
			var info = document.createElement("p");
			info.innerHTML = "Capacity: " + stadium.fieldInfo.capacity + "&emsp;Turf: " + stadium.fieldInfo.turfType+"&emsp;Roof Type: "+stadium.fieldInfo.roofType;
			if (stadium.fieldInfo.center) {
				info.innerHTML+= "<br/>Dimensions: ";
				for (var i = 0; i < dims.length; i++) {
					if (stadium.fieldInfo[dims[i]]) {
						info.innerHTML+= dimText[i] + " &ndash; " + stadium.fieldInfo[dims[i]] + " ft.&emsp;";
					}
				}
			}
			homes.after(info);
			info.innerHTML = info.innerHTML.replaceAll("undefined","unknown");
		});
	});
}


async function getData(url) {
	var ret;
	var jso = await fetch(url);
	ret = await jso.json();
	return ret;
}