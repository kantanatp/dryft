let map;
let directionsService;
let directionsRenderer;
let watchID;
let startLocation; // Should be set from local storage or query params
let endLocation; // Should be set from local storage or query params
let currentLocationMarker; // Marker for the current location

function initMap() {
    startLocation = JSON.parse(localStorage.getItem('startLocation'));
    endLocation = JSON.parse(localStorage.getItem('endLocation'));
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: startLocation || {lat: -34.397, lng: 150.644} // Default center, update with actual location
    });
    directionsRenderer.setMap(map);

    if (startLocation && endLocation) {
        calculateAndDisplayRoute(startLocation, endLocation);
    }

    // Initial marker for the current location
    if (!currentLocationMarker && startLocation) {
        currentLocationMarker = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            center: startLocation,
            radius: 10
        });
    }

    // Update current location every 10 seconds
    watchID = navigator.geolocation.watchPosition(
        position => {
            const updatedLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            // Update the position of the current location marker
            if (currentLocationMarker) {
                currentLocationMarker.setCenter(updatedLocation);
            } else {
                currentLocationMarker = new google.maps.Circle({
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#FF0000',
                    fillOpacity: 0.35,
                    map: map,
                    center: updatedLocation,
                    radius: 10
                });
            }
            // Recalculate route from updated location to end location if needed
            calculateAndDisplayRoute(updatedLocation, endLocation);
        },
        null,
        {timeout: 10000}
    );
}

function calculateAndDisplayRoute(startLoc, endLoc) {
    directionsService.route({
        origin: startLoc,
        destination: endLoc,
        travelMode: 'DRIVING'
    }, (response, status) => {
        if (status === 'OK') {
            directionsRenderer.setDirections(response);
            // Get the remaining distance from the last leg of the trip
            const remainingDistance = response.routes[0].legs[0].distance.text;
            document.getElementById('remaining-distance').textContent = `Remaining Distance: ${remainingDistance}`;
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}
