const express = require('express');
const router = express.Router();
const {
  getReviews,
  getHotelReviews,
  createReview,
  updateReviewStatus,
  deleteReview,
} = require('../controllers/reviewController');

router.route('/')
  .get(getReviews)
  .post(createReview);

router.route('/hotel/:hotelId')
  .get(getHotelReviews);

router.route('/:id/status')
  .put(updateReviewStatus);

router.route('/:id')
  .delete(deleteReview);

module.exports = router;
