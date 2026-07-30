const mongoose = require('mongoose');

const lgaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  state: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true },
});

module.exports = mongoose.model('LGA', lgaSchema);
