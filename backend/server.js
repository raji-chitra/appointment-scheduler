require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5174'
    ],
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));

// Test route
app.get('/api/test', (req, res) => {
    res.json({ 
        success: true,
        message: 'Server is running!', 
        database: 'MongoDB Connected' 
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true,
        status: 'OK', 
        timestamp: new Date().toISOString() 
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});