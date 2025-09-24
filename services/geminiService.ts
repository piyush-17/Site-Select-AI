import { GoogleGenAI, Type } from "@google/genai";
import { LocationAnalysis } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const locationSchema = {
    type: Type.OBJECT,
    properties: {
        locationName: { type: Type.STRING, description: "Name of the neighborhood or area, e.g., 'Koramangala, Bengaluru'." },
        address: { type: Type.STRING, description: "A plausible street address for a commercial location in the area." },
        latitude: { type: Type.NUMBER, description: "The latitude of the location." },
        longitude: { type: Type.NUMBER, description: "The longitude of the location." },
        overallScore: { type: Type.INTEGER, description: "A score from 1 to 100 indicating the location's potential profitability and suitability." },
        summary: { type: Type.STRING, description: "A 2-3 sentence summary explaining why this location is recommended." },
        demographics: {
            type: Type.OBJECT,
            properties: {
                populationDensity: { type: Type.STRING, description: "e.g., 'High', 'Medium', 'Low'" },
                avgIncome: { type: Type.INTEGER, description: "Average annual household income in INR." },
                dominantAgeGroup: { type: Type.STRING, description: "e.g., '25-35'" },
            },
            required: ["populationDensity", "avgIncome", "dominantAgeGroup"]
        },
        marketAnalysis: {
            type: Type.OBJECT,
            properties: {
                footTraffic: { type: Type.STRING, description: "Estimated foot traffic level: 'High', 'Medium', 'Low'." },
                competitorDensity: { type: Type.STRING, description: "Density of similar businesses: 'High', 'Medium', 'Low'." },
            },
            required: ["footTraffic", "competitorDensity"]
        },
        financials: {
            type: Type.OBJECT,
            properties: {
                projectedRevenue: {
                    type: Type.ARRAY,
                    description: "An array of 5 numbers representing projected annual revenue in INR for the first 5 years.",
                    items: { type: Type.NUMBER }
                },
                projectedCosts: {
                    type: Type.ARRAY,
                    description: "An array of 5 numbers representing projected annual operational costs in INR for the first 5 years.",
                    items: { type: Type.NUMBER }
                },
                breakEvenYear: { type: Type.INTEGER, description: "The estimated year (1-5) in which the business becomes profitable." },
                roi: { type: Type.NUMBER, description: "The estimated 5-year Return on Investment as a percentage (e.g., 150.5 for 150.5%)." }
            },
            required: ["projectedRevenue", "projectedCosts", "breakEvenYear", "roi"]
        },
        risk: {
            type: Type.OBJECT,
            properties: {
                level: { type: Type.STRING, description: "'Low', 'Medium', or 'High'." },
                factors: { type: Type.STRING, description: "A brief description of the primary risk factors (e.g., high rent, upcoming competition)." }
            },
            required: ["level", "factors"]
        }
    },
    required: ["locationName", "address", "latitude", "longitude", "overallScore", "summary", "demographics", "marketAnalysis", "financials", "risk"]
};


export const getLocationsAnalysis = async (area: string, businessType: string, investment: string): Promise<LocationAnalysis[]> => {
    const prompt = `
        Analyze the area of "${area}" in India to find the top 3 most profitable and suitable locations to establish a new "${businessType}" with an initial investment of INR ${investment}.
        
        For each location, provide a detailed analysis based on the following criteria:
        1.  **Coordinates**: Provide precise latitude and longitude for the suggested location.
        2.  **Demographics**: Population density, average annual household income in INR, dominant age groups.
        3.  **Market Analysis**: Estimated foot traffic and competitor density.
        4.  **Financial Projections**: 5-year revenue and cost forecast in INR, break-even point, and ROI.
        5.  **Risk Assessment**: Identify potential risks and assign a risk level.
        6.  **Overall Score**: A score out of 100 for its potential.
        
        Return the analysis for the top 3 locations. Be realistic and data-driven in your estimations. Base all financial figures in Indian Rupees (INR).
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: locationSchema
                },
            },
        });
        
        const jsonText = response.text.trim();
        if (!jsonText) {
            throw new Error("API returned an empty response.");
        }
        
        const parsedResult = JSON.parse(jsonText);
        // Add a check to ensure lat/lon are numbers, as models might return strings.
        const validatedResult = parsedResult.map((loc: any) => ({
            ...loc,
            latitude: parseFloat(loc.latitude),
            longitude: parseFloat(loc.longitude)
        }));
        return validatedResult as LocationAnalysis[];

    } catch (error) {
        console.error("Error fetching location analysis:", error);
        throw new Error("Failed to get analysis from AI. Please check your inputs or try again later.");
    }
};