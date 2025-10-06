
import React from 'react';
import type { IrrigationEvent, Field } from '../types';

interface IrrigationScheduleProps {
  schedule: IrrigationEvent[];
  fields: Field[];
  onRefresh: () => void;
  isLoading: boolean;
}

const RefreshIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.664 0l3.181-3.183m-3.181-4.991-3.181-3.183a8.25 8.25 0 0 0-11.664 0l-3.181 3.183" />
    </svg>
);

const IrrigationSchedule: React.FC<IrrigationScheduleProps> = ({ schedule, fields, onRefresh, isLoading }) => {

    const getFieldName = (fieldId: string) => {
        return fields.find(f => f.id === fieldId)?.name || 'Unknown Field';
    }

  return (
    <div className="bg-white dark:bg-stone-800 rounded-xl shadow-lg p-6 bg-gradient-to-br from-amber-100/50 to-white dark:from-stone-800 dark:to-stone-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-amber-950 dark:text-white">AI Irrigation Schedule</h2>
        <button 
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center px-4 py-2 text-sm font-semibold text-green-600 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-amber-50 dark:bg-stone-700 dark:text-green-300 dark:hover:bg-stone-600 dark:border-stone-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <RefreshIcon className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Calculating...' : 'Recalculate'}
        </button>
      </div>
      <div className="overflow-x-auto min-h-[120px]">
        {isLoading && schedule.length === 0 ? (
             <div className="flex items-center justify-center h-28">
                <p className="text-amber-600 dark:text-amber-300">Sprout AI is generating schedule...</p>
            </div>
        ) : schedule.length === 0 ? (
            <div className="flex items-center justify-center h-28">
                <p className="text-amber-600 dark:text-amber-300">No irrigation events scheduled.</p>
            </div>
        ) : (
            <table className="w-full text-left">
            <thead>
                <tr className="border-b border-amber-200 dark:border-stone-700 text-sm text-amber-600 dark:text-amber-400">
                <th className="py-2 px-4 font-semibold">Field</th>
                <th className="py-2 px-4 font-semibold">Start Time</th>
                <th className="py-2 px-4 font-semibold">Duration</th>
                <th className="py-2 px-4 font-semibold">Status</th>
                </tr>
            </thead>
            <tbody>
                {schedule.map((event, index) => (
                <tr key={index} className="border-b border-amber-200 dark:border-stone-700 last:border-b-0">
                    <td className="py-3 px-4 font-medium text-amber-900 dark:text-amber-200">{getFieldName(event.fieldId)}</td>
                    <td className="py-3 px-4 text-amber-700 dark:text-amber-300">{event.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="py-3 px-4 text-amber-700 dark:text-amber-300">{event.durationMinutes} min</td>
                    <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        event.status === 'Scheduled' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        event.status === 'In Progress' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                        {event.status}
                    </span>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        )}
      </div>
    </div>
  );
};

export default IrrigationSchedule;
