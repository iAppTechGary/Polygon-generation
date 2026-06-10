const mongoose = require('mongoose');

/**
 * PaintColor sub-document
 *
 * Represents a single colour entry within a paint collection.
 * `type: 'default'` colours ship with the app; `type: 'custom'` colours
 * are user-created and require a `user_id`.
 */
const colorSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: true,
      trim:     true,
    },
    rgb: {
      type: [Number], // [R, G, B]  e.g. [255, 128, 0]
    },
    hex: {
      type: String,   // e.g. "#ff8000"
    },
    type: {
      type:     String,
      required: true,
      enum:     ['default', 'custom'],
    },
    user_id: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'user',
      required: function () { return this.type === 'custom'; },
    },
  },
  { _id: true },
);

/**
 * Paint (collection)
 *
 * A named set of colours — analogous to a physical paint brand's colour chart.
 */
const paintSchema = new mongoose.Schema(
  {
    title: {
      type:     String,
      required: true,
      unique:   true,
      trim:     true,
    },
    colors: [colorSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model('paint', paintSchema);
