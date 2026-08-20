import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// Fix para los iconos de marcadores en React (Leaflet tiene un bug con Webpack)
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Sub-componente para centrar el mapa automáticamente
function RecenterAutomatically({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
}

export const InteractiveMap = () => {
  const [places, setPlaces] = useState([]);
  const [userLocation, setUserLocation] = useState({ lat: 40.4167, lng: -3.7037 }); // Madrid por defecto

  useEffect(() => {
    // 1. Obtener ubicación actual del usuario
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.log("Error obteniendo ubicación:", error)
      );
    }

    // 2. Obtener lugares de la API
    fetch(`${process.env.BACKEND_URL}/api/places`)
      .then((res) => res.json())
      .then((data) => setPlaces(data))
      .catch((err) => console.error("Error cargando lugares:", err));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Explora Eventos Cercanos</h2>
      <MapContainer center={[userLocation.lat, userLocation.lng]} zoom={13} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Centrar mapa cuando cambie la ubicación del usuario */}
        <RecenterAutomatically lat={userLocation.lat} lng={userLocation.lng} />

        {/* Marcadores de los lugares */}
        {places.map((place) => (
          <Marker key={place.id} position={[place.latitude, place.longitude]}>
            <Popup>
              <div style={{ maxWidth: "200px" }}>
                {place.image_url && (
                  <img src={place.image_url} alt={place.name} style={{ width: "100%", borderRadius: "8px" }} />
                )}
                <h6 className="mt-2">{place.name}</h6>
                <p className="badge bg-primary">{place.category}</p>
                <p className="small text-muted">{place.address}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};