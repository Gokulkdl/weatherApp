const axios = require('axios');
const Weather = require('../models/Weather');

const API_KEY = process.env.WEATHERAPI_KEY; // Ensure this environment variable is set

const getCurrentWeather = async (req, res) => {
  try {
    const { location } = req.params;

    // Fetch current weather data from WeatherAPI.com
    const response = await axios.get(
      `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(location)}`
    );
    

    const data = response.data;

    // Prepare weather data
    const weatherData = {
      location: data.location.name,
      temperature: Math.round(data.current.temp_c),
      condition: data.current.condition.text,
      feelsLike: Math.round(data.current.feelslike_c),
      humidity: data.current.humidity,
      windSpeed: data.current.wind_kph,
      sunrise: data.forecast?.forecastday[0]?.astro?.sunrise || 'N/A',
      sunset: data.forecast?.forecastday[0]?.astro?.sunset || 'N/A',
      icon: data.current.condition.icon,
      timestamp: new Date(data.location.localtime)
    };

    // Save to database
    const savedData = new Weather(weatherData);
    await savedData.save();

    res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    res.status(500).json({
      error: 'Failed to fetch weather data',
      details: error.response?.data?.error?.message || error.message
    });
  }
};

const getHistoricalWeather = async (req, res) => {
  try {
    const { location, fromDate, toDate } = req.query;

    // Validate inputs
    if (!location || !fromDate || !toDate) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Validate date range (max 30 days)
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const diffTime = Math.abs(to - from);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 30) {
      return res.status(400).json({ error: 'Date range cannot exceed 30 days' });
    }

    // Query database for historical data
    const historicalData = await Weather.find({
      location,
      timestamp: {
        $gte: from,
        $lte: to
      }
    }).sort({ timestamp: 1 });

    res.json(historicalData);
  } catch (error) {
    console.error('Error fetching historical data:', error.message);
    res.status(500).json({
      error: 'Failed to fetch historical data',
      details: error.message
    });
  }
};

module.exports = {
  getCurrentWeather,
  getHistoricalWeather
};
