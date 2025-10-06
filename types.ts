


export type View = 'DASHBOARD' | 'FIELDS' | 'SPROUT_AI' | 'FIELD_DETAIL' | 'PRICING';

export type SoilType = 'Clay' | 'Sandy Loam' | 'Silty Clay' | 'Loam' | 'Silt';
export type GrowthStage = 'Seedling' | 'Vegetative' | 'Flowering' | 'Maturity';
export type UserPlan = 'TANI_DASAR' | 'MANAJER_PRO';

export interface Field {
  id: string;
  name: string;
  cropTypes: string[];
  growthStage: GrowthStage;
  soilType: SoilType;
  irrigationSystemType: 'Drip' | 'Sprinkler' | 'Pivot';
  flowRate: number; // in gallons per minute
  location: {
    lat: number;
    lng: number;
  };
  soilMoisture: number; // as a percentage
  soilMoistureHistory: number[]; // array of recent moisture levels
  imageUrl: string;
  ndvi?: number; // Normalized Difference Vegetation Index
}

export interface IrrigationEvent {
  fieldId: string;
  startTime: Date;
  durationMinutes: number;
  status: 'Scheduled' | 'In Progress' | 'Completed';
}

export interface AgentLogEntry {
  timestamp: Date;
  message: string;
  type: 'INFO' | 'WARNING' | 'ACTION';
}

export interface ChatMessage {
    id: string;
    sender: 'USER' | 'AI';
    text: string;
    isLoading?: boolean;
}

export interface WeatherData {
    temperature: number;
    precipitation: number;
    windSpeed: number;
    relativeHumidity: number;
    et0: number; // Reference Evapotranspiration in inches/day
}

export interface GrowthData {
    solarRadiation: number; // in kW-hr/m^2/day
    temperature: number; // in Fahrenheit
    soilMoisture?: number; // as a percentage
}

export interface FarmLocation {
  name: string;
  lat: number;
  lng: number;
}

export interface AppUser {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
    plan: UserPlan;
}

export interface TourStep {
    target: string;
    content: string;
    onBefore?: () => void;
}