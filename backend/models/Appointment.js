const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  doctorId: {
    type: String,
    required: [true, 'Doctor ID is required']
  },
  doctorName: {
    type: String,
    required: [true, 'Doctor name is required']
  },
  doctorImage: {
    type: String,
    required: [true, 'Doctor image is required']
  },
  speciality: {
    type: String,
    required: [true, 'Doctor speciality is required']
  },
  fees: {
    type: Number,
    required: [true, 'Doctor fees is required']
  },
  address: {
    line1: {
      type: String,
      required: [true, 'Address line 1 is required']
    },
    line2: {
      type: String,
      default: ''
    }
  },
  appointmentDate: {
    type: Date,
    required: [true, 'Appointment date is required']
  },
  appointmentTime: {
    type: String,
    required: [true, 'Appointment time is required']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['online', 'cash', ''],
    default: ''
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for efficient queries
appointmentSchema.index({ userId: 1, appointmentDate: 1 });
appointmentSchema.index({ doctorId: 1, appointmentDate: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
