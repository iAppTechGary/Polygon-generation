const Paint              = require('../model/paintModel');
const { colorValidation } = require('../validation/joi/colorValidation');

/**
 * GET /api/color
 * Returns all paint collections with their colour arrays.
 */
exports.listColors = async (req, res) => {
  try {
    const collections = await Paint.find().lean();
    return res.status(200).json({ success: true, data: collections, message: 'Colors fetched' });
  } catch (err) {
    console.error('listColors:', err);
    return res.status(500).json({ success: false, data: null, message: 'Something went wrong' });
  }
};

/**
 * POST /api/color
 * Add a new colour to an existing paint collection.
 *
 * Body: { paintId, name, hex, rgb, type }
 */
exports.addColor = async (req, res) => {
  try {
    const { error } = colorValidation.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ success: false, data: null, message: error.message });

    const { paintId, ...colorData } = req.body;
    const paint = await Paint.findById(paintId);
    if (!paint) return res.status(404).json({ success: false, data: null, message: 'Paint collection not found' });

    // Attach user_id for custom colours
    if (colorData.type === 'custom') {
      colorData.user_id = req.user._id;
    }

    paint.colors.push(colorData);
    await paint.save();

    return res.status(201).json({ success: true, data: paint, message: 'Color added' });
  } catch (err) {
    console.error('addColor:', err);
    return res.status(500).json({ success: false, data: null, message: 'Something went wrong' });
  }
};

/**
 * DELETE /api/color/:paintId/:colorId
 * Remove a single colour sub-document by its id.
 */
exports.deleteColor = async (req, res) => {
  try {
    const { paintId, colorId } = req.params;
    const paint = await Paint.findById(paintId);
    if (!paint) return res.status(404).json({ success: false, data: null, message: 'Paint collection not found' });

    paint.colors = paint.colors.filter((c) => c._id.toString() !== colorId);
    await paint.save();

    return res.status(200).json({ success: true, data: paint, message: 'Color deleted' });
  } catch (err) {
    console.error('deleteColor:', err);
    return res.status(500).json({ success: false, data: null, message: 'Something went wrong' });
  }
};
