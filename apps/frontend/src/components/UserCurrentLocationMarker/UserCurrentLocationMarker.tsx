import { useState, useEffect } from 'react';
import { EventLocation } from '../../hooks/useAddEditEventModal';
import { useMap, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import iconMarker from '../../assets/icons/user_marker.svg';

const userMarker = L.icon({
  iconUrl: iconMarker,
  iconSize: [38, 40],
  iconAnchor: [18, 30],
  popupAnchor: [2, -30],
  shadowSize: [68, 95],
  shadowAnchor: [22, 94],
});

const UserCurrentLocationMarker = () => {
  const [position, setPosition] = useState<EventLocation | undefined>();

  const map = useMap();

  useEffect(() => {
    map.locate().on('locationfound', function (e) {
      setPosition(e.latlng as EventLocation);
      map.flyTo(e.latlng, map.getZoom());
      const radius = e.accuracy;
      const circle = L.circle(e.latlng, radius, {
        color: '#5964e0',
        fillOpacity: 0.1,
      });
      circle.addTo(map);
    });
  }, [map]);

  return (
    position && (
      <Marker position={position} icon={userMarker}>
        <Popup>You are here.</Popup>
      </Marker>
    )
  );
};

export default UserCurrentLocationMarker;
