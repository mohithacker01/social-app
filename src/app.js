const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: [process.env.FRONTEND_URL, 'http://localhost:5176', 'http://localhost:5177'],
    credentials: true
}));
app.use(cookieParser());

// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Global Error Handler Caught:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.toString() });
});

// Test Route
app.get('/', (req, res) => {
    res.send('Server is running');
});

module.exports = app;
