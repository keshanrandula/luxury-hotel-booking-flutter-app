const express = require('express');
const router = express.Router();
const {
  getPromos,
  validatePromo,
  createPromo,
  updatePromo,
  deletePromo,
} = require('../controllers/promoController');

router.route('/')
  .get(getPromos)
  .post(createPromo);

router.route('/validate')
  .post(validatePromo);

router.route('/:id')
  .put(updatePromo)
  .delete(deletePromo);

module.exports = router;
