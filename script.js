// Table sort
function sortTableBy(n) {
  var i, a, b, table, rows, swapping, shouldSwap, swapCounter = 0, direction; 
  table = document.getElementById("topPlayers");
  swapping = 1;
  direction = "ascending";
  while (swapping == 1) {
    swapping = 0;
    rows = table.rows;
    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwap = 0;
      a = rows[i].getElementsByTagName("td")[n];
      b = rows[i + 1].getElementsByTagName("td")[n];
      if(n == 0)
      if (direction == "ascending") {
        if (Number(a.innerHTML) > Number(b.innerHTML)) {
          shouldSwap = 1;
          break;
        }
      } else if (direction == "descending") {
        if (Number(a.innerHTML) < Number(b.innerHTML)) {
          shouldSwap = 1;
          break;
        }
      }
      if(n > 0)
      if (direction == "ascending") {
        if (a.innerHTML.toLowerCase() > b.innerHTML.toLowerCase()) {
          shouldSwap = 1;
          break;
        }
      } else if (direction == "descending") {
        if (a.innerHTML.toLowerCase() < b.innerHTML.toLowerCase()) {
          shouldSwap = 1;
          break;
        }
      }
    }
    if (shouldSwap == 1) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      swapping = 1;
      swapCounter ++;
    } else {
      if (swapCounter == 0 && direction == "ascending") {
        direction = "descending";
        swapping = 1;
      }
    }
  }
}

// Geolocation
localStorage.setItem("lat", -1);
localStorage.setItem("long", -1);

function getLocation() {
  if(localStorage.getItem("lat") == -1 && localStorage.getItem("long") == -1) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(setLocalCoords);
    } else {
      document.getElementById("map").innerHTML = "Geolocation is not supported by this browser.";
    }
  }
}

// Save current location in session storage
function setLocalCoords(position) {
  localStorage.setItem("lat", position.coords.latitude);
  localStorage.setItem("long", position.coords.longitude);
}

// Compute distance between current location and location[nr]
function distanceToTournament(nr) {
  const R = 6371e3; // metres
  const φ1 = TournamentDetails[nr][5] * Math.PI/180; // φ, λ in radians
  const φ2 = localStorage.getItem("lat") * Math.PI/180;
  const Δφ = (localStorage.getItem("lat")-TournamentDetails[nr][5]) * Math.PI/180;
  const Δλ = (localStorage.getItem("long")-TournamentDetails[nr][6]) * Math.PI/180;
  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
  Math.cos(φ1) * Math.cos(φ2) *
  Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = Math.round((R * c)/1000); // in km
  return distance;
}

// Find the minimum distance to a tournament and return its number
function minDistance() {
  var i, min = 10000, nr = 0;
  for(i = 0; i < 18; i ++) {
    distance = distanceToTournament(i);
    if(distance < min) {
      min = distance;
      nr = i;
    }
  }
  return nr;
}

// List of Tournaments
var TournamentDetails = [["FIRST SATURDAY 2021 May, Budapest GM-IM-ELO-Shev. Nadassy Sys. FM", "01 May 2021", "11 May 2021", "Budapest", "HUN", 47.4979, 19.0402], 
["14esimo torneo del Carso", "03 May 2021", "05 May 2021", "Gropada-Trieste", "ITA", 45.6651, 13.8490],
["San Bernardino Spring Open", "07 May 2021", "09 May 2021", "Mesocco", "CHE", 46.3920, 9.2327],
["Vezerkepzo GM IM FM, May 13-21", "13 May 2021", "21 May 2021", "Budapest", "HUN", 47.4979, 19.0402],
["Lido di Melano RAPID - International Open 15’", "15 May 2021", "15 May 2021", "Melano", "CHE", 45.9237, 8.9842],
["Mix for norms / - Third Saturday 210", "19 May 2021", "25 May 2021", "Novi-Sad", "SRB", 45.2396, 19.8227],
["Summer Open 2021", "21 May 2021", "26 May 2021", "Cattolica", "ITA", 43.9633, 12.7384],
["Open Internazionale Sud-Est Milano", "21 May 2021", "23 May 2021", "Milan", "ITA", 45.4642, 9.1900],
["Moesa Chess Festival", "21 May 2021", "24 May 2021", "Mesocco", "CHE", 46.3920, 9.2327],
["Vezerkepzo for GM, IM norms May 22-30", "22 May 2021", "30 May 2021", "Budapest", "HUN", 47.4979, 19.0402],
["8th International Chess Festival City of Cattolica", "26 May 2021", "03 Jun 2021", "Cattolica", "ITA", 43.9633, 12.7384],
["GM BANJA VRUJCI 1- 2021", "28 May 2021", "03 Jun 2021", "Banja Vrujci", "SRB", 44.2219, 20.1647],
["IM BANJA VRUJCI 1-2021", "28 May 2021", "03 Jun 2021", "Banja Vrujci", "SRB", 44.2219, 20.1647],
["10° Salento International Chess Open 2021 - Ecoresort Le Sirenè", "29 May 2021", "02 Jun 2021", "Gallipoli", "ITA", 40.0559, 17.9926],
["Zone 3.4 Zonal Open Championship", "06 May 2021", "15 May 2021", "Tashkent", "UZB", 41.2995, 69.2401],
["Zone 3.5 Zonal Open Championship", "12 May 2021", "20 May 2021", "Shaoxing", "CHN", 29.9958, 120.5861],
["Chess Tournament", "14 May 2021", "22 May 2021", "Abuja", "NGA", 9.0765, 7.3986],
["African Individual Chess Championship 2021 (Open & Women)", "17 May 2021", "28 May 2021", "Lilongwe", "MWI", 13.9626, 33.7741]]

// Display a tournament on the map and display its details
function findTournament(nr) {
  if(localStorage.getItem("lat") != -1 && localStorage.getItem("long") != -1) {
    var lat, long;
    if(nr >= 0 && nr <= 17) {
      lat = TournamentDetails[nr][5];
      long = TournamentDetails[nr][6];
    }
    var location = lat + "," + long;
    var maps_url = "https://maps.google.co.uk/?q=" + location + "&z=6&output=embed";
    document.getElementById("googleMaps").setAttribute("src", maps_url);
    
    distance = distanceToTournament(nr)
    document.getElementById("details").innerHTML = '<h1>' + TournamentDetails[nr][0] +
    '<br><img class="flag" src="photos/' + TournamentDetails[nr][4] + '.jpg" alt="Photo of ' + TournamentDetails[nr][4] +
    ' Flag" style="width:48px;height:24px;"></h1>\n<p>Starts on: ' + TournamentDetails[nr][1] + '<br>Ends on: ' +
    TournamentDetails[nr][2] + '<br>Location: ' + TournamentDetails[nr][3] +', ' + TournamentDetails[nr][4] + 
    '<br>Aprox. distance from your location: ' + distance + ' km</p>';
  }
  else {
    document.getElementById("details").innerHTML = "<h1> You must share your location in order to use this feature! </h1>";
  }
}

// Count the number of times the user has searched a tournament on the map
function buttonPressCounter() {
  if(localStorage.getItem("lat") != -1 && localStorage.getItem("long") != -1) {
    if (sessionStorage.clickcount) {
      sessionStorage.clickcount = Number(sessionStorage.clickcount) + 1;
    } else {
      sessionStorage.clickcount = 1;
    }
    document.getElementById("searched").innerHTML = "You have searched " + sessionStorage.clickcount + " Tournament(s) on the map!";
  }
}

// Switch between tabs
function openTab(evt, tab, page) {
  var i;
  defaultNone(page);
  var menu_btn = document.getElementsByClassName("menu_btn");
  for(i = 0; i < menu_btn.length; i++) {
    menu_btn[i].className = menu_btn[i].className.replace(" active", "");
  }
  
  document.getElementById(tab).style.display = "block";
  evt.currentTarget.className += " active";
}

// set display attribute for all tabs to "none" by default
function defaultNone(page) {
  var i;
  var pageClass = document.getElementsByClassName(page);
  for(i = 0; i < pageClass.length; i++) {
    pageClass[i].style.display = "none";
  }
}

// Open the first tab as default
function defaultOpen() {
  document.getElementById("defaultOpen").click();
}

// Responsive Navbar
function dropNavbar() {
  document.getElementById("nav").classList.toggle("show");
}
