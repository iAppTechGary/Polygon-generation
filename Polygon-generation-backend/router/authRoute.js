const express = require('express');
const {
  signup,
  signin,
  socialSignin,
  forgetPassword,
  verifyOtp,
  resetPassword,
  changePassword,
} = require('../controller/authController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Public
router.post('/signup',           signup);
router.post('/signin',           signin);
router.post('/social-signin',    socialSignin);
router.post('/forget-password',  forgetPassword);
router.post('/verify-otp',       verifyOtp);

// Requires valid JWT
router.put('/reset-password',    protect, resetPassword);
router.put('/change-password',   protect, changePassword);

module.exports = router;
