
import type { Field, IrrigationEvent, AgentLogEntry, FarmLocation } from './types';

export const INITIAL_FIELDS: Field[] = [];

export const INITIAL_SCHEDULE: IrrigationEvent[] = [];

export const INITIAL_AGENT_LOG: AgentLogEntry[] = [
    { 
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), 
        message: "System initialized and contexts loaded.", 
        type: 'INFO' 
    },
    {
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        message: "Analyzed Open-Meteo forecast: 0% precipitation expected in next 24h. Maintained current irrigation schedule.",
        type: 'INFO',
    },
    {
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        message: "Adjusted Southern Field's schedule due to high ET readings from OpenET. Increased duration by 15 minutes.",
        type: 'ACTION',
    },
];

export const GUEST_FARM_LOCATION: FarmLocation = {
    name: 'Fresno, California, USA',
    lat: 36.746842,
    lng: -119.772591,
};

export const GUEST_FIELDS: Field[] = [
    {
        id: 'guest-field-1',
        name: 'North-East Almond Orchard',
        cropTypes: ['Almonds'],
        growthStage: 'Flowering',
        soilType: 'Sandy Loam',
        irrigationSystemType: 'Drip',
        flowRate: 500,
        location: { lat: 36.75, lng: -119.77 },
        soilMoisture: 48,
        soilMoistureHistory: [55, 52, 50, 49, 48],
        imageUrl: 'https://storage.googleapis.com/maker-suite-gallery/aquacrop-previews/almonds.png',
    },
    {
        id: 'guest-field-2',
        name: 'Central Tomato Patch',
        cropTypes: ['Tomatoes'],
        growthStage: 'Vegetative',
        soilType: 'Loam',
        irrigationSystemType: 'Drip',
        flowRate: 300,
        location: { lat: 36.745, lng: -119.775 },
        soilMoisture: 65,
        soilMoistureHistory: [60, 62, 63, 66, 65],
        imageUrl: 'https://storage.googleapis.com/maker-suite-gallery/aquacrop-previews/tomatoes.png',
    },
    {
        id: 'guest-field-3',
        name: 'Western Cornfield',
        cropTypes: ['Corn'],
        growthStage: 'Maturity',
        soilType: 'Silty Clay',
        irrigationSystemType: 'Pivot',
        flowRate: 800,
        location: { lat: 36.748, lng: -119.78 },
        soilMoisture: 35,
        soilMoistureHistory: [48, 45, 41, 38, 35],
        imageUrl: 'https://storage.googleapis.com/maker-suite-gallery/aquacrop-previews/corn.png',
    },
];