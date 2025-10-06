
import React from 'react';

const SproutAIBotIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.59c0 .55-.45 1-1 1s-1-.45-1-1v-2.09c-1.39-.4-2.48-1.49-2.88-2.88H3.41c-.55 0-1-.45-1-1s.45-1 1-1h2.09c.4-1.39 1.49-2.48 2.88-2.88V5.41c0-.55.45-1 1-1s1 .45 1 1v2.09c1.39.4 2.48 1.49 2.88 2.88h7.21c.55 0 1 .45 1 1s-.45 1-1 1h-7.21c-.4 1.39-1.49 2.48-2.88 2.88v2.09z"/>
        <path d="M12 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" opacity=".5"/>
    </svg>
);

interface SproutAIFocusWidgetProps {
    message: string;
    isLoading: boolean;
}

const SproutAIFocusWidget: React.FC<SproutAIFocusWidgetProps> = ({ message, isLoading }) => {
    // A simple markdown-like parser for **bold** text
    const formatMessage = (text: string) => {
        if (!text) return '';
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    return (
        <div className="bg-white dark:bg-stone-800 rounded-xl shadow-lg p-6 bg-gradient-to-br from-white to-green-50 dark:from-stone-800 dark:to-stone-900/50">
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 bg-green-100 dark:bg-green-900 p-3 rounded-full">
                    <SproutAIBotIcon className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold text-amber-950 dark:text-white mb-2">Sprout AI's Focus</h2>
                    {isLoading ? (
                         <div className="space-y-2">
                            <div className="h-4 bg-amber-100 dark:bg-stone-700 rounded w-3/4 animate-pulse"></div>
                            <div className="h-4 bg-amber-100 dark:bg-stone-700 rounded w-1/2 animate-pulse"></div>
                        </div>
                    ) : (
                        <p className="text-amber-800 dark:text-amber-200">
                           {formatMessage(message)}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SproutAIFocusWidget;
