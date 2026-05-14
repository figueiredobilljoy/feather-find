import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default function Home() {
    const { user, updateLocation } = useAuth();
    const [nearby, setNearby] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user?.latitude && user?.longitude) {
            setLoading(true);
            axios.get(`/api/nearby?lat=${user.latitude}&lng=${user.longitude}`)
                 .then(res => setNearby(res.data.results || []))
                 .catch(console.error)
                 .finally(() => setLoading(false));
        }
    }, [user]);

    const handleUpdateLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async pos => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                try {
                    const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
                    const name = res.data.address.city || res.data.address.town || res.data.address.village || 'Unknown Location';
                    updateLocation(lat, lng, name);
                } catch {
                    updateLocation(lat, lng, 'Unknown Location');
                }
            });
        }
    };

    const mapCenter = user?.latitude ? [user.latitude, user.longitude] : [0, 0];
    const mapZoom = user?.latitude ? 11 : 2;

    return (
        <div className="container">
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="font-serif" style={{ fontSize: '2.5rem' }}>Dashboard</h1>
                <p style={{ color: 'var(--muted)' }}>Welcome to your Feather Find command center.</p>
            </div>

            <div className="grid-2">
                <div className="card">
                    <h2 style={{ marginBottom: '1rem' }}>Live Map</h2>
                    {user?.latitude ? (
                        <div style={{ height: '400px', width: '100%', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                            <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }}>
                                <ChangeView center={mapCenter} zoom={mapZoom} />
                                <TileLayer
                                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                    attribution='&copy; OpenStreetMap contributors &copy; CARTO'
                                />
                                <Marker position={mapCenter}>
                                    <Popup>You are here</Popup>
                                </Marker>
                                {nearby.map((b, i) => (
                                    <Marker key={i} position={[b.lat, b.lng]}>
                                        <Popup>
                                            <strong>{b.species}</strong><br/>
                                            {b.date && new Date(b.date).toLocaleDateString()}<br/>
                                            {b.photo && <img src={b.photo} style={{width:'100px', height:'100px', objectFit:'cover', marginTop:'5px'}}/>}
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        </div>
                    ) : (
                        <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--surface)', borderRadius: 'var(--radius)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📍</div>
                            <h3>Location required</h3>
                            <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>Set your location to see birds near you.</p>
                            <button onClick={handleUpdateLocation} className="btn">Update Location</button>
                        </div>
                    )}
                </div>

                <div>
                    <div className="card" style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h2>Your Location</h2>
                            <button onClick={handleUpdateLocation} className="btn btn-outline btn-sm">📍 Update</button>
                        </div>
                        <p style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>{user?.location_name || 'Not set'}</p>
                    </div>

                    <div className="card">
                        <h2 style={{ marginBottom: '1rem' }}>Nearby Sightings</h2>
                        {loading ? <p>Loading...</p> : nearby.length === 0 ? <p style={{ color: 'var(--muted)' }}>No recent sightings near you.</p> : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {nearby.slice(0, 5).map((b, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <img src={b.photo} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                                        <div>
                                            <div style={{ fontWeight: '600' }}>{b.species}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{b.user} • {new Date(b.date).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
