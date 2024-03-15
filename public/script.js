// script.js
const fileInput = document.getElementById('file-input');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
fileInput.addEventListener('change', handleFileInput);

let isRegister = true;

function toggleAuth() {
    const toggleButton = document.getElementById('toggle-button');
    if (isRegister) {
        document.getElementById('register').style.display = 'none';
        document.getElementById('login').style.display = 'block';
        toggleButton.textContent = 'New User?, Register Here!';
        isRegister = false;
    } else {
        document.getElementById('login').style.display = 'none';
        document.getElementById('register').style.display = 'block';
        toggleButton.textContent = 'Already a User?, Login!';
        isRegister = true;
    }
}

toggleAuth();

let currentImage = null;
let currentRotation = 0;  // rotation in degrees
let currentZoom = 1;  // zoom factor, where 1 is no zoom

// script.js
async function register() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    if (!username || !password) {
        alert('Username and password are required');
        return;
    }
    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (response.ok) {
            alert('Registration successful');
        } else {
            const errorData = await response.json();
            if (errorData.error === 'User already exists') {
                alert('User already exists');
            } else {
                alert(`Registration failed: ${errorData.error}`);
            }
        }
    } catch (error) {
        console.error('Error registering:', error);
    }
}

async function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', username);  // Store the username for later use
            showEditor();
        } else {
            const errorData = await response.json();
            alert(`Login failed: ${errorData.error}`);
        }
    } catch (error) {
        console.error('Error logging in:', error);
        alert('Error logging in:', error);
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');  // Remove the username from localStorage
    hideEditor();
}

function showEditor() {
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('editor-container').style.display = 'block';
    document.getElementById('username-display').textContent = localStorage.getItem('username');
    fetchImages();
}

function hideEditor() {
    document.getElementById('editor-container').style.display = 'none';
    document.getElementById('auth-container').style.display = 'block';
    // ... rest of your logout cleanup code ...
    const imageList = document.getElementById('image-list');
    imageList.innerHTML = '';  // Clear the list of images
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas
    // ... clear any other user-related state ...
    // alert('Logged out');
}


function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token && username) {
        showEditor();
    } else {
        hideEditor();
    }
}

// Call the function when the page loads
window.onload = checkAuthStatus;

async function fetchImages() {
    const token = localStorage.getItem('token');
    if (!token) return;  // Don't fetch images if not logged in
    document.getElementById('loading-indicator').style.display = 'block';
    try {
        const response = await fetch('/images', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const images = await response.json();
        const imageList = document.getElementById('image-list');
        imageList.innerHTML = '';
        images.forEach(image => {
            const divElem = document.createElement('div');
            divElem.classList.add('image-button');
            const imgElem = document.createElement('img');
            imgElem.src = image.dataUrl;
            imgElem.alt = image.name;
            imgElem.classList.add('saved-image');
            imgElem.dataset.id = image._id;
            imgElem.onclick = handleImageClick;
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteImage(image._id);
            divElem.appendChild(imgElem);
            divElem.appendChild(deleteButton);
            imageList.appendChild(divElem);
        });
    } catch (error) {
        console.error('Error fetching images:', error);
    } finally {
        document.getElementById('loading-indicator').style.display = 'none';
    }
}

async function saveImage() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in to save images');
        return;
    }
    const dataUrl = canvas.toDataURL();
    try {
        const response = await fetch('/images', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ dataUrl, name: 'Edited Image' })
        });
        const savedImage = await response.json();
        fetchImages();
        // TODO: Update your UI to include the saved image
    } catch (error) {
        console.error('Error saving image:', error);
    }
}

async function deleteImage(imageId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in to delete images');
        return;
    }
    try {
        const response = await fetch(`/images/${imageId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        fetchImages();
    } catch (error) {
        console.error('Error deleting image:', error);
    }
}

function handleImageClick(event) {
    const imgElem = event.currentTarget;
    const dataUrl = imgElem.src;
    loadNewImage(dataUrl);
}

function loadNewImage(dataUrl) {
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
    img.src = dataUrl;
}

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
