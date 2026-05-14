import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Directory from './pages/Directory';
import Admin from './pages/Admin';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user) return <Navigate to="/login" />;
    if (requireAdmin && user.is_admin !== 1) return <Navigate to="/" />;
    return children;
};

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <main>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                        <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
                        <Route path="/directory" element={<ProtectedRoute><Directory /></ProtectedRoute>} />
                        <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><Admin /></ProtectedRoute>} />
                    </Routes>
                </main>
                <footer>
                    <p>© {new Date().getFullYear()} Feather Find</p>
                </footer>
            </Router>
        </AuthProvider>
    );
}
