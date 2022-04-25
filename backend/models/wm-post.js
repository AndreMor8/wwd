const mongoose = require("mongoose");

const thing = new mongoose.Schema({
    userID: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    mirrors: [{
        name: { type: String, required: true },
        url: { type: String, required: true }
    }],
    type: { type: Number, required: true }
}, { timestamps: { createdAt: "posted" } });

module.exports = mongoose.model("wubbzymedia-post", thing);