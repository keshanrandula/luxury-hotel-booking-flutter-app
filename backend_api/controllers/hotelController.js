const mongoose = require('mongoose');
const Hotel = require('../models/Hotel');
const store = require('../config/dataStore');

const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Get all hotels (with filtering and search)
// @route   GET /api/hotels
// @access  Public
exports.getHotels = async (req, res, next) => {
  try {
    const { category, q, featured } = req.query;

    let hotels = [];
    if (isDbConnected()) {
      try {
        let query = {};
        if (category && category !== 'All') {
          query.category = { $regex: new RegExp(`^${category}$`, 'i') };
        }
        if (featured === 'true') {
          query.isFeatured = true;
        }
        if (q) {
          query.$or = [
            { name: { $regex: q, $options: 'i' } },
            { location: { $regex: q, $options: 'i' } },
            { city: { $regex: q, $options: 'i' } },
            { country: { $regex: q, $options: 'i' } },
          ];
        }
        hotels = await Hotel.find(query).sort('-createdAt');
      } catch (_) {}
    }

    if (!hotels || hotels.length === 0) {
      hotels = store.getHotels({ category, q, featured });
    }

    res.status(200).json(hotels);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single hotel by ID
// @route   GET /api/hotels/:id
// @access  Public
exports.getHotelById = async (req, res, next) => {
  try {
    let hotel;
    try {
      hotel = await Hotel.findById(req.params.id);
    } catch (_) {}

    if (!hotel) {
      hotel = store.getHotelById(req.params.id);
    }

    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }

    res.status(200).json(hotel);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new hotel (Admin)
// @route   POST /api/hotels
// @access  Private/Admin
exports.createHotel = async (req, res, next) => {
  try {
    let hotel;
    try {
      hotel = await Hotel.create(req.body);
    } catch (_) {}

    const saved = store.addHotel(hotel ? hotel.toObject() : req.body);

    res.status(201).json({
      success: true,
      data: saved,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update hotel (Admin)
// @route   PUT /api/hotels/:id
// @access  Private/Admin
exports.updateHotel = async (req, res, next) => {
  try {
    try {
      await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    } catch (_) {}

    const updated = store.updateHotel(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete hotel (Admin)
// @route   DELETE /api/hotels/:id
// @access  Private/Admin
exports.deleteHotel = async (req, res, next) => {
  try {
    try {
      await Hotel.findByIdAndDelete(req.params.id);
    } catch (_) {}

    const deleted = store.deleteHotel(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }

    res.status(200).json({ success: true, message: 'Hotel removed successfully', data: deleted });
  } catch (error) {
    next(error);
  }
};
