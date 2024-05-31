# JS Photo Editing

## Overview

JS Photo Editing is a web-based photo editing application that allows users to upload, edit, save, download, and re-edit images using various filters and effects. Built with HTML, CSS, JavaScript, Node.js, Express, MongoDB, and HTML Canvas, this application provides a robust and user-friendly platform for photo manipulation.

## Features

- **Image Upload**: Users can upload images which will be rendered on a canvas.
- **Image Editing**: Users can edit images with filters and effects such as brightness, contrast, and saturation adjustments, as well as rotation and zooming.
- **Image Saving**: Edited images can be saved to the database for future access.
- **Image Downloading**: Users can download the edited images to their local devices.
- **Image Re-editing**: Previously saved images can be retrieved from the database and re-edited.

## Live Demo

Check out the live version of the project at [JS Photo Editing on Render](https://js-photo-editing.onrender.com). Please note that the website may take 50 seconds or longer to load, as the server shuts down after 30 minutes of inactivity and requires time to restart upon receiving a new request.

## Installation

To run this application locally, ensure you have Node.js and MongoDB installed. Clone this repository or download the zip file.

### Steps:

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   node backend/server.js
   ```
3. Open your browser and navigate to `http://localhost:3000`.

## Contributing

Contributions are welcome! Feel free to fork this repository, make changes, and open a pull request.

## License

This project is licensed under the [MIT License](https://mit-license.org/).
