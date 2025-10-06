import React from 'react';
import type { Field } from '../types';

const SatelliteIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM5 4h14v10H5V4zm4.5 12.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zm5 0c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
);


const VegetationHealthWidget: React.FC<{ fields: Field[]; onSelectField: (field: Field) => void }> = ({ fields, onSelectField }) => {

    const getBarColor = (ndvi: number) => {
        if (ndvi > 0.7) return 'bg-green-600';
        if (ndvi > 0.4) return 'bg-lime-500';
        return 'bg-yellow-600';
    };

    return (
        <div className="bg-white dark:bg-stone-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
                <SatelliteIcon className="h-6 w-6 text-green-500 mr-3"/>
                <h2 className="text-xl font-bold text-amber-950 dark:text-white">Vegetation Health (NDVI)</h2>
            </div>
            <div className="space-y-4">
                {fields.map(field => field.ndvi !== undefined && (
                    <div key={field.id} className="cursor-pointer hover:bg-amber-100/50 dark:hover:bg-stone-700/50 p-1 -m-1 rounded-lg" onClick={() => onSelectField(field)}>
                        <div className="flex justify-between items-center text-sm mb-1">
                            <span className="font-medium text-amber-800 dark:text-amber-300">{field.name}</span>
                            <span className="font-semibold text-amber-700 dark:text-amber-200 w-12 text-right">{field.ndvi.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-amber-100 dark:bg-stone-700 rounded-full h-2.5">
                            <div
                                className={`h-2.5 rounded-full transition-all duration-500 ${getBarColor(field.ndvi)}`}
                                style={{ width: `${field.ndvi * 100}%` }}
                                role="progressbar"
                                aria-valuenow={field.ndvi}
                                aria-valuemin={0}
                                aria-valuemax={1}
                                aria-label={`${field.name} NDVI level`}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
             <p className="text-xs text-amber-500 dark:text-stone-400 mt-4 text-right">Simulated Satellite Data</p>
        </div>
    );
};

export default VegetationHealthWidget;
