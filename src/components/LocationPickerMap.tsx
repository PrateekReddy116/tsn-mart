"use client";

import { useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default icon issue with Next.js/Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Props {
  position: [number, number];
  setPosition: (pos: [number, number]) => void;
}

function LocationMarker({ position, setPosition }: Props) {
  const markerRef = useRef<L.Marker>(null);

  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const latlng = marker.getLatLng();
          setPosition([latlng.lat, latlng.lng]);
        }
      },
    }),
    [setPosition]
  );

  return position[0] === 0 && position[1] === 0 ? null : (
    <Marker 
      position={position} 
      draggable={true} 
      eventHandlers={eventHandlers} 
      ref={markerRef} 
    />
  );
}

export default function LocationPickerMap({ position, setPosition }: Props) {
  // If we don't have a position initially, default to roughly India
  const initialPos = (position[0] !== 0 || position[1] !== 0) ? position : [20.5937, 78.9629] as [number, number];
  const zoom = (position[0] !== 0 || position[1] !== 0) ? 15 : 5;

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer 
        center={initialPos} 
        zoom={zoom} 
        scrollWheelZoom={true} 
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={setPosition} />
      </MapContainer>
    </div>
  );
}
