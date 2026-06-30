const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET;
const JWT_ISSUER = process.env.JWT_ISSUER || 'authflow-api';
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || 'authflow-client';

const auth = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ msg: 'Access denied. Token is missing.' });
  }

  jwt.verify(token, SECRET_KEY, {
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
    algorithms: ['HS256'],
  }, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ msg: 'Token expired. Please sign in again.' });
      }
      if (err.name === 'JsonWebTokenError') {
        return res.status(403).json({ msg: 'Invalid token. Access denied.' });
      }
      if (err.name === 'NotBeforeError') {
        return res.status(403).json({ msg: 'Token not yet valid.' });
      }
      return res.status(403).json({ msg: 'Token verification failed.' });
    }

    req.user = decoded; // attach decoded payload to request
    return next();
  });
};

module.exports = auth;
