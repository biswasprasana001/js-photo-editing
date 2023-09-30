// backend\routes\auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register route
router.post('/register', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send();
    } catch (error) {
        res.status(400).send(error);
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || !(await user.checkPassword(password))) {
            throw new Error();
        }
        const token = jwt.sign({ _id: user._id }, 'secretkey', { expiresIn: '7d' }); // Replace 'secretkey' with a secret key string
        res.send({ token });
    } catch (error) {
        res.status(401).send({ error: 'Login failed!' });
    }
});

module.exports = router;