const express    = require('express');
const cors       = require('cors');
const mongoose   = require('mongoose');
require('dotenv').config();

const routes              = require('./router/router');
const uploadImageMiddleware = require('./middleware/singleImageUpload');

const app = express();

// ─── Database ─────────────────────────────────────────────────────────────────

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// ─── Global middleware ────────────────────────────────────────────────────────

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads')); // serve uploaded files

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use('/api', routes);

/**
 * POST /api/render
 *
 * Accepts a multipart image upload and converts it to geometric primitives
 * (SVG, PNG, or JSON) using the `primitive` library via the sharp pipeline.
 *
 * Body params:
 *   output_format      — "svg" | "png" | "json"  (default: "svg")
 *   shape_types        — array of shape names     (default: ["triangle"])
 *   num_shapes         — number of primitives     (default: 200)
 *   computation_size   — resize resolution        (default: 256)
 *   output_size        — output resolution        (default: 512)
 *   background         — "auto" or hex colour     (default: "auto")
 */
app.post('/api/render', async (req, res) => {
  try {
    req.imagePath = 'geo-magic';
    await uploadImageMiddleware(req, res);

    const {
      output_format    = 'svg',
      shape_types      = ['triangle'],
      num_shapes       = 200,
      computation_size = 256,
      output_size      = 512,
      background       = 'auto',
    } = req.body;

    // Resize source image to computation resolution
    const sharp       = require('sharp');
    const { primitive } = require('primitive');               // geometric primitive lib
    const resizedPath = `uploads/resized_${Date.now()}.png`;

    await sharp(req.file.path).resize(+computation_size).toFile(resizedPath);

    // Run geometric primitive approximation
    const model = await primitive({
      input:      resizedPath,
      numSteps:   +num_shapes,
      shapeTypes: shape_types,
      mode:       output_format === 'svg' ? 'svg' : 'png',
    });

    // Return result in requested format
    if (output_format === 'svg') {
      res.setHeader('Content-Type', 'image/svg+xml');
      return res.send(model.buffer.toString());
    }
    if (output_format === 'png') {
      res.setHeader('Content-Type', 'image/png');
      return res.send(model.buffer);
    }
    if (output_format === 'json') {
      return res.json({ shape_types, num_shapes, background, data: model.buffer.toString('utf8') });
    }

    return res.status(400).send('Invalid output_format');
  } catch (err) {
    console.error('/api/render error:', err);
    return res.status(500).send('Failed to process image.');
  }
});

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(process.env.PORT, () =>
  console.log(`Server running on ${process.env.BASE_URL}`),
);
