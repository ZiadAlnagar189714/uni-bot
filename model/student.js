const mongoose = require("mongoose");
const { Schema } = mongoose;

const StudentSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        minLength: 6,
        required: true,
    },
    isEnrolled: {
        type: Boolean,
        default: false
    },
    faculty: {
        type: String,
        enum: ['cs', 'eng', 'den']
    },
});

const student = mongoose.model("student", StudentSchema);
module.exports = student;







// bsonType: "objectId",
// title: "Student",
// properties: {
//     email: { type: String },
//     password: { type: String },
//     isFromEgypt: { type: Boolean },
//     admissionStatus: { type: String },
//     provided: { type: Array },
// },
// date: { type: Date, default: Date.now },
// hidden: Boolean,
// meta: {
//     votes: Number,
//     favs: Number,
// },
// required: ["_id", "email", "password", "isFromEgypt", "admissionStatus", "provided"],
