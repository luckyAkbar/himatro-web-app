require('dotenv').config();
const mongoose = require('mongoose');

const mongodbAtlasConnection = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB Atlas connected.');
  } catch (e) {
    console.log('failed to connect to MongoDB Atlas. Retrying...');
    await mongodbAtlasConnection()
  }
}

module.exports = { mongodbAtlasConnection };