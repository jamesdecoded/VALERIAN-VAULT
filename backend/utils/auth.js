const jwt = require('jsonwebtoken');
const { query } = require('../database/config');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '24h';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

/**
 * Generate JWT token
 * @param {Object} payload - Data to encode in token
 * @param {String} expiresIn - Token expiration time
 * @returns {String} Signed JWT token
 */
function generateToken(payload, expiresIn = JWT_EXPIRES_IN) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Verify JWT token
 * @param {String} token - JWT token to verify
 * @returns {Object|Boolean} Decoded payload or false if invalid
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return false;
  }
}

/**
 * Generate refresh token
 * @param {Object} payload - Data to encode in token
 * @returns {String} Signed refresh JWT token
 */
function generateRefreshToken(payload) {
  return generateToken(payload, REFRESH_TOKEN_EXPIRES_IN);
}

/**
 * Middleware to protect routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }

  // Attach user info to request
  req.user = decoded;
  next();
}

/**
 * Middleware to check user role
 * @param {Array} allowedRoles - Array of allowed roles (e.g., ['admin', 'staff'])
 * @returns {Function} Middleware function
 */
function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}

/**
 * Get user by ID
 * @param {Integer} userId - User ID
 * @returns {Object|null} User object or null if not found
 */
async function getUserById(userId) {
  try {
    const result = await query('SELECT * FROM users WHERE id = $1', [userId]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
}

/**
 * Get user by email
 * @param {String} email - User email
 * @returns {Object|null} User object or null if not found
 */
async function getUserByEmail(email) {
  try {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
}

/**
 * Create new user
 * @param {Object} userData - User data (email, password_hash, etc.)
 * @returns {Object} Created user object
 */
async function createUser(userData) {
  try {
    const {
      email,
      password_hash,
      first_name = '',
      last_name = '',
      phone = '',
      role = 'customer'
    } = userData;

    const result = await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone, role) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [email, password_hash, first_name, last_name, phone, role]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

module.exports = {
  generateToken,
  verifyToken,
  generateRefreshToken,
  authenticateToken,
  authorizeRole,
  getUserById,
  getUserByEmail,
  createUser,
  JWT_SECRET
};