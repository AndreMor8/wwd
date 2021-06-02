const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    discordId: { type: String, required: true },
    username: { type: String, required: true },
    avatar: { type: String },
    premium_type: { type: Number }
});

module.exports = mongoose.model('User', UserSchema);