import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" className="nav-brand font-serif" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.4rem' }}>🪶</span> Feather Find
                </Link>
                <div className="nav-links">
                    <Link to="/" className="nav-link">Dashboard</Link>
                    <Link to="/directory" className="nav-link">Directory</Link>
                    <Link to="/upload" className="nav-link">Upload</Link>
                    {user?.is_admin === 1 && (
                        <Link to="/admin" className="nav-link" style={{ color: 'var(--accent-light)' }}>Admin</Link>
                    )}
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {user ? (
                        <>
                            <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Hi, {user.full_name.split(' ')[0]}</span>
                            <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Log In</Link>
                            <Link to="/register" className="btn btn-sm">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
