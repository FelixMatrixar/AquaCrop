
import React from 'react';
import type { AgentLogEntry } from '../types';

interface AgentLogProps {
  logEntries: AgentLogEntry[];
}

const TerminalIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M4 3h16c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2zm2 14h12v-2H6v2zm0-4h5v-2H6v2z"/>
    </svg>
);


const AgentLog: React.FC<AgentLogProps> = ({ logEntries }) => {
    const getTypeStyles = (type: AgentLogEntry['type']) => {
        switch (type) {
            case 'ACTION': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
            case 'WARNING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'INFO': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200';
            default: return 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200';
        }
    };

    return (
        <div className="bg-white dark:bg-stone-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
                <TerminalIcon className="h-6 w-6 text-green-600 mr-3"/>
                <h2 className="text-xl font-bold text-amber-950 dark:text-white">Agent Log</h2>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {logEntries.map((entry, index) => (
                    <div key={index} className="flex items-start text-sm">
                        <div className="font-mono text-amber-500 dark:text-stone-400 mr-4 pt-0.5">
                            {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="flex-1 flex items-center">
                            <span className={`px-2.5 py-0.5 mr-2 text-xs font-semibold rounded-full ${getTypeStyles(entry.type)}`}>
                                {entry.type}
                            </span>
                            <span className="text-amber-800 dark:text-amber-200">{entry.message}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AgentLog;
