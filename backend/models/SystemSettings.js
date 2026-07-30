const mongoose = require('mongoose');

const systemSettingsSchema = new mongoose.Schema({
  reminderMinutesBeforeReturn: { type: Number, default: 15 },
  gracePeriodMinutes: { type: Number, default: 30 },
  defaultReturnTime: { type: String, default: '17:00' },
  language: { type: String, default: 'English' },

  smsProvider: { type: String, default: 'Termii' },
  smsSenderId: { type: String, default: 'Termii' },

  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SystemSettings', systemSettingsSchema);
