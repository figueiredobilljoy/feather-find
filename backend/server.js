require('dotenv').config({ override: true });
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Vite default port
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadDir));

// Import routes (we will create these next)
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');
const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');

// Mount routes
app.use('/auth', authRoutes);
app.use('/upload', uploadRoutes);
app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);

// Basic health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Feather Find API is running' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, () => {
    console.log(`✅ Backend server running on http://localhost:${PORT}`);
});
