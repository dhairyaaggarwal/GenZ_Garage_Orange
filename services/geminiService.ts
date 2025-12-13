import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, InvestmentPlan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateInvestmentPlan = async (profile: UserProfile): Promise<InvestmentPlan> => {
  const model = "gemini-2.5-flash";

  const prompt = `
    You are "Orange", a warm, witty, and supportive financial companion for a beginner investor in India (likely Gen Z or female).
    
    **Your Mission:** 
    The user feels overwhelmed. Your job is NOT to overwhelm them with data, but to give them *clarity* and *confidence*.
    Do not act like a bank. Act like a smart friend or a big sister who is good with money.
    
    **User Profile:**
    - Name: ${profile.name}
    - Stage: ${profile.ageRange} (${profile.occupation})
    - Dreams: ${profile.financialGoals.join(", ")}
    - Vibes/Interests: ${profile.investmentInterests.join(", ")}
    - Motivation: "${profile.motivation}"
    - Reaction to Market Drop: ${profile.riskAppetite} (This determines their risk tolerance. Low = Panic, Medium = Wait, High = Buy)

    **Task:**
    Create a starter investment plan.
    
    **Guidelines:**
    1. **No Jargon Zone:** Do not use words like "Asset Allocation", "Equity", "Debt", "Liquid" without immediately explaining them in plain English in parentheses. 
       Example: "Equity (Owning pieces of companies)" or "Debt (Safe lending like FDs)".
    2. **The 'Why':** Explain the strategy by connecting it to their *Dreams*. 
       Example: "Since you want to travel, we need some money to grow fast, but we'll keep some safe so you're always ready to book a flight."
    3. **Asset Classes:** Suggest Indian instruments: Index Funds (Nifty 50), Flexi Cap, SGB (Gold), Corporate Debt, Liquid Funds, etc.
    4. **Tone:** Empathetic, encouraging, and simple.
  
    The response must be a JSON object with the following schema:
    1. allocations: Array of objects with 'assetClass' (string), 'percentage' (number), and 'color' (hex string). Total percentage should equal 100.
    2. summary: A 3-5 word empowering title for their plan (e.g. "The Freedom Fund", "The Future CEO Mix").
    3. rationale: A warm, conversational paragraph explaining why this mix fits their personality. Address the user by name.
    4. firstSteps: An array of 3 concrete, simple steps they can take today in India (e.g., "Download Groww/Zerodha", "Complete KYC", "Start a SIP of ₹500").
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            allocations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  assetClass: { type: Type.STRING },
                  percentage: { type: Type.NUMBER },
                  color: { type: Type.STRING, description: "A hex color code suitable for a chart, ideally warm or neutral tones" },
                },
              },
            },
            summary: { type: Type.STRING },
            rationale: { type: Type.STRING },
            firstSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as InvestmentPlan;
    }
    throw new Error("No response text from Gemini");
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback in case of error
    return {
      allocations: [
        { assetClass: "Top 50 Companies (Safe Growth)", percentage: 50, color: "#f97316" },
        { assetClass: "Gold (Safety)", percentage: 20, color: "#fbbf24" },
        { assetClass: "Fixed Income (Stability)", percentage: 30, color: "#a8a29e" }
      ],
      summary: "The Balanced Starter",
      rationale: `Hey ${profile.name}, we had a tiny hiccup connecting to the brain, but this is a classic mix for someone starting out! It balances safety with growth.`,
      firstSteps: ["Open a Demat account", "Set aside 10% of monthly income", "Start a small SIP"]
    };
  }
};
