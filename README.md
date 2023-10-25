# JSPhotoEditor

## Overview
This is a web-based photo editing app that allows users to upload, edit, save, download, and re-edit images using various filters and effects. The app is built with HTML, CSS, JS, CamanJs, Node, Express, and Mongo. The app uses CamanJs to manipulate the pixels of the images and apply different filters such as vintage, lomo, clarity, etc. The app also uses Node and Express to create a backend server & Mongo to store the images in a database and retrieve them for further editing.


## Features
- **Image Upload**: Users can upload an image of their choice which will be rendered on a canvas.
- **Image editing**: Users can edit the images using a range of filters and effects provided by CamanJs. Users can adjust the brightness, contrast, saturation, etc. of the images. Users can also rotate, zoom the images.
- **Image saving**: Users can save the edited images in the database for future access.
- **Image downloading**: Users can download the edited images to their local device.
- **Image re-editing**: Users can re-edit the images that are stored in the database. The app retrieves the image from Mongo and displays it on the canvas for further editing.

## Installation
To run this app locally, you need to have Node.js and Mongo installed on your system. You also need to clone this repository or download the zip file.

To install the dependencies, run the following command in the terminal:
```
npm install
```
To start the server, run the following command in the terminal:
```
node backend\server.js
```
The server will run on port 3000 by default. You can change it in the `backend\server.js` file if you want.

To access the app, open your browser and go to `http://localhost:3000`.

## Contributing
Feel free to fork this repository, make changes, and open a pull request if you think you have a way to improve this app or fix issues. Any contributions are welcome!

## License
This project is licensed under the [MIT License](https://mit-license.org/).
