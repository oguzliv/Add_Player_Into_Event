const mongoose = require("mongoose");

const user = new mongoose.Schema({
    username: {
        required: true,
        type: String
    },
    password : {
        required: true,
        type: String
    },
    group_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    level : {
        required: true,
        type: Number
    }
});

const group = new mongoose.Schema({
    event_id: {
        required: true,
        type: mongoose.Schema.Types.ObjectId
    },
    category : {
        required: true,
        type: String,
        enum : ["Bronze", "Silver", "Gold"]
    }
});

module.exports = {
    Group : mongoose.model('Group', group),
    User : mongoose.model('User', user)
}