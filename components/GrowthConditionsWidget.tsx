
import React from 'react';
import type { WeatherData, GrowthData } from '../types';

interface GrowthConditionsWidgetProps {
  weather: WeatherData | null;
  growthData: GrowthData | null;
}

const SunIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l1.06 1.06c.39.39 1.02.39 1.41 0s.39-1.02 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l1.06 1.06c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.02 0 1.41s1.02.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.02 0 1.41s1.02.39 1.41 0l1.06-1.06z"/>
    </svg>
);

const EvaporationIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 5.5l-4 4h3v6h2v-6h3l-4-4zM2 18h20v2H2v-2zm0-4h20v2H2v-2z" />
    </svg>
);

const DataPoint: React.FC<{ icon: React.ReactNode, label: string, value: string | number, unit: string }> = ({ icon, label, value, unit }) => (
    <div className="flex items-start space-x-3">
        <div className="bg-amber-100 dark:bg-stone-700/80 p-2.5 rounded-full mt-1">
            {icon}
        </div>
        <div>
            <p className="text-sm text-amber-700 dark:text-amber-300">{label}</p>
            <p className="text-xl font-bold text-amber-950 dark:text-white">
                {value} <span className="text-sm font-normal">{unit}</span>
            </p>
        </div>
    </div>
);

const GrowthConditionsWidget: React.FC<GrowthConditionsWidgetProps> = ({ weather, growthData }) => {
  return (
    <div className="bg-white dark:bg-stone-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-amber-950 dark:text-white mb-4">Growth Conditions</h2>
        {weather && growthData ? (
           <div className="space-y-4">
               <DataPoint 
                    icon={<SunIcon className="w-5 h-5 text-yellow-500" />} 
                    label="Solar Radiation" 
                    value={growthData.solarRadiation.toFixed(2)} 
                    unit="kWh/m²" 
                />
                <DataPoint 
                    icon={<EvaporationIcon className="w-5 h-5 text-sky-500" />} 
                    label="Evapotranspiration (ET₀)" 
                    value={weather.et0} 
                    unit="in/day" 
                />
           </div>
        ) : (
             <div className="flex justify-center items-center h-24">
                <p className="text-amber-600 dark:text-amber-300">Loading growth data...</p>
            </div>
        )}
    </div>
  );
};

export default GrowthConditionsWidget;
