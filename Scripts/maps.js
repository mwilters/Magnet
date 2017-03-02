$(document).ready(function () {
    $('#locations').DataTable();
    $('#nearMe').click(initMap);


    //Clear Text Boxes
    $('#citySearch').focus(function () {
        $('#searchSelected').val('');
        $('#postalSearch').val('');
    });
    $('#postalSearch').focus(function () {
        $('#searchSelected').val('');
        $('#citySearch').val('');
    });
    $('#searchSelected').focus(function () {
        $('#citySearch').val('');
        $('#postalSearch').val('');
    });
    $('#formClear').click(function () {
        $('#citySearch').val('');
        $('#postalSearch').val('');
        $('#radiusSearch').val('');
        $('#searchSelected').val('');
    });
});

var app = angular.module('myapp', ['ui.bootstrap', 'angular.filter']); //dependency we should add to angular application  

app.controller('mapsController', function ($scope, $http) {
    $scope.markers = [];
    $scope.locations = [];
    $scope.cities = [];
    $scope.nearByLocations = [];
    $scope.avgWaitTime = 0;
    $scope.numLocations = 0;
    var currentLat = 0.0;
    var currentLng = 0.0;

    $scope.selected = undefined;
    $scope.selectedCity = undefined;

    $scope.clearForm = function () {
        $scope.selectedCity = "";
    }

    //to get all the locations from the server for live search
    $http.get('/Home/GetAllLocation').then(function (data) {
        $scope.locations = data.data;
    }, function () {
        alert('Error getting all locations');
    });

    //to get all the locations from the server for live search
    $http.get('/Home/GetCities').then(function (data) {
        $scope.cities = data.data;
    }, function () {
        alert('Error getting all locations');
    });

    //Get nearby locations - passing currentLat/Lng and map object and datatable
    $scope.GetNearByLocations = function (currentLat, currentLng, map, searchRadius) {
        $http.get('/Home/GetNearByLocations',
        {
            params:
            {
                currentLat: currentLat,
                currentLng: currentLng,
                searchRadius: searchRadius
            }
        }).then(function (data) {
            //Return data from controller
            $scope.nearByLocations = data.data;

            //Reset avgWaitTime
            $scope.avgWaitTime = 0;
            $scope.numLocations = 0;

            for (var i = 0; i < $scope.nearByLocations.length; i++) {
                $scope.nearByLocations[i].WaitTime.LastUpdated = formatDate($scope.nearByLocations[i].WaitTime.LastUpdated);

                //Calculate Average WaitTime
                $scope.avgWaitTime = $scope.avgWaitTime + $scope.nearByLocations[i].WaitTime.CurrentWaitTime;
            }

            //Format Average Wait Time
            $scope.avgWaitTime = Math.round($scope.avgWaitTime / $scope.nearByLocations.length) + " min";

            //Number of Locations
            $scope.numLocations = $scope.nearByLocations.length;

            //Create Markers
            for (var i = 0, length = $scope.nearByLocations.length; i < length; i++) {
                var data = $scope.nearByLocations[i];
                //var latLng = new google.maps.LatLng(data.Latitude, data.Longitude);

                // Creating a marker and putting it on the map
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(data.Latitude, data.Longitude),
                    map: map,
                    title: data.Name + " - Current Wait Time: " + data.WaitTime.CurrentWaitTime + "min",

                });

                // Attaching a click event to the current marker
                google.maps.event.addListener(marker, "click", function (e) {
                    infoWindow.setContent(data.Name);
                    infoWindow.open(map, marker);
                });

                // Creating a closure to retain the correct data 
                //Note how I pass the current data in the loop into the closure (marker, data)
                (function (marker, data) {

                    // Attaching a click event to the current marker
                    google.maps.event.addListener(marker, "click", function (e) {
                        infoWindow.setContent(data.Name);
                        infoWindow.open(map, marker);
                    });

                })(marker, data);
            };

        }, function () {
            alert('Error here');
        });
    }

    //Get selected one location - passing currentLat/Lng and map object and datatable
    $scope.GetSelectedLocation = function (search, map) {
        $http.get('/Home/GetSelectedLocation',
        {
            params:
            {
                search: search
            }
        }).then(function (data) {
            //Return data from controller
            $scope.nearByLocations = data.data;

            //Format Average Wait Time
            $scope.avgWaitTime = "-";
            //Number of Locations
            $scope.numLocaitons = "-";

            //Create Markers
            for (var i = 0, length = $scope.nearByLocations.length; i < length; i++) {
                var data = $scope.nearByLocations[i];

                //Update Map Center
                var center = new google.maps.LatLng(data.Latitude, data.Longitude);
                map.setCenter(center);

                // Creating a marker and putting it on the map
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(data.Latitude, data.Longitude),
                    map: map,
                    title: data.Name + " - Current Wait Time: " + data.WaitTime.CurrentWaitTime + "min",

                });

                // Attaching a click event to the current marker
                google.maps.event.addListener(marker, "click", function (e) {
                    infoWindow.setContent(data.Name);
                    infoWindow.open(map, marker);
                });

                // Creating a closure to retain the correct data 
                //Note how I pass the current data in the loop into the closure (marker, data)
                (function (marker, data) {

                    // Attaching a click event to the current marker
                    google.maps.event.addListener(marker, "click", function (e) {
                        infoWindow.setContent(data.Name);
                        infoWindow.open(map, marker);
                    });

                })(marker, data);
            };
        }, function () {
            alert('Error here');
        });
    }
    //Get locations by city
    $scope.GetLocationsByCity = function (map, searchRadius) {
        $http.get('/Home/GetLocationsByCity',
        {
            params:
            {
                //currentLat: currentLat,
                //currentLng: currentLng,
                searchCity: searchCity
            }
        }).then(function (data) {
            //Return data from controller
            $scope.locationsByCity = data.data;

            //Create Markers
            for (var i = 0, length = $scope.locationsByCity.length; i < length; i++) {
                var data = $scope.locationsByCity[i];
                //var latLng = new google.maps.LatLng(data.Latitude, data.Longitude);

                // Creating a marker and putting it on the map
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(data.Latitude, data.Longitude),
                    map: map,
                    title: data.Name + " - Current Wait Time: " + data.WaitTime.CurrentWaitTime + "min",

                });

                // Attaching a click event to the current marker
                google.maps.event.addListener(marker, "click", function (e) {
                    infoWindow.setContent(data.Name);
                    infoWindow.open(map, marker);
                });

                // Creating a closure to retain the correct data 
                //Note how I pass the current data in the loop into the closure (marker, data)
                (function (marker, data) {

                    // Attaching a click event to the current marker
                    google.maps.event.addListener(marker, "click", function (e) {
                        infoWindow.setContent(data.Name);
                        infoWindow.open(map, marker);
                    });

                })(marker, data);
            };
        }, function () {
            alert('Error getting cities');
        });
    }
    //service that gets makers info from server  
    $scope.ShowLocation = function (locationID) {
        $http.get('/Home/GetMarkerData',
        {
            params:
            {
                locationID: locationID
            }
        }).then(function (data) {
            $scope.markers = [];
            $scope.markers.push
            ({
                id: data.data.ID,
                coords:
                {
                    latitude: data.data.Latitude,
                    longitude: data.data.Longitude
                },
                title: data.data.Name, //title of the makers  
                address: data.data.Address, //Address of the makers   
            });
            //set map focus to center  
            $scope.map.center.latitude = data.data.Latitude;
            $scope.map.center.longitude = data.data.Longitude;
        }, function () {
            alert('Error setting markers'); //shows error if connection lost or error occurs  
        });
    }

    //Show or Hide marker on map using options passes here  
    $scope.windowOptions =
      {
          show: true
      };
});

app.filter('jsonDate', ['$filter', function ($filter) {
    return function (input, format) {
        return (input) 
               ? $filter('date')(parseInt(input.substr(6)), format) 
               : '';
    };
}]);
        
///Google Map Directions - Start
//Get Value from click eveny
function getDirections() {
    //var destination = el.value;

    var origin = $('#directionFrom').val();
    var destination = $('#directionTo').val();

    //Call makeDirections, passing destination
    makeDirections(origin, destination);
}

//Make Directions
function makeDirections(origin, destination) {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 51.397, lng: -114.644 },
        zoom: 9
    });

    directionsDisplay.setMap(map);

    calculateAndDisplayRoute(directionsService, directionsDisplay, origin, destination);
}

//Calculate and Display Route
function calculateAndDisplayRoute(directionsService, directionsDisplay, origin, destination) {
    directionsService.route({
        origin: origin,
        destination: destination,
        travelMode: 'DRIVING'
    }, function (response, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}
///Google Map Directions - End

//Initial Function to load map based on current location
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 51.397, lng: -114.644 },
        zoom: 9
    });

    //directionsDisplay.setMap(map);

    //var infoWindow = new google.maps.InfoWindow({ map: map });
    var searchRadius = 100;

    //Add event listener when map dragged
    google.maps.event.addListener(map, 'dragend', function () {
        //alert('map dragged');
        var map_center_lat = map.getCenter().lat();
        var map_center_lng = map.getCenter().lng();

        //Get radius from form or use default
        if (isNaN(document.getElementById('radiusSearch'))) {
            searchRadius = 100;
            //alert(searchRadius)
        } else {
            var txt_radius = document.getElementById('radiusSearch');
            searchRadius = parseInt(txt_radius.value);
            //alert(searchRadius)
        }

        //alert("New map center " + map_center_lat + " " + map_center_lng)
        angular.element($("#mapsController")).scope().GetNearByLocations(map_center_lat, map_center_lng, map, searchRadius);
    });

    //Add event listener when map zoomed
    google.maps.event.addListener(map, 'zoom_changed', function () {
        //alert('map zoomed');
        var map_center_lat = map.getCenter().lat();
        var map_center_lng = map.getCenter().lng();
        //alert("New map center " + map_center_lat + " " + map_center_lng)

        //Get radius from form or use default
        if (isNaN(document.getElementById('radiusSearch'))) {
            searchRadius = 100;
            //alert(searchRadius)
        } else {
            var txt_radius = document.getElementById('radiusSearch');
            searchRadius = parseInt(txt_radius.value);
            //alert(searchRadius)
        }
        angular.element($("#mapsController")).scope().GetNearByLocations(map_center_lat, map_center_lng, map, searchRadius);
    });

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            
            //alert("Current Position " + pos.lat + " " + pos.lng)

            angular.element($("#mapsController")).scope().GetNearByLocations(pos.lat, pos.lng, map, searchRadius);

            //infoWindow.setPosition(pos);
            //infoWindow.setContent('Location found.');
            map.setCenter(pos);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

    //Add onchnage events for text fields to trigger search functions after user enters value
    //SearchForm - call GetNearByLocations
    document.getElementById('searchForm').addEventListener('submit', function () {
        geocodeSearchSelected(geocoder, map);
    });

    //Postal - call GetByGeoInfo passing in postal code entered.
    var geocoder = new google.maps.Geocoder();
    document.getElementById('postalForm').addEventListener('submit', function () {
        geocodeAddress(geocoder, map);
    });

    //City - call GetByGeoInfo passing in city name entered.
    //document.getElementById('citySearch').addEventListener("blur", searchCityChanged(map), false);
    var geocoder = new google.maps.Geocoder();
    document.getElementById('cityForm').addEventListener('submit', function () {
        geocodeCity(geocoder, map);
    });
}

function geocodeAddress(geocoder, resultsMap) {
    var address = document.getElementById('postalSearch').value;
    var searchRadius = 15;

    geocoder.geocode({
        'address': address
    }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            lat = results[0].geometry.location.lat();
            lng = results[0].geometry.location.lng();

            var map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: lat, lng: lng },
                zoom: 10
            });

            angular.element($("#mapsController")).scope().GetNearByLocations(lat, lng, map, searchRadius);
        }
        else {
            alert("Geocode was not successful for the following reasons:" + status);
        }
    });
}

function geocodeCity(geocoder, resultsMap) {
    var address = document.getElementById('citySearch').value;
    var searchRadius = 100;

    geocoder.geocode({
        'address': address
    }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            lat = results[0].geometry.location.lat();
            lng = results[0].geometry.location.lng();

            var map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: lat, lng: lng },
                zoom: 10
            });

            angular.element($("#mapsController")).scope().GetNearByLocations(lat, lng, map, searchRadius);
        }
        else {
            alert("Geocode was not successful for the following reasons:" + status);
        }
    });
}

function geocodeSearchSelected(geocoder, resultsMap) {
    var search = document.getElementById('searchSelected').value;

    geocoder.geocode({
        'address': search
    }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            lat = results[0].geometry.location.lat();
            lng = results[0].geometry.location.lng();

            var map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: lat, lng: lng },
                zoom: 10
            });

            angular.element($("#mapsController")).scope().GetSelectedLocation(search, map);
        }
        else {
            alert("Geocode was not successful for the following reasons:" + status);
        }
    });
}

    //Search Functions
    function searchRadiusChanged(map) {
        var map_center_lat = map.getCenter().lat();
        var map_center_lng = map.getCenter().lng();
        var searchRadius = 25;
        var txt_radius = document.getElementById('radiusSearch');
        alert("New search radius entered...searching")

        //Get radius from form or use default
        if (isNaN(document.getElementById('radiusSearch'))) {
            searchRadius = 25;
            //alert(searchRadius)
        } else {
            searchRadius = parseInt(txt_radius.value);
            //alert(searchRadius)
        }

        angular.element($("#mapsController")).scope().GetNearByLocations(map_center_lat, map_center_lng, map, searchRadius);
    }

    function searchPostalChanged(map) {
        alert("Postal code changed...searching");

        //Get radius from form or use default
        if (isNaN(document.getElementById('radiusSearch'))) {
            searchRadius = 25;
            //alert(searchRadius)
        } else {
            var txt_radius = document.getElementById('radiusSearch');
            searchRadius = parseInt(txt_radius.value);
            //alert(searchRadius)
        }

        //Get the lat/lng of postal code and pass to GetNearByLocations function
        var txt_postalCode = document.getElementById('postalSearch');
        searchPostal = parseInt(txt_postalCode.value);

        //Get the lat/lng of the postal code area and do a search on nearby locations using
        //same function as using users current location.  Also pass searchRadius or use default.
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            'searchPostal': searchPostal
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                lat = results[0].geometry.location.lat();
                lng = results[0].geometry.location.lng();
            }
            else {
                alert("Geocode was not successful for the following reasons:" + status);
            }
        });
    }
function searchCityChanged(map) {
    alert("City name changed...searching");

    var txt_city = document.getElementById('citySearch');
    searchCity = parseInt(txt_city.value);

    alert(searchCity);

    //Get the lat/lng of the city entered to create a new map
    geocoder.geocode({
        'searchCity': searchCity
    }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            lat = results[0].geometry.location.lat();
            lng = results[0].geometry.location.lng();
        }
        else {
            alert("Geocode was not successful for the following reasons:" + status);
        }
    });

    //Create new Map for City being searched
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: lat, lng: lng },
        zoom: 7
    });

    angular.element($("#mapsController")).scope().GetLocationsByCity(map, searchCity);
}

function searchLocations() {
    var address = document.getElementById("addressSearch").value;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            searchLocationsNear(results[0].geometry.location);
        } else {
            alert(address + ' not found');
        }
    });
}

function formatDate(date) {
    //Convert JSON Date to JavaScript Date
    var date = new Date(parseInt(date.substr(6)));

    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
}