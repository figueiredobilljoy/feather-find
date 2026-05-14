const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../db');

const INAT_BASE = 'https://api.inaturalist.org/v1';
const BIRD_TAXON_ID = 3;

// Cache helper
function getCache(key) {
    const stmt = db.prepare('SELECT payload_json FROM species_cache WHERE cache_key = ? AND expires_at > ?');
    const row = stmt.get(key, Math.floor(Date.now() / 1000));
    return row ? JSON.parse(row.payload_json) : null;
}
function setCache(key, payload, ttl_seconds = 21600) {
    const stmt = db.prepare('INSERT OR REPLACE INTO species_cache (cache_key, payload_json, expires_at) VALUES (?, ?, ?)');
    stmt.run(key, JSON.stringify(payload), Math.floor(Date.now() / 1000) + ttl_seconds);
}

router.get('/nearby', async (req, res) => {
    const { lat, lng } = req.query;
    if (!lat || !lng) return res.json({ results: [] });

    const key = `nearby_${lat}_${lng}`;
    const cached = getCache(key);
    if (cached) return res.json(cached);

    try {
        const response = await axios.get(`${INAT_BASE}/observations`, {
            params: {
                taxon_id: BIRD_TAXON_ID,
                lat, lng, radius: 50,
                per_page: 50,
                order: 'desc', order_by: 'created_at'
            }
        });
        
        const results = response.data.results.map(o => ({
            id: o.id,
            species: o.taxon?.preferred_common_name || o.taxon?.name || 'Unknown',
            scientific_name: o.taxon?.name || '',
            lat: o.geojson?.coordinates[1] || null,
            lng: o.geojson?.coordinates[0] || null,
            photo: o.photos?.[0]?.url?.replace('square', 'medium') || null,
            date: o.time_observed_at,
            user: o.user?.login || 'Observer'
        })).filter(o => o.lat && o.lng);

        setCache(key, { results }, 900); // 15 mins cache
        res.json({ results });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch nearby sightings' });
    }
});

router.get('/species-search', async (req, res) => {
    const q = req.query.q || '';
    const page = req.query.page || 1;
    if (q.length < 2) return res.json({ results: [], total: 0 });

    const key = `taxa_${q}_${page}`;
    const cached = getCache(key);
    if (cached) return res.json(cached);

    try {
        const response = await axios.get(`${INAT_BASE}/taxa`, {
            params: {
                q, taxon_id: BIRD_TAXON_ID,
                per_page: 20, page,
                order: 'desc', order_by: 'observations_count'
            }
        });

        const results = response.data.results.map(t => ({
            id: t.id,
            name: t.preferred_common_name || t.name,
            scientific: t.name,
            photo: t.default_photo?.medium_url || t.default_photo?.square_url || null,
            observations: t.observations_count || 0,
            conservation: t.conservation_status?.status_name || null,
            wikipedia: t.wikipedia_url || null,
            rank: t.rank || ''
        }));

        const payload = { results, total: response.data.total_results || 0 };
        setCache(key, payload, 21600); // 6 hours cache
        res.json(payload);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Search failed' });
    }
});

module.exports = router;
