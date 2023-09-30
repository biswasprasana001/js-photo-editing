// models/Image.js
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  dataUrl: String,
  name: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Image', imageSchema);