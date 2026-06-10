const mongoose = require('mongoose');

/**
 * Portfolio
 *
 * Stores a user's saved creative works — each entry can hold an image,
 * a title, description, and associated colour palette data.
 */
const portfolioSchema = new mongoose.Schema(
  {
    user_id: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'user',
      required: true,
    },
    title: {
      type:     String,
      required: true,
      trim:     true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String, // relative path under /uploads or a CDN URL
    },
    /** Hex colours extracted / chosen for this work */
    colors: {
      type: [String],
    },
    /** Arbitrary metadata (tags, dimensions, medium, etc.) */
    meta: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('portfolio', portfolioSchema);
