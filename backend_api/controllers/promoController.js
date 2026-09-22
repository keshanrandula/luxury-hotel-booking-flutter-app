const store = require('../config/dataStore');
const PromoCode = require('../models/PromoCode');

// @desc    Get all promo codes (with summary metrics)
// @route   GET /api/promos
// @access  Public / Admin
exports.getPromos = async (req, res, next) => {
  try {
    const { activeOnly } = req.query;

    let promos = [];
    try {
      let query = {};
      if (activeOnly === 'true') query.isActive = true;
      promos = await PromoCode.find(query).sort('-createdAt');
    } catch (_) {}

    if (!promos || promos.length === 0) {
      promos = store.getPromos({ activeOnly: activeOnly === 'true' });
    }

    const all = store.getPromos();
    const stats = {
      total: all.length,
      active: all.filter((p) => p.isActive).length,
      inactive: all.filter((p) => !p.isActive).length,
      totalRedemptions: all.reduce((acc, p) => acc + (p.usageCount || 0), 0),
    };

    res.status(200).json({
      success: true,
      count: promos.length,
      stats,
      promos,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Validate a promo code during checkout
// @route   POST /api/promos/validate
// @access  Public
exports.validatePromo = async (req, res, next) => {
  try {
    const { code, bookingAmount } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a promo code to validate.',
      });
    }

    const result = store.validatePromo(code, bookingAmount || 0);

    if (!result.isValid) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new promo code (Admin)
// @route   POST /api/promos
// @access  Private/Admin
exports.createPromo = async (req, res, next) => {
  try {
    let promo;
    try {
      promo = await PromoCode.create(req.body);
    } catch (_) {}

    const saved = store.addPromo(promo ? promo.toObject() : req.body);

    res.status(201).json({
      success: true,
      message: 'Promo code created successfully!',
      data: saved || promo,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update promo code (Admin)
// @route   PUT /api/promos/:id
// @access  Private/Admin
exports.updatePromo = async (req, res, next) => {
  try {
    try {
      await PromoCode.findByIdAndUpdate(req.params.id, req.body, { new: true });
    } catch (_) {}

    const updated = store.updatePromo(req.params.id, req.body);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Promo code not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Promo code updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete promo code (Admin)
// @route   DELETE /api/promos/:id
// @access  Private/Admin
exports.deletePromo = async (req, res, next) => {
  try {
    try {
      await PromoCode.findByIdAndDelete(req.params.id);
    } catch (_) {}

    const deleted = store.deletePromo(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Promo code not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Promo code removed successfully',
      data: deleted,
    });
  } catch (error) {
    next(error);
  }
};
