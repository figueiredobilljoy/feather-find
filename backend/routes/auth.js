const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { JWT_SECRET, requireAuth } = require('../middleware/authMiddleware');

router.post('/register', (req, res) => {
    const { email, password, confirm_password, full_name } = req.body;
    
    if (!email || !password || !full_name) {
        return res.status(400).json({ error: 'All fields are required.' });
    }
    if (password !== confirm_password) {
        return res.status(400).json({ error: 'Passwords do not match.' });
    }

    try {
        const hash = bcrypt.hashSync(password, 10);
        const stmt = db.prepare('INSERT INTO users (email, password_hash, full_name) VALUES (?, ?, ?)');
        const info = stmt.run(email, hash, full_name);
        
        const token = jwt.sign({ user_id: info.lastInsertRowid, email, full_name, is_admin: 0 }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ message: 'Registration successful', token, user: { user_id: info.lastInsertRowid, email, full_name, is_admin: 0 } });
    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(400).json({ error: 'Email is already registered.' });
        }
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required.' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
        return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign({ 
        user_id: user.user_id, 
        email: user.email, 
        full_name: user.full_name, 
        is_admin: user.is_admin 
    }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ message: 'Login successful', token, user: {
        user_id: user.user_id,
        email: user.email,
        full_name: user.full_name,
        is_admin: user.is_admin,
        location: { lat: user.latitude, lng: user.longitude, name: user.location_name }
    }});
});

router.post('/location', requireAuth, (req, res) => {
    const { lat, lng, name } = req.body;
    db.prepare('UPDATE users SET latitude = ?, longitude = ?, location_name = ? WHERE user_id = ?')
      .run(lat, lng, name, req.user.user_id);
    res.json({ message: 'Location updated' });
});

router.get('/me', requireAuth, (req, res) => {
    const user = db.prepare('SELECT user_id, email, full_name, is_admin, latitude, longitude, location_name FROM users WHERE user_id = ?').get(req.user.user_id);
    res.json({ user });
});

module.exports = router;
