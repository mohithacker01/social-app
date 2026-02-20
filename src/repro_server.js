require('dotenv').config();
const app = require('./app');
const connectDB = require('./db/db');

// Override console.log and console.error to ensure we capture everything clearly
const originalLog = console.log;
const originalError = console.error;

console.log = (...args) => {
    originalLog('[REPRO_LOG]', ...args);
};

console.error = (...args) => {
    originalError('[REPRO_ERROR]', ...args);
};

const startServer = async () => {
    try {
        await connectDB();
        const PORT = 8001;
        app.listen(PORT, () => {
            console.log(`Repro Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Failed to start repro server:", err);
    }
};

startServer();
