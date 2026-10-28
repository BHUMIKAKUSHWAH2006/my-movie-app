const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if custom dns servers cannot be set
}

const mongoose = require('mongoose');

module.exports = async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/imovies';
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  try {
    await require('../models/Movie').syncIndexes();
  } catch (e) {
    console.warn('Index update skipped:', e.message);
  }
  console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
};
