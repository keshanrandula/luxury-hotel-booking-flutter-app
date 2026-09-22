const store = require('../config/dataStore');

// @desc    Get dashboard metrics & analytics
// @route   GET /api/stats/dashboard
// @access  Public / Private
exports.getDashboardStats = async (req, res, next) => {
  try {
    const statsData = store.getStats();
    res.status(200).json(statsData);
  } catch (error) {
    next(error);
  }
};

// @desc    Get 6-month revenue & occupancy forecasting projections
// @route   GET /api/stats/forecast
// @access  Public / Private
exports.getForecastStats = async (req, res, next) => {
  try {
    const forecastData = store.getForecastingAnalytics();
    res.status(200).json({
      success: true,
      data: forecastData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get 30-day occupancy heatmap across resort portfolio
// @route   GET /api/stats/heatmap
// @access  Public / Private
exports.getOccupancyHeatmap = async (req, res, next) => {
  try {
    const heatmapData = store.getOccupancyHeatmap();
    res.status(200).json({
      success: true,
      data: heatmapData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Download Bookings Ledger CSV
// @route   GET /api/stats/export/bookings
// @access  Public / Private
exports.exportBookingsCSV = async (req, res, next) => {
  try {
    const csvContent = store.generateBookingsCSV();
    const filename = `luxestays_bookings_ledger_${new Date().toISOString().split('T')[0]}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

// @desc    Download Revenue & Financial Performance CSV
// @route   GET /api/stats/export/revenue
// @access  Public / Private
exports.exportRevenueCSV = async (req, res, next) => {
  try {
    const csvContent = store.generateRevenueCSV();
    const filename = `luxestays_financial_performance_${new Date().toISOString().split('T')[0]}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};
