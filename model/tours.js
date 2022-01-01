const mongoose = require("mongoose");
const { Schema } = mongoose;

const CampusToursSchema = new Schema({
    Faculty: {
        type: String,
        required: true,
    },
    StudentEmail: {
        type: [String],
    },
    NumofStudents: {
        type: Number,
        required: true,
    },
});

const tours = mongoose.model("tours", CampusToursSchema);
module.exports = tours;
