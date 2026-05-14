const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcrypt');

const dbPath = path.join(__dirname, 'feather_find.db');
const db = new Database(dbPath, { verbose: console.log });

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize schema
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        latitude REAL,
        longitude REAL,
        location_name TEXT,
        is_admin INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sightings (
        sighting_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        species TEXT NOT NULL,
        scientific_name TEXT,
        image_path TEXT NOT NULL,
        location_note TEXT,
        sighting_date DATETIME NOT NULL,
        status TEXT CHECK(status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
        groq_confidence REAL,
        ai_validation_score INTEGER,
        ai_validation_reasoning TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
        message_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        sender_name TEXT NOT NULL,
        sender_email TEXT NOT NULL,
        subject TEXT NOT NULL,
        message_text TEXT NOT NULL,
        status TEXT CHECK(status IN ('unread', 'read')) DEFAULT 'unread',
        ai_summary TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS species_cache (
        cache_key TEXT PRIMARY KEY,
        payload_json TEXT NOT NULL,
        expires_at INTEGER NOT NULL
    );
`);

// Create a default admin if no users exist
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
if (userCount === 0) {
    const hash = bcrypt.hashSync('admin123', 10);
    db.prepare('INSERT INTO users (email, password_hash, full_name, is_admin) VALUES (?, ?, ?, ?)')
      .run('admin@featherfind.local', hash, 'System Admin', 1);
    console.log('Created default admin: admin@featherfind.local / admin123');
}

module.exports = db;
