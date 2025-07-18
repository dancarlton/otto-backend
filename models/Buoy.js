const mongoose = require('mongoose');

const buoySchema = new mongoose.Schema({
  stationId: { type: String, required: true, unique: true },
  name: String,
  lat: Number,
  lng: Number,
  active: { type: Boolean, default: true },
  lastUpdated: Date,
  latestData: {
    waveHeight: Number, // WVHT
    swellPeriod: Number, // DPD
    swellDirection: Number, // MWD
    windSpeed: Number, // WSPD
    windDirection: String,
    waterTemp: Number, // WTMP
    dominantPeriod: Number,
  },
});

module.exports = mongoose.model('Buoy', buoySchema);
