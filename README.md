# JSPhotoEditor

## Overview
The Photo Editing App allows users to upload an image, and apply basic editing functions such as rotation, zoom, and adjustments for brightness, contrast, and saturation. The edited image can then be downloaded to the user's device. The App is built using HTML, CSS, and JavaScript alongside the CamanJS library for image manipulation.

## Features
- **Image Upload**: Users can upload an image of their choice which will be rendered on a canvas.
- **Image Rotation**: Rotate the image either to the left or to the right in 90-degree increments.
- **Zoom**: Zoom in or out of the image.
- **Brightness, Contrast, and Saturation Adjustment**: Adjust the brightness, contrast, and saturation using slider controls.
- **Download Edited Image**: Once done with editing, users can download the edited image to their device.

## Usage
- **Uploading an Image**: Click on the file input field and choose an image file to upload. Only image files are accepted.
- **Rotating an Image**: Click on the "Rotate Left" button to rotate the image 90 degrees to the left. Click on the "Rotate Right" button to rotate the image 90 degrees to the right.
- **Zooming In/Out**: Click on the "Zoom In" button to zoom into the image. Click on the "Zoom Out" button to zoom out of the image.
- **Adjusting Brightness, Contrast, and Saturation**: Move the sliders labeled Brightness, Contrast, and Saturation to adjust these properties of the image.
- **Downloading the Image**: Click on the "Download" button. The edited image will be downloaded as 'edited-image.png'.

## File Structure
- **index.html**: The HTML file that holds the structure of the app.
- **styles.css**: The CSS file to style the app (not provided).
- **script.js**: The JavaScript file that contains the logic for image manipulation.

## Dependencies
The Photo Editing App relies on the following external library:
- CamanJS: A JavaScript library for image manipulation used for applying brightness, contrast, and saturation filters to the image.

To get the full functionality of the app, ensure that your browser has JavaScript enabled and can access external libraries from CDNs.

## Contributing
Feel free to fork this repository, make changes, and open a pull request if you think you have a way to improve this app or fix issues. Any contributions are welcome!

## License
This project is licensed under the [MIT License](https://mit-license.org/).
