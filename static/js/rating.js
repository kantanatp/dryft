document.addEventListener("DOMContentLoaded", function() {
    const stars = document.querySelectorAll(".star");
    const ratingContainer = document.querySelector(".stars");
    let rating = 0;
    const commentBox = document.getElementById("comment");
    const submissionMessageDiv = document.getElementById("submissionMessage"); // New message div
    const submitRatingBtn = document.getElementById("submitRating");

    stars.forEach((star, index) => {
        star.addEventListener("click", () => {
            ratingContainer.setAttribute("data-rating", index + 1);
            rating = index + 1;
            updateStars(rating);
        });
    });

    function updateStars(rating) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add("selected");
            } else {
                star.classList.remove("selected");
            }
        });
    }

    submitRatingBtn.addEventListener("click", () => {
        // Assuming rating and comment submission logic here

        // Display submission success message and clear comment box
        submissionMessageDiv.textContent = 'Submitted successfully';
        submissionMessageDiv.style.color = "green";
        commentBox.value = ""; // Clear the comment box
    });

    document.getElementById("returnMain").addEventListener("click", () => {
        window.location.href = "/main"; // Adjust the path as necessary
    });
});
