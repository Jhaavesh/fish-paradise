const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // MONGO_URI ya MONGODB_URI — dono check karega
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!uri) {
      throw new Error('MongoDB URI not found! Check MONGO_URI in .env file');
    }

    const conn = await mongoose.connect(uri);
    console.log('✅ MongoDB Connected:', conn.connection.host);
  } catch (e) {
    console.error('❌ DB Error:', e.message);
    process.exit(1);
  }
};

module.exports = connectDB;