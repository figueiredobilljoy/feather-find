const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAdmin } = require('../middleware/authMiddleware');

router.get('/stats', requireAdmin, (req, res) => {
    const pending = db.prepare("SELECT COUNT(*) as c FROM sightings WHERE status='pending'").get().c;
    const approved = db.prepare("SELECT COUNT(*) as c FROM sightings WHERE status='approved'").get().c;
    const unread = db.prepare("SELECT COUNT(*) as c FROM contact_messages WHERE status='unread'").get().c;
    const users = db.prepare("SELECT COUNT(*) as c FROM users WHERE is_admin=0").get().c;
    res.json({ pending, approved, unread, users });
});

router.get('/sightings/pending', requireAdmin, (req, res) => {
    const sightings = db.prepare(`
        SELECT s.*, u.full_name, u.email 
        FROM sightings s 
        JOIN users u ON u.user_id = s.user_id 
        WHERE s.status='pending' 
        ORDER BY s.sighting_date DESC
    `).all();
    res.json({ sightings });
});

router.post('/sightings/:id/action', requireAdmin, (req, res) => {
    const { action } = req.body; // 'approve' or 'reject'
    if (!['approve', 'reject'].includes(action)) return res.status(400).json({ error: 'Invalid action' });
    
    const status = action === 'approve' ? 'approved' : 'rejected';
    db.prepare('UPDATE sightings SET status = ? WHERE sighting_id = ?').run(status, req.params.id);
    res.json({ message: `Sighting ${status}` });
});

router.get('/messages', requireAdmin, (req, res) => {
    const messages = db.prepare(`
        SELECT m.*, u.full_name 
        FROM contact_messages m 
        LEFT JOIN users u ON u.user_id = m.user_id 
        ORDER BY m.created_at DESC
    `).all();
    res.json({ messages });
});

router.get('/users', requireAdmin, (req, res) => {
    const users = db.prepare(`
        SELECT u.user_id, u.email, u.full_name, u.is_admin, u.created_at, u.location_name,
        (SELECT COUNT(*) FROM sightings s WHERE s.user_id = u.user_id) as sighting_count
        FROM users u 
        ORDER BY u.created_at DESC
    `).all();
    res.json({ users });
});

router.post('/users/:id/toggle-admin', requireAdmin, (req, res) => {
    const targetUserId = parseInt(req.params.id);
    if (targetUserId === req.user.user_id) return res.status(400).json({ error: 'Cannot modify your own role' });

    const targetUser = db.prepare('SELECT is_admin FROM users WHERE user_id = ?').get(targetUserId);
    if (!targetUser) return res.status(404).json({ error: 'User not found' });

    const newRole = targetUser.is_admin ? 0 : 1;
    db.prepare('UPDATE users SET is_admin = ? WHERE user_id = ?').run(newRole, targetUserId);
    
    res.json({ message: `User role updated to ${newRole ? 'Admin' : 'User'}` });
});

module.exports = router;
