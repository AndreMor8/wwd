const mongoose = require("mongoose");

const thing = new mongoose.Schema({
    year: { type: Number },
    enabled: { type: Boolean, default: false }
});

module.exports = mongoose.model("birthdayyear", thing);