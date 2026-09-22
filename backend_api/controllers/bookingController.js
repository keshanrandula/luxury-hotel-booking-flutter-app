const Booking = require('../models/Booking');
const store = require('../config/dataStore');
const fcmService = require('../services/fcmService');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Public / Private
exports.createBooking = async (req, res, next) => {
  try {
    const bookingData = {
      ...req.body,
      user: req.user ? req.user._id : undefined,
    };

    let booking;
    try {
      booking = await Booking.create(bookingData);
    } catch (_) {}

    const saved = store.addBooking(booking ? booking.toObject() : bookingData);

    // Auto-dispatch booking confirmation push notification
    try {
      const hotel = store.getHotelById(saved.hotelId);
      const hotelName = hotel ? hotel.name : (saved.hotelName || 'Luxury Resort');
      const roomName = saved.roomName || 'Sanctuary Suite';
      const checkInStr = saved.checkIn ? new Date(saved.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Upcoming';

      const notifTitle = `Reservation Confirmed! 🛎️`;
      const notifBody = `Your stay at ${hotelName} (${roomName}) is booked for ${checkInStr}. Your luxury itinerary is ready.`;

      fcmService.sendPushNotification({
        title: notifTitle,
        body: notifBody,
        type: 'booking_confirmed',
        targetTopic: 'active_bookings',
        data: {
          bookingId: String(saved._id),
          hotelId: String(saved.hotelId),
          grandTotal: String(saved.grandTotal || ''),
          screen: 'booking_details',
        },
      });

      store.addNotification({
        title: notifTitle,
        body: notifBody,
        type: 'booking_confirmed',
        targetAudience: 'single_device',
        recipientCount: 1,
        status: 'delivered',
        data: {
          bookingId: String(saved._id),
          hotelId: String(saved.hotelId),
        },
      });
    } catch (notifErr) {
      console.warn('Auto booking notification error:', notifErr.message);
    }

    res.status(201).json({
      success: true,
      data: saved,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/my
// @access  Private
exports.getMyBookings = async (req, res, next) => {
  try {
    let bookings = [];
    try {
      bookings = await Booking.find({
        $or: [{ user: req.user._id }, { guestEmail: req.user.email }],
      }).sort('-createdAt');
    } catch (_) {}

    if (!bookings || bookings.length === 0) {
      bookings = store.getBookings().filter(
        (b) => b.guestEmail === req.user?.email || b.user === req.user?._id
      );
    }

    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
exports.getAllBookings = async (req, res, next) => {
  try {
    let bookings = [];
    try {
      bookings = await Booking.find().sort('-createdAt');
    } catch (_) {}

    if (!bookings || bookings.length === 0) {
      bookings = store.getBookings();
    }

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (Admin / User)
// @route   PUT /api/bookings/:id/status
// @access  Private
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    try {
      const b = await Booking.findById(req.params.id);
      if (b) {
        b.status = status;
        await b.save();
      }
    } catch (_) {}

    const updated = store.updateBookingStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    try {
      const b = await Booking.findById(req.params.id);
      if (b) {
        b.status = 'cancelled';
        await b.save();
      }
    } catch (_) {}

    const updated = store.updateBookingStatus(req.params.id, 'cancelled');
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
