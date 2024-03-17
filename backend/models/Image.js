// models/Image.js
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  dataUrl: String,
  name: String,
  date: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } 
});

module.exports = mongoose.model('Image', imageSchema);