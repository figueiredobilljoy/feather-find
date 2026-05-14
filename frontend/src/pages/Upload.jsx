import { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Upload() {
    const [step, setStep] = useState(1);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);
    const [locationNote, setLocationNote] = useState('');
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleFile = (selectedFile) => {
        setError('');
        if (!selectedFile.type.startsWith('image/')) {
            setError('Please select an image file.');
            return;
        }
        if (selectedFile.size > 3 * 1024 * 1024) {
            setError('Max 3 MB per image.');
            return;
        }
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
        setStep(2);
    };

    const handleIdentify = async () => {
        setLoading(true);
        setError('');
        const fd = new FormData();
        fd.append('image', file);
        try {
            const res = await axios.post('/upload/identify', fd);
            if (res.data.error) throw new Error(res.data.error);
            setResult(res.data);
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Network error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/upload/submit', {
                species: result.species,
                scientific_name: result.scientific_name,
                confidence: result.confidence,
                filename: result.filename,
                location_note: locationNote
            });
            navigate('/');
        } catch (err) {
            setError('Failed to submit sighting');
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '800px' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="font-serif" style={{ fontSize: '2.5rem' }}>Upload Sighting</h1>
            </div>

            <div className="wizard-steps" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <div className={`wizard-step ${step >= 1 ? 'active' : ''}`} style={{ flex: 1, padding: '1rem', background: 'var(--surface)', borderRadius: 'var(--radius)', opacity: step >= 1 ? 1 : 0.5 }}>1. Upload</div>
                <div className={`wizard-step ${step >= 2 ? 'active' : ''}`} style={{ flex: 1, padding: '1rem', background: 'var(--surface)', borderRadius: 'var(--radius)', opacity: step >= 2 ? 1 : 0.5 }}>2. AI Analysis</div>
                <div className={`wizard-step ${step >= 3 ? 'active' : ''}`} style={{ flex: 1, padding: '1rem', background: 'var(--surface)', borderRadius: 'var(--radius)', opacity: step >= 3 ? 1 : 0.5 }}>3. Submit</div>
            </div>

            {error && <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

            <div className="card">
                {step === 1 && (
                    <div 
                        className="drop-zone" 
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--primary)'; }}
                        onDragLeave={e => { e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)'; }}
                        onDrop={e => { e.preventDefault(); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
                        style={{ textAlign: 'center', padding: '4rem 2rem', border: '2px dashed rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius)', cursor: 'pointer' }}
                    >
                        <span style={{ fontSize: '3rem' }}>🖼️</span>
                        <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginTop: '1rem' }}>Drag & drop your bird photo here</p>
                        <p>or <span style={{ color: 'var(--primary)', fontWeight: 600 }}>click to browse</span></p>
                        <input type="file" accept="image/*" style={{ display: 'none' }} ref={fileInputRef} onChange={e => e.target.files[0] && handleFile(e.target.files[0])} />
                    </div>
                )}

                {step >= 2 && preview && (
                    <div style={{ textAlign: 'center' }}>
                        <img src={preview} style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: 'var(--radius)', marginBottom: '1.5rem' }} />
                        {step === 2 && (
                            <button onClick={handleIdentify} disabled={loading} className="btn" style={{ minWidth: '200px' }}>
                                {loading ? 'Analyzing...' : '🔍 Identify Bird with AI'}
                            </button>
                        )}
                    </div>
                )}

                {step === 3 && result && (
                    <form onSubmit={handleSubmit} style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
                        <div className="grid-2">
                            <div className="form-group">
                                <label>Species Name</label>
                                <input type="text" value={result.species} readOnly />
                            </div>
                            <div className="form-group">
                                <label>Scientific Name</label>
                                <input type="text" value={result.scientific_name} readOnly />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>AI Confidence</label>
                            <div className="confidence-bar">
                                <div className="confidence-fill" style={{ width: `${Math.round(result.confidence * 100)}%` }}></div>
                            </div>
                            <small>{Math.round(result.confidence * 100)}% Match</small>
                        </div>
                        <div className="form-group">
                            <label>Location Note (Optional)</label>
                            <input type="text" placeholder="E.g. In my backyard, near the oak tree..." value={locationNote} onChange={e => setLocationNote(e.target.value)} />
                        </div>
                        <button type="submit" disabled={loading} className="btn btn-block">
                            {loading ? 'Submitting...' : '🚀 Submit Sighting'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
