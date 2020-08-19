var map;
var breweries;
const fullBeer = "./assets/img/beer.png"
const emptyBeer = "./assets/img/emptybeer.png";

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
  newLink.addClass("panel-block");
  newLink.text(brewery.name);
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

  var queryURL = "https://api.openbrewerydb.org/breweries?by_city=charlotte"


  // creates markers for breweries
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    console.log(response);

    breweries = response;

    console.log('image')
    for (var i = 0; i < response.length; i++) {
      if (response[i].state === "North Carolina" && response[i].latitude !== null && response[i].longitude !== null) {
        createMarker(response[i]);
        createRow(response[i]);
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
  var newBrew = $("<p>");
  newBrew.addClass("title is-4");
  newBrew.text(brewery.name);
  $("#random-brewname").append(newBrew);

  // var newLink = $("<a>");
  // newLink.addClass("panel-block");
  // newLink.text(brewery.name);
  // $("#breweries").append(newLink);

  // console.log(breweryName);
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












// var queryURL = "https://api.brewerydb.com/v2/beer/:beerId/breweries/?key=2db2db282e38ab26a08d62e2ed00dfe1";

// var queryURL ="https://api.openbrewerydb.org/breweries?by_city=charlotte"
// $.ajax({
//   url: queryURL,
//   method: "GET"
// }).then(function(response) {
//   // var res = (response)
//   // var brewObj = JSON.stringify(response)
//   console.log(response);
//   console.log(response[0])
//   console.log(brewObj)
//   initMap(response)

// });

//   // Note: This example requires that you consent to location sharing when
//       // prompted by your browser. If you see the error "The Geolocation service
//       // failed.", it means you probably did not give permission for the browser to
//       // locate you.
//       var map, infoWindow;
//       function initMap(response) {
//         console.log(response)
//         map = new google.maps.Map(document.getElementById('map'), {
//           center: {lat: -34.397, lng: 150.644},
//           zoom: 6
//         });
//         infoWindow = new google.maps.InfoWindow;

//         // Try HTML5 geolocation.
//         if (navigator.geolocation) {
//           navigator.geolocation.getCurrentPosition(function(position) {
//             var pos = {
//               lat: response[0].latitude,
//               lng: response[0].longitude
//             };
//             // lat: position.coords.latitude,
//             // lng: position.coords.longitude

//             infoWindow.setPosition(pos);
//             infoWindow.setContent('Location found.');
//             infoWindow.open(map);
//             map.setCenter(pos);
//           }, function() {
//             handleLocationError(true, infoWindow, map.getCenter());
//           });
//         } else {
//           // Browser doesn't support Geolocation
//           handleLocationError(false, infoWindow, map.getCenter());
//         }
//       }

//       function handleLocationError(browserHasGeolocation, infoWindow, pos) {
//         infoWindow.setPosition(pos);
//         infoWindow.setContent(browserHasGeolocation ?
//                               'Error: The Geolocation service failed.' :
//                               'Error: Your browser doesn\'t support geolocation.');
//         infoWindow.open(map);
//       }







// $.ajax({
//   url: "https://www.omdbapi.com/?t=romancing+the+stone&y=&plot=short&apikey=trilogy",
//   method: "GET"
// }).then(function(response) {
//   console.log(response);
// });


// var G = ("hey")
// console.log(G)