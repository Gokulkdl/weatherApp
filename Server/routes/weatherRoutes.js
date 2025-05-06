const express = require('express');
const weatherController = require('../controllers/weatherController');

const router = express.Router();

router.get('/current/:location', weatherController.getCurrentWeather);
router.get('/historical', weatherController.getHistoricalWeather);

module.exports = router;