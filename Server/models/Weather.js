const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
    enum: ['Delhi', 'Moscow', 'Paris', 'New York', 'Sydney', 'Riyadh']
  },
  temperature: Number,
  condition: String,
  feelsLike: Number,
  humidity: Number,
  windSpeed: Number,
  timestamp: {
    type: Date,
    default: Date.now
  },
  sunset: String,
  sunrise: String,
  icon: String
});

module.exports = mongoose.model('Weather', weatherSchema);