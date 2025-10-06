
import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { FarmLocation } from '../types';

declare global {
  interface Window {
    google: any;
  }
}

interface FarmSetupProps {
    onLocationSet: (location: FarmLocation) => void;
}

const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);

const FarmSetup: React.FC<FarmSetupProps> = ({ onLocationSet }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);
    const [locationName, setLocationName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markerInstanceRef = useRef<any>(null);
    const geocoderRef = useRef<any>(null);
    
    // Reverse geocode coordinates to get a human-readable address
    const reverseGeocode = useCallback((coords: { lat: number; lng: number }) => {
        if (!geocoderRef.current) return;
        setIsLoading(true);
        geocoderRef.current.geocode({ location: coords }, (results: any[], status: string) => {
            setIsLoading(false);
            if (status === 'OK' && results[0]) {
                setLocationName(results[0].formatted_address);
            } else {
                setLocationName('Unknown location');
                console.error('Geocoder failed due to: ' + status);
            }
        });
    }, []);
    
    // Initialize map
    useEffect(() => {
        if (!mapRef.current || typeof window.google === 'undefined' || mapInstanceRef.current) return;
        
        geocoderRef.current = new window.google.maps.Geocoder();
        const map = new window.google.maps.Map(mapRef.current, {
            center: { lat: 39.8283, lng: -98.5795 }, // Center of the US
            zoom: 4,
            mapTypeId: 'satellite',
            disableDefaultUI: true,
            zoomControl: true,
        });
        mapInstanceRef.current = map;

        map.addListener('click', (e: any) => {
            const coords = { lat: e.latLng.lat(), lng: e.latLng.lng() };
            setMarkerPosition(coords);
            reverseGeocode(coords);
        });
    }, [reverseGeocode]);

    // Update marker when position changes
    useEffect(() => {
        if (!mapInstanceRef.current || !markerPosition) return;

        if (!markerInstanceRef.current) {
            const marker = new window.google.maps.Marker({
                position: markerPosition,
                map: mapInstanceRef.current,
                draggable: true,
            });
            markerInstanceRef.current = marker;

            marker.addListener('dragend', (e: any) => {
                const coords = { lat: e.latLng.lat(), lng: e.latLng.lng() };
                setMarkerPosition(coords);
                reverseGeocode(coords);
            });
        } else {
            markerInstanceRef.current.setPosition(markerPosition);
        }
    }, [markerPosition, reverseGeocode]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim() || !geocoderRef.current) return;

        setIsLoading(true);
        geocoderRef.current.geocode({ address: searchQuery }, (results: any[], status: string) => {
            setIsLoading(false);
            if (status === 'OK' && results[0]) {
                const location = results[0].geometry.location;
                const coords = { lat: location.lat(), lng: location.lng() };
                mapInstanceRef.current?.panTo(coords);
                mapInstanceRef.current?.setZoom(12);
                setMarkerPosition(coords);
                setLocationName(results[0].formatted_address);
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    };

    const handleSubmit = () => {
        if (markerPosition && locationName) {
            onLocationSet({ name: locationName, ...markerPosition });
        }
    };

    return (
        <div className="min-h-screen bg-amber-50 dark:bg-stone-900 flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-3xl bg-white dark:bg-stone-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 animate-fade-in-1">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-amber-950 dark:text-white">Where is your farm located?</h1>
                    <p className="text-amber-700 dark:text-amber-300 mt-2">Search for a location, then click or drag the pin to be more precise.</p>
                </div>

                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Enter address, city, or coordinates"
                        className="flex-grow block w-full rounded-full border-amber-300 dark:border-stone-600 bg-amber-50 dark:bg-stone-700 focus:border-green-500 focus:ring-green-500"
                    />
                    <button type="submit" className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700" aria-label="Search">
                        <SearchIcon className="w-6 h-6" />
                    </button>
                </form>
                
                <div 
                    ref={mapRef} 
                    className="h-64 sm:h-80 w-full rounded-lg overflow-hidden border border-amber-200 dark:border-stone-700 bg-amber-100 dark:bg-stone-700"
                    aria-label="Interactive map for location selection"
                />

                <div className="text-center h-10">
                    {isLoading && <p className="text-amber-600 dark:text-amber-400">Finding location...</p>}
                    {locationName && !isLoading && (
                        <p className="text-sm text-amber-800 dark:text-amber-200">
                            <span className="font-semibold">Selected:</span> {locationName}
                        </p>
                    )}
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={!markerPosition || isLoading}
                    className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-full shadow-xl transition-all hover:scale-105 active:scale-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gradient-to-r disabled:from-stone-400 disabled:to-stone-500 disabled:scale-100 disabled:cursor-not-allowed"
                >
                    Confirm Location
                </button>
            </div>
        </div>
    );
};

export default FarmSetup;
