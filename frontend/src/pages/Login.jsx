import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="container" style={{ maxWidth: '480px', marginTop: '4rem' }}>
            <div className="card" data-animate>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🪶</div>
                    <h1 className="font-serif" style={{ fontSize: '1.8rem', color: '#fff' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--muted)' }}>Log in to Feather Find</p>
                </div>
                {error && <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-block" style={{ marginTop: '1.5rem' }}>Log In</button>
                </form>
                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text2)' }}>Don't have an account? </span>
                    <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>Create one</Link>
                </div>
            </div>
        </div>
    );
}
