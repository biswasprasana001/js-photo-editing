// backend\middleware\authenticate.js
// We're bringing in the 'jsonwebtoken' library, which helps us work with JSON Web Tokens (JWTs).
const jwt = require('jsonwebtoken');

// We're defining a function named 'authenticate'. This function will be used as middleware in our Express routes.
function authenticate(req, res, next) {
    try {
        // We're extracting the JWT from the 'Authorization' header of the incoming request.
        // The 'split' function is used to separate the 'Bearer' part from the actual token.
        const token = req.headers.authorization.split(' ')[1];

        // We're verifying the token using the same secret that was used to sign it. If the token is valid, 'verify' will return the payload of the token.
        const decoded = jwt.verify(token, 'your_jwt_secret');

        // We're adding a new property 'userId' to the request object. This property will contain the ID of the user who was authenticated.
        req.userId = decoded.userId;

        // We're calling the 'next' function to pass control to the next middleware function in the stack. If 'authenticate' is the last middleware function, control will be passed to the route handler.
        next();
    } catch (error) {
        // If anything goes wrong within the try block (for example, if the token is invalid), we log the error and return a 401 status code (Unauthorized) along with an error message.
        console.error('Error in authentication:', error);
        res.status(401).json({ error: 'Unauthorized' });
    }
}

// We're exporting the 'authenticate' function so that it can be imported and used in other files.
module.exports = authenticate;