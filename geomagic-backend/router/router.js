const express = require('express');

const authRoute              = require('./authRoute');
const userRoute              = require('./userRoute');
const portfolioRoute         = require('./portfolioRoute');
const paintRoute             = require('./paintRoute');
const colorRoute             = require('./colorRoute');
const templateRoute          = require('./templateRoute');
const templateCategoryRoute  = require('./templateCategoryRoute');
const paletteBrandRoute      = require('./paletteBrandRoute');
const geometrizeRoute        = require('./geometrizeRoute');
const contactRoute           = require('./contactRoute');
const polygonRoute           = require('./polygonRoute');

const router = express.Router();

router.use('/auth',              authRoute);
router.use('/user',              userRoute);
router.use('/portfolio',         portfolioRoute);
router.use('/paint',             paintRoute);
router.use('/color',             colorRoute);
router.use('/template',          templateRoute);
router.use('/template-category', templateCategoryRoute);
router.use('/palette-brand',     paletteBrandRoute);
router.use('/geometrize',        geometrizeRoute);
router.use('/contact',           contactRoute);
router.use('/polygon',           polygonRoute);

module.exports = router;
