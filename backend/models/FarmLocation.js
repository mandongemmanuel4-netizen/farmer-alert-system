const mongoose = require('mongoose');

const farmLocationSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmName: { type: String, required: true },
  cropType: { type: String },
  farmSize: { type: String },
  gps: {
    lat: { type: Number },
    lng: { type: Number },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('FarmLocation', farmLocationSchema);
