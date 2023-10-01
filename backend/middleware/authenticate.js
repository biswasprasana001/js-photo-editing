// backend\middleware\authenticate.js
const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, 'your_jwt_secret');
        req.userId = decoded.userId;
        next();
    } catch {
        res.status(401).json({ error: 'Unauthorized' });
    }
}

module.exports = authenticate;