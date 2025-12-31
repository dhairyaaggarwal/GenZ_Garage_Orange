
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, InvestmentPlan } from "../types";

export const generateInvestmentPlan = async (profile: UserProfile): Promise<InvestmentPlan> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview";
  const rp = profile.riskProfile;

  // Map vibes to keywords for Gemini
  const vibeContext = profile.investmentInterests.length > 0 
    ? `The user is specifically interested in these sectors: ${profile.investmentInterests.join(", ")}. 
       Try to suggest at least one specific thematic fund or stock segment related to these.`
    : "No specific sector preference, suggest a broad-based index approach.";

  const prompt = `
    System: You are "Orange Buddy", a witty, expert, and compassionate financial guide for Gen Z in India.
    
    User Profile:
    - Name: ${profile.name}
    - Goals: ${profile.financialGoals.join(", ")}
    - Risk Profile: ${rp?.type} (${rp?.risk_level} risk)
    - Calculated Equity Allocation: ${rp?.equity_display}%
    - Calculated Debt Allocation: ${rp?.debt_display}%
    - Calculated Gold Allocation: ${rp?.gold}%
    
    Context:
    ${vibeContext}

    Task:
    Create a personalized investment "Playlist" (Portfolio).
    Instead of generic terms, use real-world Indian instruments available on platforms like Groww or Zerodha.
    Examples: "Nifty 50 Index Fund", "Liquid Funds", "Sovereign Gold Bonds", "Thematic EV Mutual Fund".

    Response Requirements (JSON ONLY):
    1. allocations: Array of {assetClass: string, percentage: number, color: string}. Percentage must sum to 100.
    2. summary: A 3-word catchy "vibe" name for the portfolio.
    3. rationale: A warm explanation of why this mix fits their ${rp?.type} profile and their goals.
    4. firstSteps: 3 actionable items (e.g., "Set up a ₹500 SIP", "Complete E-KYC").
    5. expectedReturn: A range like "10-12%".
    6. riskLevel: "${rp?.risk_level}".

    Rules:
    - DO NOT hardcode instruments in the prompt, let the model decide the best currently trending ones.
    - Keep the tone encouraging and beginner-friendly.
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
                  color: { type: Type.STRING },
                },
              },
            },
            summary: { type: Type.STRING },
            rationale: { type: Type.STRING },
            firstSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            expectedReturn: { type: Type.STRING },
            riskLevel: { type: Type.STRING },
          },
          required: ["allocations", "summary", "rationale", "firstSteps", "expectedReturn", "riskLevel"]
        },
      },
    });

    const text = response.text?.trim();
    if (text) {
      return JSON.parse(text) as InvestmentPlan;
    }
    throw new Error("Empty response");
  } catch (error) {
    console.error("Gemini Generation Failed:", error);
    // Dynamic fallback based on user's calculated risk
    return {
      allocations: [
        { assetClass: "Equity (Nifty 50)", percentage: rp?.equity_display || 60, color: "#9B7EEC" },
        { assetClass: "Debt (Safety)", percentage: rp?.debt_display || 35, color: "#FFB7A5" },
        { assetClass: "Gold (Hedge)", percentage: rp?.gold || 5, color: "#DFFF4F" }
      ],
      summary: `${profile.name}'s Growth Starter`,
      rationale: `Since you're looking for ${rp?.risk_level} growth, we've focused on India's top 50 companies while keeping a safety net in bonds.`,
      firstSteps: ["Complete your KYC on any app", "Start a SIP of ₹500", "Join the Orange community"],
      expectedReturn: rp?.expected_annual_return || "10-12%",
      riskLevel: rp?.risk_level || "Moderate"
    };
  }
};
