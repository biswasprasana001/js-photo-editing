// We're bringing in the 'express' library, which is a framework that helps us create web applications in Node.js.
const express = require('express');

// 'mongoose' is a library that helps us interact with MongoDB databases in an easier and more structured way.
const mongoose = require('mongoose');

// 'cors' is a library that allows or denies cross-origin requests. It's a way to let a server specify where requests can come from.
const cors = require('cors');

// 'bcryptjs' is a library that helps us securely hash passwords. This is important for keeping user data secure.
const bcrypt = require('bcryptjs');

// 'jsonwebtoken' or 'jwt' is a library that helps us create JSON Web Tokens. These tokens are a way of managing user sessions in a secure manner.
const jwt = require('jsonwebtoken');

// We're importing a custom middleware function named 'authenticate'. Middleware functions are functions that have access to the request and response objects, and the next middleware function in the application’s request-response cycle.
const authenticate = require('./middleware/authenticate')

// We're importing two models, 'Image' and 'User'. These models define the structure of the documents within their respective collections in our MongoDB database.
const Image = require('./models/Image');
const User = require('./models/User');

// 'dotenv' is a module that loads environment variables from a .env file into process.env. This is useful for hiding sensitive information like database passwords.
require('dotenv').config();

// We're creating an instance of an Express application.
const app = express();

// We're telling our Express application to use the 'cors' middleware. This will allow our server to respond to requests from different origins.
app.use(cors());

// We're telling our Express application to use the built-in middleware function 'express.json'. This function parses incoming requests with JSON payloads.
app.use(express.json({ limit: '50mb' }));

// We're telling our Express application to serve static files (like HTML, CSS, and JavaScript files) that are in the 'public' directory.
app.use(express.static('../public'));

// We're defining a route for the '/register' endpoint. When a POST request is made to this endpoint, the following function will be executed.
app.post('/register', async (req, res) => {
    try {
        // We're extracting the 'username' and 'password' fields from the request body.
        const { username, password } = req.body;

        // If either 'username' or 'password' is not provided in the request, we return a 400 status code (Bad Request) along with an error message.
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // We're checking if a user with the provided username already exists in the database.
        const existingUser = await User.findOne({ username });

        // If such a user exists, we return a 400 status code (Bad Request) along with an error message.
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // If the username is not taken, we create a new user with the data provided in the request body.
        const user = new User(req.body);

        // We save the new user to the database.
        await user.save();

        // We return a 201 status code (Created) along with the newly created user.
        res.status(201).json(user);
    } catch (error) {
        // If anything goes wrong within the try block, we log the error and return a 500 status code (Internal Server Error) along with the error message.
        console.error('Error registering:', error);
        res.status(500).json({ error: error.message });
    }
});

// We're defining a route for the '/login' endpoint. When a POST request is made to this endpoint, the following function will be executed.
app.post('/login', async (req, res) => {
    try {
        // We're trying to find a user with the provided username in the database.
        const user = await User.findOne({ username: req.body.username });

        // If no such user exists, or the provided password does not match the user's password, we throw an error.
        if (!user || !await bcrypt.compare(req.body.password, user.password)) {
            throw new Error('Invalid username or password');
        }

        // If the username and password are correct, we create a new JSON Web Token (JWT) for the user. This token will be used for authentication in subsequent requests.
        const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

        // We return the token to the client.
        res.json({ token });
    } catch (error) {
        // If anything goes wrong within the try block, we log the error and return a 401 status code (Unauthorized) along with the error message.
        console.error('Error logging in:', error);
        res.status(401).json({ error: error.message });
    }
});

// We're defining a route for the '/images' endpoint. When a GET request is made to this endpoint, the following function will be executed.
// The 'authenticate' middleware function is used to verify the user's authentication status before proceeding.
app.get('/images', authenticate, async (req, res) => {
    try {
        // We're trying to find all images in the database that belong to the authenticated user.
        const images = await Image.find({ user: req.userId });

        // If the images are found successfully, we return them in the response.
        res.json(images);
    } catch (error) {
        // If anything goes wrong within the try block, we return a 500 status code (Internal Server Error) along with the error message.
        res.status(500).json({ error: error.message });
    }
});

// We're defining a route for the '/images' endpoint. When a POST request is made to this endpoint, the following function will be executed.
// The 'authenticate' middleware function is used to verify the user's authentication status before proceeding.
app.post('/images', authenticate, async (req, res) => {
    try {
        // We're creating a new image with the data provided in the request body and the authenticated user's ID.
        const image = new Image({ ...req.body, user: req.userId });

        // We save the new image to the database.
        await image.save();

        // We return a 201 status code (Created) along with the newly created image.
        res.status(201).json(image);
    } catch (error) {
        // If anything goes wrong within the try block, we return a 500 status code (Internal Server Error) along with the error message.
        res.status(500).json({ error: error.message });
    }
});

// We're defining a route for the '/images/:id' endpoint. When a DELETE request is made to this endpoint, the following function will be executed.
// The 'authenticate' middleware function is used to verify the user's authentication status before proceeding.
// The ':id' in the route is a placeholder for the ID of the image that we want to delete.
app.delete('/images/:id', authenticate, async (req, res) => {
    try {
        // We're trying to find an image in the database with the ID provided in the request parameters and delete it.
        // The 'findByIdAndDelete' function does exactly what its name suggests: it finds a document by its ID and deletes it.
        const image = await Image.findByIdAndDelete(req.params.id);

        // If the image is found and deleted successfully, we return a success message in the response.
        res.json({ message: 'Image deleted' });
    } catch (error) {
        // If anything goes wrong within the try block, we log the error and return a 500 status code (Internal Server Error) along with the error message.
        console.error('Error in server:', error);
        res.status(500).json({ error: error.message });
    }
});

// We're using the 'connect' function from the 'mongoose' library to connect to our MongoDB database.
// The connection string (i.e., the location of the database) is stored in an environment variable for security reasons.
// The options object passed as the second argument is used to set up the connection properly.
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// We're storing the connection object in a variable for easier access.
const db = mongoose.connection;

// We're setting up an event listener for the 'error' event. This will log any errors that occur while trying to connect to the database.
db.on('error', console.error.bind(console, 'connection error:'));

// We're setting up an event listener for the 'open' event. This will run once when the connection to the database is opened.
db.once('open', function () {
    console.log('Connected to MongoDB');
});

// We're telling our Express application to start listening for incoming HTTP requests.
// The port number is retrieved from an environment variable, and if it's not set, we default to 3000.
// The function passed as the second argument will run once when the server starts listening.
app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000');
});
