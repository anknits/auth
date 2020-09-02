const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username:{
        type: String,
        required: true,
        min: 6
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        min: 8
    },
    since: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("User", userSchema);