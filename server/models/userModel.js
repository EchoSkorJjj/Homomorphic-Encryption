const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
        unique: true
    },
    vote: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('User', userSchema);