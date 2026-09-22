const mongoose = require("mongoose");

async function connectDB() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is required to connect to MongoDB");
  }

  const connection = await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000,
  });
  console.log(`MongoDB connected: ${connection.connection.host}`);
}

module.exports = connectDB;
