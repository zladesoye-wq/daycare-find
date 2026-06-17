const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  joinWaitlist,
  checkWaitlist,
  notifyWaitlist
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

// All booking routes require authentication
router.use(protect);

// Booking routes
router.post('/', authorize('parent'), createBooking);
router.get('/', getBookings);
router.get('/:id', getBookingById);
router.put('/:id/status', updateBookingStatus);

// Waitlist routes
router.post('/waitlist', authorize('parent'), joinWaitlist);
router.get('/waitlist/check/:provider_id', authorize('parent'), checkWaitlist);
router.post('/waitlist/notify', authorize('provider'), notifyWaitlist);

module.exports = router;
