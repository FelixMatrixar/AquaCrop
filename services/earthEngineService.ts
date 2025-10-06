import type { Field } from '../types';

const getNdviForGrowthStage = (stage: Field['growthStage']): number => {
    // Returns a random NDVI value within a realistic range for the stage
    switch (stage) {
        case 'Seedling':
            return 0.2 + Math.random() * 0.1; // 0.2 - 0.3
        case 'Vegetative':
            return 0.5 + Math.random() * 0.2; // 0.5 - 0.7
        case 'Flowering':
            return 0.7 + Math.random() * 0.15; // 0.7 - 0.85
        case 'Maturity':
            return 0.6 + Math.random() * 0.15; // 0.6 - 0.75
        default:
            return 0.5;
    }
};

export const getSimulatedNdviForFields = async (fields: Field[]): Promise<Field[]> => {
    // Simulate a network request to a satellite data provider
    await new Promise(resolve => setTimeout(resolve, 800));

    return fields.map(field => ({
        ...field,
        ndvi: parseFloat(getNdviForGrowthStage(field.growthStage).toFixed(2)),
    }));
};
