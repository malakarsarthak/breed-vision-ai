require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/breedvision";

        const connection = await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(`MongoDB Connected to: ${connection.connection.name}`);
    } catch (error) {
        console.error("Database connection error:", error.message);
        console.log("Retrying in 5 seconds...");
        setTimeout(connectDB, 5000);
    }
};

module.exports = connectDB;
