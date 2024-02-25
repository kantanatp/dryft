function uploadFile(file) {
    let formData = new FormData();
    formData.append('license', file);

    fetch('/upload-license', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text()) // Adjusted to expect a simple text response
    .then(data => alert(data))
    .catch(error => console.error('Error:', error));
}

document.getElementById('submitBtn').addEventListener('click', function() {
    var fileInput = document.getElementById('licenseUpload');
    if(fileInput.files.length > 0) {
        var file = fileInput.files[0];
        uploadFile(file); // Call the upload function
    } else {
        alert('Please select a file before submitting.');
    }
});