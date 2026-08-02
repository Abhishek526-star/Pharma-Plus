const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log("Using existing MongoDB connection");
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        isConnected = conn.connection.readyState === 1;

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("MongoDB Connection Failed:", error);
        throw error; // Don't use process.exit() on Vercel
    }
};

module.exports = connectDB;