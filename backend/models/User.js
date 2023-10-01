// backend\models\User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
});

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        try {
            this.password = await bcrypt.hash(this.password, 10);
            next();
        } catch (error) {
            console.error('Error hashing password:', error);
            next(error);
        }
    } else {
        next();
    }
});

module.exports = mongoose.model('User', userSchema);