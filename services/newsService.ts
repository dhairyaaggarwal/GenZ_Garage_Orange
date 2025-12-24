
import { GoogleGenAI, Type } from "@google/genai";
import { NewsItem } from "../types";

export const fetchIndianDailyBriefing = async (): Promise<NewsItem[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview";

  const prompt = `
    Search for the latest 3 most important business and stock market news from India for today.
    Focus on companies like Zomato, Reliance, Tata, HDFC, or big Indian startups.
    
    For each news item, provide:
    1. A short, punchy title (max 6 words).
    2. A subtitle that provides a direct insight for a beginner investor (e.g. "Good sign for long term").
    3. A relevant high-quality image URL (use Unsplash source URLs if specific news images aren't available, e.g. https://images.unsplash.com/photo-1611974714658-66d14560d0bb?w=800 for stock market).
    4. The original source article URL.
    5. A short "Buddy Insight" (1 sentence) explaining why this news matters to a Gen Z investor.
    6. A list of 2-3 associated brand names and their representative emojis.

    Return the result as a JSON array of objects following the NewsItem interface.
    Current date: ${new Date().toDateString()}.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              subtitle: { type: Type.STRING },
              imageUrl: { type: Type.STRING },
              sourceUrl: { type: Type.STRING },
              date: { type: Type.STRING },
              brands: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    logo: { type: Type.STRING },
                    name: { type: Type.STRING }
                  }
                }
              },
              insight: { type: Type.STRING }
            },
            required: ["id", "title", "subtitle", "imageUrl", "sourceUrl", "date", "brands", "insight"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text.trim()) as NewsItem[];
    }
    throw new Error("No response text");
  } catch (error) {
    console.error("Error fetching news:", error);
    // Fallback Mock Data
    return [
      {
        id: "1",
        title: "Zomato share price hits new high",
        subtitle: "Expansion into new cities driving growth.",
        imageUrl: "https://images.unsplash.com/photo-1526367790999-0150786486a9?w=800",
        sourceUrl: "https://economictimes.indiatimes.com",
        date: "Tue Dec 23",
        brands: [{ logo: "🍕", name: "Zomato" }, { logo: "🚲", name: "Swiggy" }],
        insight: "Consistent growth makes it a strong contender for long-term tech playlists."
      },
      {
        id: "2",
        title: "Reliance to invest in Green Energy",
        subtitle: "Massive shift towards sustainable power.",
        imageUrl: "https://images.unsplash.com/photo-1466611653911-95282fc3656b?w=800",
        sourceUrl: "https://www.livemint.com",
        date: "Mon Dec 22",
        brands: [{ logo: "💎", name: "Reliance" }, { logo: "☀️", name: "Jio" }],
        insight: "Energy transition is a multi-decade theme you don't want to miss."
      }
    ];
  }
};
