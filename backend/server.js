const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Image = require('./models/Image');

const app = express();

// Allow requests from your frontend app
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Endpoint to get a list of all saved images
app.get('/images', async (req, res) => {
    try {
        const images = await Image.find();
        res.json(images);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to save a new image
app.post('/images', async (req, res) => {
    try {
        const image = new Image(req.body);
        await image.save();
        res.status(201).json(image);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to delete an image
app.delete('/images/:id', async (req, res) => {
    try {
        await Image.findByIdAndDelete(req.params.id);
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