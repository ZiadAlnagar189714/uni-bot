const mongoose = require("mongoose");
const { Schema } = mongoose;

const BotUserSchema = new Schema({
    userID: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    firstSeen: {
        type: String,
    },
    lastSeen: {
        type: String,
    },
    source: {
        type: String,
    },
    country: {
        type: String,
    },
    region: {
        type: String,
    },
    ip: {
        type: String,
    },
});

const BotUser = mongoose.model("botuser", BotUserSchema);
module.exports = BotUser