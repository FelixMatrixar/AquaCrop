import React from 'react';
import type { WeatherData } from '../types';

interface CurrentConditionsWidgetProps {
  weather: WeatherData | null;
}

const HumidityIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.32 0L12 2.69zM12 18a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" opacity=".6"/>
        <path d="M12 16.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
    </svg>
);

const ThermometerIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M15 13V5c0-1.66-1.34-3-3-3S9 3.34 9 5v8c-1.21.91-2 2.37-2 4 0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.63-.79-3.09-2-4zm-4-8c0-.55.45-1 1-1s1 .45 1 1v7.27c.58.57 1 1.32 1 2.23 0 1.65-1.35 3-3 3s-3-1.35-3-3c0-.91.42-1.66 1-2.23V5z"/>
    </svg>
);


const LeafIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm6-6c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-3 4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-4-4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm3-4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
    </svg>
);

const DataPoint: React.FC<{ icon: React.ReactNode, label: string, value: string | number, unit: string }> = ({ icon, label, value, unit }) => (
    <div className="flex items-center space-x-4">
        <div className="bg-white/50 dark:bg-gray-700/50 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">{label}</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
                {value} <span className="text-sm font-normal">{unit}</span>
            </p>
        </div>
    </div>
);


const CurrentConditionsWidget: React.FC<CurrentConditionsWidgetProps> = ({ weather }) => {
  return (
    <div className="bg-gradient-to-br from-green-200 to-green-300 dark:from-green-800 dark:to-green-900 rounded-xl shadow-lg p-6 relative overflow-hidden">
        <div className="absolute -bottom-10 -right-10 text-green-400/30 dark:text-green-500/20">
            <LeafIcon className="w-48 h-48" />
        </div>
        <div className="relative z-10">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Current Conditions</h2>
            {weather ? (
            <div className="space-y-4">
                <div className="space-y-3 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm p-4 rounded-lg">
                    <DataPoint icon={<ThermometerIcon className="w-5 h-5 text-red-500" />} label="Temperature" value={weather.temperature} unit="°F" />
                    <DataPoint icon={<HumidityIcon className="w-5 h-5 text-cyan-500" />} label="Humidity" value={weather.relativeHumidity} unit="%" />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 pt-2 text-right">Data from Open-Meteo</p>
            </div>
            ) : (
                <div className="flex justify-center items-center h-32">
                    <p className="text-gray-700 dark:text-gray-300">Loading live conditions...</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default CurrentConditionsWidget;