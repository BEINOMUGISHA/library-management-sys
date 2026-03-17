
import { GoogleGenAI } from "@google/genai";
import { Book } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const searchService = {
  /**
   * Natural language search for books
   */
  async smartSearch(query: string, books: Book[]): Promise<Book[]> {
    try {
      const bookList = books.map(b => ({
        id: b.id,
        title: b.title,
        author: b.author,
        category: b.category,
        description: b.description,
        department: b.department
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are a library assistant at BBUC. Given the following list of books and a user query, return a JSON array of book IDs that best match the query. 
        Query: "${query}"
        Books: ${JSON.stringify(bookList)}
        
        Return ONLY a JSON array of strings (IDs).`,
        config: {
          responseMimeType: "application/json"
        }
      });

      const result = JSON.parse(response.text || "[]");
      if (Array.isArray(result)) {
        return books.filter(b => result.includes(b.id));
      }
      return [];
    } catch (error) {
      console.error('Smart search error:', error);
      // Fallback to simple keyword search
      const q = query.toLowerCase();
      return books.filter(b => 
        b.title.toLowerCase().includes(q) || 
        b.author.toLowerCase().includes(q) || 
        b.category.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q)
      );
    }
  },

  /**
   * Personalized recommendations
   */
  async getRecommendations(userHistory: string[], department: string, allBooks: Book[]): Promise<Book[]> {
    try {
      const bookList = allBooks.map(b => ({
        id: b.id,
        title: b.title,
        author: b.author,
        category: b.category,
        department: b.department
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are a library recommendation engine. Based on the user's borrowing history and department, suggest 3 books they might like from the provided list.
        User History (Book IDs): ${JSON.stringify(userHistory)}
        User Department: "${department}"
        Available Books: ${JSON.stringify(bookList)}
        
        Return ONLY a JSON array of 3 book IDs.`,
        config: {
          responseMimeType: "application/json"
        }
      });

      const result = JSON.parse(response.text || "[]");
      if (Array.isArray(result)) {
        return allBooks.filter(b => result.includes(b.id));
      }
      return [];
    } catch (error) {
      console.error('Recommendation error:', error);
      // Fallback: same department
      return allBooks
        .filter(b => b.department === department && !userHistory.includes(b.id))
        .slice(0, 3);
    }
  }
};
