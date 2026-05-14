const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_feather_find_key_2026';

function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
}

function requireAdmin(req, res, next) {
    requireAuth(req, res, () => {
        if (!req.user.is_admin) {
            return res.status(403).json({ error: 'Forbidden: Admins only' });
        }
        next();
    });
}

module.exports = { requireAuth, requireAdmin, JWT_SECRET };
