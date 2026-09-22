const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getForecastStats,
  getOccupancyHeatmap,
  exportBookingsCSV,
  exportRevenueCSV,
} = require('../controllers/statsController');

router.get('/dashboard', getDashboardStats);
router.get('/forecast', getForecastStats);
router.get('/heatmap', getOccupancyHeatmap);
router.get('/export/bookings', exportBookingsCSV);
router.get('/export/revenue', exportRevenueCSV);

module.exports = router;
