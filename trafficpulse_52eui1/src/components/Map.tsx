import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useIncidents } from '../context/IncidentContext';
import { MapMarker } from '../types';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const createIcon = (color: string) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const LocationTracker = () => {
  const map = useMap();
  const { setCurrentLocation } = useIncidents();

  useEffect(() => {
    let watchId: number;

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          map.setView([latitude, longitude], map.getZoom());
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to London
          setCurrentLocation({ lat: 51.505, lng: -0.09 });
        },
        { enableHighAccuracy: true }
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [map, setCurrentLocation]);

  return null;
};

const Map: React.FC = () => {
  const { markers, currentLocation, selectedTypes } = useIncidents();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-300">Loading map...</p>
        </div>
      </div>
    );
  }

  const filteredMarkers = selectedTypes.length > 0
    ? markers.filter(marker => selectedTypes.includes(marker.type))
    : markers;

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'accident':
      case 'roadblock':
        return createIcon('red');
      case 'construction':
        return createIcon('yellow');
      case 'roadfree':
        return createIcon('green');
      default:
        return createIcon('blue');
    }
  };

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={currentLocation || [51.505, -0.09]}
        zoom={13}
        className="dark-theme"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationTracker />
        
        {currentLocation && (
          <Marker
            position={[currentLocation.lat, currentLocation.lng]}
            icon={createIcon('blue')}
          >
            <Popup>You are here</Popup>
          </Marker>
        )}

        {filteredMarkers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.position.lat, marker.position.lng]}
            icon={getMarkerIcon(marker.type)}
          >
            <Popup>
              <div className="text-gray-900">
                <h3 className="font-semibold capitalize">{marker.type}</h3>
                <p>{marker.count} report(s)</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
