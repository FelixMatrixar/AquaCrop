
import React from 'react';
import type { Field } from '../types';

const BackIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
);
const CameraIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.776 48.776 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
    </svg>
);
const PlusIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);
const MinusIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
    </svg>
);
const DropletIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.32 0L12 2.69zm0 13.89a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
    </svg>
);

const CropIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M21.6,3.2C21,2.5,20.1,2,19,2h-2.5C15.4,2,14.5,2.5,13.8,3.2l-2.8,2.8c-0.2,0.2-0.5,0.2-0.7,0L7.4,3.2 C6.8,2.5,5.9,2,4.8,2H2.3C1.2,2,0.3,2.5,0,3.2L0,3.5v17C0,21.3,0.7,22,1.5,22h21c0.8,0,1.5-0.7,1.5-1.5v-17L21.6,3.2z M10,18H8 v-4h2V18z M14,18h-2v-7h2V18z M18,18h-2V8h2V18z"/>
    </svg>
);


interface FieldDetailScreenProps {
  field: Field;
  onBack: () => void;
}

const FieldDetailScreen: React.FC<FieldDetailScreenProps> = ({ field, onBack }) => {
  return (
    <div className="h-screen w-screen bg-black flex items-center justify-center font-sans" style={{ backgroundColor: '#FBF8ED' }}>
      <div 
        className="relative w-full h-full max-w-sm mx-auto shadow-2xl overflow-hidden rounded-[2.5rem] bg-cover bg-center"
        style={{ backgroundImage: "url('https://i.imgur.com/GgS037s.jpeg')" }}
        aria-label="Aerial view of a farm field"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

        <div className="absolute top-0 left-0 right-0 p-5 flex justify-between items-start z-10">
          <button onClick={onBack} className="w-10 h-10 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors" aria-label="Go back">
            <BackIcon />
          </button>
          <div className="bg-black/20 backdrop-blur-sm rounded-full py-2 px-4 flex items-center space-x-2">
            <img src={field.imageUrl} alt={field.cropTypes[0]} className="w-8 h-8 rounded-full object-cover"/>
            <div>
              <p className="text-white font-semibold text-sm leading-tight truncate max-w-[120px]">{field.name}</p>
              <p className="text-white/80 text-xs leading-tight truncate max-w-[120px]">{field.cropTypes.join(', ')}</p>
            </div>
          </div>
        </div>

        <div className="absolute top-1/3 right-5 flex flex-col space-y-3 z-10">
          <button className="w-11 h-11 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors" aria-label="Camera view">
            <CameraIcon />
          </button>
          <button className="w-11 h-11 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors" aria-label="Zoom in">
            <PlusIcon />
          </button>
          <button className="w-11 h-11 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors" aria-label="Zoom out">
            <MinusIcon />
          </button>
        </div>

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[92%] bg-[#E0E0E0]/90 backdrop-blur-md rounded-2xl shadow-lg p-3 flex items-center space-x-3">
            <img src={field.imageUrl} alt={field.name} className="w-20 h-20 rounded-xl object-cover" />
            <div className="flex-1">
                <h3 className="font-bold text-lg text-[#7D9B33]">{field.name}</h3>
                <p className="text-sm text-[#4B6725] font-medium">Growth Stage: <span className="font-semibold">{field.growthStage}</span></p>
                <div className="flex items-center space-x-1.5 mt-1">
                    <DropletIcon className="text-[#7D9B33] w-5 h-5" />
                    <p className="font-bold text-base text-[#4B6725]">{field.soilMoisture}% Moisture</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default FieldDetailScreen;
