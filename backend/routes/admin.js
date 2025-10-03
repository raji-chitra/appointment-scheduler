const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// Admin dashboard stats
router.get('/dashboard', async (req, res) => {
    try {
        const totalPatients = await User.countDocuments({ role: 'patient' });
        const totalDoctors = await Doctor.countDocuments();
        const totalAppointments = await Appointment.countDocuments();
        
        res.json({
            success: true,
            stats: {
                totalPatients,
                totalDoctors,
                totalAppointments
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
});

// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json({
            success: true,
            users: users
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
});

module.exports = router;