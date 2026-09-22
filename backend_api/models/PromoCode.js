const mongoose = require('mongoose');

const promoCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Promo code string is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage',
    },
    discountValue: {
      type: Number,
      required: [true, 'Discount value is required'],
    },
    minBookingAmount: {
      type: Number,
      default: 0,
    },
    maxDiscount: {
      type: Number,
      default: 5000,
    },
    expiryDate: {
      type: String,
      default: '2027-12-31',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('PromoCode', promoCodeSchema);
