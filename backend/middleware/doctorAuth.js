const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

const doctorAuth = async (req, res, next) => {
  try {
    // Check for token in x-auth-token header first, then Authorization header
    const token = req.header('x-auth-token') || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided, authorization denied'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is a doctor
    if (user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Doctor role required.'
      });
    }

    // Find doctor document for this user
    const doctor = await Doctor.findOne({ user: user._id });
    if (!doctor) {
      return res.status(403).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    req.user = user;
    req.doctor = doctor;
    next();
  } catch (error) {
    console.error('Doctor auth middleware error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: error.message
    });
  }
};

module.exports = doctorAuth;
