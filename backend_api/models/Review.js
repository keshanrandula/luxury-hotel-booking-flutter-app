const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    hotelId: {
      type: String,
      required: [true, 'Hotel ID is required'],
    },
    hotelName: {
      type: String,
      required: true,
    },
    bookingId: {
      type: String,
      default: '',
    },
    userId: {
      type: String,
      default: '',
    },
    userName: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
    },
    userAvatar: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required (1-5)'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
    },
    photos: [{
      type: String,
    }],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Review', reviewSchema);
