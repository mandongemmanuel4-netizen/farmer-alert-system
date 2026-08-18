import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../../services/api';
import CsoBottomNav from '../../components/coordinator/CsoBottomNav';

const icons = {
  'checked-in': new L.Icon({ iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png', iconSize: [20, 33], className: 'hue-rotate-90' }),
  overdue: new L.Icon({ iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png', iconSize: [22, 36] }),
  emergency: new L.Icon({ iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x-red.png', iconSize: [26, 42] }),
  post: new L.Icon({ iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x-grey.png', iconSize: [22, 36] }),
};

const DEFAULT_CENTER = [9.8965, 8.8583]; // Jos, Plateau

export default function LiveMap() {
  const [data, setData] = useState({ farmers: [], securityPosts: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/coordinator/map').then((res) => {
      setData(res.data);
      setLoading(false);
    });
  }, []);

  const withGps = data.farmers.filter((f) => f.gps?.lat);

  return (
    <div className="min-h-screen bg-official-light/10 pb-24">
      <div className="bg-white px-6 py-4 border-b border-gray-100">
        <h1 className="text-lg font-bold text-gray-900">Live Map</h1>
        <p className="text-xs text-gray-400">
          🟢 On time &nbsp; 🟠 Overdue &nbsp; 🔴 Active alert &nbsp; ⚪ Security post
        </p>
      </div>

      <div style={{ height: '60vh' }}>
        <MapContainer center={DEFAULT_CENTER} zoom={9} style={{ height: '100%', width: '100%' }}>
          <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {withGps.map((f) => (
            <Marker key={f.checkInId} position={[f.gps.lat, f.gps.lng]} icon={icons[f.status] || icons['checked-in']}>
              <Popup>
                <strong>{f.name}</strong><br />
                {f.farmName}<br />
                Status: {f.status}
              </Popup>
            </Marker>
          ))}
          {data.securityPosts.filter((p) => p.gps?.lat).map((p) => (
            <Marker key={p._id} position={[p.gps.lat, p.gps.lng]} icon={icons.post}>
              <Popup><strong>{p.name}</strong><br />{p.phone}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="px-6 py-4">
        <p className="font-semibold text-gray-700 text-sm mb-2">
          {loading ? 'Loading...' : `${withGps.length} farmer${withGps.length !== 1 ? 's' : ''} active on the map`}
        </p>
      </div>

      <CsoBottomNav />
    </div>
  );
}
