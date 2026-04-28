import { GoogleGenAI } from '@google/genai';
import { SYSTEM_PROMPT } from './prompt';

// Ensure the API key exists
const apiKey = process.env.GEMINI_API_KEY;

let ai: GoogleGenAI;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export type Region = 'Global Defaults (PK, US, EU)' | 'United States' | 'European Union' | 'Pakistan' | 'United Kingdom' | 'Canada' | 'Australia';

export interface AnalysisRequest {
  idea: string;
  regions: Region[];
  industry: string;
}

export async function analyzeBusinessIdea(request: AnalysisRequest): Promise<string> {
  if (!ai) {
    throw new Error('Gemini API key is not configured. Please add it to your environment variables.');
  }

  const prompt = `
    Business Idea: ${request.idea}
    Target Regions: ${request.regions.join(', ')}
    Industry/Vertical: ${request.industry || 'Not specified'}

    Please analyze this business idea using your standard AI Legal & Business Decision Agent protocols.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.2, // Keep it grounded, factual and analytical
      }
    });

    if (response.text) {
        return response.text;
    } else {
        throw new Error("No text content returned from the model");
    }
  } catch (error) {
    console.error("Error analyzing business idea:", error);
    throw error;
  }
}
