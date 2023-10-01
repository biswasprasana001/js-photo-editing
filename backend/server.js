const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticate = require('./middleware/authenticate')
const Image = require('./models/Image');
const User = require('./models/User');

const app = express();

// Allow requests from your frontend app
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Registration endpoint
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        console.error('Error registering:', error);
        res.status(500).json({ error: error.message });
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user || !await bcrypt.compare(req.body.password, user.password)) {
            throw new Error('Invalid username or password');
        }
        const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

// Secure the image endpoints with the authenticate middleware
app.get('/images', authenticate, async (req, res) => {
    try {
        const images = await Image.find({ user: req.userId });
        res.json(images);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/images', authenticate, async (req, res) => {
    try {
        const image = new Image({ ...req.body, user: req.userId });
        await image.save();
        res.status(201).json(image);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/images/:id', authenticate, async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        if (image.user.toString() !== req.userId) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        await image.remove();
        res.json({ message: 'Image deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Connect to MongoDB
mongoose.connect('mongodb+srv://biswasprasana004:Elrd8Dv1XsuwvcPo@cluster0.r7ri5c0.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

// Check MongoDB connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB');
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});