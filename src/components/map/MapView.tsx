import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import type { ReactNode } from 'react';

const pinIcon = (color: string) =>
  L.divIcon({
    className: 'map-pin',
    html: `<div class="map-pin-dot" style="background:${color}"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });

export interface MapMarkerData {
  id: string;
  lat: number;
  lng: number;
  color?: string;
  popup?: ReactNode;
}

interface MapViewProps {
  center: [number, number];
  zoom?: number;
  markers?: MapMarkerData[];
  height?: number | string;
  onMapClick?: (lat: number, lng: number) => void;
}

function ClickCatcher({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick?.(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function MapView({ center, zoom = 12, markers = [], height = 400, onMapClick }: MapViewProps) {
  return (
    <div style={{ height, width: '100%', borderRadius: 12, overflow: 'hidden' }}>
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {onMapClick && <ClickCatcher onMapClick={onMapClick} />}
        {markers.map((m) => (
          <Marker key={m.id} position={[m.lat, m.lng]} icon={pinIcon(m.color ?? '#1a3d7c')}>
            {m.popup && <Popup>{m.popup}</Popup>}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
