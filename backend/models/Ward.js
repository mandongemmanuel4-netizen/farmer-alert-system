const mongoose = require('mongoose');

const wardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lga: { type: mongoose.Schema.Types.ObjectId, ref: 'LGA', required: true },
});

module.exports = mongoose.model('Ward', wardSchema);
