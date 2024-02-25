// Initialize and add the map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 18, // Closer zoom level
        center: {lat: 40.1164, lng: -88.2434} // Default center, will update to current location
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    // HTML5 geolocation for the user's current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            map.setCenter(currentLocation);
            directionsRenderer.setOptions({
                polylineOptions: {
                    strokeColor: '#4285F4',
                    strokeOpacity: 0.8,
                    strokeWeight: 6
                }
            });
            // Represent the user's current location with a blue dot
            new google.maps.Circle({
                strokeColor: '#4285F4',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#4285F4',
                fillOpacity: 0.35,
                map: map,
                center: currentLocation,
                radius: 10
            });

            // Listen for clicks on the map to set the destination
            map.addListener('click', function(mapsMouseEvent) {
                // Use a confirmation dialog
                let userConfirmed = confirm("Set this as your drop-off point?");
                if (userConfirmed) {
                    calculateAndDisplayRoute(directionsService, directionsRenderer, mapsMouseEvent.latLng);
                }
            });

        }, function() {
            handleLocationError(true, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, map.getCenter());
    }
    var markers = {
        start: new google.maps.Marker({
            map: map,
            anchorPoint: new google.maps.Point(0, -29)
        }),
        end: new google.maps.Marker({
            map: map,
            anchorPoint: new google.maps.Point(0, -29)
        })
    };
    
    // Input fields for the starting point and destination
    var inputStart = document.getElementById('start');
    var inputEnd = document.getElementById('end');

    // Autocomplete functionality for input fields
    var autocompleteStart = new google.maps.places.Autocomplete(inputStart);
    var autocompleteEnd = new google.maps.places.Autocomplete(inputEnd);

    // Bind the map's bounds to the autocomplete objects
    autocompleteStart.bindTo('bounds', map);
    autocompleteEnd.bindTo('bounds', map);

    // Marker for the starting point
    autocompleteStart.addListener('place_changed', function() {
        markers.start.setVisible(false);
        var place = autocompleteStart.getPlace();
        if (!place.geometry) {
            window.alert("No details available for input: '" + place.name + "'");
            return;
        }
        expandViewportToFitPlace(map, place, markers.start);
    });

    // Marker for the destination
    autocompleteEnd.addListener('place_changed', function() {
        markers.end.setVisible(false);
        var place = autocompleteEnd.getPlace();
        if (!place.geometry) {
            window.alert("No details available for input: '" + place.name + "'");
            return;
        }
        expandViewportToFitPlace(map, place, markers.end);
    });
}
function calculateAndDisplayRoute(directionsService, directionsRenderer, destination) {
    directionsService.route({
        origin: currentLocation,
        destination: destination,
        travelMode: 'DRIVING'
    }, function(response, status) {
        if (status === 'OK') {
            directionsRenderer.setDirections(response);
            const distance = response.routes[0].legs[0].distance.text;
            displayDistanceAndPrice(distance);
            localStorage.setItem('startLocation', JSON.stringify(currentLocation));
            localStorage.setItem('endLocation', JSON.stringify(destination));
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}

function displayDistanceAndPrice(distance) {
    let infoDiv = document.getElementById('distance-price-info');
    infoDiv.innerHTML = `<div>Distance: ${distance}</div>`;
    // Create buttons
    let buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    
    let cancelButton = document.createElement('button');
    cancelButton.className = 'button';
    cancelButton.textContent = 'Cancel';
    cancelButton.onclick = clearRoute;
    
    let bookingButton = document.createElement('button');
    bookingButton.className = 'button';
    bookingButton.textContent = 'Booking';
    bookingButton.onclick = function() {
        window.location.href = 'booking'; // Redirect to booking.html
    };
    
    // Append buttons to container
    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(bookingButton);
    
    // Append container to infoDiv
    infoDiv.appendChild(buttonContainer);
    
    infoDiv.style.display = 'flex'; // Show the info bar with flex layout
}

function clearRoute() {
    // Clear the current route from the map
    directionsRenderer.set('directions', null);
    // Hide the distance-price-info div
    document.getElementById('distance-price-info').style.display = 'none';
}

function handleLocationError(browserHasGeolocation, pos) {
    alert(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
    map.setCenter(pos);
}
// Function to fit the map around the selected place and show a marker
function expandViewportToFitPlace(map, place, marker) {
    if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
    } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
    }
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);
}
