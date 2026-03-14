const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.databaseKey);
        console.log("Connected successfully");
    } catch (error) {
        console.log("Connection failed", error);
    }
}

connectDB();