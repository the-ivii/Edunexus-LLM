const mongoose = require('mongoose')
const env = require('dotenv')

const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected Succesfully!");
    } catch(error) {
        console.error("Database connection failed! Error: ", error.message);
    }
}

module.exports = connectDB;