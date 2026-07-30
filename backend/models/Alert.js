const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  checkIn: { type: mongoose.Schema.Types.ObjectId, ref: 'CheckIn', default: null },

  type: {
    type: String,
    enum: ['timeout', 'panic'],
    required: true,
  },

  gps: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },

  recipients: [{
    name: String,
    phone: String,
    kind: { type: String, enum: ['emergency-contact', 'coordinator', 'security-post'] },
    smsStatus: { type: String, default: 'pending' },
  }],

  status: {
    type: String,
    enum: ['open', 'resolved'],
    default: 'open',
  },
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  resolutionNotes: { type: String, default: '' },
  resolvedAt: { type: Date, default: null },

  ward: { type: mongoose.Schema.Types.ObjectId, ref: 'Ward', required: true },

  createdAt: { type: Date, default: Date.now },
  detectionToAlertSeconds: { type: Number },
});

module.exports = mongoose.model('Alert', alertSchema);
