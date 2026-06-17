const express = require('express');
const router = express.Router();
const {
  createSubscription,
  handleWebhook,
  getSubscriptionStatus
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

// Webhook endpoint (must be before protect middleware and use raw body)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Protected routes
router.post('/create-subscription', protect, authorize('provider'), createSubscription);
router.get('/subscription/:providerId', protect, getSubscriptionStatus);

module.exports = router;
