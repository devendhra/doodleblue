// This file handles the connection to our MongoDB Atlas database.
// connectDB() is called once when the server starts (see server.js).

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // MONGO_URI comes from the .env file (loaded in server.js)
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    // If we cannot reach the database there is no point running the server,
    // so we log the reason and stop the process.
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
