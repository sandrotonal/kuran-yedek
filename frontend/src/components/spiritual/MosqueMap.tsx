import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Mosque } from '../../lib/MosqueService';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// User Location Icon
const userIcon = L.divIcon({
    className: 'custom-user-icon',
    html: `<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
});

// Mosque Icon
const mosqueIcon = L.divIcon({
    className: 'custom-mosque-icon',
    html: `<div style="background-color: #10b981; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="14" height="14"><path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z"/></svg>
           </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});

interface MosqueMapProps {
    userLat: number;
    userLon: number;
    mosques: Mosque[];
    selectedMosqueId?: number | null;
    onSelectMosque: (mosque: Mosque) => void;
}

export function MosqueMap({ userLat, userLon, mosques, selectedMosqueId, onSelectMosque }: MosqueMapProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const markersRef = useRef<L.Marker[]>([]);
    const userMarkerRef = useRef<L.Marker | null>(null);

    // 1. Initialize Map
    useEffect(() => {
        if (!mapContainerRef.current) return;

        // If map already exists, just return (React 18 double-mount protection)
        if (mapRef.current) return;

        const map = L.map(mapContainerRef.current).setView([userLat, userLon], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        mapRef.current = map;

        // Cleanup on unmount
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []); // Run once on mount (or rely on ref to prevent double init)

    // 2. Update Map Center & User Marker when user location changes
    useEffect(() => {
        if (!mapRef.current) return;

        // Update User Marker
        if (userMarkerRef.current) {
            userMarkerRef.current.setLatLng([userLat, userLon]);
        } else {
            userMarkerRef.current = L.marker([userLat, userLon], { icon: userIcon })
                .addTo(mapRef.current)
                .bindPopup("Sizin Konumunuz");
        }

        // Only pan if no mosque is selected
        if (!selectedMosqueId) {
            mapRef.current.setView([userLat, userLon], 15);
        }

    }, [userLat, userLon, selectedMosqueId]); // selectedMosqueId dependency handled below

    // 3. Update Markers & FlyTo Selected
    useEffect(() => {
        if (!mapRef.current) return;

        // Clear existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        // Add Mosque Markers
        mosques.forEach(mosque => {
            const marker = L.marker([mosque.lat, mosque.lon], { icon: mosqueIcon })
                .addTo(mapRef.current!)
                .on('click', () => onSelectMosque(mosque));

            // Build Popup Content
            const popupContent = document.createElement('div');
            popupContent.className = "text-center";
            popupContent.innerHTML = `
                <h3 class="font-bold text-sm">${mosque.name || "Cami"}</h3>
                <p class="text-xs text-slate-500">${(mosque.distance || 0).toFixed(0)}m</p>
                <a href="https://www.google.com/maps/dir/?api=1&destination=${mosque.lat},${mosque.lon}" target="_blank" class="mt-2 block w-full py-1 px-2 bg-emerald-600 text-white text-xs rounded hover:bg-emerald-700 transition" style="text-decoration: none;">Yol Tarifi Al</a>
            `;

            marker.bindPopup(popupContent);
            markersRef.current.push(marker);

            // If this is the selected mosque, open popup and fly to it
            if (selectedMosqueId === mosque.id) {
                marker.openPopup();
                mapRef.current!.flyTo([mosque.lat, mosque.lon], 16, { animate: true });
            }
        });

    }, [mosques, selectedMosqueId, onSelectMosque, userLat, userLon]); // Re-run when mosques or selection changes

    return (
        <div
            ref={mapContainerRef}
            className="w-full h-full rounded-xl z-0"
            style={{ minHeight: '300px' }}
        />
    );
}
