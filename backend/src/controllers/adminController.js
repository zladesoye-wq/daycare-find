const db = require('../db');

/**
 * @desc    Get all providers with details
 * @route   GET /api/admin/providers
 * @access  Private/Admin
 */
const getProviders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        p.*, 
        pa.total_spots, pa.available_spots,
        ps.plan as subscription_plan, ps.status as subscription_status
      FROM providers p
      LEFT JOIN provider_availability pa ON p.id = pa.provider_id
      LEFT JOIN provider_subscriptions ps ON p.id = ps.provider_id
    `;

    const queryParams = [];
    if (status === 'active') {
      query += ` WHERE p.is_active = true`;
    } else if (status === 'inactive') {
      query += ` WHERE p.is_active = false`;
    }

    query += ` ORDER BY p.created_at DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(limit, offset);

    const result = await db.query(query, queryParams);
    
    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM providers';
    const countParams = [];
    if (status === 'active') {
      countQuery += ' WHERE is_active = true';
    } else if (status === 'inactive') {
      countQuery += ' WHERE is_active = false';
    }
    const countResult = await db.query(countQuery, countParams);

    res.json({
      success: true,
      count: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      limit: parseInt(limit),
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Flag a provider as inactive
 * @route   PUT /api/admin/providers/:id/flag
 * @access  Private/Admin
 */
const flagProvider = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_active, reason } = req.body;

    const result = await db.query(
      'UPDATE providers SET is_active = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [is_active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    // Optionally create a notification for the provider user
    await db.query(
      'INSERT INTO notifications (user_id, title, body) VALUES ($1, $2, $3)',
      [
        result.rows[0].user_id,
        `Provider Account ${is_active ? 'Activated' : 'Deactivated'}`,
        `Your provider account has been ${is_active ? 'activated' : 'deactivated'} by an administrator. ${reason ? 'Reason: ' + reason : ''}`
      ]
    );

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get platform analytics
 * @route   GET /api/admin/analytics
 * @access  Private/Admin
 */
const getAnalytics = async (req, res, next) => {
  try {
    // 1. Total active providers
    const activeProvidersRes = await db.query('SELECT COUNT(*) FROM providers WHERE is_active = true');
    const totalActiveProviders = parseInt(activeProvidersRes.rows[0].count);

    // 2. Total parent signups
    const parentSignupsRes = await db.query("SELECT COUNT(*) FROM users WHERE role = 'parent'");
    const totalParentSignups = parseInt(parentSignupsRes.rows[0].count);

    // 3. Total tour bookings (all time and this month)
    const bookingsAllTimeRes = await db.query('SELECT COUNT(*) FROM tour_bookings');
    const totalBookingsAllTime = parseInt(bookingsAllTimeRes.rows[0].count);

    const bookingsThisMonthRes = await db.query(
      "SELECT COUNT(*) FROM tour_bookings WHERE created_at >= date_trunc('month', current_date)"
    );
    const totalBookingsThisMonth = parseInt(bookingsThisMonthRes.rows[0].count);

    // 4. Booking status breakdown
    const bookingStatusRes = await db.query('SELECT status, COUNT(*) FROM tour_bookings GROUP BY status');
    const bookingStatusBreakdown = bookingStatusRes.rows.reduce((acc, row) => {
      acc[row.status] = parseInt(row.count);
      return acc;
    }, {});

    // 5. Average search radius usage
    const avgRadiusRes = await db.query('SELECT AVG(search_radius) FROM parent_profiles');
    const averageSearchRadius = parseFloat(avgRadiusRes.rows[0].avg) || 0;

    // 6. Budget Pick engagement (calculated from engagement_logs)
    const engagementRes = await db.query(`
      SELECT 
        COUNT(*) FILTER (WHERE is_budget_pick = true) as budget_engagement,
        COUNT(*) as total_engagement
      FROM engagement_logs
    `);
    const budgetEngagement = parseInt(engagementRes.rows[0].budget_engagement) || 0;
    const totalEngagement = parseInt(engagementRes.rows[0].total_engagement) || 0;
    const budgetPickEngagementRate = totalEngagement > 0 
      ? (budgetEngagement / totalEngagement) * 100 
      : 0;

    res.json({
      success: true,
      data: {
        totalActiveProviders,
        totalParentSignups,
        totalBookingsAllTime,
        totalBookingsThisMonth,
        bookingStatusBreakdown,
        averageSearchRadius,
        budgetPickEngagement: {
          rate: budgetPickEngagementRate,
          total_interactions: totalEngagement,
          budget_pick_interactions: budgetEngagement
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a provider listing
 * @route   DELETE /api/admin/providers/:id
 * @access  Private/Admin
 */
const deleteProvider = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if provider exists
    const providerRes = await db.query('SELECT * FROM providers WHERE id = $1', [id]);
    if (providerRes.rows.length === 0) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    // Delete provider (cascading delete should handle related records)
    await db.query('DELETE FROM providers WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Provider deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProviders,
  flagProvider,
  getAnalytics,
  deleteProvider
};
