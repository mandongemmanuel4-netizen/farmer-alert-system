const mongoose = require('mongoose');

const securityPostSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  ward: { type: mongoose.Schema.Types.ObjectId, ref: 'Ward', required: true },
  gps: {
    lat: { type: Number },
    lng: { type: Number },
  },
});

module.exports = mongoose.model('SecurityPost', securityPostSchema);
