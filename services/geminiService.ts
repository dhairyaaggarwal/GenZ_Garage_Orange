
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, InvestmentPlan } from "../types";

export const generateInvestmentPlan = async (profile: UserProfile): Promise<InvestmentPlan> => {
  // Always initialize GoogleGenAI inside the function to ensure the correct apiKey from process.env is used.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview";
  const rp = profile.riskProfile;

  const prompt = `
    You are "Orange", a warm and witty financial companion for a beginner investor in India.
    
    **User Context:**
    - Name: ${profile.name}
    - Ambitions: ${profile.financialGoals.join(", ")}
    - Risk Profile: ${rp?.type} (Score: ${rp?.score}/25)
    // Fixed returns -> expected_annual_return
    - Targeted Growth: ${rp?.expected_annual_return} per year (${rp?.risk_level} risk)

    **Investment Strategy (MANDATORY ALLOCATIONS):**
    // Fixed missing equity/debt range properties
    - Equity: ${rp?.equity_display}% (Allowed range: ${rp?.equity_min}% to ${rp?.equity_max}%)
    - Debt: ${rp?.debt_display}% (Allowed range: ${rp?.debt_min}% to ${rp?.debt_max}%)
    - Gold: ${rp?.gold}%
    - Cash: 0%

    **Task:**
    Create a detailed starter plan. Use real Indian instruments like "Nifty 50 Index Fund", "Fixed Maturity Plans", and "Sovereign Gold Bonds".
    
    The response must be JSON:
    1. allocations: Array with 'assetClass', 'percentage', and 'color'.
    2. summary: A catchy 3-word title.
    3. rationale: Explain the logic for a ${rp?.type} profile in a warm tone.
    4. firstSteps: 3 concrete steps for an Indian investor.
    // Fixed returns -> expected_annual_return
    5. expectedReturn: "${rp?.expected_annual_return}".
    6. riskLevel: "${rp?.risk_level}".
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
        },
      },
    });

    // Use response.text as a property, not a method.
    if (response.text) {
      return JSON.parse(response.text.trim()) as InvestmentPlan;
    }
    throw new Error("No response text from Gemini");
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      allocations: [
        { assetClass: "Equity (Growth)", percentage: rp?.equity_display || 70, color: "#f97316" },
        { assetClass: "Debt (Safety)", percentage: rp?.debt_display || 28, color: "#94a3b8" },
        { assetClass: "Gold (Hedge)", percentage: rp?.gold || 2, color: "#fbbf24" }
      ],
      summary: `${rp?.type || 'Balanced'} Growth Plan`,
      rationale: `Hey ${profile.name}, based on your score of ${rp?.score}, this mix balances stability with growth potential.`,
      firstSteps: ["Complete your KYC", "Start a SIP of ₹1,000", "Link your Bank Account"],
      // Fixed returns -> expected_annual_return
      expectedReturn: rp?.expected_annual_return || "8-10%",
      riskLevel: rp?.risk_level || "Moderate-High"
    };
  }
};
