const { getUser } = require('../utils/jwt');
const User         = require('../model/userModel');

/**
 * protect
 *
 * Express middleware that validates a Bearer JWT and attaches the full
 * Mongoose user document to `req.user` for downstream handlers.
 *
 * Usage:
 *   router.get('/protected', protect, handler);
 */
const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, data: null, message: 'Token not provided' });
    }

    const decoded = getUser(token);
    if (!decoded) {
      return res.status(401).json({ success: false, data: null, message: 'Invalid or expired token' });
    }

    const user = await User.findById(decoded.userId).select('-password -email_otp');
    if (!user) {
      return res.status(401).json({ success: false, data: null, message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('authMiddleware:', err);
    return res.status(500).json({ success: false, data: null, message: 'Something went wrong' });
  }
};

module.exports = protect;
