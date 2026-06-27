const express = require('express');
const router = express.Router();
const {
  getProviders,
  getProviderById,
  updateProvider,
  updateAvailability,
  updatePricing,
  getMyProvider,
  getMyProviderStats,
  updateMyProvider,
  updateMyAvailability,
  updateMyPricing
} = require('../controllers/providerController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getProviders);
router.get('/me', protect, authorize('provider'), getMyProvider);
router.get('/me/stats', protect, authorize('provider'), getMyProviderStats);
router.get('/:id', getProviderById);

// Protected routes (Provider only)
router.put('/me', protect, authorize('provider'), updateMyProvider);
router.put('/me/availability', protect, authorize('provider'), updateMyAvailability);
router.put('/me/pricing', protect, authorize('provider'), updateMyPricing);
router.put('/:id', protect, authorize('provider'), updateProvider);
router.put('/:id/availability', protect, authorize('provider'), updateAvailability);
router.put('/:id/pricing', protect, authorize('provider'), updatePricing);

module.exports = router;
