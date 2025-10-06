

import React from 'react';
import type { IrrigationEvent, AgentLogEntry, Field, WeatherData, GrowthData } from '../types';
import IrrigationSchedule from './IrrigationSchedule';
import AgentLog from './AgentLog';
import SoilMoistureWidget from './SoilMoistureWidget';
import SproutAIFocusWidget from './SproutAIFocusWidget';
import CurrentConditionsWidget from './CurrentConditionsWidget';
import GrowthConditionsWidget from './GrowthConditionsWidget';

interface DashboardProps {
  schedule: IrrigationEvent[];
  agentLog: AgentLogEntry[];
  fields: Field[];
  onRefreshSchedule: () => void;
  isScheduleLoading: boolean;
  onSelectField: (field: Field) => void;
  aiFocusMessage: string;
  isAiFocusLoading: boolean;
  weather: WeatherData | null;
  growthData: GrowthData | null;
}

const Dashboard: React.FC<DashboardProps> = ({ 
    schedule, 
    agentLog, 
    fields, 
    onRefreshSchedule, 
    isScheduleLoading, 
    onSelectField, 
    aiFocusMessage, 
    isAiFocusLoading,
    weather,
    growthData,
}) => {
  return (
    <div className="space-y-6">
       <div className="text-left">
        <h1 className="text-2xl font-bold text-amber-950 dark:text-white">Hello, Farmer!</h1>
        <p className="text-amber-700 dark:text-amber-300">Here's an overview of your farm's status.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <div id="tour-step-1">
                <IrrigationSchedule 
                    schedule={schedule} 
                    fields={fields} 
                    onRefresh={onRefreshSchedule}
                    isLoading={isScheduleLoading}
                />
            </div>
            <div id="tour-step-2">
                <SproutAIFocusWidget message={aiFocusMessage} isLoading={isAiFocusLoading} />
            </div>
            <AgentLog logEntries={agentLog} />
        </div>
        <div className="space-y-6">
            <div id="tour-step-3">
                <SoilMoistureWidget fields={fields} onSelectField={onSelectField} />
            </div>
            <div id="tour-step-4" className="space-y-6">
                <CurrentConditionsWidget weather={weather} />
                <GrowthConditionsWidget weather={weather} growthData={growthData} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;