const express = require('express');
const router = express.Router();
const {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
} = require('../controllers/hotelController');
const {
  checkAvailability,
  updateRoomInventory,
} = require('../controllers/availabilityController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.route('/')
  .get(getHotels)
  .post(protect, authorize('admin'), createHotel);

router.route('/:id/availability')
  .get(checkAvailability);

router.route('/:id/rooms/:roomId/inventory')
  .put(updateRoomInventory);

router.route('/:id')
  .get(getHotelById)
  .put(protect, authorize('admin'), updateHotel)
  .delete(protect, authorize('admin'), deleteHotel);

module.exports = router;
