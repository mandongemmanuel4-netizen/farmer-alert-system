const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, unique: true, trim: true },
  gender: { type: String, enum: ['male', 'female'] },
  pin: { type: String, required: true },

  role: {
    type: String,
    enum: ['farmer', 'coordinator', 'admin'],
    required: true,
  },

  state: { type: mongoose.Schema.Types.ObjectId, ref: 'State' },
  lga: { type: mongoose.Schema.Types.ObjectId, ref: 'LGA' },
  ward: { type: mongoose.Schema.Types.ObjectId, ref: 'Ward' },
  village: { type: String },

  status: {
    type: String,
    enum: ['idle', 'checked-in', 'overdue', 'emergency'],
    default: 'idle',
  },

  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
