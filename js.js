var map;
var userPos = null;
const fullBeer = "./assets/img/beer.png"
const emptyBeer = "./assets/img/emptybeer.png";

function createMarker(brewery) {
  var latLng = new google.maps.LatLng(brewery.latitude, brewery.longitude);
  var marker = new google.maps.Marker({
    position: latLng,
    map: map,
    title: brewery.name,
    // icon: fullBeer,
  });
}

function createRow(brewery) {
  var newLink = $("<a>");
  newLink.addClass("panel-block");
  newLink.text(brewery.name);
  newLink.text(brewery.distanceFromUser)
  $("#breweries").append(newLink);

  var newSpan = $("<span>");
  newSpan.addClass("panel-icon");
  newLink.prepend(newSpan);

  var newIcon = $("<i>");
  newIcon.addClass("fa fa-beer");
  newIcon.attr("aria-hidden", "true");
  newSpan.append(newIcon);
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10.5,
    center: new google.maps.LatLng(35.223790, -80.841140),
    mapTypeId: 'terrain'
  });
}

function calcDistance(brewery, cb) {
  if (userPos === null) {
    return alert("No position yet");
  }

  var queryUrl = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + userPos.coords.latitude + "," + userPos.coords.longitude + "&destinations=" + brewery.latitude + "," + brewery.longitude + "&key=AIzaSyALpzkW8PTJ7k9963498EIvN2uIgfIuYgI";

  $.ajax({
    url: queryUrl,
    method: "GET"
  }).then(function (response) {
    cb(response);
  });
}

function queryBreweries() {
  var queryURL = "https://api.openbrewerydb.org/breweries?by_city=charlotte"

  // creates markers for breweries
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    //for (var i = 0; i < response.length; i++) {
    for (let i = 0; i < response.length; i++) {
      let brewery = response[i];
      
      if (brewery.state === "North Carolina" &&
          brewery.latitude !== null && 
          brewery.longitude !== null) {
        calcDistance(brewery, function (distance) {
          brewery.distanceFromUser = distance.rows[0].elements[0].distance.text;
          console.log(brewery);
          createMarker(brewery);
          createRow(brewery);
        });
      }
    }
  });
}

// get user's location and create marker
navigator.geolocation.getCurrentPosition(function (position) {
  //console.log(position);
  userPos = position;

  var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

  var marker = new google.maps.Marker({
    position: latLng,
    map: map,
    title: "You Are Here",
    // icon: emptyBeer,   
  });

  queryBreweries();
});
