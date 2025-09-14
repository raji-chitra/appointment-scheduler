const express = require('express');
const Appointment = require('../models/Appointment');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/appointments/book
// @desc    Book a new appointment
// @access  Private
router.post('/book', auth, async (req, res) => {
  try {
    const {
      doctorId,
      doctorName,
      doctorImage,
      speciality,
      fees,
      address,
      appointmentDate,
      appointmentTime
    } = req.body;

    // Validation
    if (!doctorId || !doctorName || !appointmentDate || !appointmentTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required appointment details'
      });
    }

    // Check if appointment slot is already taken
    const existingAppointment = await Appointment.findOne({
      doctorId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      status: { $ne: 'cancelled' }
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'This appointment slot is already booked'
      });
    }

    // Create new appointment
    const appointment = new Appointment({
      userId: req.user._id,
      doctorId,
      doctorName,
      doctorImage,
      speciality,
      fees,
      address,
      appointmentDate: new Date(appointmentDate),
      appointmentTime
    });

    await appointment.save();

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointment
    });

  } catch (error) {
    console.error('Book appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during appointment booking',
      error: error.message
    });
  }
});

// @route   GET /api/appointments/my-appointments
// @desc    Get user's appointments
// @access  Private
router.get('/my-appointments', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user._id })
      .sort({ appointmentDate: -1, createdAt: -1 });

    res.json({
      success: true,
      appointments
    });

  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching appointments',
      error: error.message
    });
  }
});

// @route   PUT /api/appointments/:id/cancel
// @desc    Cancel an appointment
// @access  Private
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Appointment is already cancelled'
      });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
      appointment
    });

  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during appointment cancellation',
      error: error.message
    });
  }
});

// @route   PUT /api/appointments/:id/payment
// @desc    Update payment status
// @access  Private
router.put('/:id/payment', auth, async (req, res) => {
  try {
    const { paymentStatus, paymentMethod } = req.body;

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    if (paymentStatus) appointment.paymentStatus = paymentStatus;
    if (paymentMethod) appointment.paymentMethod = paymentMethod;

    await appointment.save();

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      appointment
    });

  } catch (error) {
    console.error('Update payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during payment update',
      error: error.message
    });
  }
});

module.exports = router;
