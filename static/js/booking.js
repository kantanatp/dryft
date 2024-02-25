document.addEventListener('DOMContentLoaded', function() {
    fetch('static/json/drivers.json')
        .then(response => response.json())
        .then(drivers => {
            // Sort drivers by max bid
            drivers.sort((a, b) => a.maxBid - b.maxBid);

            displayDrivers(drivers);
        })
        .catch(error => console.error('Error loading driver data:', error));
});

function displayDrivers(drivers) {
    const driverList = document.querySelector('.driver-list');
    driverList.innerHTML = ''; // Clear existing entries

    drivers.forEach(driver => {
        const driverArticle = document.createElement('article');
        driverArticle.className = 'driver';
        const driverName = `${driver.firstName} ${driver.lastName.charAt(0)}.`;

        driverArticle.innerHTML = `
            <div class="driver-details">
                <img src="static/images/defaultimage.jpeg" alt="${driverName}'s Profile Picture" class="driver-photo">
                <div class="driver-info">
                    <h2 class="driver-name">${driverName}</h2>
                    <p class="car-type">${driver.carType}</p>
                </div>
            </div>
            <div class="driver-action">
                <p class="driver-bid" id="bid-${driver.id}">Current Bid: $${driver.maxBid}</p>
                <button class="select-driver" data-driver-id="${driver.id}">Place Bid</button>
            </div>
        `;

        // Append the driver entry to the driver list
        driverList.appendChild(driverArticle);
    });

    // Add event listeners for the new buttons
    addSelectDriverEventListeners(drivers);
}

function addSelectDriverEventListeners(drivers) {
    const selectButtons = document.querySelectorAll('.select-driver');
    selectButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            const driverId = event.target.getAttribute('data-driver-id');
            const driver = drivers.find(d => d.id.toString() === driverId);
            const newBid = prompt(`Place your bid for ${driver.firstName}: (Current Bid(Yours): $${driver.maxBid})`);
            
            if (newBid && !isNaN(newBid) && parseFloat(newBid) > driver.maxBid && parseFloat(newBid) >= driver.maxBid + 0.5) {
                driver.maxBid = parseFloat(newBid).toFixed(2);
                document.getElementById(`bid-${driverId}`).textContent = `Current Bid (Yours): $${newBid}`; // Update the displayed bid
            } else {
                alert('Invalid bid. Bid must be at least $0.50 more than the current max bid.');
            }
        });
    });
}
document.addEventListener('DOMContentLoaded', function() {
    // Existing code to fetch and display drivers...

    // Add event listener for the "Finish Bidding" button
    const finishBiddingButton = document.getElementById('finish-bidding');
    finishBiddingButton.addEventListener('click', function() {
        window.location.href = 'trip'; // Redirect to the trip page
    });
});
