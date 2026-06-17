"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { MapPin, X } from "lucide-react";

// Dynamically import the map so it doesn't break during SSR
const LocationPickerMap = dynamic(() => import("./LocationPickerMap"), { ssr: false });

interface Props {
  onClose: () => void;
  onConfirm: (address: string) => void;
}

export default function LocationPickerModal({ onClose, onConfirm }: Props) {
  const [position, setPosition] = useState<[number, number]>([0, 0]); // 0,0 indicates not set
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Ask for permission when modal opens to auto-center if they haven't picked yet
  if (!initialized) {
    setInitialized(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        () => {
          // ignore error, map will default to India
        }
      );
    }
  }

  async function handleConfirm() {
    if (position[0] === 0 && position[1] === 0) {
      alert("Please tap on the map to select a location.");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position[0]}&lon=${position[1]}`);
      const data = await res.json();
      if (data && data.display_name) {
        onConfirm(data.display_name);
      } else {
        alert("Could not determine address from this location.");
      }
    } catch (err) {
      alert("Failed to fetch address.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[var(--surface)] w-full max-w-2xl h-[80vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl relative">
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <div>
            <h2 className="text-lg font-bold text-[var(--text)]">Set Location on Map</h2>
            <p className="text-xs text-[var(--text3)]">Tap on the map to place the pin</p>
          </div>
          <button onClick={onClose} className="p-2 text-[var(--text2)] hover:bg-[var(--surface2)] rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 relative bg-slate-100">
          <LocationPickerMap position={position} setPosition={setPosition} />
          
          {/* Overlay instruction */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-md text-sm font-semibold text-slate-800 z-10 pointer-events-none flex items-center gap-2">
            <MapPin size={16} className="text-[var(--brand)]" />
            Drag or tap to move pin
          </div>
        </div>

        <div className="p-4 border-t border-[var(--border)] bg-[var(--surface)]">
          <button
            onClick={handleConfirm}
            disabled={loading || (position[0] === 0 && position[1] === 0)}
            className="w-full bg-[var(--brand)] hover:bg-[var(--brand2)] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[.98]"
          >
            {loading ? "Fetching Address..." : "Confirm Location"}
          </button>
        </div>
      </div>
    </div>
  );
}
