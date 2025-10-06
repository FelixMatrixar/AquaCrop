



import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { View, Field, IrrigationEvent, AgentLogEntry, WeatherData, GrowthData, FarmLocation, AppUser, TourStep, UserPlan } from './types';
import { INITIAL_AGENT_LOG, GUEST_FARM_LOCATION, GUEST_FIELDS } from './constants';
import { getAIIrrigationSchedule, getAIGeneratedCropImage, getSproutAIFocus } from './services/geminiService';
import { getSimulatedNdviForFields } from './services/earthEngineService';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import { Fields } from './components/Fields';
import SproutAI from './components/SproutAI';
import FarmSetup from './components/FarmSetup';
import FieldDetailScreen from './components/FieldDetailScreen';
import Tour from './components/Tour';
import PricingScreen from './components/PricingScreen';
import { auth, db } from './services/firebase';
// Fix: Use Firebase v9 compat imports to resolve module export errors.
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


const LogoIcon: React.FC<{ className: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 6C14.0589 6 6 14.0589 6 24C6 33.9411 14.0589 42 24 42C33.9411 42 42 33.9411 42 24C42 16.5 37.5 10.5 31.5 8" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M31.5 16C34.5 16 36 14 36 11.5C36 9 34.5 8 31.5 8C28.5 8 27 9 27 11.5C27 14 28.5 16 31.5 16Z" fill="#16a34a" />
        <path d="M24 13C18.4772 13 14 17.4772 14 23C14 28.5228 18.4772 33 24 33" stroke="#f97316" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
const GoogleIcon: React.FC<{ className: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.223 0-9.657-3.657-11.303-8.591l-6.571 4.819C9.656 39.663 16.318 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C41.383 36.641 44 31.033 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
);

const LoginScreen: React.FC<{ onLogin: () => void; onGuestLogin: () => void; }> = ({ onLogin, onGuestLogin }) => {
    return (
        <div className="h-screen w-screen bg-amber-50 flex items-center justify-center font-sans">
            <div className="relative w-full h-full max-w-sm mx-auto bg-white shadow-2xl overflow-hidden rounded-[2.5rem]">
                <div
                    className="absolute bottom-0 left-0 right-0 h-3/4 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.pexels.com/photos/175389/pexels-photo-175389.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#A15B2A]/80 to-transparent"></div>
                
                <div className="relative h-full flex flex-col p-6 text-gray-800">
                     <div className="flex justify-between items-start opacity-0 animate-fade-in-1">
                        <LogoIcon className="h-9 w-9" />
                        <div className="bg-[#2E4823] text-white text-xs font-semibold px-3 py-1 rounded-full">
                            Ensuring Sustainable
                        </div>
                    </div>
                    <div className="mt-8 opacity-0 animate-fade-in-2">
                        <h2 className="text-lg font-bold text-white tracking-widest [text-shadow:1px_1px_3px_rgb(0_0_0_/_0.5)]">THE NEW ERA OF</h2>
                        <h1 className="text-5xl font-[900] leading-tight text-white [text-shadow:1px_1px_3px_rgb(0_0_0_/_0.5)]">
                            <span>AGRI</span>CULTURE
                        </h1>
                    </div>
                    <p className="mt-3 text-gray-200 text-sm max-w-xs opacity-0 animate-fade-in-3 [text-shadow:1px_1px_2px_rgb(0_0_0_/_0.5)]">
                        Sustainable farming solutions for a better tomorrow.
                    </p>
                    <div className="flex-grow"></div>
                    <div className="pb-6 space-y-3 opacity-0 animate-fade-in-6">
                        <button
                            onClick={onLogin}
                            className="w-full h-14 bg-white text-[#A15B2A] font-bold rounded-full shadow-xl transition-transform hover:scale-105 active:scale-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 flex items-center justify-center space-x-3"
                        >
                            <GoogleIcon className="w-6 h-6" />
                            <span>Sign in with Google</span>
                        </button>
                        <button
                            onClick={onGuestLogin}
                            className="w-full h-14 bg-transparent border-2 border-white text-white font-bold rounded-full shadow-xl transition-transform hover:scale-105 active:scale-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                        >
                            Continue as Guest
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const LoadingScreen: React.FC<{ message: string }> = ({ message }) => (
    <div className="h-screen w-screen bg-amber-50 flex flex-col items-center justify-center font-sans text-amber-800">
        <LogoIcon className="h-16 w-16 animate-pulse" />
        <p className="mt-4 text-lg font-semibold">{message}</p>
    </div>
);


const App: React.FC = () => {
    const [user, setUser] = useState<AppUser | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [isGuestMode, setIsGuestMode] = useState(false);
    const [farmId, setFarmId] = useState<string | null>(null);
    const [farmLocation, setFarmLocation] = useState<FarmLocation | null>(null);
    const [isFarmLoading, setIsFarmLoading] = useState(true);
    
    const [activeView, setActiveView] = useState<View>('DASHBOARD');
    const [selectedField, setSelectedField] = useState<Field | null>(null);
    const [fields, setFields] = useState<Field[]>([]);
    const [schedule, setSchedule] = useState<IrrigationEvent[]>([]);
    const [agentLog, setAgentLog] = useState<AgentLogEntry[]>(INITIAL_AGENT_LOG);
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [growthData, setGrowthData] = useState<GrowthData | null>(null);
    const [isScheduleLoading, setIsScheduleLoading] = useState(false);
    const [aiFocusMessage, setAiFocusMessage] = useState<string>('');
    const [isAiFocusLoading, setIsAiFocusLoading] = useState(false);
    const initialScheduleGenerated = useRef(false);

    // Pro Feature State
    const [notificationPermission, setNotificationPermission] = useState(Notification.permission);
    const notifiedLowMoistureFields = useRef(new Set<string>());
    const notifiedEvents = useRef(new Set<string>());

    // Tour state
    const [isTourActive, setIsTourActive] = useState(false);
    const [tourStep, setTourStep] = useState(0);
  
  useEffect(() => {
    // Fix: Use compat API for onAuthStateChanged
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setIsGuestMode(false);
        // Fix: Use compat API for Firestore
        const userDocRef = db.collection('users').doc(firebaseUser.uid);
        // Fix: Use compat API for Firestore
        const userDocSnap = await userDocRef.get();
        let userPlan: UserPlan = 'TANI_DASAR';

        // Fix: Use compat API for Firestore (exists is a property)
        if (!userDocSnap.exists) {
          // Create a new user document in Firestore if it doesn't exist
          // Fix: Use compat API for Firestore
          await userDocRef.set({
            displayName: firebaseUser.displayName,
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
            plan: 'TANI_DASAR', // New users start on the free plan
            // Fix: Use compat API for Firestore
            createdAt: firebase.firestore.Timestamp.now(),
          });
        } else {
            userPlan = userDocSnap.data()?.plan || 'TANI_DASAR';
        }
        
        // Fix: Use compat API for Firestore
        const farmDocRef = db.collection('farms').doc(firebaseUser.uid);
        // Fix: Use compat API for Firestore
        const farmDocSnap = await farmDocRef.get();
        // Fix: Use compat API for Firestore (exists is a property)
        if (farmDocSnap.exists) {
            setFarmId(farmDocSnap.id);
            setFarmLocation(farmDocSnap.data() as FarmLocation);
        }

        setUser({
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName,
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
            plan: userPlan,
        });
        setIsFarmLoading(false);
      } else {
        if (!isGuestMode) {
            setUser(null);
            setFarmLocation(null);
            setFarmId(null);
            setFields([]);
        }
      }
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, [isGuestMode]);
  
    useEffect(() => {
        if (!farmId || isGuestMode) {
            setFields(isGuestMode ? GUEST_FIELDS : []);
            return;
        };

        // Fix: Use compat API for Firestore
        const fieldsQuery = db.collection(`farms/${farmId}/fields`);
        // Fix: Use compat API for Firestore
        const unsubscribe = fieldsQuery.onSnapshot((querySnapshot) => {
            const fieldsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Field));
            setFields(fieldsData);
        });

        return () => unsubscribe();
    }, [farmId, isGuestMode]);
  
  const handleLogin = async () => {
    // Fix: Use compat API for GoogleAuthProvider
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      // Fix: Use compat API for signInWithPopup
      await auth.signInWithPopup(provider);
    } catch (error) {
      console.error("Authentication failed:", error);
    }
  };

  const handleGuestLogin = () => {
      setIsGuestMode(true);
      setUser({
          uid: 'guest',
          displayName: 'Guest Farmer',
          email: null,
          photoURL: 'https://storage.googleapis.com/maker-suite-gallery/aquacrop-previews/guest-avatar.png',
          plan: 'TANI_DASAR',
      });
      setFarmLocation(GUEST_FARM_LOCATION);
      setFields(GUEST_FIELDS);
      setIsAuthLoading(false);
      setIsFarmLoading(false);
      setIsTourActive(true); // Start the tour for guests
  };

  const handleLogout = async () => {
      if (isGuestMode) {
          setIsGuestMode(false);
          setUser(null);
          setFarmLocation(null);
          setFields([]);
      } else {
        try {
            // Fix: Use compat API for signOut
            await auth.signOut();
        } catch (error) {
            console.error("Sign out failed:", error);
        }
      }
  };
  
  const handleSetFarmLocation = async (location: FarmLocation) => {
      if (!user || isGuestMode) return;
      // Fix: Use compat API for Firestore
      const farmDocRef = db.collection('farms').doc(user.uid);
      // Fix: Use compat API for Firestore
      await farmDocRef.set(location);
      setFarmId(user.uid);
      setFarmLocation(location);
  };
  
  const addAgentLogEntry = useCallback((message: string, type: 'INFO' | 'ACTION' | 'WARNING' = 'ACTION') => {
    setAgentLog(prevLog => [
      { timestamp: new Date(), message, type },
      ...prevLog,
    ]);
  }, []);

  const generateSchedule = useCallback(async () => {
    if (!weatherData || !growthData || fields.length === 0) {
        return;
    }
    
    setIsScheduleLoading(true);
    addAgentLogEntry("Sprout AI is analyzing real-time weather and crop data...", "INFO");

    try {
        let fieldsForCalculation = fields;
        // Satellite data is a pro feature
        if (user?.plan === 'MANAJER_PRO') {
            addAgentLogEntry("Fetching satellite vegetation data (Pro Feature)...", "INFO");
            // The NDVI data is now only used for this calculation and not persisted
            // back to the main 'fields' state to prevent re-render loops.
            fieldsForCalculation = await getSimulatedNdviForFields(fields);
            addAgentLogEntry("Sprout AI has generated a new irrigation schedule based on satellite vegetation data.", "ACTION");
        } else {
            addAgentLogEntry("Generated basic irrigation schedule. Upgrade to Pro for satellite data optimization.", "ACTION");
        }

        // Generate schedule with the new data
        const newSchedule = await getAIIrrigationSchedule(fieldsForCalculation, weatherData, growthData);
        setSchedule(newSchedule);

    } catch (error) {
        console.error("Failed to generate AI schedule:", error);
        addAgentLogEntry("Failed to generate an AI-powered irrigation schedule. Please review conditions and try again.", "WARNING");
    } finally {
        setIsScheduleLoading(false);
    }
  }, [fields, weatherData, growthData, addAgentLogEntry, user?.plan]);

  const generateAIFocus = useCallback(async () => {
    if (!weatherData || fields.length === 0 || schedule.length === 0) {
        return;
    }
    setIsAiFocusLoading(true);
    try {
        const focusMessage = await getSproutAIFocus(weatherData, fields, schedule);
        setAiFocusMessage(focusMessage);
    } catch (error) {
        console.error("Failed to generate AI focus message:", error);
        setAiFocusMessage("Could not retrieve AI focus. System is monitoring conditions.");
    }
    setIsAiFocusLoading(false);
  }, [weatherData, fields, schedule]);

  // Fetch real-time environmental data from Open-Meteo
  useEffect(() => {
    if (!farmLocation) return;
    
    const fetchEnvironmentalData = async () => {
      const { lat, lng } = farmLocation;
      try {
        const params = new URLSearchParams({
            latitude: lat.toString(),
            longitude: lng.toString(),
            current: 'temperature_2m,relative_humidity_2m,wind_speed_10m',
            // Note: soil_moisture_0_to_7cm is removed as it's not available for forecast models and causes API errors.
            daily: 'et0_fao_evapotranspiration,precipitation_sum,shortwave_radiation_sum',
            temperature_unit: 'fahrenheit',
            wind_speed_unit: 'mph',
            precipitation_unit: 'inch',
            forecast_days: '1',
            timezone: 'auto'
        });

        const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch environmental data from Open-Meteo');
        const data = await response.json();

        if (data.current && data.daily) {
            // Update Weather Data
            const et0_mm = data.daily.et0_fao_evapotranspiration[0];
            const et0_inches = et0_mm / 25.4;
            setWeatherData({
                temperature: Math.round(data.current.temperature_2m),
                precipitation: data.daily.precipitation_sum[0],
                windSpeed: Math.round(data.current.wind_speed_10m),
                relativeHumidity: data.current.relative_humidity_2m,
                et0: parseFloat(et0_inches.toFixed(2)),
            });

            // Update Growth Data
            const newGrowthData: GrowthData = {
               solarRadiation: data.daily.shortwave_radiation_sum[0] / 1000, // Wh/m² to kWh/m²/day
               temperature: Math.round(data.current.temperature_2m),
            };
            
            // Safely access soil moisture data, which is no longer fetched to prevent errors.
            const soilMoistureValues = data.daily.soil_moisture_0_to_7cm;
            const soilMoistureVol = (soilMoistureValues && soilMoistureValues.length > 0) ? soilMoistureValues[0] : null;

            if (soilMoistureVol !== null && soilMoistureVol > -999 && !isGuestMode) { // Open-Meteo uses null for no-data. Don't override guest data.
                const soilMoisturePercent = Math.round(soilMoistureVol * 100);
                newGrowthData.soilMoisture = soilMoisturePercent;
                
                // Update fields with new baseline moisture from remote sensing data
                setFields(currentFields => currentFields.map(field => {
                    const newHistory = [...field.soilMoistureHistory.slice(1), soilMoisturePercent];
                    return {...field, soilMoisture: soilMoisturePercent, soilMoistureHistory: newHistory};
                }));
                addAgentLogEntry(`Calibrated soil moisture to ${soilMoisturePercent}% from Open-Meteo data.`, "INFO");
            }
            setGrowthData(newGrowthData);
        }
      } catch (error) {
        console.error("Could not fetch Open-Meteo data:", error);
        addAgentLogEntry("Failed to fetch real-time environmental data.", "WARNING");
      }
    };
    
    fetchEnvironmentalData();
    const interval = setInterval(() => {
        fetchEnvironmentalData();
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
    
  }, [addAgentLogEntry, farmLocation, isGuestMode]);
  
  // Initial schedule generation
  useEffect(() => {
    // This effect should only run once to generate the very first schedule.
    // The ref prevents re-running on failures which could cause an infinite loop.
    if(weatherData && growthData && fields.length > 0 && schedule.length === 0 && !isScheduleLoading && !initialScheduleGenerated.current) {
        initialScheduleGenerated.current = true;
        generateSchedule();
    }
  }, [weatherData, growthData, fields.length, schedule.length, isScheduleLoading, generateSchedule]);
  
  // Periodic 10-minute schedule refresh
  useEffect(() => {
    const intervalId = setInterval(() => {
        generateSchedule();
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(intervalId);
  }, [generateSchedule]);

  useEffect(() => {
    // Generate focus after schedule is created or updated, or fields change
    if (!isScheduleLoading && weatherData && fields.length > 0 && schedule.length > 0) {
        generateAIFocus();
    }
  }, [isScheduleLoading, weatherData, fields, schedule, generateAIFocus]);

    // Pro Feature: Low Soil Moisture Notifications
    useEffect(() => {
        if (user?.plan !== 'MANAJER_PRO' || notificationPermission !== 'granted') return;

        fields.forEach(field => {
            if (field.soilMoisture < 35 && !notifiedLowMoistureFields.current.has(field.id)) {
                new Notification('AquaCrop: Critical Soil Moisture Alert', {
                    body: `${field.name} has reached a critical moisture level of ${field.soilMoisture}%.`,
                    icon: 'https://storage.googleapis.com/maker-suite-gallery/aquacrop-previews/droplet-icon.png',
                    tag: `low-moisture-${field.id}`
                });
                notifiedLowMoistureFields.current.add(field.id);
            } else if (field.soilMoisture >= 40) { // Reset when moisture is restored
                notifiedLowMoistureFields.current.delete(field.id);
            }
        });
    }, [fields, user, notificationPermission]);

    // Pro Feature: Irrigation Start Reminders
    useEffect(() => {
        if (user?.plan !== 'MANAJER_PRO' || notificationPermission !== 'granted' || schedule.length === 0) {
            notifiedEvents.current.clear(); // Clear old notifications if plan changes or schedule is empty
            return;
        }

        const checkInterval = setInterval(() => {
            const now = new Date();
            schedule.forEach(event => {
                const eventId = `${event.fieldId}-${event.startTime.toISOString()}`;
                if (notifiedEvents.current.has(eventId) || event.status !== 'Scheduled') return;

                const timeDiffMinutes = (event.startTime.getTime() - now.getTime()) / (1000 * 60);
                
                // Notify between 5 and 10 minutes before the event
                if (timeDiffMinutes > 5 && timeDiffMinutes <= 10) {
                    const fieldName = fields.find(f => f.id === event.fieldId)?.name || 'Unknown Field';
                    new Notification('AquaCrop: Irrigation Reminder', {
                        body: `Irrigation for ${fieldName} is scheduled to start in approximately ${Math.round(timeDiffMinutes)} minutes.`,
                        icon: 'https://storage.googleapis.com/maker-suite-gallery/aquacrop-previews/droplet-icon.png',
                        tag: `reminder-${eventId}`
                    });
                    notifiedEvents.current.add(eventId);
                }
            });
        }, 30 * 1000); // Check every 30 seconds

        return () => clearInterval(checkInterval);

    }, [schedule, fields, user, notificationPermission]);

    const handleUpdateField = useCallback(async (updatedField: Field) => {
        if (isGuestMode) {
            alert("Guest mode is read-only. Please sign in to manage your own farm.");
            return;
        }
        if (!farmId || !updatedField.id) return;
        // Fix: Use compat API for Firestore
        const fieldDocRef = db.collection(`farms/${farmId}/fields`).doc(updatedField.id);
        const { id, ...fieldData } = updatedField;
        // Fix: Use compat API for Firestore
        await fieldDocRef.update(fieldData);
        addAgentLogEntry(`Field "${updatedField.name}" configuration updated. Re-evaluating irrigation models.`);
        generateSchedule();
    }, [addAgentLogEntry, generateSchedule, farmId, isGuestMode]);

    const handleAddField = useCallback(async (newField: Omit<Field, 'id' | 'soilMoisture' | 'soilMoistureHistory' | 'imageUrl'>) => {
        if (isGuestMode) {
            alert("Guest mode is read-only. Please sign in to manage your own farm.");
            return;
        }
        if (!user || !farmId) return;

        addAgentLogEntry(`Generating image for new field: ${newField.name}...`, "INFO");
        const base64Image = await getAIGeneratedCropImage(newField.cropTypes[0] || 'farm field', newField.growthStage);
        
        addAgentLogEntry(`Storing image data in database...`, "INFO");

        const fieldWithData: Omit<Field, 'id'> = {
            ...newField,
            soilMoisture: 50,
            soilMoistureHistory: [50, 50, 50, 50, 50],
            imageUrl: base64Image,
        };
        
        // Fix: Use compat API for Firestore
        await db.collection(`farms/${farmId}/fields`).add(fieldWithData);

        addAgentLogEntry(`New field "${newField.name}" added. Integrating into schedule.`);
        generateSchedule();
    }, [addAgentLogEntry, generateSchedule, user, farmId, isGuestMode]);

  const handleSelectField = (field: Field) => {
    setSelectedField(field);
    setActiveView('FIELD_DETAIL');
  };

  const handleBack = () => {
    setSelectedField(null);
    setActiveView('FIELDS'); // Go back to the fields list
  };

  const handleUpgradeSuccess = () => {
      if (!user) return;

      const upgradedUser: AppUser = { ...user, plan: 'MANAJER_PRO' };
      setUser(upgradedUser);

      if (!isGuestMode) {
          db.collection('users').doc(user.uid).update({ plan: 'MANAJER_PRO' });
      }

      setActiveView('DASHBOARD');
      addAgentLogEntry("Upgraded to Manajer Pro! Smart Alerts are now active.", "ACTION");

      // Request notification permission after upgrade
      if (Notification.permission === 'default') {
          Notification.requestPermission().then(permission => {
              setNotificationPermission(permission);
              if (permission === 'granted') {
                  new Notification('AquaCrop Notifications Enabled!', {
                      body: 'You will now receive smart alerts for your farm.',
                      icon: 'https://storage.googleapis.com/maker-suite-gallery/aquacrop-previews/droplet-icon.png'
                  });
              }
          });
      }
  };

    const tourSteps: TourStep[] = [
        {
            target: '#tour-step-1',
            content: "Welcome to AquaCrop! This is the AI Irrigation Schedule. Sprout AI analyzes live weather and field data to create an optimal watering plan, saving you time and resources.",
        },
        {
            target: '#tour-step-2',
            content: "This is Sprout AI's daily focus. It highlights the most critical insight or action for your farm today, so you always know what to prioritize.",
        },
        {
            target: '#tour-step-3',
            content: "The Soil Moisture widget gives you a quick overview of all your fields. The sparkline shows recent trends, helping you spot issues at a glance.",
        },
        {
            target: '#tour-step-4',
            content: "These widgets show live environmental data from real-world sources, which powers all of the AI's calculations.",
        },
        {
            target: '#tour-step-5',
            content: "Click on 'My Fields' to see a list of all fields on this farm. In guest mode, we've pre-loaded some for you to explore.",
            onBefore: () => setActiveView('DASHBOARD'),
        },
        {
            target: '#tour-step-6',
            content: "Have a question? Open the Sprout AI chat to ask about farm operations, schedules, or data analysis. Try asking 'Which field is the driest?'",
            onBefore: () => setActiveView('DASHBOARD'),
        }
    ];

    if (isAuthLoading) {
        return <LoadingScreen message="Initializing AquaCrop..." />;
    }
    
    if (!user) {
        return <LoginScreen onLogin={handleLogin} onGuestLogin={handleGuestLogin} />;
    }

    if (isFarmLoading) {
        return <LoadingScreen message="Loading your farm data..." />;
    }
    
    if (!farmLocation) {
        return <FarmSetup onLocationSet={handleSetFarmLocation} />;
    }
  
  if (activeView === 'FIELD_DETAIL' && selectedField) {
    return <FieldDetailScreen field={selectedField} onBack={handleBack} />;
  }

  const renderContent = () => {
    switch (activeView) {
      case 'DASHBOARD':
        return (
            <Dashboard 
                schedule={schedule} 
                agentLog={agentLog} 
                fields={fields}
                onRefreshSchedule={generateSchedule}
                isScheduleLoading={isScheduleLoading}
                onSelectField={handleSelectField}
                aiFocusMessage={aiFocusMessage}
                isAiFocusLoading={isAiFocusLoading}
                weather={weatherData}
                growthData={growthData}
            />
        );
      case 'FIELDS':
        return (
            <Fields 
                fields={fields} 
                farmLocation={farmLocation!}
                onUpdateField={handleUpdateField} 
                onAddField={handleAddField}
                onSelectField={handleSelectField}
            />
        );
      case 'SPROUT_AI':
        return <SproutAI fields={fields} schedule={schedule} agentLog={agentLog} />;
      case 'PRICING':
        return <PricingScreen onBack={() => setActiveView('DASHBOARD')} onUpgradeSuccess={handleUpgradeSuccess} />;
      default:
        return <Dashboard 
            schedule={schedule} 
            agentLog={agentLog} 
            fields={fields} 
            onRefreshSchedule={generateSchedule}
            isScheduleLoading={isScheduleLoading}
            onSelectField={handleSelectField}
            aiFocusMessage={aiFocusMessage}
            isAiFocusLoading={isAiFocusLoading}
            weather={weatherData}
            growthData={growthData}
        />;
    }
  };


  return (
    <div className="min-h-screen bg-amber-50 text-amber-950 dark:bg-stone-900 dark:text-amber-100 font-sans">
        <Tour 
            isOpen={isTourActive}
            steps={tourSteps}
            stepIndex={tourStep}
            onClose={() => setIsTourActive(false)}
            onNext={() => setTourStep(s => s + 1)}
        />
        <Header 
            activeView={activeView} 
            setActiveView={setActiveView} 
            onLogout={handleLogout} 
            user={user} 
            onUpgrade={() => setActiveView('PRICING')}
        />
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {renderContent()}
        </main>
    </div>
  );
};

export default App;