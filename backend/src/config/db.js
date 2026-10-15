const mongoose = require('mongoose');
const env = require('./env');

/**
 * Open a single Mongoose connection using the configured Atlas URI.
 */
async function connectDB() {
  await mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 10000,
  });
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
}

module.exports = connectDB;
