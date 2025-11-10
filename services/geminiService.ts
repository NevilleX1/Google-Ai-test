
import { GoogleGenAI } from "@google/genai";

export async function correctGrammar(text: string): Promise<string> {
  // Per Gemini API guidelines, the API key must be obtained from process.env.API_KEY.
  const API_KEY = process.env.API_KEY;

  if (!API_KEY) {
    // In a production environment, this variable should always be set.
    throw new Error("API_KEY environment variable is not set. Please configure it in your deployment settings.");
  }

  // Create a new GoogleGenAI instance for each call to ensure the latest API key is used.
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const model = 'gemini-2.5-flash';
  // Use systemInstruction for providing persona and task instructions, which is a Gemini API best practice.
  const systemInstruction = `You are an expert in English grammar and style. Please correct the following text for grammar, spelling, punctuation, and clarity. Your goal is to make the text sound natural and fluent, like it was written by a native speaker. Do not add any commentary, explanations, or introductory phrases. Only provide the corrected text as a direct response.`;

  try {
    // The user's text is passed as `contents`, separate from the system instruction.
    const response = await ai.models.generateContent({
      model: model,
      contents: text,
      config: {
        systemInstruction,
      },
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error correcting grammar:", error);
    if (error instanceof Error && (error.message.includes('API key not valid') || error.message.includes('API_KEY') || error.message.includes('permission'))) {
         throw new Error("The provided API key is invalid or lacks required permissions. Please check your configuration.");
    }
    // Rethrow a more user-friendly error to be caught by the UI component
    throw new Error("Failed to get a correction from the AI. The service may be busy or unavailable. Please try again later.");
  }
}
