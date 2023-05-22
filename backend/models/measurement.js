const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
  // define the schema for measurements
  voltage: {
    type: Number,
    required: true,
  },
  current: {
    type: Number,
    required: true,
  },
  powerConsumption: {
    type: Number,
    required: true,
  },
  batteryStats: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Measurement = mongoose.model('Measurement', measurementSchema);

module.exports = Measurement;