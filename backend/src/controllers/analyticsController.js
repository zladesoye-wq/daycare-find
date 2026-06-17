const db = require('../db');

/**
 * @desc    Log an engagement event (view or tap)
 * @route   POST /api/analytics/engagement
 * @access  Public (optional user_id)
 */
const logEngagement = async (req, res, next) => {
  try {
    const { provider_id, action_type, is_budget_pick } = req.body;
    const user_id = req.user ? req.user.id : null;

    if (!provider_id || !action_type) {
      return res.status(400).json({ message: 'provider_id and action_type are required' });
    }

    await db.query(
      `INSERT INTO engagement_logs (user_id, provider_id, action_type, is_budget_pick)
       VALUES ($1, $2, $3, $4)`,
      [user_id, provider_id, action_type, is_budget_pick || false]
    );

    res.status(201).json({ success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  logEngagement
};
