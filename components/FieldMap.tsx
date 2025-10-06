
import React, { useEffect, useRef } from 'react';
import type { Field } from '../types';

declare global {
  interface Window {
    google: any;
  }
}

interface FieldMapProps {
    fields: Field[];
    center?: { lat: number, lng: number };
    onMapClick?: (coords: { lat: number, lng: number }) => void;
    newFieldLocation?: {lat: number, lng: number} | null;
}

const MapPinIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
);

const FieldMap: React.FC<FieldMapProps> = ({ fields, center, onMapClick, newFieldLocation }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const infoWindowRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || typeof window.google === 'undefined' || !window.google.maps) {
        return;
    }

    const map = new window.google.maps.Map(mapRef.current, {
        center: center || { lat: 36.75, lng: -119.77 },
        zoom: 15,
        mapTypeId: 'satellite',
        disableDefaultUI: true,
        zoomControl: true,
        styles: onMapClick ? [{ stylers: [{ saturation: -100 }]}] : [], // Desaturate map in "add mode"
    });
    
    infoWindowRef.current = new window.google.maps.InfoWindow();

    fields.forEach(field => {
        const marker = new window.google.maps.Marker({
            position: field.location,
            map: map,
            title: field.name,
        });

        marker.addListener('click', () => {
            if(infoWindowRef.current) {
                const contentString = 
                    `<div class="p-2">` +
                    `<h3 class="font-bold text-md mb-1 text-gray-800">${field.name}</h3>` +
                    `<p class="text-sm text-gray-600">Crops: <strong>${field.cropTypes.join(', ')}</strong></p>` +
                    `</div>`;
                infoWindowRef.current.setContent(contentString);
                infoWindowRef.current.open(map, marker);
            }
        });
    });

    if (newFieldLocation) {
        new window.google.maps.Marker({
            position: newFieldLocation,
            map: map,
            title: 'New Field Location',
            icon: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
        });
        map.setCenter(newFieldLocation);
    }

    if (onMapClick) {
        const clickListener = map.addListener('click', (e: any) => {
            onMapClick({ lat: e.latLng.lat(), lng: e.latLng.lng() });
        });
        return () => {
             window.google.maps.event.removeListener(clickListener);
        }
    }

  }, [fields, center, onMapClick, newFieldLocation]);

  return (
    <div className="bg-white dark:bg-stone-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-4">
        <MapPinIcon className="h-6 w-6 text-red-500 mr-3"/>
        <h2 className="text-xl font-bold text-amber-950 dark:text-white">Field Overview</h2>
      </div>
      <div 
        ref={mapRef} 
        className="aspect-video bg-amber-100 dark:bg-stone-700 rounded-lg overflow-hidden"
        aria-label="Map of farm fields"
      >
        { (typeof window.google === 'undefined' || !window.google.maps) && (
             <div className="w-full h-full flex items-center justify-center">
                <p className="text-amber-600 dark:text-amber-400">Loading map...</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default FieldMap;
