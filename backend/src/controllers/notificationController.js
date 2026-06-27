const db = require('../db');

// GET /api/notifications — get notifications for current user
exports.getNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const result = await db.query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [req.user.id, limit, offset]
    );
    const countResult = await db.query(
      'SELECT COUNT(*) FROM notifications WHERE user_id = $1',
      [req.user.id]
    );
    const unreadResult = await db.query(
      'SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false',
      [req.user.id]
    );
    res.json({
      notifications: result.rows,
      total: parseInt(countResult.rows[0].count),
      unread: parseInt(unreadResult.rows[0].count),
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/notifications/:id/read — mark notification as read
exports.markAsRead = async (req, res, next) => {
  try {
    const result = await db.query(
      'UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2 RETURNING *',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.json({ notification: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// PUT /api/notifications/read-all — mark all as read
exports.markAllAsRead = async (req, res, next) => {
  try {
    await db.query(
      'UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false',
      [req.user.id]
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    next(err);
  }
};

// POST /api/notifications/register-push — store Expo push token
exports.registerPushToken = async (req, res, next) => {
  try {
    const { pushToken } = req.body;
    if (!pushToken) {
      return res.status(400).json({ error: 'Push token is required' });
    }
    await db.query(
      'UPDATE users SET push_token = $1 WHERE id = $2',
      [pushToken, req.user.id]
    );
    res.json({ message: 'Push token registered' });
  } catch (err) {
    next(err);
  }
};
