const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

const register = async (req, res, next) => {
  const { email, password, role, name, phone } = req.body;

  try {
    // Check if user exists
    const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const result = await db.query(
      'INSERT INTO users (email, password_hash, role, name, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, role, name, phone',
      [email, passwordHash, role, name, phone]
    );

    const user = result.rows[0];

    // If role is provider, create provider entry
    if (role === 'provider') {
        // We'll just create a placeholder provider entry, which they can update later
        await db.query(
            'INSERT INTO providers (user_id, center_name, address) VALUES ($1, $2, $3)',
            [user.id, `${name}'s Daycare`, 'Address pending']
        );
    } else if (role === 'parent') {
        await db.query(
            'INSERT INTO parent_profiles (user_id) VALUES ($1)',
            [user.id]
        );
    }

    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        token: generateToken(user.id, user.role)
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (user && (await bcrypt.compare(password, user.password_hash))) {
      res.json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
          token: generateToken(user.id, user.role)
        }
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT id, email, role, name, phone FROM users WHERE id = $1',
      [req.user.id]
    );
    const user = result.rows[0];

    if (user) {
      res.json({
        success: true,
        data: user
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe };
