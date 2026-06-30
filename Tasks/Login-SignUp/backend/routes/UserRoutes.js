const router = require('express').Router();
const { login, register, home, dashboard } = require('../controllers/Api');
const auth = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/home', home);

// Protected route (requires valid JWT)
router.get('/dashboard', auth, dashboard);

module.exports = router;
