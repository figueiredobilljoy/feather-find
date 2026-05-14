import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Admin() {
    const [stats, setStats] = useState({ pending: 0, approved: 0, unread: 0, users: 0 });
    const [tab, setTab] = useState('sightings');
    const [sightings, setSightings] = useState([]);
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const [st, si, me, us] = await Promise.all([
                axios.get('/admin/stats'),
                axios.get('/admin/sightings/pending'),
                axios.get('/admin/messages'),
                axios.get('/admin/users')
            ]);
            setStats(st.data);
            setSightings(si.data.sightings);
            setMessages(me.data.messages);
            setUsers(us.data.users);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSightingAction = async (id, action) => {
        try {
            await axios.post(`/admin/sightings/${id}/action`, { action });
            loadData();
        } catch (err) {
            alert('Failed to update sighting');
        }
    };

    const handleToggleAdmin = async (id) => {
        try {
            await axios.post(`/admin/users/${id}/toggle-admin`);
            loadData();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to toggle admin');
        }
    };

    if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}><span className="spinner"></span></div>;

    return (
        <div className="container">
            <div style={{ marginBottom: '1.5rem' }}>
                <h1 className="font-serif" style={{ fontSize: '2rem' }}>📊 Admin Dashboard</h1>
            </div>

            <div className="stats-strip" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: '2rem' }}>
                <div className="stat-card warning"><span className="stat-icon">⏳</span><span className="stat-value">{stats.pending}</span><span className="stat-label">Pending</span></div>
                <div className="stat-card primary"><span className="stat-icon">✅</span><span className="stat-value">{stats.approved}</span><span className="stat-label">Approved</span></div>
                <div className="stat-card danger"><span className="stat-icon">✉️</span><span className="stat-value">{stats.unread}</span><span className="stat-label">Messages</span></div>
                <div className="stat-card accent"><span className="stat-icon">👥</span><span className="stat-value">{stats.users}</span><span className="stat-label">Users</span></div>
            </div>

            <div className="card">
                <div className="tabs" style={{ marginBottom: '1.5rem' }}>
                    <button className={`tab-btn ${tab === 'sightings' ? 'active' : ''}`} onClick={() => setTab('sightings')}>⏳ Sightings {stats.pending > 0 && <span className="nav-badge" style={{ marginLeft: '.3rem' }}>{stats.pending}</span>}</button>
                    <button className={`tab-btn ${tab === 'messages' ? 'active' : ''}`} onClick={() => setTab('messages')}>✉️ Messages {stats.unread > 0 && <span className="nav-badge" style={{ marginLeft: '.3rem' }}>{stats.unread}</span>}</button>
                    <button className={`tab-btn ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>👥 Users</button>
                </div>

                {tab === 'sightings' && (
                    sightings.length === 0 ? <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>No pending sightings to review! 🎉</p> : (
                        <div className="grid-3" style={{ gap: '1.25rem' }}>
                            {sightings.map(s => {
                                const isHighConf = s.ai_validation_score >= 70;
                                return (
                                <div key={s.sighting_id} className="card card-sm" style={{ padding: 0, overflow: 'hidden' }}>
                                    <img src={`http://localhost:3000${s.image_path}`} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                                    <div style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>{s.species}</div>
                                        <div style={{ fontStyle: 'italic', fontSize: '.8rem', color: 'var(--muted)', marginBottom: '.5rem' }}>{s.scientific_name}</div>
                                        <div style={{ fontSize: '.82rem', color: 'var(--text2)', marginBottom: '.75rem' }}>
                                            📍 {s.location_note || 'No location'}<br/>👤 {s.full_name}<br/>📅 {new Date(s.sighting_date).toLocaleString()}
                                        </div>
                                        <div style={{ marginBottom: '.75rem' }}>
                                            <span className={`badge ${isHighConf ? 'badge-approved' : 'badge-rejected'}`}>🤖 AI {s.ai_validation_score}%</span>
                                        </div>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--accent-light)', marginBottom: '1rem', fontStyle: 'italic' }}>{s.ai_validation_reasoning}</p>
                                        <div style={{ display: 'flex', gap: '.5rem' }}>
                                            <button onClick={() => handleSightingAction(s.sighting_id, 'approve')} className="btn btn-sm" style={{ flex: 1 }}>✅ Approve</button>
                                            <button onClick={() => handleSightingAction(s.sighting_id, 'reject')} className="btn btn-danger btn-sm" style={{ flex: 1 }}>❌ Reject</button>
                                        </div>
                                    </div>
                                </div>
                            )})}
                        </div>
                    )
                )}

                {tab === 'messages' && (
                    messages.length === 0 ? <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>No messages! 📭</p> : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
                            {messages.map(m => (
                                <div key={m.message_id} className="card card-sm" style={{ borderLeft: m.status === 'unread' ? '3px solid var(--accent)' : 'none' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div>
                                            <span className={`badge ${m.status === 'unread' ? 'badge-unread' : 'badge-read'}`}>{m.status}</span>
                                            <strong style={{ marginLeft: '.5rem', color: '#fff' }}>{m.subject}</strong>
                                            <div style={{ fontSize: '.82rem', color: 'var(--muted)', marginTop: '.25rem' }}>{m.sender_name} • {new Date(m.created_at).toLocaleString()}</div>
                                            {m.ai_summary && <div style={{ marginTop: '.5rem', fontSize: '.85rem', color: 'var(--text2)' }}>🤖 <i>{m.ai_summary}</i></div>}
                                            <p style={{ marginTop: '.75rem', fontSize: '.88rem', color: 'var(--text2)', whiteSpace: 'pre-wrap' }}>{m.message_text}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}

                {tab === 'users' && (
                    <div className="table-wrap">
                        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    <th style={{ padding: '0.5rem' }}>Name</th><th style={{ padding: '0.5rem' }}>Email</th><th style={{ padding: '0.5rem' }}>Role</th><th style={{ padding: '0.5rem' }}>Sightings</th><th style={{ padding: '0.5rem' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.user_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '0.5rem' }}>{u.full_name}</td>
                                        <td style={{ padding: '0.5rem' }}>{u.email}</td>
                                        <td style={{ padding: '0.5rem' }}>{u.is_admin ? <span className="badge badge-accent">Admin</span> : <span className="badge badge-read">User</span>}</td>
                                        <td style={{ padding: '0.5rem' }}>{u.sighting_count}</td>
                                        <td style={{ padding: '0.5rem' }}>
                                            <button onClick={() => handleToggleAdmin(u.user_id)} className="btn btn-ghost btn-sm">Toggle Admin</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
