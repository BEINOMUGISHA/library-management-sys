
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface ResearchResponse {
  text: string;
  sources: { title: string; uri: string }[];
}

export const askLibrarian = async (query: string, bookContext: string): Promise<ResearchResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are the BBUC Virtual Librarian. 
      Local Catalog Context: ${bookContext}. 
      User Query: ${query}
      If the user is looking for research beyond our catalog, use Google Search to find reputable academic sources.`,
      config: {
        systemInstruction: "You are the professional and knowledgeable Librarian for Bishop Barham University College (BBUC). Assist students and staff in finding academic resources. When using external search, provide academic citations.",
        tools: [{ googleSearch: {} }],
        temperature: 0.7,
      }
    });

    const text = response.text || "I'm having trouble retrieving that information.";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const sources = groundingChunks
      .filter(chunk => chunk.web)
      .map(chunk => ({
        title: chunk.web.title,
        uri: chunk.web.uri
      }));

    return { text, sources };
  } catch (error) {
    console.error("Gemini Error:", error);
    return { 
      text: "I'm having trouble connecting to the BBUC research portal. Please visit the physical library desk.",
      sources: []
    };
  }
};

export const getBookRecommendation = async (userInterests: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on the following user interest: "${userInterests}", suggest one specific genre and three types of books they might like for academic and personal growth. Be concise.`,
    });
    return response.text;
  } catch (error) {
    return "Theology, Education, and Business studies are popular choices at BBUC!";
  }
};
