const express = require('express');
const router = express.Router();
const {
  getProviders,
  getProviderById,
  updateProvider,
  updateAvailability,
  updatePricing
} = require('../controllers/providerController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getProviders);
router.get('/:id', getProviderById);

// Protected routes (Provider only)
router.put('/:id', protect, authorize('provider'), updateProvider);
router.put('/:id/availability', protect, authorize('provider'), updateAvailability);
router.put('/:id/pricing', protect, authorize('provider'), updatePricing);

module.exports = router;
