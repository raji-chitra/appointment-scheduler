const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    appointmentStatus: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    rejectionReason: {
        type: String,
        default: ''
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours from now
    },
    symptoms: String,
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Ensure a doctor cannot have duplicate active appointments for the same date and time slot
appointmentSchema.index(
    { doctor: 1, date: 1, time: 1 },
    { unique: true, partialFilterExpression: { status: { $ne: 'cancelled' } } }
);

module.exports = mongoose.model('Appointment', appointmentSchema);