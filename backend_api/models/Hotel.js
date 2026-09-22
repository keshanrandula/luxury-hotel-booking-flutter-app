const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bedType: { type: String, default: '1 King Bed' },
  maxGuests: { type: Number, default: 2 },
  sizeSqM: { type: Number, default: 80 },
  pricePerNight: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  features: [{ type: String }],
  totalInventory: { type: Number, default: 5 },
  weekendMultiplier: { type: Number, default: 1.15 },
  seasonalMultiplier: { type: Number, default: 1.25 },
});

const reviewSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  userAvatar: { type: String, default: '' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  date: { type: String, default: 'Recent' },
  comment: { type: String, required: true },
});

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a hotel name'],
      trim: true,
    },
    tagline: {
      type: String,
      default: 'Exclusive Luxury Retreat',
    },
    location: {
      type: String,
      required: [true, 'Please add location details'],
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 4.9,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 150,
    },
    pricePerNight: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
    },
    discountPercent: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      enum: ['Luxury', 'Beachfront', 'Mountain', 'Boutique', 'Urban'],
      default: 'Luxury',
    },
    images: [{ type: String }],
    description: {
      type: String,
      required: true,
    },
    amenities: [{ type: String }],
    rooms: [roomSchema],
    reviews: [reviewSchema],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    latitude: {
      type: Number,
      default: 0.0,
    },
    longitude: {
      type: Number,
      default: 0.0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Hotel', hotelSchema);
