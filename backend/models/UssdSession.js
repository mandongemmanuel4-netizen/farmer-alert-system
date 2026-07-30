const mongoose = require('mongoose');

const ussdSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  step: { type: String, default: 'ENTRY' },
  data: { type: mongoose.Schema.Types.Mixed, default: {} }, // scratch space for the in-progress flow
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // set once logged in/registered
  createdAt: { type: Date, default: Date.now, expires: 600 }, // auto-deleted after 10 min of inactivity
});

module.exports = mongoose.model('UssdSession', ussdSessionSchema);
