const mongoose = require('mongoose');

const checkInSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farm: { type: mongoose.Schema.Types.ObjectId, ref: 'FarmLocation', required: true },

  checkInTime: { type: Date, default: Date.now },
  expectedReturnBy: { type: Date, required: true },
  checkOutTime: { type: Date, default: null },

  gpsAtCheckIn: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },

  reminderSent: { type: Boolean, default: false },

  status: {
    type: String,
    enum: ['active', 'completed', 'overdue', 'alert-sent', 'emergency'],
    default: 'active',
  },
});

checkInSchema.index({ status: 1, expectedReturnBy: 1 });

module.exports = mongoose.model('CheckIn', checkInSchema);
