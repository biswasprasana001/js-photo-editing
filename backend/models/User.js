// backend\models\User.js
// We're bringing in the 'mongoose' library, which helps us interact with MongoDB databases.
const mongoose = require('mongoose');

// We're bringing in the 'bcryptjs' library, which helps us securely hash passwords.
const bcrypt = require('bcryptjs');

// We're defining a schema for our users. A schema is like a blueprint for how our data should look.
// Our users will have a 'username' and a 'password', both of which are required. The 'username' must be unique.
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
});

// We're setting up a 'pre' middleware function that will run before each 'save' operation on instances of our model.
// This function will hash the user's password before it gets saved to the database.
userSchema.pre('save', async function (next) {
    // We're checking if the password has been modified. If it hasn't, there's no need to hash it again.
    if (this.isModified('password')) {
        try {
            // We're hashing the password using 'bcryptjs'. The '10' is the number of rounds of hashing to apply.
            this.password = await bcrypt.hash(this.password, 10);

            // We're calling the 'next' function to proceed with the save operation.
            next();
        } catch (error) {
            // If anything goes wrong with the hashing operation, we log the error and pass it to the next middleware function.
            console.error('Error hashing password:', error);
            next(error);
        }
    } else {
        // If the password hasn't been modified, we simply proceed with the save operation.
        next();
    }
});

// We're creating a model from our schema and exporting it. A model is a constructor compiled from a schema definition.
// An instance of a model is a document. Models are responsible for creating and reading documents from the underlying MongoDB database.
module.exports = mongoose.model('User', userSchema);