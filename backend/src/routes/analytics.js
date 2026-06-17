const express = require('express');
const router = express.Router();
const { logEngagement } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

// Optional authentication - logEngagement handles null user_id
// We use a middleware that tries to decode but doesn't fail if no token
const optionalProtect = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const jwt = require('jsonwebtoken');
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (error) {
      // Ignore error for optional auth
    }
  }
  next();
};

router.post('/engagement', optionalProtect, logEngagement);

module.exports = router;
