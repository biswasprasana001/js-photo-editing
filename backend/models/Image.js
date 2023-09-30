// backend\models\Image.js
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    data: { type: String, required: true },  // Base64 encoded image data
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;