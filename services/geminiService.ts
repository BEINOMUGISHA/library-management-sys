
import { GoogleGenAI } from "@google/genai";

// Fix: Strictly follow the Gemini API initialization guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const askLibrarian = async (query: string, bookContext: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are the BBUC Virtual Librarian, a helpful assistant for Bishop Barham University College. 
      You have access to the following current catalog summary: ${bookContext}. 
      Answer the student or lecturer's query politely and professionally within the context of BBUC.
      User Query: ${query}`,
      config: {
        systemInstruction: "You are the professional and knowledgeable Librarian for Bishop Barham University College (BBUC). Your goal is to assist students and staff in finding academic resources, understanding borrowing policies, and promoting a culture of reading and research at BBUC. Be academic yet approachable.",
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting to the BBUC catalog right now. Please try again or visit the physical library desk.";
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
