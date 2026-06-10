const mongoose = require('mongoose');

const THEMES = ['light', 'dark'];

/**
 * User
 *
 * Core user record. Social-login users omit `password`; local-auth users
 * omit `socialType` / `socialId`.
 */
const userSchema = new mongoose.Schema(
  {
    user_name: {
      type:     String,
      required: true,
      trim:     true,
    },
    email: {
      type:     String,
      required: true,
      unique:   true,
      lowercase: true,
      trim:     true,
    },
    /** Hashed with bcrypt + server-side pepper. Never returned to clients. */
    password: {
      type: String,
    },
    /** 'google' | 'apple' — set for social-login accounts */
    socialType: {
      type: String,
      enum: ['google', 'apple'],
    },
    socialId: {
      type: String,
    },
    /** 6-digit OTP stored temporarily during password-reset flow */
    email_otp: {
      type: Number,
    },
    dob: {
      type: String,
    },
    country: {
      type: String,
    },
    profile_picture: {
      type: String,
    },
    theme: {
      type: String,
      enum: THEMES,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('user', userSchema);
