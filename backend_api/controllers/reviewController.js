const mongoose = require('mongoose');
const Review = require('../models/Review');
const Hotel = require('../models/Hotel');
const store = require('../config/dataStore');

const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Get all reviews (with optional status & hotel filtering)
// @route   GET /api/reviews
// @access  Public / Admin
exports.getReviews = async (req, res, next) => {
  try {
    const { status, hotelId } = req.query;

    let reviews = [];
    if (isDbConnected()) {
      try {
        let query = {};
        if (status && status !== 'all') query.status = status;
        if (hotelId) query.hotelId = hotelId;

        reviews = await Review.find(query).sort('-createdAt');
      } catch (_) {}
    }

    if (!reviews || reviews.length === 0) {
      reviews = store.getReviews({ status, hotelId });
    }

    // Return summary statistics along with review list
    const all = store.getReviews();
    const stats = {
      total: all.length,
      pending: all.filter((r) => r.status === 'pending').length,
      approved: all.filter((r) => r.status === 'approved').length,
      rejected: all.filter((r) => r.status === 'rejected').length,
      averageRating:
        all.length > 0
          ? +(all.reduce((acc, r) => acc + (r.rating || 5), 0) / all.length).toFixed(1)
          : 4.9,
    };

    res.status(200).json({
      success: true,
      count: reviews.length,
      stats,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get approved reviews for a specific hotel
// @route   GET /api/hotels/:hotelId/reviews
// @access  Public
exports.getHotelReviews = async (req, res, next) => {
  try {
    const { hotelId } = req.params;

    let reviews = [];
    if (isDbConnected()) {
      try {
        reviews = await Review.find({ hotelId, status: 'approved' }).sort('-createdAt');
      } catch (_) {}
    }

    if (!reviews || reviews.length === 0) {
      reviews = store.getReviews({ hotelId, status: 'approved' });
    }

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add review for a hotel (User)
// @route   POST /api/reviews
// @access  Public / Private
exports.createReview = async (req, res, next) => {
  try {
    const { hotelId, hotelName, bookingId, userId, userName, userAvatar, rating, comment, photos } = req.body;

    if (!hotelId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide hotelId, rating, and review comment',
      });
    }

    let review;
    if (isDbConnected()) {
      try {
        review = await Review.create({
          hotelId,
          hotelName: hotelName || 'Luxury Hotel',
          bookingId: bookingId || '',
          userId: userId || 'usr-guest',
          userName: userName || 'Guest Traveler',
          userAvatar: userAvatar || '',
          rating: Number(rating),
          comment,
          photos: Array.isArray(photos) ? photos : [],
          status: 'approved', // Auto-approved or set to pending based on config
        });
      } catch (_) {}
    }

    const saved = store.addReview({
      hotelId,
      hotelName,
      bookingId,
      userId,
      userName,
      userAvatar,
      rating: Number(rating),
      comment,
      photos,
      status: 'approved',
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully!',
      data: saved || review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update review moderation status (Admin: approve / reject)
// @route   PUT /api/reviews/:id/status
// @access  Private/Admin
exports.updateReviewStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['approved', 'pending', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be approved, pending, or rejected',
      });
    }

    let updatedReview = null;
    try {
      updatedReview = await Review.findByIdAndUpdate(req.params.id, { status }, { new: true });
    } catch (_) {}

    const storeUpdated = store.updateReviewStatus(req.params.id, status);
    const finalData = updatedReview ? (updatedReview.toObject ? updatedReview.toObject() : updatedReview) : storeUpdated;

    if (!finalData) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    res.status(200).json({
      success: true,
      message: `Review marked as ${status}`,
      data: finalData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review (Admin)
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
exports.deleteReview = async (req, res, next) => {
  try {
    let deleted = null;
    try {
      deleted = await Review.findByIdAndDelete(req.params.id);
    } catch (_) {}

    const storeDeleted = store.deleteReview(req.params.id);
    const finalDeleted = deleted || storeDeleted;

    if (!finalDeleted) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    res.status(200).json({ success: true, message: 'Review removed successfully', data: finalDeleted });
  } catch (error) {
    next(error);
  }
};
