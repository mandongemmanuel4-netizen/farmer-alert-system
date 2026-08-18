import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Leaflet's default marker icons don't load correctly with bundlers unless we
// point them at hosted images explicitly — this fixes the "broken marker" bug.
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Default map center: Jos, Plateau State — a reasonable starting view for this
// project's demo region. The farmer can pan/zoom to their actual community.
const DEFAULT_CENTER = [9.8965, 8.8583];

function ClickHandler({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function MapPicker({ value, onChange, height = '260px' }) {
  const [position, setPosition] = useState(value || null);

  const handleSelect = (latlng) => {
    setPosition(latlng);
    onChange(latlng);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200" style={{ height }}>
      <MapContainer
        center={position ? [position.lat, position.lng] : DEFAULT_CENTER}
        zoom={position ? 15 : 8}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onSelect={handleSelect} />
        {position && (
          <Marker
            position={[position.lat, position.lng]}
            icon={markerIcon}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const latlng = e.target.getLatLng();
                handleSelect({ lat: latlng.lat, lng: latlng.lng });
              },
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
