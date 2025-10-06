
import React from 'react';
import type { Field } from '../types';

interface SoilMoistureWidgetProps {
  fields: Field[];
  onSelectField: (field: Field) => void;
}

const DropletIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.32 0L12 2.69zm0 13.89a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
    </svg>
);

const SparkLine: React.FC<{ data: number[] }> = ({ data }) => {
    const width = 50;
    const height = 16;
    const max = 100;
    const min = 0;
    
    if (!data || data.length < 2) return null;

    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((d - min) / (max - min)) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-12 h-4" preserveAspectRatio="none">
            <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                points={points}
            />
        </svg>
    );
};

const SoilMoistureWidget: React.FC<SoilMoistureWidgetProps> = ({ fields, onSelectField }) => {

    const getBarColor = (percentage: number) => {
        if (percentage > 60) return 'bg-blue-500';
        if (percentage > 30) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="bg-white dark:bg-stone-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
                <DropletIcon className="h-6 w-6 text-blue-500 mr-3"/>
                <h2 className="text-xl font-bold text-amber-950 dark:text-white">Soil Moisture</h2>
            </div>
            <div className="space-y-4">
                {fields.map(field => (
                    <div key={field.id} className="cursor-pointer hover:bg-amber-100/50 dark:hover:bg-stone-700/50 p-1 -m-1 rounded-lg" onClick={() => onSelectField(field)}>
                        <div className="flex justify-between items-center text-sm mb-1">
                            <span className="font-medium text-amber-800 dark:text-amber-300">{field.name}</span>
                            <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400">
                                <SparkLine data={field.soilMoistureHistory} />
                                <span className="font-semibold w-8 text-right">{field.soilMoisture}%</span>
                            </div>
                        </div>
                        <div className="w-full bg-amber-100 dark:bg-stone-700 rounded-full h-2.5">
                            <div
                                className={`h-2.5 rounded-full transition-all duration-500 ${getBarColor(field.soilMoisture)}`}
                                style={{ width: `${field.soilMoisture}%` }}
                                aria-valuenow={field.soilMoisture}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                role="progressbar"
                                aria-label={`${field.name} soil moisture level`}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SoilMoistureWidget;