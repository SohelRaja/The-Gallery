const mongoose = require('mongoose');

const {DEFAULT_PIC} = require('../config/keys');

const {ObjectId} = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    pic:{
        type: String,
        default: DEFAULT_PIC
    },
    followers: [{type: ObjectId, ref: "User"}],
    following: [{type: ObjectId, ref: "User"}],
    priority: {
        type: String,
        default: "normal"
    }
});

mongoose.model("User", userSchema);