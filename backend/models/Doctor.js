const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  speciality: { type: String, required: true },
  fees: { type: Number, required: true },
  image: { type: String, default: '' },
  address: {
    line1: { type: String, required: true },
    line2: { type: String, default: '' }
  },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);


