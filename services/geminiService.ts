
import { GoogleGenAI, Type } from "@google/genai";
import type { Field, IrrigationEvent, AgentLogEntry, WeatherData, GrowthData } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const getAIGeneratedCropImage = async (cropType: string, growthStage: string): Promise<string> => {
    try {
        const prompt = `A photorealistic, vibrant, and healthy ${cropType} field, seen from a slightly elevated perspective. The ${cropType} plants are in the ${growthStage} stage. The field is bathed in natural sunlight. Focus on the rich green foliage and the texture of the specific crop. No artificial structures or machinery. Natural outdoor lighting, high detail.`;

        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        }
        throw new Error("No image was generated.");

    } catch (error) {
        console.error(`Error generating image for ${cropType}:`, error);
        // Return a placeholder image on failure
        return 'https://storage.googleapis.com/maker-suite-gallery/aquacrop-previews/placeholder.png';
    }
};


export const getAIIrrigationSchedule = async (
    fields: Field[],
    weatherData: WeatherData,
    growthData: GrowthData
): Promise<IrrigationEvent[]> => {
    try {
        const prompt = `
            You are "Sprout AI", an expert agronomist AI for the AquaCrop farm management system. Your task is to generate an optimal, quantitative irrigation schedule for the next 24 hours based on the provided real-time data. You will use the soil water balance method.

            **Instructions & Methodology:**
            1.  **Analyze Environmental Data:** You are given the Reference Evapotranspiration (ET₀), which represents the water loss from a standard reference surface. You also have precipitation data.
            2.  **Estimate Crop Coefficient (Kc):** Based on the provided \`growthStage\` and the Normalized Difference Vegetation Index (NDVI), you must estimate the Crop Coefficient (Kc). NDVI is a measure of vegetation health from satellite data (range 0 to 1).
                *   First, determine a baseline Kc from the \`growthStage\`:
                    *   'Seedling': Base Kc = 0.3
                    *   'Vegetative': Base Kc = 0.7
                    *   'Flowering': Base Kc = 1.1
                    *   'Maturity': Base Kc = 0.8
                *   Next, adjust this baseline Kc using the field's specific NDVI value. A higher NDVI indicates denser, healthier vegetation that requires more water. Use this adjustment formula: \`Adjusted Kc = Base Kc * (1 + (NDVI - 0.5))\`. This increases Kc for NDVI > 0.5 and decreases it for NDVI < 0.5. Use this adjusted Kc for your calculations.
            3.  **Calculate Crop Water Use (ETc):** For each field, calculate its specific Crop Water Use (ETc) using the formula: \`ETc = ET₀ * Adjusted Kc\`. ETc represents the actual water needs of the crop in inches/day.
            4.  **Determine Net Irrigation Requirement (NIR):** For each field, calculate the water deficit. The daily water loss is ETc. The daily water gain is precipitation. The current soil moisture is provided as a percentage. A critical threshold for action is a soil moisture below 40%.
            5.  **Calculate Irrigation Duration:** Based on the calculated water deficit for each field (in inches), convert this volume into an irrigation duration in minutes. Use the \`flowRate\` (in gallons per minute) of each field's irrigation system. Assume a standard area of one acre (which requires approx. 27,154 gallons per inch of water). The formula is: \`Duration (min) = (NIR_inches * 27154) / flowRate_gpm\`. If a field's soil moisture is adequate or precipitation covers the ETc, the duration should be 0.
            6.  **Create the Schedule:**
                *   Prioritize fields with soil moisture below 40%.
                *   Schedule irrigation for the early morning or late evening to minimize evaporation.
                *   If precipitation is significant and meets or exceeds ETc, no irrigation may be needed.
                *   Return a JSON array of irrigation events for only the fields that require watering. The \`startTime\` should be a full ISO 8601 string for a suitable time today.

            **Real-Time Data Context:**
            ---
            **Weather Data (from Open-Meteo):**
            - Reference Evapotranspiration (ET₀): ${weatherData.et0} inches/day
            - Forecasted Precipitation: ${weatherData.precipitation} inches
            - Current Temperature: ${weatherData.temperature}°F
            - Relative Humidity: ${weatherData.relativeHumidity}%

            **Field Data:**
            ${JSON.stringify(fields.map(field => ({...field, imageUrl: undefined, soilMoistureHistory: undefined})), null, 2)}
            ---
            Now, perform the calculations and generate the JSON schedule.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            fieldId: { type: Type.STRING },
                            startTime: { type: Type.STRING, description: "Full ISO 8601 date string for today's date and the scheduled time." },
                            durationMinutes: { type: Type.NUMBER },
                            status: { type: Type.STRING, enum: ['Scheduled'] },
                        },
                        required: ["fieldId", "startTime", "durationMinutes", "status"]
                    }
                }
            }
        });

        const scheduleJson = JSON.parse(response.text);

        // Convert startTime strings to Date objects
        return scheduleJson.map((event: any) => ({
            ...event,
            startTime: new Date(event.startTime),
        }));

    } catch (error) {
        console.error("Error calling Gemini API for schedule generation:", error);
        throw new Error("Failed to generate AI schedule.");
    }
};

export const getSproutAIResponse = async (
  query: string,
  fields: Field[],
  schedule: IrrigationEvent[],
  agentLog: AgentLogEntry[]
): Promise<string> => {
  try {
    // Construct a detailed context for the AI
    const context = `
      **Farm Status Overview:**
      - Fields: ${fields.length} fields are currently being managed.
      - Scheduled Irrigations: ${schedule.length} events are on today's schedule.

      **Field Data:**
      ${JSON.stringify(fields.map(({imageUrl, ...rest}) => rest), null, 2)}

      **Today's Irrigation Schedule:**
      ${JSON.stringify(schedule.map(s => ({...s, fieldName: fields.find(f => f.id === s.fieldId)?.name || 'Unknown'})), null, 2)}

      **Recent Agent Actions (Log):**
      ${JSON.stringify(agentLog.slice(0, 5), null, 2)}
    `;

    const prompt = `
      You are "Sprout AI", the intelligent, agentic core of the AquaCrop farm management system. Your purpose is to provide helpful, data-driven answers to the farmer's questions. You operate on a Multi-Context Protocol, analyzing environmental data (from OpenET & Open-Meteo), field data, operational parameters, and user preferences to make autonomous decisions.

      Here is the current state of the farm based on the data you have:
      ---
      ${context}
      ---

      Based ONLY on the context provided, please answer the following user query. Be concise, clear, and friendly in your explanation. If the user asks about a decision you made, refer to the specific data points in the context that influenced that decision. If the query is outside the scope of farm management or the provided context, politely state that you cannot answer.

      User Query: "${query}"
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "I'm sorry, but I'm having trouble connecting to my reasoning engine right now. Please try again in a moment.";
  }
};

export const getSproutAIFocus = async (
    weatherData: WeatherData,
    fields: Field[],
    schedule: IrrigationEvent[]
): Promise<string> => {
    try {
        const prompt = `
            You are "Sprout AI", an expert agronomist AI for the AquaCrop farm management system.
            Based on the real-time data provided below, generate a single, concise "focus" message for the farmer.
            This message should be proactive and highlight the most critical observation or the most important action you have taken/planned.
            Start with a bolded title like "**Today's Focus:**" or "**Critical Alert:**".
            Keep the entire message under 50 words. Be direct and insightful.

            **Real-Time Data Context:**
            ---
            **Weather Data:**
            - Reference Evapotranspiration (ET₀): ${weatherData.et0} inches/day
            - Forecasted Precipitation: ${weatherData.precipitation} inches
            - Current Temperature: ${weatherData.temperature}°F
            - Relative Humidity: ${weatherData.relativeHumidity}%

            **Field Data Summary:**
            - Number of fields: ${fields.length}
            - Fields with low moisture (<40%): ${fields.filter(f => f.soilMoisture < 40).length}
            - Lowest soil moisture reading: ${Math.min(...fields.map(f => f.soilMoisture))}%

            **Today's Irrigation Schedule Summary:**
            - Total scheduled events: ${schedule.length}
            ---
            Now, generate the focus message.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        return response.text.trim();

    } catch (error) {
        console.error("Error calling Gemini API for focus message generation:", error);
        return "**System Status:** All parameters are currently stable. Monitoring for changes.";
    }
};