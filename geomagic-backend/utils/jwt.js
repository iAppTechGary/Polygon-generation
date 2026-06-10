const jwt = require('jsonwebtoken');

/**
 * setUser — sign a JWT containing non-sensitive user identifiers.
 *
 * @param {Object} user - Mongoose user document
 * @returns {string} Signed JWT
 */
const setUser = (user) =>
  jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRE_TIME ?? '7d' },
  );

/**
 * getUser — verify and decode a JWT.
 *
 * @param {string} token
 * @returns {Object|null} Decoded payload, or null if invalid / expired
 */
const getUser = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch {
    return null;
  }
};

module.exports = { setUser, getUser };
