import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Directory() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);

    const searchBirds = async (q, p = 1) => {
        if (q.length < 2) {
            setResults([]);
            setTotal(0);
            return;
        }
        setLoading(true);
        try {
            const res = await axios.get(`/api/species-search?q=${encodeURIComponent(q)}&page=${p}`);
            setResults(res.data.results || []);
            setTotal(res.data.total || 0);
            setPage(p);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Debounce search
    useEffect(() => {
        const timeout = setTimeout(() => searchBirds(query, 1), 500);
        return () => clearTimeout(timeout);
    }, [query]);

    return (
        <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }} data-animate>
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem', filter: 'drop-shadow(0 0 20px rgba(16,185,129,0.5))' }}>🗂️</div>
                <h1 className="font-serif" style={{ fontSize: '2.5rem' }}>Bird Directory</h1>
                <p style={{ color: 'var(--muted)', maxWidth: '600px', margin: '0 auto' }}>Search millions of community observations powered by iNaturalist.</p>
            </div>

            <div className="card" style={{ padding: '1rem', marginBottom: '2rem' }}>
                <input 
                    type="text" 
                    placeholder="Search for a bird species (e.g., Robin, Eagle, Hawk)..." 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.2rem', width: '100%', outline: 'none' }}
                />
            </div>

            {loading && <div style={{ textAlign: 'center', padding: '2rem' }}><span className="spinner"></span></div>}

            {!loading && results.length > 0 && (
                <>
                    <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>Found {total.toLocaleString()} species</p>
                    <div className="grid-3">
                        {results.map(b => (
                            <div key={b.id} className="card card-sm" style={{ padding: 0, overflow: 'hidden' }}>
                                <img src={b.photo || 'https://via.placeholder.com/400x250?text=No+Photo'} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                                <div style={{ padding: '1.25rem' }}>
                                    <h3 style={{ marginBottom: '0.25rem' }}>{b.name}</h3>
                                    <p style={{ fontStyle: 'italic', color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{b.scientific}</p>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                                        <span className="badge badge-ai">👁️ {b.observations.toLocaleString()} obs</span>
                                        {b.conservation && <span className="badge badge-warning">⚠️ {b.conservation}</span>}
                                    </div>
                                    {b.wikipedia && (
                                        <a href={b.wikipedia} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm" style={{ width: '100%' }}>Wikipedia</a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
                        <button disabled={page <= 1} onClick={() => searchBirds(query, page - 1)} className="btn btn-outline">Previous Page</button>
                        <button disabled={results.length < 20} onClick={() => searchBirds(query, page + 1)} className="btn btn-outline">Next Page</button>
                    </div>
                </>
            )}

            {!loading && query.length >= 2 && results.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                    <h3>No species found</h3>
                    <p>Try a different search term.</p>
                </div>
            )}
        </div>
    );
}
