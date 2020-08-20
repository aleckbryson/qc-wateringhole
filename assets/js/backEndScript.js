var map;
var breweries;
var userPos = null;
const fullBeer = "./assets/img/beer.png"
const emptyBeer = "./assets/img/emptybeer.png";
var beerLat;
var beerLon;

function createMarker(brewery) {
  var latLng = new google.maps.LatLng(brewery.latitude, brewery.longitude);
  var marker = new google.maps.Marker({
    position: latLng,
    map: map,
    title: brewery.name,
    icon: fullBeer,
  });
}

function createRow(brewery) {
  var newLink = $("<a>");
  newLink.attr("href", "https://www.google.com/maps/dir/?api=1&origin=" + userPos.coords.latitude + "," + userPos.coords.longitude + "&destination=" + brewery.latitude + "," +brewery.longitude)
  newLink.attr("target", "_blank");
  newLink.addClass("panel-block");
  var milesAway = brewery.durationFromUser; 
  // $("#breweries").css("font-style: italic", milesAway);
  newLink.text(brewery.name + " - " + milesAway + " away from you");
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
  beerLat = brewery.latitude;
  beerLon = brewery.longitude;
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
    console.log(response);

    breweries = response;
    for (let i = 0; i < response.length; i++) {
      let brewery = response[i];

      if (brewery.state === "North Carolina" &&
        brewery.latitude !== null &&
        brewery.longitude !== null) {
        calcDistance(brewery, function (distance) {
          brewery.distanceFromUser = distance.rows[0].elements[0].distance.text;
          brewery.durationFromUser = distance.rows[0].elements[0].duration.text;
          console.log(brewery);
          createMarker(brewery);
          createRow(brewery);
        });
      }
    }
  });

  // create a button to randomaly pick a brewery
  //use id="random-button"

  


  // show brewery on the screen
  // get user's location and create marker
  navigator.geolocation.getCurrentPosition(function (position) {
    console.log(position);

    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var marker = new google.maps.Marker({
      position: latLng,
      map: map,
      title: "You Are Here",
      icon: emptyBeer,


    });
  });
}

function randomBrewery() {
  // need to pick from the previously generated list of breweries 
  var brewery = breweries[Math.floor(Math.random() * breweries.length)];
  console.log(brewery)
  var brewImg = $("<img>");
  var newBrew = $("<p>");
  var brewCon = $("<div>")
  var website = $("<a>")
  newBrew.addClass("title is-4");
  newBrew.text(brewery.name);
  brewCon.addClass("content");
  brewCon.text("ADDRESS:  " + brewery.street + ", " + brewery.city + ", " + brewery.state);
  website.addClass("content");
  
  //appending random brewery name and address and website
  $("#random-brewname").append(newBrew);
  $("#brewname-content").append(brewCon);
  
  //if website isn't available then webdite link will not append
  if (brewery.website_url !== "") {
    website.text("WEBSITE:  " + brewery.website_url);
    $("#brewname-content2").attr("href", brewery.website_url);
    $("#brewname-content2").append(website);
  }
}

$("#beer-button").on("click", function () {
  $(".clicked").addClass("is-hidden");
  $(".show-options").addClass("is-flex-widescreen").removeClass("is-hidden");
});

$("#random-button").on("click", function () {
  $(".show-options").addClass("is-hidden");
  $(".random-option").addClass("is-flex-widescreen").removeClass("is-hidden");
  randomBrewery()
});

// get user's location and create marker
navigator.geolocation.getCurrentPosition(function (position) {
  //console.log(position);
  userPos = position;

  var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

  var marker = new google.maps.Marker({
    position: latLng,
    map: map,
    title: "You Are Here",
    icon: emptyBeer,
  });

  queryBreweries();
});

