const mongoose = require("mongoose");
const glob = require("./globals")
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(glob('db'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("database connected: " + conn.connection.host);
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
};

module.exports = connectDB;