const db = require('../db');

const createBooking = async (req, res, next) => {
  const { provider_id, tour_date, tour_time, notes } = req.body;
  const parent_id = req.user.id;

  try {
    // 1. Check if provider exists and has available spots
    const providerResult = await db.query(
      'SELECT pa.available_spots FROM providers p JOIN provider_availability pa ON p.id = pa.provider_id WHERE p.id = $1',
      [provider_id]
    );

    if (providerResult.rows.length === 0) {
      return res.status(404).json({ message: 'Provider not found or availability not set' });
    }

    if (providerResult.rows[0].available_spots <= 0) {
      return res.status(400).json({ message: 'No available spots for this provider' });
    }

    // 2. Create booking
    const result = await db.query(
      'INSERT INTO tour_bookings (parent_id, provider_id, tour_date, tour_time, status, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [parent_id, provider_id, tour_date, tour_time, 'pending', notes]
    );

    const booking = result.rows[0];

    // 3. Create notification for provider
    const providerUserResult = await db.query('SELECT user_id, center_name FROM providers WHERE id = $1', [provider_id]);
    const providerUserId = providerUserResult.rows[0].user_id;
    const centerName = providerUserResult.rows[0].center_name;

    await db.query(
      'INSERT INTO notifications (user_id, title, body) VALUES ($1, $2, $3)',
      [providerUserId, 'New Tour Request', `You have a new tour request for ${tour_date} at ${tour_time} from ${req.user.name}.`]
    );

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

const getBookings = async (req, res, next) => {
  const { role, id: userId } = req.user;
  const { status } = req.query;

  try {
    let query = '';
    let params = [userId];

    if (role === 'parent') {
      query = `
        SELECT b.*, p.center_name, p.address, p.phone as provider_phone 
        FROM tour_bookings b 
        JOIN providers p ON b.provider_id = p.id 
        WHERE b.parent_id = $1
      `;
    } else if (role === 'provider') {
      query = `
        SELECT b.*, u.name as parent_name, u.email as parent_email, u.phone as parent_phone 
        FROM tour_bookings b 
        JOIN providers p ON b.provider_id = p.id 
        JOIN users u ON b.parent_id = u.id 
        WHERE p.user_id = $1
      `;
    }

    if (status) {
      query += ' AND b.status = $2';
      params.push(status);
    }

    query += ' ORDER BY b.tour_date ASC, b.tour_time ASC';

    const result = await db.query(query, params);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
};

const getBookingById = async (req, res, next) => {
  const { id } = req.params;
  const { role, id: userId } = req.user;

  try {
    const result = await db.query(
      `SELECT b.*, p.center_name, p.user_id as provider_user_id, u.name as parent_name 
       FROM tour_bookings b 
       JOIN providers p ON b.provider_id = p.id 
       JOIN users u ON b.parent_id = u.id 
       WHERE b.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const booking = result.rows[0];

    // Check authorization
    if (role === 'parent' && booking.parent_id !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (role === 'provider' && booking.provider_user_id !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

const updateBookingStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body; // 'confirmed', 'cancelled', 'completed'
  const { role, id: userId } = req.user;

  try {
    // 1. Get booking and check ownership
    const bookingResult = await db.query(
      `SELECT b.*, p.user_id as provider_user_id, p.center_name 
       FROM tour_bookings b 
       JOIN providers p ON b.provider_id = p.id 
       WHERE b.id = $1`,
      [id]
    );

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const booking = bookingResult.rows[0];

    if (role === 'parent') {
      if (booking.parent_id !== userId) {
        return res.status(403).json({ message: 'Not authorized' });
      }
      if (status !== 'cancelled') {
        return res.status(400).json({ message: 'Parents can only cancel bookings' });
      }
    } else if (role === 'provider') {
      if (booking.provider_user_id !== userId) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }

    // 2. Handle status transitions and spot adjustments
    const oldStatus = booking.status;

    await db.query('BEGIN');

    // If confirming a pending/cancelled booking, decrement spots
    if (status === 'confirmed' && oldStatus !== 'confirmed') {
      await db.query(
        'UPDATE provider_availability SET available_spots = available_spots - 1 WHERE provider_id = $1 AND available_spots > 0',
        [booking.provider_id]
      );
    }
    // If cancelling a confirmed booking, increment spots
    else if (status === 'cancelled' && oldStatus === 'confirmed') {
      await db.query(
        'UPDATE provider_availability SET available_spots = available_spots + 1 WHERE provider_id = $1',
        [booking.provider_id]
      );
    }

    // 3. Update booking status
    const updateResult = await db.query(
      'UPDATE tour_bookings SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    // 4. Create notification
    let notificationUserId;
    let notificationTitle;
    let notificationBody;

    if (role === 'parent') {
      notificationUserId = booking.provider_user_id;
      notificationTitle = 'Booking Cancelled';
      notificationBody = `A tour booking for ${booking.tour_date} has been cancelled by the parent.`;
    } else {
      notificationUserId = booking.parent_id;
      notificationTitle = `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}`;
      notificationBody = `Your tour booking at ${booking.center_name} for ${booking.tour_date} has been ${status}.`;
    }

    await db.query(
      'INSERT INTO notifications (user_id, title, body) VALUES ($1, $2, $3)',
      [notificationUserId, notificationTitle, notificationBody]
    );

    await db.query('COMMIT');

    res.json({
      success: true,
      data: updateResult.rows[0]
    });
  } catch (error) {
    await db.query('ROLLBACK');
    next(error);
  }
};

const joinWaitlist = async (req, res, next) => {
  const { provider_id, age_group } = req.body;
  const parent_id = req.user.id;

  try {
    // Check for duplicates
    const checkDuplicate = await db.query(
      'SELECT id FROM waitlist WHERE parent_id = $1 AND provider_id = $2 AND age_group = $3',
      [parent_id, provider_id, age_group]
    );

    if (checkDuplicate.rows.length > 0) {
      return res.status(400).json({ message: 'Already on waitlist for this provider and age group' });
    }

    const result = await db.query(
      'INSERT INTO waitlist (parent_id, provider_id, age_group) VALUES ($1, $2, $3) RETURNING *',
      [parent_id, provider_id, age_group]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

const checkWaitlist = async (req, res, next) => {
  const { provider_id } = req.params;
  const parent_id = req.user.id;

  try {
    const result = await db.query(
      'SELECT * FROM waitlist WHERE parent_id = $1 AND provider_id = $2',
      [parent_id, provider_id]
    );

    res.json({
      success: true,
      on_waitlist: result.rows.length > 0,
      entries: result.rows
    });
  } catch (error) {
    next(error);
  }
};

const notifyWaitlist = async (req, res, next) => {
  const { provider_id } = req.body;
  const { id: userId } = req.user;

  try {
    // 1. Check ownership
    const providerResult = await db.query('SELECT center_name FROM providers WHERE id = $1 AND user_id = $2', [provider_id, userId]);
    if (providerResult.rows.length === 0) {
      return res.status(403).json({ message: 'Not authorized or provider not found' });
    }
    const centerName = providerResult.rows[0].center_name;

    // 2. Get waitlisted parents
    const waitlistResult = await db.query(
      'SELECT parent_id, age_group FROM waitlist WHERE provider_id = $1 AND notified_at IS NULL',
      [provider_id]
    );

    if (waitlistResult.rows.length === 0) {
      return res.json({ success: true, message: 'No one to notify' });
    }

    // 3. Notify parents
    for (const entry of waitlistResult.rows) {
      await db.query(
        'INSERT INTO notifications (user_id, title, body) VALUES ($1, $2, $3)',
        [entry.parent_id, 'Spot Available!', `A spot has opened up at ${centerName} for the ${entry.age_group} group. Book a tour now!`]
      );
    }

    // 4. Mark as notified
    await db.query(
      'UPDATE waitlist SET notified_at = CURRENT_TIMESTAMP WHERE provider_id = $1 AND notified_at IS NULL',
      [provider_id]
    );

    res.json({
      success: true,
      message: `Notified ${waitlistResult.rows.length} parents`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  joinWaitlist,
  checkWaitlist,
  notifyWaitlist
};
