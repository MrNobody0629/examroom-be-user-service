const mongoose = require('mongoose');
const config = require('../config');
const { AppError } = require('../utils/errorHandler');
if (!('dbConfig' in config)) {
  throw new AppError(
    'dbConnection',
    'Please Provide dbConfig in configFile',
    'custom',
    500
  );
}
const { dbConfig } = config;
const { mongoUrlString } = dbConfig;
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoUrlString);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit();
  }
};

module.exports = connectDB;
