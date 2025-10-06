
import React, { useState, useEffect } from 'react';
import type { Field, SoilType, GrowthStage, FarmLocation } from '../types';
import FieldMap from './FieldMap';

interface FieldFormProps {
    field: Field | null;
    onSave: (field: Field | Omit<Field, 'id' | 'location' | 'soilMoisture' | 'soilMoistureHistory' | 'imageUrl'>) => void;
    onCancel: () => void;
    isAdding: boolean;
}

const soilTypes: SoilType[] = ['Clay', 'Sandy Loam', 'Silty Clay', 'Loam', 'Silt'];
const growthStages: GrowthStage[] = ['Seedling', 'Vegetative', 'Flowering', 'Maturity'];

const FieldForm: React.FC<FieldFormProps> = ({ field, onSave, onCancel, isAdding }) => {
    const [formData, setFormData] = useState({
        name: '',
        cropTypes: '',
        growthStage: 'Seedling' as GrowthStage,
        soilType: 'Loam' as SoilType,
        irrigationSystemType: 'Drip' as Field['irrigationSystemType'],
        flowRate: 0,
    });
    
    useEffect(() => {
        if (field) {
            setFormData({
                name: field.name,
                cropTypes: field.cropTypes.join(', '),
                growthStage: field.growthStage,
                soilType: field.soilType,
                irrigationSystemType: field.irrigationSystemType,
                flowRate: field.flowRate,
            });
        } else {
             setFormData({
                name: '',
                cropTypes: '',
                growthStage: 'Seedling',
                soilType: 'Loam',
                irrigationSystemType: 'Drip',
                flowRate: 0,
            });
        }
    }, [field]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'flowRate' ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalData = {
            name: formData.name,
            cropTypes: formData.cropTypes.split(',').map(s => s.trim()).filter(Boolean),
            growthStage: formData.growthStage,
            soilType: formData.soilType,
            irrigationSystemType: formData.irrigationSystemType,
            flowRate: formData.flowRate,
        };
        
        if (field) {
            onSave({ ...field, ...finalData });
        } else {
            onSave(finalData as Omit<Field, 'id' | 'location' | 'soilMoisture' | 'soilMoistureHistory' | 'imageUrl'>);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-bold text-amber-950 dark:text-white">{isAdding ? '2. Enter Field Details' : 'Edit Field'}</h3>
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-amber-800 dark:text-amber-200">Field Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-amber-300 dark:border-stone-600 bg-amber-50 dark:bg-stone-700 focus:border-green-500 focus:ring-green-500" required />
            </div>
            <div>
                <label htmlFor="cropTypes" className="block text-sm font-medium text-amber-800 dark:text-amber-200">Crop Types (comma-separated)</label>
                <input type="text" name="cropTypes" id="cropTypes" value={formData.cropTypes} onChange={handleChange} className="mt-1 block w-full rounded-md border-amber-300 dark:border-stone-600 bg-amber-50 dark:bg-stone-700 focus:border-green-500 focus:ring-green-500" required />
            </div>
             <div>
                <label htmlFor="growthStage" className="block text-sm font-medium text-amber-800 dark:text-amber-200">Growth Stage</label>
                <select name="growthStage" id="growthStage" value={formData.growthStage} onChange={handleChange} className="mt-1 block w-full rounded-md border-amber-300 dark:border-stone-600 bg-amber-50 dark:bg-stone-700 focus:border-green-500 focus:ring-green-500">
                    {growthStages.map(stage => (
                        <option key={stage} value={stage}>{stage}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="soilType" className="block text-sm font-medium text-amber-800 dark:text-amber-200">Soil Type</label>
                <select name="soilType" id="soilType" value={formData.soilType} onChange={handleChange} className="mt-1 block w-full rounded-md border-amber-300 dark:border-stone-600 bg-amber-50 dark:bg-stone-700 focus:border-green-500 focus:ring-green-500">
                    {soilTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="irrigationSystemType" className="block text-sm font-medium text-amber-800 dark:text-amber-200">Irrigation System</label>
                    <select name="irrigationSystemType" id="irrigationSystemType" value={formData.irrigationSystemType} onChange={handleChange} className="mt-1 block w-full rounded-md border-amber-300 dark:border-stone-600 bg-amber-50 dark:bg-stone-700 focus:border-green-500 focus:ring-green-500">
                        <option>Drip</option>
                        <option>Sprinkler</option>
                        <option>Pivot</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="flowRate" className="block text-sm font-medium text-amber-800 dark:text-amber-200">Flow Rate (GPM)</label>
                    <input type="number" name="flowRate" id="flowRate" value={formData.flowRate} onChange={handleChange} className="mt-1 block w-full rounded-md border-amber-300 dark:border-stone-600 bg-amber-50 dark:bg-stone-700 focus:border-green-500 focus:ring-green-500" required />
                </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-semibold text-amber-800 bg-amber-100 rounded-full hover:bg-amber-200 dark:bg-stone-700 dark:text-amber-200 dark:hover:bg-stone-600">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-full hover:bg-green-700">Save Field</button>
            </div>
        </form>
    );
};

const StatusIndicator: React.FC<{ moisture: number }> = ({ moisture }) => {
    const getStatus = (): { text: string; color: string } => {
        if (moisture > 60) return { text: 'Optimal', color: 'bg-green-500' };
        if (moisture > 30) return { text: 'Watch', color: 'bg-yellow-500' };
        return { text: 'Critical', color: 'bg-red-500' };
    };

    const { text, color } = getStatus();

    return (
        <div className="flex items-center space-x-2">
            <div className={`w-2.5 h-2.5 rounded-full ${color}`}></div>
            <span className="text-xs font-medium text-amber-700 dark:text-amber-300">{text}</span>
        </div>
    );
};

const LandscapeIcon: React.FC<{className: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 6l-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22L14 6z" />
  </svg>
);


interface FieldsProps {
    fields: Field[];
    farmLocation: FarmLocation;
    onUpdateField: (field: Field) => void;
    onAddField: (newField: Omit<Field, 'id' | 'soilMoisture' | 'soilMoistureHistory' | 'imageUrl'>) => void;
    onSelectField: (field: Field) => void;
}

export const Fields: React.FC<FieldsProps> = ({ fields, farmLocation, onUpdateField, onAddField, onSelectField }) => {
    const [editingField, setEditingField] = useState<Field | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newFieldLocation, setNewFieldLocation] = useState<{lat: number, lng: number} | null>(null);

    const handleOpenAddFieldModal = () => {
        setEditingField(null);
        setNewFieldLocation(null);
        setIsModalOpen(true);
    };
    
    const handleOpenEditFieldModal = (field: Field) => {
        setEditingField(field);
        setNewFieldLocation(field.location);
        setIsModalOpen(true);
    };

    const handleSave = (fieldData: Field | Omit<Field, 'id' | 'soilMoisture' | 'soilMoistureHistory' | 'imageUrl'>) => {
        if ('id' in fieldData) {
            onUpdateField(fieldData);
        } else {
            if (newFieldLocation) {
                const newField = { ...fieldData, location: newFieldLocation };
                onAddField(newField);
            }
        }
        setIsModalOpen(false);
        setEditingField(null);
        setNewFieldLocation(null);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingField(null);
        setNewFieldLocation(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                     <h1 className="text-3xl font-bold text-amber-950 dark:text-white">My Fields</h1>
                     <p className="text-amber-700 dark:text-amber-300">Farm Location: <span className="font-semibold">{farmLocation.name}</span></p>
                </div>
                 <button 
                    onClick={handleOpenAddFieldModal}
                    className="flex-shrink-0 px-5 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-full hover:bg-green-700 shadow-md"
                >
                    Add New Field
                </button>
            </div>

            <div className="space-y-4">
                {fields.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-stone-800 rounded-xl shadow-lg flex flex-col items-center">
                        <LandscapeIcon className="w-16 h-16 text-amber-400 dark:text-amber-500 mb-4" />
                        <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200">No fields added yet.</h3>
                        <p className="text-amber-600 dark:text-amber-400 mt-1">Let's create your first one!</p>
                        <button 
                            onClick={handleOpenAddFieldModal} 
                            className="mt-6 px-5 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-full hover:bg-green-700 shadow-md"
                        >
                            Add Your First Field
                        </button>
                    </div>
                ) : (
                    fields.map(field => (
                        <div key={field.id} className="bg-white dark:bg-stone-800 p-4 rounded-xl shadow-lg flex items-center space-x-4 cursor-pointer hover:shadow-xl transition-shadow" onClick={() => onSelectField(field)}>
                            <img src={field.imageUrl} alt={field.name} className="w-24 h-24 object-cover rounded-lg flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-amber-950 dark:text-white truncate">{field.name}</h3>
                                <p className="text-sm text-amber-700 dark:text-amber-300">{field.cropTypes.join(', ')}</p>
                                <p className="text-xs text-amber-600 dark:text-amber-400 capitalize">{field.growthStage} Stage</p>
                                <div className="mt-2">
                                    <StatusIndicator moisture={field.soilMoisture} />
                                </div>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); handleOpenEditFieldModal(field);}} className="self-start flex-shrink-0 mt-1 px-4 py-2 text-sm font-semibold text-amber-800 bg-amber-100 rounded-full hover:bg-amber-200 dark:bg-stone-700 dark:text-amber-200 dark:hover:bg-stone-600">
                                Edit
                            </button>
                        </div>
                    ))
                )}
            </div>

            {isModalOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
                    onClick={handleCancel}
                    aria-modal="true"
                    role="dialog"
                >
                    <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative" onClick={e => e.stopPropagation()}>
                        <button onClick={handleCancel} className="absolute top-3 right-3 text-amber-500 hover:text-amber-800 dark:text-stone-400 dark:hover:text-white z-10 p-2 rounded-full">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        
                        <div className="p-6 sm:p-8 space-y-6">
                            {!editingField && (
                                <div>
                                    <h3 className="text-lg font-bold text-amber-950 dark:text-white mb-2">1. Select Field Location</h3>
                                    <p className="text-sm text-amber-700 dark:text-amber-300 mb-4">Click on the map to place your new field.</p>
                                    <div className="rounded-lg overflow-hidden border border-amber-200 dark:border-stone-700">
                                        <FieldMap fields={fields} onMapClick={setNewFieldLocation} newFieldLocation={newFieldLocation} center={{lat: farmLocation.lat, lng: farmLocation.lng}} />
                                    </div>
                                </div>
                            )}

                            {((!editingField && newFieldLocation) || editingField) && (
                                <FieldForm 
                                    field={editingField}
                                    onSave={handleSave}
                                    onCancel={handleCancel}
                                    isAdding={!editingField}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};