// script.js
const fileInput = document.getElementById('file-input');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
fileInput.addEventListener('change', handleFileInput);

let currentImage = null;
let currentRotation = 0;  // rotation in degrees
let currentZoom = 1;  // zoom factor, where 1 is no zoom

function handleFileInput(event) {
    const file = event.target.files[0];
    if (file && file.type.match('image.*')) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
                currentImage = img;
                currentRotation = 0;  // reset rotation
                currentZoom = 1;  // reset zoom
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please upload a valid image file.');
    }
}

function redrawImage() {
    // Save the current canvas context state
    ctx.save();

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Translate to the center of the canvas
    ctx.translate(canvas.width / 2, canvas.height / 2);

    // Rotate the canvas
    ctx.rotate(currentRotation * Math.PI / 180);

    // Scale the canvas
    ctx.scale(currentZoom, currentZoom);

    // Draw the image back on the canvas
    ctx.drawImage(currentImage, -currentImage.width / 2, -currentImage.height / 2);

    // Restore the canvas context state
    ctx.restore();
}

function rotate(angle) {
    currentRotation = (currentRotation + angle) % 360;
    redrawImage();
}

function zoom(amount) {
    currentZoom += amount;
    // To prevent zooming out indefinitely:
    if (currentZoom < 0.1) {
        currentZoom = 0.1;
    }
    redrawImage();
}

document.getElementById('brightness-slider').addEventListener('input', applyFilters);
document.getElementById('contrast-slider').addEventListener('input', applyFilters);
document.getElementById('saturation-slider').addEventListener('input', applyFilters);

function applyFilters() {
    const brightness = document.getElementById('brightness-slider').value;
    const contrast = document.getElementById('contrast-slider').value;
    const saturation = document.getElementById('saturation-slider').value;
    Caman('#canvas', function () {
        this.revert(false);
        this.brightness(brightness)
            .contrast(contrast)
            .saturation(saturation)
            .render();
    });
}

function download() {
    const link = document.createElement('a');
    link.download = 'edited-image.png';
    link.href = canvas.toDataURL();
    link.click();
}
