document.addEventListener("DOMContentLoaded", function() {
    const paymentMethodSelect = document.getElementById("paymentMethod");
    const saveButton = document.getElementById("savePaymentMethod");
    const submitBtn = document.getElementById("submitBtn");
    const paymentFields = document.getElementById("paymentFields");
    const paymentMethodSaved = document.getElementById("paymentMethodSaved");
    const pronounsSelect = document.getElementById('pronouns');
    const pronounsOtherField = document.getElementById('pronounsOtherField');
    let paymentInfoSaved = false;

    // Event listener for pronouns select
    pronounsSelect.addEventListener('change', function() {
        // Toggle visibility of "Other" pronouns input field based on selected value
        if (this.value === 'other') {
            pronounsOtherField.style.display = 'block';
        } else {
            pronounsOtherField.style.display = 'none';
        }
        checkFormValidity();
    });

    paymentMethodSelect.addEventListener("change", function() {
        if (this.value === "credit/debit") {
            paymentFields.style.display = "block";
            checkPaymentMethodFormValidity(); // Check immediately when the section is shown
        } else {
            paymentFields.style.display = "none";
        }
        checkFormValidity();
    });

    saveButton.addEventListener("click", function() {
        paymentFields.style.display = "none";
        paymentMethodSaved.style.display = "block";
        paymentMethodSelect.style.display = "none"; // Hide payment method dropdown
        paymentInfoSaved = true; // Set flag to true
        checkFormValidity();
    });

    window.removePaymentMethod = function() {
        paymentMethodSaved.style.display = "none";
        paymentMethodSelect.style.display = "block";
        paymentMethodSelect.value = ""; // Reset dropdown
        checkFormValidity();
    };

    // Add event listener to all input fields for form validation
    const inputs = document.querySelectorAll("input, select");
    inputs.forEach(input => {
        input.addEventListener("input", function() {
            checkFormValidity();
            if (input.closest('#paymentFields')) {
                checkPaymentMethodFormValidity();
            }
        });
    });

    // Modify the checkFormValidity function to check if payment information has been saved
    function checkFormValidity() {
        const formIsValid = document.getElementById("registrationForm").checkValidity() && paymentInfoSaved;
        submitBtn.disabled = !formIsValid;
        submitBtn.style.backgroundColor = formIsValid ? 'blue' : '#ccc';
        submitBtn.style.color = formIsValid ? 'white' : '#666';
    }

    // Add an event listener to the form's submit event to redirect to main.html
    document.getElementById("registrationForm").addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent default form submission
        if(paymentInfoSaved) {
            window.location.href = 'main.html'; // Redirect to main.html if payment info is saved
        }
    });

    function checkPaymentMethodFormValidity() {
        const paymentInputs = document.querySelectorAll("#paymentFields input[required]");
        let allFilled = true;
        paymentInputs.forEach(input => {
            if (!input.value.trim()) allFilled = false; // Check if any input is empty
        });

        if (allFilled) {
            saveButton.disabled = false;
            saveButton.style.backgroundColor = 'blue';
            saveButton.style.color = 'white';
        } else {
            saveButton.disabled = true;
            saveButton.style.backgroundColor = '#ccc';
            saveButton.style.color = '#666';
        }
    }

    // Initially check form validity to set the button color
    checkFormValidity();
});
