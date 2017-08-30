// Initialize Firebase
  var config = {
    apiKey: "AIzaSyB8db6Euu-ptfoyColPQn2VFUYzE7KGR20",
    authDomain: "ocations-44191.firebaseapp.com",
    databaseURL: "https://ocations-44191.firebaseio.com",
    projectId: "ocations-44191",
    storageBucket: "",
    messagingSenderId: "661022780335"
  };
  firebase.initializeApp(config);
  var db = firebase.database();

//Global map variable
var map;

//Create a single infowindow
var infoWindow = new google.maps.InfoWindow();

//Function run on DOM load

//hide form
function hideForm() {
  var $form = document.getElementById("container-form");
  $form.style.visibility = "hidden";
  $form.style.top = "0";
  $form.style.left = "19%";
}





// add listeners to buttons
document.getElementById("need-help").addEventListener("click", goToForm)
document.getElementById("rescuing").addEventListener("click", rescuer)


//for entry



var reviewForm = document.getElementById('reviewForm');


reviewForm.addEventListener('submit', (e) => {
  e.preventDefault();

  var name = document.getElementById('Name');
  var phoneNumber = document.getElementById('PhoneNumber');
  var numberOfPeople = document.getElementById('NumberOfPeople');
  var address = document.getElementById('Address');
  var details = document.getElementById('Details');

  //rescuee();
  var id = 'locations/' + Date.now()

  db.ref(id).set({
    name: name.value,
    phoneNumber: phoneNumber.value,
    numberOfPeople: numberOfPeople.value,
    address: address.value,
    details: details.value,
    lat: 0,
    lng: 0
  });

  rescuee(id);

})







function displayMap() {
  //remove buttons
  var parent = document.getElementById("container");
  var child = document.getElementById("landing");
  parent.removeChild(child);

  //Set the map options
  var mapOptions = {

      //Zoom on load
      zoom: 9,

      //Map center
      center: new google.maps.LatLng(29.65,-95.3),

      //Set the map style
      styles: shiftWorkerMapStyle
  };

  //Get the id of the map container div
  var mapId = document.getElementById('map');

  //Create the map
  map = new google.maps.Map(mapId,mapOptions);
}


function goToForm() {
  var $form = document.getElementById("container-form");
  var $landing = document.getElementById("landing");
  $landing.style.visibility = "hidden";
  $form.style.visibility = "visible";
}


function rescuee(id) {
    var $form = document.getElementById("container-form");
    $form.style.visibility = "hidden";

    displayMap();

    if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location Registered');
            infoWindow.open(map);
            map.setCenter(pos);
            //adding your marker
            addMarkerToDatabase(pos, id);
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
          infoWindow.setPosition(pos);
          infoWindow.setContent(browserHasGeolocation ?
                                'Error: The Geolocation service failed.' :
                                'Error: Your browser doesn\'t support geolocation.');
          infoWindow.open(map);
      }
}


function addMarkerToDatabase(pos, id) {


    db.ref(id).update({
      lat: pos.lat,
      lng: pos.lng
    });
}


function rescuer() {
//Loop through the airport data
displayMap();
var locationsRef = db.ref('locations');
locationsRef.on('value', function(snapshot) {
  snapshot.forEach(function(a) {
    var latitude = a.val().lat
    var longitude = a.val().lng
    var name = a.val().name
    var phoneNumber = a.val().phoneNumber
    var numberOfPeople = a.val().numberOfPeople
    var address = a.val().address
    var details = a.val().details
    newMarker = addMarker(latitude, longitude);
    newMarker.locationData = a;
    addInfoWindow(newMarker, latitude, longitude, name, phoneNumber, numberOfPeople, address, details);
 })
})
}


function addMarker(lat,lng) {


var marker = new google.maps.Marker({

        //Position of marker
        position: new google.maps.LatLng(lat,lng),

        //Map
        map: map,

        //Icon details
        icon: {

            //URL of the image
            url: 'http://www.clker.com/cliparts/e/3/F/I/0/A/google-maps-marker-for-residencelamontagne-hi.png',

            //Sets the image size
            size: {width: 16, height: 16, f: "px", b: "px"},

            //Sets the origin of the image (top left)
            origin: new google.maps.Point(0,0),

            //Sets the anchor (middle, bottom)
            anchor: new google.maps.Point(16,32),

            //Scales the image
            scaledSize: {width: 16, height: 16, f: "px", b: "px"}
        },

        //Sets the title when mouse hovers
        title: 'location'

    });
    return marker;
 }






// {width: 16, height: 16, f: "px", b: "px"}

//Associate an infowindow with the marker
function addInfoWindow(marker, lat, lng, name, phoneNumber, numberOfPeople, address, details) {



    //Content string
    var contentString = '<div class="infowindowcontent">'+
        '<div class="row">' +
        '<p class="location">'+name+'</p>'+
        '<p class="code">Phone #: '+phoneNumber+'</p>'+
        '<p class="code">People: '+numberOfPeople+'</p>'+
        '<p class="code">Address: <span>'+address+'</span></p>'+
        '<p class="code">Details: <span>'+details+'</span></p>'+
        '</div>'+
        '<div class="data">'+
        '<p class="tagbelow"></p>'+
        '<p class="label">Arrivals</p>'+
        '<p class="label">Departures</p>'+
        '<p class="coords">'+lat+' , '+lng+'</p>' +
        '</div>'+
        '</div>';

    //Add click event listener
    google.maps.event.addListener(marker, 'click', function() {

        //Close any open infowindows
        infoWindow.close();

        //Set the new content
        infoWindow.setContent(contentString);

        //Open the infowindow
        infoWindow.open(map,marker);

    });
}



//Add Commas to number
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

//Load the map
google.maps.event.addDomListener(window, 'load', hideForm());
