// middleware/authMiddleware.js - Protects routes and checks user roles
const jwt = require('jsonwebtoken');

// Verifies the JWT token and attaches the decoded user info to req.user
const protect = (req, res, next) => {
  let token;

  // Expect header format: "Authorization: Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach decoded payload (id, role) to the request object
      req.user = decoded;

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Restricts access to users with one of the allowed roles
// Usage: admin(['admin']) or admin(['admin', 'user'])
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }
    next();
  };
};

module.exports = { protect, authorize };
