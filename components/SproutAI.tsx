import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage, Field, IrrigationEvent, AgentLogEntry } from '../types';
import { getSproutAIResponse } from '../services/geminiService';

interface SproutAIProps {
    fields: Field[];
    schedule: IrrigationEvent[];
    agentLog: AgentLogEntry[];
}

const BotIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.59c0 .55-.45 1-1 1s-1-.45-1-1v-2.09c-1.39-.4-2.48-1.49-2.88-2.88H3.41c-.55 0-1-.45-1-1s.45-1 1-1h2.09c.4-1.39 1.49-2.48 2.88-2.88V5.41c0-.55.45-1 1-1s1 .45 1 1v2.09c1.39.4 2.48 1.49 2.88 2.88h7.21c.55 0 1 .45 1 1s-.45 1-1 1h-7.21c-.4 1.39-1.49 2.48-2.88 2.88v2.09z"/>
        <path d="M12 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" opacity=".5"/>
    </svg>
);

const UserIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
);


const SproutAI: React.FC<SproutAIProps> = ({ fields, schedule, agentLog }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 'initial', sender: 'AI', text: "Hello! I'm Sprout AI. Ask me anything about your farm's operations, and I'll analyze the data for you." }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { id: `user-${Date.now()}`, sender: 'USER', text: input };
        const aiLoadingMessage: ChatMessage = { id: `ai-loading-${Date.now()}`, sender: 'AI', text: "Thinking...", isLoading: true };
        
        setMessages(prev => [...prev, userMessage, aiLoadingMessage]);
        setInput('');
        setIsLoading(true);

        const aiResponseText = await getSproutAIResponse(input, fields, schedule, agentLog);

        const aiResponseMessage: ChatMessage = { id: `ai-response-${Date.now()}`, sender: 'AI', text: aiResponseText };
        
        setMessages(prev => {
            const newMessages = prev.filter(msg => !msg.isLoading);
            return [...newMessages, aiResponseMessage];
        });
        setIsLoading(false);
    };

    return (
        <div className="bg-white dark:bg-stone-800 rounded-xl shadow-lg flex flex-col h-[calc(100vh-14rem)]">
            <div className="p-4 border-b dark:border-stone-700 flex items-center space-x-3">
                 <BotIcon className="w-8 h-8 text-green-600"/>
                <h2 className="text-xl font-bold text-amber-950 dark:text-white">Chat with Sprout AI</h2>
            </div>
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex items-start gap-4 ${msg.sender === 'USER' ? 'justify-end' : ''}`}>
                        {msg.sender === 'AI' && <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0"><BotIcon className="w-6 h-6 text-green-600 dark:text-green-300"/></div>}
                        <div className={`max-w-xl p-4 rounded-xl ${
                            msg.sender === 'AI' 
                            ? 'bg-amber-100 dark:bg-stone-700 text-amber-950 dark:text-amber-200' 
                            : 'bg-green-600 text-white'
                        }`}>
                            {msg.isLoading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-2.5 h-2.5 bg-stone-400 rounded-full animate-pulse"></div>
                                    <div className="w-2.5 h-2.5 bg-stone-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                                    <div className="w-2.5 h-2.5 bg-stone-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                                </div>
                            ) : (
                                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            )}
                        </div>
                        {msg.sender === 'USER' && <div className="w-10 h-10 rounded-full bg-amber-200 dark:bg-stone-600 flex items-center justify-center flex-shrink-0"><UserIcon className="w-6 h-6 text-amber-700 dark:text-amber-300"/></div>}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t dark:border-stone-700 bg-amber-50 dark:bg-stone-800 rounded-b-xl">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Why did you change the schedule for the cornfield?"
                        className="flex-1 block w-full rounded-full border-amber-300 dark:border-stone-600 bg-white dark:bg-stone-700 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm pl-4 pr-12 py-2.5"
                        disabled={isLoading}
                    />
                    <button type="submit" className="px-5 py-2.5 text-sm font-semibold text-white bg-green-600 border border-transparent rounded-full shadow-sm hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed" disabled={isLoading}>
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SproutAI;