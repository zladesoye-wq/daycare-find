const db = require('../db');
const { geocodeZip } = require('../services/googleMaps');
const { calculateBudgetPicks } = require('../services/budgetMatch');

const getProviders = async (req, res, next) => {
  const {
    zip,
    radius = 10,
    age_group,
    min_price,
    max_price,
    subsidy,
    availability,
    lat: reqLat,
    lng: reqLng,
    page = 1,
    limit = 10
  } = req.query;

  try {
    let searchLat = reqLat;
    let searchLng = reqLng;

    // 1. Geocode ZIP if lat/lng not provided
    if (zip && (!searchLat || !searchLng)) {
      const coords = await geocodeZip(zip);
      if (coords) {
        searchLat = coords.lat;
        searchLng = coords.lng;
      }
    }

    // 2. Build Query
    let query = `
      SELECT 
        p.*, 
        pa.available_spots, 
        pa.total_spots,
        pp.monthly_price,
        pp.age_group as requested_age_group
    `;

    // Add distance calculation if we have search coordinates
    if (searchLat && searchLng) {
      query += `,
        (3959 * acos(cos(radians($1)) * cos(radians(p.lat)) * cos(radians(p.lng) - radians($2)) + sin(radians($1)) * sin(radians(p.lat)))) AS distance
      `;
    } else {
      query += `, 0 as distance`;
    }

    query += `
      FROM providers p
      LEFT JOIN provider_availability pa ON p.id = pa.provider_id
      LEFT JOIN provider_pricing pp ON p.id = pp.provider_id AND pp.age_group = $3
      WHERE p.is_active = true
    `;

    const params = [searchLat, searchLng, age_group];
    let paramCount = 3;

    // 3. Apply Filters
    if (age_group) {
      query += ` AND $3 = ANY(p.age_groups)`;
    }

    if (min_price) {
      paramCount++;
      query += ` AND pp.monthly_price >= $${paramCount}`;
      params.push(min_price);
    }

    if (max_price) {
      paramCount++;
      query += ` AND pp.monthly_price <= $${paramCount}`;
      params.push(max_price);
    }

    if (subsidy === 'true') {
      query += ` AND p.subsidy_accepted = true`;
    }

    if (availability === 'true') {
      query += ` AND pa.available_spots > 0`;
    }

    // Distance filter
    if (searchLat && searchLng) {
      query += ` AND (3959 * acos(cos(radians($1)) * cos(radians(p.lat)) * cos(radians(p.lng) - radians($2)) + sin(radians($1)) * sin(radians(p.lat)))) <= $${paramCount + 1}`;
      params.push(radius);
      paramCount++;
    }

    // Pagination
    const offset = (page - 1) * limit;
    query += ` ORDER BY distance ASC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await db.query(query, params);
    
    // 4. Calculate Budget Picks
    let providers = result.rows;
    if (age_group) {
      providers = calculateBudgetPicks(providers, age_group);
    } else {
      providers = providers.map(p => ({ ...p, budget_pick: false }));
    }

    res.json({
      success: true,
      count: providers.length,
      data: providers
    });
  } catch (error) {
    next(error);
  }
};

const getProviderById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const providerResult = await db.query(
      'SELECT p.*, pa.available_spots, pa.total_spots FROM providers p LEFT JOIN provider_availability pa ON p.id = pa.provider_id WHERE p.id = $1',
      [id]
    );

    if (providerResult.rows.length === 0) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    const pricingResult = await db.query(
      'SELECT * FROM provider_pricing WHERE provider_id = $1',
      [id]
    );

    const provider = providerResult.rows[0];
    provider.pricing = pricingResult.rows;

    res.json({
      success: true,
      data: provider
    });
  } catch (error) {
    next(error);
  }
};

const updateProvider = async (req, res, next) => {
  const { id } = req.params;
  const { center_name, address, lat, lng, phone, description, age_groups, subsidy_accepted } = req.body;

  try {
    // Check ownership
    const checkOwnership = await db.query('SELECT user_id FROM providers WHERE id = $1', [id]);
    if (checkOwnership.rows.length === 0) {
      return res.status(404).json({ message: 'Provider not found' });
    }
    if (checkOwnership.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this provider' });
    }

    const result = await db.query(
      `UPDATE providers SET 
        center_name = COALESCE($1, center_name), 
        address = COALESCE($2, address), 
        lat = COALESCE($3, lat), 
        lng = COALESCE($4, lng), 
        phone = COALESCE($5, phone), 
        description = COALESCE($6, description), 
        age_groups = COALESCE($7, age_groups), 
        subsidy_accepted = COALESCE($8, subsidy_accepted),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $9 RETURNING *`,
      [center_name, address, lat, lng, phone, description, age_groups, subsidy_accepted, id]
    );

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

const updateAvailability = async (req, res, next) => {
  const { id } = req.params;
  const { total_spots, available_spots } = req.body;

  try {
    // Check ownership
    const checkOwnership = await db.query('SELECT user_id FROM providers WHERE id = $1', [id]);
    if (checkOwnership.rows.length === 0) {
      return res.status(404).json({ message: 'Provider not found' });
    }
    if (checkOwnership.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this provider' });
    }

    // Upsert availability
    const result = await db.query(
      `INSERT INTO provider_availability (provider_id, total_spots, available_spots, updated_at)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
       ON CONFLICT (provider_id) DO UPDATE SET
        total_spots = EXCLUDED.total_spots,
        available_spots = EXCLUDED.available_spots,
        updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [id, total_spots, available_spots]
    );

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

const updatePricing = async (req, res, next) => {
  const { id } = req.params;
  const { pricing } = req.body; // Array of { age_group, monthly_price }

  try {
    // Check ownership
    const checkOwnership = await db.query('SELECT user_id FROM providers WHERE id = $1', [id]);
    if (checkOwnership.rows.length === 0) {
      return res.status(404).json({ message: 'Provider not found' });
    }
    if (checkOwnership.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this provider' });
    }

    // Transaction for multiple pricing updates
    await db.query('BEGIN');
    
    // Delete existing pricing
    await db.query('DELETE FROM provider_pricing WHERE provider_id = $1', [id]);

    // Insert new pricing
    for (const item of pricing) {
      await db.query(
        'INSERT INTO provider_pricing (provider_id, age_group, monthly_price) VALUES ($1, $2, $3)',
        [id, item.age_group, item.monthly_price]
      );
    }

    await db.query('COMMIT');

    res.json({
      success: true,
      message: 'Pricing updated successfully'
    });
  } catch (error) {
    await db.query('ROLLBACK');
    next(error);
  }
};

const getMyProvider = async (req, res, next) => {
  try {
    const providerResult = await db.query(
      'SELECT p.*, pa.available_spots, pa.total_spots FROM providers p LEFT JOIN provider_availability pa ON p.id = pa.provider_id WHERE p.user_id = $1',
      [req.user.id]
    );

    if (providerResult.rows.length === 0) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    const provider = providerResult.rows[0];
    
    const pricingResult = await db.query(
      'SELECT * FROM provider_pricing WHERE provider_id = $1',
      [provider.id]
    );
    provider.pricing = pricingResult.rows;

    res.json({
      success: true,
      provider: provider
    });
  } catch (error) {
    next(error);
  }
};

const getMyProviderStats = async (req, res, next) => {
  try {
    const providerResult = await db.query('SELECT id FROM providers WHERE user_id = $1', [req.user.id]);
    if (providerResult.rows.length === 0) {
      return res.status(404).json({ message: 'Provider not found' });
    }
    const providerId = providerResult.rows[0].id;

    const availabilityResult = await db.query(
      'SELECT available_spots, total_spots FROM provider_availability WHERE provider_id = $1',
      [providerId]
    );

    const bookingsResult = await db.query(
      'SELECT COUNT(*) as total, SUM(CASE WHEN status = \'pending\' THEN 1 ELSE 0 END) as pending FROM tour_bookings WHERE provider_id = $1',
      [providerId]
    );

    // Mock views for now
    const views = 142;

    res.json({
      success: true,
      stats: {
        available_spots: availabilityResult.rows[0]?.available_spots || 0,
        total_spots: availabilityResult.rows[0]?.total_spots || 0,
        pending_bookings: parseInt(bookingsResult.rows[0]?.pending || 0),
        total_bookings: parseInt(bookingsResult.rows[0]?.total || 0),
        views
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateMyProvider = async (req, res, next) => {
    try {
        const providerResult = await db.query('SELECT id FROM providers WHERE user_id = $1', [req.user.id]);
        if (providerResult.rows.length === 0) {
            return res.status(404).json({ message: 'Provider not found' });
        }
        req.params.id = providerResult.rows[0].id;
        return updateProvider(req, res, next);
    } catch (error) {
        next(error);
    }
};

const updateMyAvailability = async (req, res, next) => {
    try {
        const providerResult = await db.query('SELECT id FROM providers WHERE user_id = $1', [req.user.id]);
        if (providerResult.rows.length === 0) {
            return res.status(404).json({ message: 'Provider not found' });
        }
        req.params.id = providerResult.rows[0].id;
        return updateAvailability(req, res, next);
    } catch (error) {
        next(error);
    }
};

const updateMyPricing = async (req, res, next) => {
    try {
        const providerResult = await db.query('SELECT id FROM providers WHERE user_id = $1', [req.user.id]);
        if (providerResult.rows.length === 0) {
            return res.status(404).json({ message: 'Provider not found' });
        }
        req.params.id = providerResult.rows[0].id;
        return updatePricing(req, res, next);
    } catch (error) {
        next(error);
    }
};

module.exports = {
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
};
