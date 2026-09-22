const store = require('../config/dataStore');
const Hotel = require('../models/Hotel');

// @desc    Check room availability & dynamic pricing for a hotel
// @route   GET /api/hotels/:id/availability
// @access  Public
exports.checkAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { checkIn, checkOut, roomId } = req.query;

    const availability = store.checkRoomAvailability(id, checkIn, checkOut, roomId);

    if (!availability) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found',
      });
    }

    res.status(200).json({
      success: true,
      data: availability,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update room inventory & dynamic pricing rules (Admin)
// @route   PUT /api/hotels/:id/rooms/:roomId/inventory
// @access  Private/Admin
exports.updateRoomInventory = async (req, res, next) => {
  try {
    const { id, roomId } = req.params;
    const updateData = req.body;

    const updatedRoom = store.updateRoomInventory(id, roomId, updateData);

    if (!updatedRoom) {
      return res.status(404).json({
        success: false,
        message: 'Hotel or Room not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Room inventory and pricing rules updated successfully',
      data: updatedRoom,
    });
  } catch (error) {
    next(error);
  }
};
