const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dioosqpp7',
  api_key: process.env.CLOUDINARY_API_KEY || '531473134211287',
  api_secret: process.env.CLOUDINARY_API_SECRET || '5mFDa13V2GPDiQNhIB6SAbSDP7o',
  secure: true,
});

module.exports = cloudinary;
