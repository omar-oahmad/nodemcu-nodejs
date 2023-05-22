const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  // define schema for events
  location: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
