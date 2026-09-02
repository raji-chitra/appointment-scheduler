const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const userAuth = require('../middleware/userAuth');
const doctorAuth = require('../middleware/doctorAuth');
const { buildBookingConflictQuery } = require('../utils/appointmentSlot');

// Get booked slots for a specific doctor
router.get('/booked-slots/:doctorId', async (req, res) => {
    try {
        const { doctorId } = req.params;
        const { date } = req.query;

        const query = {
            doctor: doctorId,
            status: { $ne: 'cancelled' }
        };

        if (date) {
            const bookingDate = new Date(date);
            if (!isNaN(bookingDate.getTime())) {
                const startOfDay = new Date(bookingDate);
                startOfDay.setUTCHours(0, 0, 0, 0);
                const endOfDay = new Date(bookingDate);
                endOfDay.setUTCHours(23, 59, 59, 999);
                query.date = { $gte: startOfDay, $lte: endOfDay };
            }
        }

        const appointments = await Appointment.find(query).select('date time');

        const bookedSlots = appointments.map(appt => {
            let formattedDate = null;
            if (appt.date) {
                formattedDate = new Date(appt.date).toISOString().split('T')[0];
            }
            return {
                date: formattedDate,
                time: appt.time
            };
        });

        res.json({
            success: true,
            bookedSlots
        });
    } catch (error) {
        console.error('Error fetching booked slots:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch booked slots'
        });
    }
});

// Create appointment (POST /book) - frontend expects /appointments/book
const createAppointmentHandler = async (req, res) => {
    try {
        if (req.user && (req.user.role === 'doctor' || req.user.role === 'admin')) {
            return res.status(403).json({
                success: false,
                message: 'Only patients can book appointments.'
            });
        }

        const { doctor, date, time, symptoms } = req.body;

        if (!doctor || !date || !time) {
            return res.status(400).json({
                success: false,
                message: 'Doctor, date, and time are required'
            });
        }

        // Check if this slot is already booked for this doctor
        const bookingDate = new Date(date);
        if (isNaN(bookingDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date provided'
            });
        }

        const existingAppointment = await Appointment.findOne(
            buildBookingConflictQuery({ doctorId: doctor, dateInput: date, time })
        );

        if (existingAppointment) {
            return res.status(400).json({
                success: false,
                message: 'This time slot is already booked for this doctor. Please choose a different slot.'
            });
        }

        const appointment = new Appointment({
            patient: req.user._id, // Use authenticated user's ID
            doctor,
            date,
            time,
            symptoms
        });

        await appointment.save();
        await appointment.populate('doctor patient', 'name specialization');

        res.status(201).json({
            success: true,
            message: 'Appointment booked successfully',
            appointment: appointment
        });
    } catch (error) {
        // Handle Mongoose duplicate key error (race condition safeguard)
        if (error.code === 11000 || (error.message && error.message.includes('E11000'))) {
            return res.status(400).json({
                success: false,
                message: 'This time slot is already booked for this doctor. Please choose a different slot.'
            });
        }
        res.status(500).json({ 
            success: false,
            message: error.message || 'Server error while booking appointment' 
        });
    }
};

// POST /book - used by frontend
router.post('/book', userAuth, createAppointmentHandler);

// Keep root POST for backward compatibility
router.post('/', userAuth, createAppointmentHandler);

// Get user's appointments
router.get('/my-appointments', userAuth, async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient: req.user._id })
            .populate('doctor', 'name specialization speciality fees image degree experience about')
            .sort({ date: -1 });
        
        res.json({
            success: true,
            appointments: appointments
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
});

// Cancel appointment
router.put('/:id/cancel', userAuth, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }
        
        // Check if the appointment belongs to the user
        if (appointment.patient.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to cancel this appointment'
            });
        }
        
        // Update appointment status to cancelled
        appointment.status = 'cancelled';
        await appointment.save();
        
        res.json({
            success: true,
            message: 'Appointment cancelled successfully',
            appointment: appointment
        });
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to cancel appointment'
        });
    }
});

// Get doctor's appointments (only pending)
router.get('/doctor/pending-appointments', doctorAuth, async (req, res) => {
    try {
        // Auto-reject expired appointments
        const now = new Date();
        await Appointment.updateMany(
            {
                doctor: req.doctor._id,
                appointmentStatus: 'pending',
                expiresAt: { $lt: now }
            },
            {
                appointmentStatus: 'rejected',
                rejectionReason: 'Automatically rejected due to timeout'
            }
        );

        const appointments = await Appointment.find({ doctor: req.doctor._id })
            .populate('patient', 'name email phone')
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            appointments: appointments
        });
    } catch (error) {
        console.error('Error fetching pending appointments:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get doctor's appointments
router.get('/doctor/:doctorId', userAuth, async (req, res) => {
    try {
        const userId = req.params.doctorId;
        
        // First find the doctor document associated with this user
        const Doctor = require('../models/Doctor');
        const doctor = await Doctor.findOne({ user: userId });
        
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found for this user'
            });
        }
        
        // Now fetch appointments using the doctor's ID
        const appointments = await Appointment.find({ doctor: doctor._id })
            .populate('patient', 'name email')
            .sort({ date: -1 });
        
        res.json({
            success: true,
            appointments: appointments
        });
    } catch (error) {
        console.error('Error fetching doctor appointments:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Doctor accepts appointment
router.put('/:appointmentId/accept', doctorAuth, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.appointmentId);
        
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        // Check if appointment belongs to this doctor
        if (appointment.doctor.toString() !== req.doctor._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to accept this appointment'
            });
        }

        // Check if appointment is already accepted
        if (appointment.appointmentStatus === 'accepted') {
            return res.status(400).json({
                success: false,
                message: 'Appointment is already accepted'
            });
        }

        // Update appointment status
        appointment.appointmentStatus = 'accepted';
        await appointment.save();
        await appointment.populate('patient doctor', 'name email');

        res.json({
            success: true,
            message: 'Appointment accepted successfully',
            appointment: appointment
        });
    } catch (error) {
        console.error('Error accepting appointment:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to accept appointment'
        });
    }
});

// Doctor rejects appointment
router.put('/:appointmentId/reject', doctorAuth, async (req, res) => {
    try {
        const { reason } = req.body;
        const appointment = await Appointment.findById(req.params.appointmentId);
        
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        // Check if appointment belongs to this doctor
        if (appointment.doctor.toString() !== req.doctor._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to reject this appointment'
            });
        }

        // Check if appointment is already rejected
        if (appointment.appointmentStatus === 'rejected') {
            return res.status(400).json({
                success: false,
                message: 'Appointment is already rejected'
            });
        }

        // Update appointment status
        appointment.appointmentStatus = 'rejected';
        appointment.rejectionReason = reason || '';
        await appointment.save();
        await appointment.populate('patient doctor', 'name email');

        res.json({
            success: true,
            message: 'Appointment rejected successfully',
            appointment: appointment
        });
    } catch (error) {
        console.error('Error rejecting appointment:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to reject appointment'
        });
    }
});

module.exports = router;