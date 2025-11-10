
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    // This will be caught by the app's error boundary or a try-catch block in the component.
    // In a production environment, this variable should always be set.
    throw new Error("API_KEY environment variable is not set. Please configure it to use the AI service.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function correctGrammar(text: string): Promise<string> {
  const model = 'gemini-2.5-flash';
  const prompt = `You are an expert in English grammar and style. Please correct the following text for grammar, spelling, punctuation, and clarity. Your goal is to make the text sound natural and fluent, like it was written by a native speaker. Do not add any commentary, explanations, or introductory phrases. Only provide the corrected text as a direct response.\n\nOriginal Text:\n---\n${text}\n---\n\nCorrected Text:`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error correcting grammar:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
         throw new Error("The provided API key is invalid. Please check your configuration.");
    }
    // Rethrow a more user-friendly error to be caught by the UI component
    throw new Error("Failed to get a correction from the AI. The service may be busy or unavailable. Please try again later.");
  }
}
