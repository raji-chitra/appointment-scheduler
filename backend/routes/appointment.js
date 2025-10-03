const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// Create appointment
router.post('/', async (req, res) => {
    try {
        const { patient, doctor, date, time, symptoms } = req.body;
        
        const appointment = new Appointment({
            patient,
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
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
});

// Get user's appointments
router.get('/my-appointments', async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient: req.query.patientId })
            .populate('doctor', 'name specialization consultationFee')
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

module.exports = router;