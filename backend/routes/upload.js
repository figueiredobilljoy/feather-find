const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db');
const { requireAuth } = require('../middleware/authMiddleware');
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
});

const upload = multer({ 
    storage, 
    limits: { fileSize: 3 * 1024 * 1024 }, // 3MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Only images are allowed'));
    }
});

async function identifyBird(imagePath, mimeType) {
    const base64Image = fs.readFileSync(imagePath).toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64Image}`;

    const prompt = 'You are an expert ornithologist. Analyse this image carefully. Return ONLY a JSON object with exactly these fields: {"species":"Common Name","scientific_name":"Scientific Name","confidence":0.85,"reasoning":"One sentence explanation of your identification.","is_bird":true}. If no bird is visible, set is_bird to false. Confidence must be a decimal 0.0–1.0.';

    const response = await groq.chat.completions.create({
        messages: [{
            role: 'user',
            content: [
                { type: 'text', text: prompt },
                { type: 'image_url', image_url: { url: dataUrl } }
            ]
        }],
        model: 'meta-llama/llama-4-scout-17b-16e-instruct', // Fixed decommissioned model
        temperature: 0.1,
        max_tokens: 300
    });

    const content = response.choices[0]?.message?.content || '{}';
    const match = content.match(/\{[\s\S]*\}/);
    return JSON.parse(match ? match[0] : '{}');
}

router.post('/identify', requireAuth, upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No image provided' });

    try {
        const result = await identifyBird(req.file.path, req.file.mimetype);
        
        // We do not delete the file here because the user might submit it right after
        // We will pass the filename back so the frontend can submit it
        res.json({ ...result, filename: req.file.filename });
    } catch (err) {
        console.error('Vision API Error:', err);
        res.status(500).json({ error: 'AI Identification failed.' });
    }
});

router.post('/submit', requireAuth, async (req, res) => {
    const { species, scientific_name, confidence, location_note, filename } = req.body;
    
    if (!filename || !species) return res.status(400).json({ status: 'error', message: 'Missing data' });

    const image_path = `/uploads/${filename}`;
    
    // AI Validation
    let ai_score = 0;
    let ai_reason = "Unable to generate validation.";
    try {
        const userLoc = db.prepare('SELECT latitude, longitude FROM users WHERE user_id = ?').get(req.user.user_id);
        const prompt = `A user reported a sighting of a "${species}" (${scientific_name}). The vision model gave it a confidence of ${Math.round(confidence * 100)}%. Is this plausible in the wild considering global distribution (Assume user is at ${userLoc?.latitude||'Unknown'}, ${userLoc?.longitude||'Unknown'})? Return ONLY JSON: {"validity_score": 85, "reasoning": "Short explanation"}`;
        
        const response = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.3
        });
        const parsed = JSON.parse(response.choices[0]?.message?.content?.match(/\{[\s\S]*\}/)?.[0] || '{}');
        ai_score = parsed.validity_score || Math.round(confidence * 100);
        ai_reason = parsed.reasoning || "Validation passed.";
    } catch (e) { console.error('Validation error:', e); }

    const stmt = db.prepare(`
        INSERT INTO sightings (user_id, species, scientific_name, image_path, location_note, sighting_date, groq_confidence, ai_validation_score, ai_validation_reasoning)
        VALUES (?, ?, ?, ?, ?, datetime('now'), ?, ?, ?)
    `);
    
    try {
        stmt.run(req.user.user_id, species, scientific_name, image_path, location_note || '', confidence, ai_score, ai_reason);
        res.json({ status: 'success', species });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Database error' });
    }
});

module.exports = router;
