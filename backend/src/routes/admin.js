const express = require('express');
const router = express.Router();
const {
  getProviders,
  flagProvider,
  getAnalytics,
  deleteProvider
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All admin routes are protected and require admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/providers', getProviders);
router.put('/providers/:id/flag', flagProvider);
router.get('/analytics', getAnalytics);
router.delete('/providers/:id', deleteProvider);

module.exports = router;
