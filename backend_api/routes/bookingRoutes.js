const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/', createBooking);
router.get('/my', protect, getMyBookings);
router.get('/', protect, authorize('admin'), getAllBookings);
router.put('/:id/status', protect, authorize('admin'), updateBookingStatus);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
