// script.js
// We're getting the file input element from the HTML document. This is where the user will upload their image.
const fileInput = document.getElementById('file-input');

// We're getting the canvas element from the HTML document. This is where we'll draw the uploaded image.
const canvas = document.getElementById('canvas');

// We're getting the 2D rendering context for the canvas. This is like our toolbox for drawing on the canvas.
const ctx = canvas.getContext('2d');

// We're setting up an event listener on the file input. When the user uploads a file, we'll call the handleFileInput function.
fileInput.addEventListener('change', handleFileInput);


// We're defining a variable named 'isRegister' and setting its initial value to true. This variable will be used to keep track of whether the user is trying to register or log in.
let isRegister = true;

// We're defining a function named 'toggleAuth'. This function will be used to switch between the registration form and the login form.
function toggleAuth() {

    // We're getting the element with the id 'toggle-button' (which is the button that the user can click to switch forms) and storing it in a constant named 'toggleButton'.
    const toggleButton = document.getElementById('toggle-button');

    // If 'isRegister' is true, we hide the registration form, show the login form, change the text of the toggle button, and set 'isRegister' to false.
    if (isRegister) {
        document.getElementById('register').style.display = 'none';
        document.getElementById('login').style.display = 'block';
        toggleButton.textContent = 'New User?, Register Here!';
        isRegister = false;

        // If 'isRegister' is false, we hide the login form, show the registration form, change the text of the toggle button, and set 'isRegister' to true.
    } else {
        document.getElementById('login').style.display = 'none';
        document.getElementById('register').style.display = 'block';
        toggleButton.textContent = 'Already a User?, Login!';
        isRegister = true;
    }
}

// We're calling the 'toggleAuth' function. This will run the function once when the script is loaded.
toggleAuth();

// We're setting up some variables to keep track of the current image, its rotation, and its zoom level.
let currentImage = null;  // No image to start with
let currentRotation = 0;  // No rotation to start with
let currentZoom = 1;  // No zoom to start with (1 means the image is at its original size)

// We're defining an asynchronous function named 'register'. Asynchronous means it's designed to perform tasks in the background.
async function register() {

    // We're getting the value entered in the 'register-username' field and storing it in a constant named 'username'.
    const username = document.getElementById('register-username').value;

    // Similarly, we're getting the value entered in the 'register-password' field and storing it in a constant named 'password'.
    const password = document.getElementById('register-password').value;

    // If either 'username' or 'password' is not provided, we show an alert saying 'Username and password are required' and stop the function.
    if (!username || !password) {
        alert('Username and password are required');
        return;
    }

    // We're using a try-catch block to handle potential errors in our code.
    try {

        // We're making a POST request to the '/register' endpoint with the username and password as the body. The 'await' keyword means we wait for the request to complete before moving on.
        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        // If the response is okay (status code 200-299), we show an alert saying 'Registration successful'.
        if (response.ok) {
            alert('Registration successful');

            // If the response is not okay, we handle the error.
        } else {

            // We're getting the error data from the response.
            const errorData = await response.json();

            // If the error is 'User already exists', we show an alert saying so.
            if (errorData.error === 'User already exists') {
                alert('User already exists');

                // For any other error, we show an alert with the error message.
            } else {
                alert(`Registration failed: ${errorData.error}`);
            }
        }

        // If there's an error in the try block, we catch it and log it to the console.
    } catch (error) {
        console.error('Error registering:', error);
    }
}

// We're defining an asynchronous function named 'login'. Asynchronous means it's designed to perform tasks in the background.
async function login() {

    // We're getting the value entered in the 'login-username' field and storing it in a constant named 'username'.
    const username = document.getElementById('login-username').value;

    // Similarly, we're getting the value entered in the 'login-password' field and storing it in a constant named 'password'.
    const password = document.getElementById('login-password').value;

    // We're using a try-catch block to handle potential errors in our code.
    try {

        // We're making a POST request to the '/login' endpoint with the username and password as the body. The 'await' keyword means we wait for the request to complete before moving on.
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        // If the response is okay (status code 200-299), we handle the successful login.
        if (response.ok) {

            // We're getting the data from the response.
            const data = await response.json();

            // We're storing the token received from the server in the local storage. This token will be used for authentication in subsequent requests.
            localStorage.setItem('token', data.token);

            // We're also storing the username in the local storage for later use.
            localStorage.setItem('username', username);

            // We're calling a function named 'showEditor'. This function will be used to display the editor to the user after they've logged in.
            showEditor();

            // If the response is not okay, we handle the error.
        } else {

            // We're getting the error data from the response.
            const errorData = await response.json();

            // We show an alert with the error message.
            alert(`Login failed: ${errorData.error}`);
        }

        // If there's an error in the try block, we catch it, log it to the console, and show an alert.
    } catch (error) {
        console.error('Error logging in:', error);
        alert('Error logging in:', error);
    }
}

// We're defining a function named 'logout'. This function will be used to log the user out of the application.
function logout() {

    // We're removing the item with the key 'token' from local storage. This is the token we stored earlier when the user logged in.
    localStorage.removeItem('token');

    // We're also removing the item with the key 'username' from local storage. This is the username we stored earlier when the user logged in.
    localStorage.removeItem('username');

    // We're calling a function named 'hideEditor'. This function is not defined here, but it's presumably defined elsewhere in your code and is used to hide the editor when the user logs out.
    hideEditor();
}

// We're defining a function named 'showEditor'. This function will be used to display the editor to the user after they've logged in.
function showEditor() {

    // We're getting the element with the id 'auth-container' (which is the login/register form) and setting its display style to 'none', effectively hiding it.
    document.getElementById('auth-container').style.display = 'none';

    // We're getting the element with the id 'editor-container' (which is the text editor) and setting its display style to 'block', effectively showing it.
    document.getElementById('editor-container').style.display = 'block';

    // We're getting the element with the id 'username-display' (which is where we'll display the username) and setting its text content to the username we stored in local storage earlier.
    document.getElementById('username-display').textContent = localStorage.getItem('username');

    // We're calling a function named 'fetchImages'. This function will be used to fetch images from the server after the user has logged in.
    fetchImages();
}


// We're defining a function named 'hideEditor'. This function will be used to hide the editor and show the authentication form when the user logs out.
function hideEditor() {

    // We're getting the element with the id 'editor-container' (which is presumably the text editor) and setting its display style to 'none', effectively hiding it.
    document.getElementById('editor-container').style.display = 'none';

    // We're getting the element with the id 'auth-container' (which is presumably the login/register form) and setting its display style to 'block', effectively showing it.
    document.getElementById('auth-container').style.display = 'block';

    // We're getting the element with the id 'image-list' (which is presumably where we display the images) and clearing its inner HTML. This removes all the images from the list.
    const imageList = document.getElementById('image-list');
    imageList.innerHTML = '';

    // We're clearing the entire canvas. This is done to ensure that the new user doesn't see the old user's images on the canvas.
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // We're showing an alert saying 'Logged out'. This gives the user feedback that they've been logged out.
    alert('Logged out');
}

// We're defining a function named 'checkAuthStatus'. This function will be used to check if the user is logged in when the page loads.
function checkAuthStatus() {

    // We're getting the token we stored in local storage earlier. This token was stored when the user logged in.
    const token = localStorage.getItem('token');

    // We're also getting the username we stored in local storage earlier. This username was stored when the user logged in.
    const username = localStorage.getItem('username');

    // If both the token and the username exist, we call the 'showEditor' function. This function will be used to display the editor to the user.
    if (token && username) {
        showEditor();

        // If either the token or the username doesn't exist, we call the 'hideEditor' function. This function will be used to hide the editor and show the authentication form
    } else {
        hideEditor();
    }
}

// We're setting the onload property of the window object to the 'checkAuthStatus' function. This means that the 'checkAuthStatus' function will be called when the page finishes loading.
window.onload = checkAuthStatus;

// We're defining an asynchronous function named 'fetchImages'. This function will be used to fetch images from the server after the user has logged in.
async function fetchImages() {

    // We're getting the token we stored in local storage earlier. This token will be used for authentication.
    const token = localStorage.getItem('token');

    // If there's no token, we return from the function early. This means we don't fetch images if the user is not logged in.
    if (!token) return;

    // We're getting the element with the id 'loading-indicator' (which is a loading screen) and setting its display style to 'block', effectively showing it.
    document.getElementById('loading-indicator').style.display = 'block';

    // We're using a try-catch-finally block to handle potential errors in our code and to ensure that the loading indicator is hidden whether or not the fetch is successful.
    try {

        // We're making a GET request to the '/images' endpoint with the token as the Authorization header. The 'await' keyword means we wait for the request to complete before moving on.
        const response = await fetch('/images', {
            headers: { Authorization: `Bearer ${token}` }
        });

        // We're getting the images data from the response.
        const images = await response.json();

        // We're getting the element with the id 'image-list' (which is where we'll display the images) and clearing its inner HTML.
        const imageList = document.getElementById('image-list');
        imageList.innerHTML = '';

        // We're looping over each image in the images data.
        images.forEach(image => {

            // We're creating a new div element and adding the 'image' class to it.
            const divElem = document.createElement('div');
            divElem.classList.add('image');

            // We're creating a new img element, setting its source to the image data URL, setting its alt text to the image name, adding the 'saved-image' class to it, and setting its data-id attribute to the image id.
            const imgElem = document.createElement('img');
            imgElem.src = image.dataUrl;
            imgElem.alt = image.name;
            imgElem.classList.add('saved-image');
            imgElem.dataset.id = image._id;

            // We're setting the img element's onclick handler to a function named 'handleImageClick'. This function will be used to handle when an image is clicked.

            imgElem.onclick = handleImageClick;

            // We're creating a new button element, adding the 'delete-button' class to it, and setting its text content to 'Delete'.
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-button');
            deleteButton.textContent = 'Delete';

            // We're setting the delete button's onclick handler to a function that calls 'deleteImage' with the image id. This function will be used to delete an image from the server.
            deleteButton.onclick = () => deleteImage(image._id);

            // We're appending the img element and the delete button to the div element.
            divElem.appendChild(imgElem);
            divElem.appendChild(deleteButton);

            // We're appending the div element to the image list.
            imageList.appendChild(divElem);
        });

        // If there's an error in the try block, we catch it and log it to the console.
    } catch (error) {
        console.error('Error fetching images:', error);

        // Whether or not there was an error, we hide the loading indicator.
    } finally {
        document.getElementById('loading-indicator').style.display = 'none';
    }
}

// We're defining an asynchronous function named 'saveImage'. This function will be used to save the current image on the canvas to the server.
async function saveImage() {

    // We're getting the token we stored in local storage earlier. This token was stored when the user logged in.
    const token = localStorage.getItem('token');

    // If there's no token, we show an alert saying 'Please log in to save images' and return from the function early. This means we don't try to save images if the user is not logged in.
    if (!token) {
        alert('Please log in to save images');
        return;
    }

    // We're getting a data URL representation of the current image on the canvas. This is a string that represents the image in a format that can be easily stored or transferred.
    const dataUrl = canvas.toDataURL();

    // We're using a try-catch block to handle potential errors in our code.
    try {

        // We're making a POST request to the '/images' endpoint with the token as the Authorization header and the data URL and name of the image as the body. The 'await' keyword means we wait for the request to complete before moving on.
        const response = await fetch('/images', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ dataUrl, name: 'Edited Image' })
        });

        // We're getting the saved image data from the response.
        const savedImage = await response.json();

        // If the save was successful, we call 'fetchImages' to refresh the list of images.
        fetchImages();

        // If there's an error in the try block, we catch it and log it to the console.
    } catch (error) {
        console.error('Error saving image:', error);
    }
}

// We're defining an asynchronous function named 'deleteImage'. This function will be used to delete an image from the server.
async function deleteImage(imageId) {

    // We're getting the token we stored in local storage earlier. This token will be used for authentication.
    const token = localStorage.getItem('token');

    // If there's no token, we show an alert saying 'Please log in to delete images' and return from the function early. This means we don't try to delete images if the user is not logged in.
    if (!token) {
        alert('Please log in to delete images');
        return;
    }

    // We're using a try-catch block to handle potential errors in our code.
    try {

        // We're making a DELETE request to the '/images/{imageId}' endpoint with the token as the Authorization header. The 'await' keyword means we wait for the request to complete before moving on.
        const response = await fetch(`/images/${imageId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });

        // If the response is not okay (status code 200-299), we throw an error with the status code.
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // If the delete was successful, we call 'fetchImages' to refresh the list of images.
        fetchImages();

        // If there's an error in the try block, we catch it and log it to the console.
    } catch (error) {
        console.error('Error deleting image:', error);
    }
}

// We're defining a function named 'handleImageClick'. This function will be used to handle when an image is clicked.
function handleImageClick(event) {

    // We're getting the img element that was clicked. 'event.currentTarget' refers to the element that the event listener was attached to.
    const imgElem = event.currentTarget;

    // We're getting the source of the img element, which is the data URL of the image.
    const dataUrl = imgElem.src;

    // We're calling a function named 'loadNewImage' with the data URL of the image. This function will be used to load a new image onto a canvas.
    loadNewImage(dataUrl);
}

// We're defining a function named 'loadNewImage'. This function will be used to load a new image onto a canvas.
function loadNewImage(dataUrl) {

    // We're creating a new Image object. This is a built-in JavaScript object for creating and manipulating images.
    const img = new Image();

    // We're setting the onload property of the Image object to a function. This function will be called when the image has finished loading.
    img.onload = function () {

        // We're setting the width and height of the canvas to match the width and height of the image.
        canvas.width = img.width;
        canvas.height = img.height;

        // We're clearing the entire canvas. This is done to ensure that the new image doesn't overlap with any old content on the canvas.
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // We're drawing the image onto the canvas at the coordinates (0, 0).
        ctx.drawImage(img, 0, 0);

        // We're setting a variable named 'currentImage' to the Image object. This is presumably used elsewhere in your code to keep track of the current image.
        currentImage = img;

        // We're setting a variable named 'currentRotation' to 0. This is presumably used elsewhere in your code to keep track of the current rotation of the image.
        currentRotation = 0;

        // We're setting a variable named 'currentZoom' to 1. This is presumably used elsewhere in your code to keep track of the current zoom level of the image.
        currentZoom = 1;
    };

    // We're setting the source of the Image object to the data URL passed into the function. This starts the process of loading the image.
    img.src = dataUrl;
}

// This is the function that gets called when the user uploads a file.
function handleFileInput(event) {
    // We're getting the first file from the list of files that were uploaded.
    const file = event.target.files[0];

    // We're checking if the file exists and if it's an image file.
    if (file && file.type.match('image.*')) {
        // We're creating a new FileReader to read the contents of the file.
        const reader = new FileReader();

        // We're setting up an event listener on the reader. When it's done loading the file, it will call this function.
        reader.onload = function (e) {
            // We're creating a new Image object.
            const img = new Image();

            // We're setting up an event listener on the image. When it's done loading, it will call this function.
            img.onload = function () {
                // We're setting the canvas's width and height to match the image's width and height.
                canvas.width = img.width;
                canvas.height = img.height;

                // We're clearing the canvas, just in case there was something drawn on it before.
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // We're drawing the image onto the canvas.
                ctx.drawImage(img, 0, 0);

                // We're saving the image, rotation, and zoom level so we can use them later.
                currentImage = img;
                currentRotation = 0;  // Reset rotation
                currentZoom = 1;  // Reset zoom
            };

            // We're telling the image to load the data from the file.
            img.src = e.target.result;
        };

        // We're telling the reader to start reading the file. It will call the onload function when it's done.
        reader.readAsDataURL(file);
    } else {
        // If the file wasn't an image, we're showing an alert to the user.
        alert('Please upload a valid image file.');
    }
}

// We're defining a function called 'redrawImage'. This function will be used to redraw an image on a canvas.
function redrawImage() {
    // 'ctx.save()' is like taking a snapshot of the current drawing style settings and transformations. It's like saying "Remember what everything looks like right now".
    ctx.save();

    // 'ctx.clearRect(0, 0, canvas.width, canvas.height)' is like using an eraser to clear the entire canvas. It's like saying "Let's start with a clean slate".
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 'ctx.translate(canvas.width / 2, canvas.height / 2)' shifts the origin of the canvas to its center. It's like saying "Let's move our viewpoint to the center of the canvas".
    ctx.translate(canvas.width / 2, canvas.height / 2);

    // 'ctx.rotate(currentRotation * Math.PI / 180)' rotates the canvas by 'currentRotation' degrees. It's like saying "Let's spin our viewpoint by this many degrees".
    ctx.rotate(currentRotation * Math.PI / 180);

    // 'ctx.scale(currentZoom, currentZoom)' scales the size of the canvas by 'currentZoom' factor. It's like saying "Let's zoom in or out by this much".
    ctx.scale(currentZoom, currentZoom);

    // 'ctx.drawImage(currentImage, -currentImage.width / 2, -currentImage.height / 2)' draws the image on the canvas such that the image's center aligns with the canvas's center. It's like saying "Let's put our picture right in the middle of our viewpoint".
    ctx.drawImage(currentImage, -currentImage.width / 2, -currentImage.height / 2);

    // 'ctx.restore()' reverts the canvas back to how it was when we last called 'ctx.save()'. It's like saying "Let's forget all the changes we made and go back to how things were".
    ctx.restore();
}

// We're defining a function named 'rotate'. This function will be used to rotate the current image on the canvas by a certain angle.
function rotate(angle) {

    // We're adding the input angle to the current rotation angle and taking the modulus by 360. This ensures that the rotation angle always stays between 0 and 359 degrees. We're storing the result back in 'currentRotation'.
    currentRotation = (currentRotation + angle) % 360;

    // We're calling the 'redrawImage' function. This function is not defined here, but it's presumably defined elsewhere in your code and is used to redraw the image on the canvas with the current rotation and zoom level.
    redrawImage();
}

// We're defining a function named 'zoom'. This function will be used to zoom in or out of the current image on the canvas.
function zoom(amount) {

    // We're adding the input amount to the current zoom level. If the amount is positive, we'll zoom in. If the amount is negative, we'll zoom out.
    currentZoom += amount;

    // If the current zoom level is less than 0.1 (which would be very zoomed out), we set it to 0.1 to prevent the image from getting too small.
    if (currentZoom < 0.1) {
        currentZoom = 0.1;
    }

    // We're calling the 'redrawImage' function. This function is not defined here, but it's presumably defined elsewhere in your code and is used to redraw the image on the canvas with the current rotation and zoom level.
    redrawImage();
}

// We're adding an event listener to the element with the id 'brightness-slider'. This will call the 'applyFilters' function whenever the user changes the input value.
document.getElementById('brightness-slider').addEventListener('input', applyFilters);

// We're doing the same for the elements with the ids 'contrast-slider' and 'saturation-slider'.
document.getElementById('contrast-slider').addEventListener('input', applyFilters);
document.getElementById('saturation-slider').addEventListener('input', applyFilters);

// We're defining a function named 'applyFilters'. This function will be used to apply brightness, contrast, and saturation filters to an image on a canvas.
function applyFilters() {

    // We're getting the current values of the brightness, contrast, and saturation sliders and storing them in constants.
    const brightness = document.getElementById('brightness-slider').value;
    const contrast = document.getElementById('contrast-slider').value;
    const saturation = document.getElementById('saturation-slider').value;

    // We're using the Caman library to apply the filters to the image on the canvas. The '#' in '#canvas' means we're selecting an element by its id.
    Caman('#canvas', function () {

        // We're reverting any previous filters applied to the image. The 'false' argument means we're not forcing a re-render of the image yet.
        this.revert(false);

        // We're applying the brightness, contrast, and saturation filters to the image. The values are taken from the slider inputs.
        this.brightness(brightness)
            .contrast(contrast)
            .saturation(saturation)

            // We're rendering the image with the applied filters.
            .render();
    });
}

// We're defining a function named 'clearCanvas'. This function will be used to clear the entire canvas.
function clearCanvas() {

    // We're clearing the entire canvas. This is done by calling the 'clearRect' method on the canvas context ('ctx') and passing in the top-left corner (0, 0) and the width and height of the canvas.
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// We're defining a function named 'download'. This function will be used to download the current image on the canvas.
function download() {

    // We're creating a new 'a' (anchor) element. This element will be used to trigger the download.
    const link = document.createElement('a');

    // We're setting the 'download' attribute of the anchor element to the desired filename of the downloaded image.
    link.download = 'edited-image.png';

    // We're setting the 'href' (hyperlink reference) attribute of the anchor element to a data URL representation of the current image on the canvas. This is done by calling the 'toDataURL' method on the canvas.
    link.href = canvas.toDataURL();

    // We're programmatically clicking the anchor element. This will trigger the download of the image.
    link.click();
}