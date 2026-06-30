require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 12;
const SECRET_KEY = process.env.JWT_SECRET;
const JWT_ISSUER = process.env.JWT_ISSUER || 'authflow-api';
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || 'authflow-client';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Guard: crash early if no secret is set (prevents running with insecure default)
if (!SECRET_KEY) {
  console.error('[FATAL] JWT_SECRET is not set in environment variables. Exiting.');
  process.exit(1);
}

// In-memory "database" (replace with MongoDB/MySQL in production)
let users = [];

/**
 * Signs a JWT with standard registered claims.
 */
function signToken(payload) {
  return jwt.sign(payload, SECRET_KEY, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
    algorithm: 'HS256',
  });
}

// POST /pages/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Name, email, and password are required' });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({ msg: 'Name must be at least 2 characters' });
    }

    if (password.length < 6) {
      return res.status(400).json({ msg: 'Password must be at least 6 characters' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: 'Invalid email format' });
    }

    // Check if user already exists
    const existingUser = users.find((u) => u.email === email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({ msg: 'This email is already registered' });
    }

    // Hash password with stronger salt rounds
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Save user
    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);

    // Generate JWT token
    const token = signToken({ userId: newUser.id, email: newUser.email });

    return res.status(201).json({
      msg: 'User registered successfully',
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email }
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ msg: 'Server error during registration' });
  }
};

// POST /pages/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ msg: 'Email and password are required' });
    }

    // Find user
    const user = users.find((u) => u.email === email.toLowerCase());
    if (!user) {
      // Use generic message to prevent user enumeration
      return res.status(401).json({ msg: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = signToken({ userId: user.id, email: user.email });

    return res.status(200).json({
      msg: 'Logged in successfully',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ msg: 'Server error during login' });
  }
};

// GET /pages/home (public)
const home = (req, res) => {
  res.json({ message: 'AuthFlow API is running' });
};

// GET /pages/dashboard (protected)
const dashboard = (req, res) => {
  res.json({
    msg: 'Dashboard data loaded. Token verified successfully.',
    user: req.user
  });
};

module.exports = { login, register, home, dashboard };
