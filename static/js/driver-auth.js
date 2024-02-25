document.addEventListener("DOMContentLoaded", function() {
    const licenseForm = document.getElementById("licenseForm");
    const messageDiv = document.getElementById("message");
    const detailsDiv = document.getElementById("details"); // Add a div for details in your HTML
    const uploadBtn = document.getElementById("uploadBtn");

    licenseForm.addEventListener("submit", function(event) {
        event.preventDefault();
        uploadBtn.disabled = true; // Disable the upload button
        messageDiv.textContent = 'Processing...';
        messageDiv.style.color = "black";
        detailsDiv.innerHTML = ''; // Clear previous details

        const formData = new FormData(this);

        fetch("/driver-auth", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            messageDiv.textContent = data.message;
            messageDiv.style.color = data.success ? "green" : "red";
            uploadBtn.disabled = false; // Enable the upload button
            if (data.success && data.details) {
                // Display each detail
                data.details.forEach(detail => {
                    const detailP = document.createElement("p");
                    detailP.textContent = detail;
                    detailsDiv.appendChild(detailP);
                });
            }
            if (data.success) {
                // If processing is successful, show a continue button
                const continueBtn = document.createElement("button");
                continueBtn.textContent = "Continue";
                continueBtn.onclick = function() {
                    window.location.href = "/main"; // Redirect to the next page
                };
                detailsDiv.appendChild(continueBtn); // Append the continue button below the details
            }
        })
        .catch(error => {
            messageDiv.textContent = "Error: " + error.message;
            messageDiv.style.color = "red";
            uploadBtn.disabled = false; // Enable the upload button
        });
    });
});
