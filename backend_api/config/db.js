const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  const mongoURI = process.env.MONGODB_URI;

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log(` MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ MongoDB Atlas notice (offline mode): ${error.message}`);
    mongoose.set('bufferCommands', false);
    isConnected = false;
  }
};

module.exports = connectDB;
