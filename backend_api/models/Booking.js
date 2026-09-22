const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: false,
    },
    hotelId: {
      type: String,
      required: true,
    },
    hotelName: {
      type: String,
      required: true,
    },
    hotelImage: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    roomId: {
      type: String,
      required: true,
    },
    roomName: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    guestName: {
      type: String,
      required: true,
    },
    guestEmail: {
      type: String,
      required: true,
    },
    guestPhone: {
      type: String,
      required: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    adults: {
      type: Number,
      default: 2,
    },
    children: {
      type: Number,
      default: 0,
    },
    nights: {
      type: Number,
      required: true,
    },
    roomTotal: {
      type: Number,
      required: true,
    },
    taxesAndFees: {
      type: Number,
      required: true,
    },
    grandTotal: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['confirmed', 'active', 'completed', 'cancelled'],
      default: 'confirmed',
    },
    paymentMethod: {
      type: String,
      default: 'concierge',
    },
    specialRequests: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
