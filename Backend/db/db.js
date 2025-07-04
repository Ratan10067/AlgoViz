const mongoose = require("mongoose");
const url = process.env.MONGO_URL;
// console.log()
const connectDB = async () => {
  try {
    const connect = await mongoose.connect(url);
    console.log(`MongoDB connected: ${connect.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

module.exports = connectDB;
