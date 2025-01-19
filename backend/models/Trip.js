const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
  user: { type: String, required: true },
  locations: { type: Array, required: true },
  routeDetails: { type: Object },
  totalDistance: { type: String },
  totalDuration: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Trip', TripSchema);
