const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a notification title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    body: {
      type: String,
      required: [true, 'Please provide notification body text'],
      trim: true,
      maxlength: [300, 'Body cannot exceed 300 characters'],
    },
    type: {
      type: String,
      enum: ['booking_confirmed', 'checkin_reminder', 'promo_deal', 'system_alert'],
      default: 'system_alert',
    },
    targetAudience: {
      type: String,
      enum: ['all', 'active_bookings', 'vip_tier', 'single_device'],
      default: 'all',
    },
    recipientCount: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'failed'],
      default: 'delivered',
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Notification', NotificationSchema);
