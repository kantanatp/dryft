document.addEventListener("DOMContentLoaded", function() {
    // Attach an event listener to the "Back to Main" button
    const backToMainButton = document.getElementById("backToMainButton");

    if(backToMainButton) {
        backToMainButton.addEventListener("click", function() {
            // Navigate to the "/main" page when the button is clicked
            window.location.href = '/main';
        });
    }
});
