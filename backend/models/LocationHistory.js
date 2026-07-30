const mongoose = require('mongoose');

const locationHistorySchema = new mongoose.Schema({
  checkIn: { type: mongoose.Schema.Types.ObjectId, ref: 'CheckIn', required: true },
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  recordedAt: { type: Date, default: Date.now },
});

locationHistorySchema.index({ checkIn: 1, recordedAt: -1 });

module.exports = mongoose.model('LocationHistory', locationHistorySchema);
