
import { ProfileType, RiskProfileData, AppState } from '../types';

export interface OnboardingState {
  first_name: string | null;
  is_over_18: boolean | null;
  future_goals: string[];
  investment_needs: string[];
  current_activities: string[];
  investment_horizon: string | null;
  risk_temperament: string | null;
  email: string | null;
  mobileNumber: string | null;
  mobileVerified: boolean | null;
  emailVerified: boolean | null;
  sessionToken: string | null;
}

const initialState: OnboardingState = {
  first_name: null,
  is_over_18: null,
  future_goals: [],
  investment_needs: [],
  current_activities: [],
  investment_horizon: null,
  risk_temperament: null,
  email: null,
  mobileNumber: null,
  mobileVerified: null,
  emailVerified: null,
  sessionToken: null,
};

export let onboardingState: OnboardingState = { ...initialState };

if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('onboardingState');
  if (saved) {
    try {
      onboardingState = { ...initialState, ...JSON.parse(saved) };
    } catch (e) {
      console.error("Failed to parse onboarding state", e);
    }
  }
}

export function persistOnboardingState() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('onboardingState', JSON.stringify(onboardingState));
  }
}

export function getOnboardingState() {
  return onboardingState;
}

export function setValue(key: keyof OnboardingState, value: any) {
  (onboardingState as any)[key] = value;
  persistOnboardingState();
}

/**
 * Maps AppState to the 5-step conceptual progress bar.
 */
export function getStepFromState(state: AppState): number {
  if (state <= AppState.AGE_CONFIRM) return 1;
  if (state <= AppState.SELECTED_GOALS) return 2;
  if (state <= AppState.SELECTED_STATUS) return 3;
  if (state <= AppState.FINALIZE_PLAN) return 4;
  return 5;
}

/**
 * Returns the starting AppState for a conceptual step.
 */
export function getStateFromStep(step: number): AppState {
  const mapping: Record<number, AppState> = {
    1: AppState.ASK_NAME,
    2: AppState.FUTURE_GOALS,
    3: AppState.HELP_OPTIONS,
    4: AppState.INVESTMENT_DURATION,
    5: AppState.SIGNUP
  };
  return mapping[step] || AppState.ASK_NAME;
}

// 1. Numeric Mappings based on provided backend logic
const HORIZON_POINTS: Record<string, number> = {
  "lt_5": 1, "5_10": 2, "10_20": 3, "20_30": 4, "30_plus": 5, "dont_know": 2
};

const TEMPERAMENT_POINTS: Record<string, number> = {
  "low": 1, "moderate": 3, "moderate_high": 4, "high_reward": 5
};

const GOAL_PROFILE: Record<string, ProfileType> = {
  "buy_house": "MODERATE",
  "work_less": "MODERATE",
  "retire_early": "GROWTH",
  "financial_independence": "BALANCED",
  "pay_for_school": "CONSERVATIVE",
  "dont_know": "MODERATE"
};

const ACTIVITY_BIAS: Record<string, number> = {
  "not_started": -1, "saving": 0, "investing": 1, "saving_and_investing": 2
};

const PROFILE_LEVEL: Record<ProfileType, number> = {
  "CONSERVATIVE": 1, "MODERATE": 2, "BALANCED": 3, "GROWTH": 4, "AGGRESSIVE": 5
};

const LEVEL_PROFILE: Record<number, ProfileType> = {
  1: "CONSERVATIVE", 2: "MODERATE", 3: "BALANCED", 4: "GROWTH", 5: "AGGRESSIVE"
};

// Allocation Table strictly following the user's reference image
const PORTFOLIO_ALLOCATIONS: Record<ProfileType, any> = {
  "CONSERVATIVE": {
    equity: 25, debt: 75, gold: 2, cash: 0,
    expected_annual_return: "4–5%",
    description: "Low-risk mix focused on protecting your money while still beating savings account/FD returns. Good for short-term or very cautious investors.",
    nextStep: "Buddy suggests starting a small, regular SIP once live. Emphasise that this is a starter portfolio you can later step up from. Let's look at some basics!"
  },
  "MODERATE": {
    equity: 55, debt: 45, gold: 2, cash: 0,
    expected_annual_return: "6–7%",
    description: "Balanced mix for beginners who want some growth but still care a lot about stability. Suitable for medium-term goals and 'not sure yet' users.",
    nextStep: "Prompt yourself to start a SIP for 1-2 goals. Highlight: 'you can always adjust later' to reduce fear. Check out our SIP explainer!"
  },
  "BALANCED": {
    equity: 70, debt: 30, gold: 2, cash: 0,
    expected_annual_return: "8–10%",
    description: "Growth-oriented mix with a safety cushion. Designed for long-term goals like financial independence or buying a house in 7–15 years.",
    nextStep: "Encourage higher-ticket or multi-goal SIPs. Stick with us for the long term to see compounding in action through 10-20% drawdowns!"
  },
  "GROWTH": {
    equity: 85, debt: 15, gold: 1, cash: 0,
    expected_annual_return: "10–12%",
    description: "High-growth mix with bigger ups and downs. For long-term, aggressive goals like retiring early where you can ignore short-term noise.",
    nextStep: "Explicit risk warning active: 'check your comfort'. Suggest long horizon (10+ years) and recommend small step-up increases instead of lump sums."
  },
  "AGGRESSIVE": {
    equity: 95, debt: 5, gold: 0, cash: 0,
    expected_annual_return: "12–15%",
    description: "Very high-risk, high-return mix. Only for users who can handle large swings and stay invested 10+ years.",
    nextStep: "Extra confirmation required: 'I understand large temporary losses can happen'. Consider splitting money between Aggressive + Balanced to provide a buffer."
  }
};

export function calculateRiskProfile(): RiskProfileData {
  const { investment_horizon, risk_temperament, future_goals, current_activities } = onboardingState;

  // Step 3.1: Base Risk Score (Q1-Q4)
  const q1 = HORIZON_POINTS[investment_horizon || "dont_know"] || 2;
  const q2 = q1;
  const q3 = TEMPERAMENT_POINTS[risk_temperament || "moderate"] || 3;
  const q4 = 3; // Fixed default
  const totalScore = q1 + q2 + q3 + q4;

  // Step 3.2: Score -> Score Profile
  let scoreProfile: ProfileType;
  if (totalScore <= 7) scoreProfile = "CONSERVATIVE";
  else if (totalScore <= 10) scoreProfile = "MODERATE";
  else if (totalScore <= 13) scoreProfile = "BALANCED";
  else if (totalScore <= 16) scoreProfile = "GROWTH";
  else scoreProfile = "AGGRESSIVE";

  // Step 3.3: Intent Profile from Goals
  let intentProfile: ProfileType = "MODERATE";
  if (future_goals && future_goals.length > 0) {
    const levels = future_goals.map(g => PROFILE_LEVEL[GOAL_PROFILE[g] || "MODERATE"]);
    const avgGoalLevel = Math.round(levels.reduce((a, b) => a + b, 0) / levels.length);
    intentProfile = LEVEL_PROFILE[Math.max(1, Math.min(5, avgGoalLevel))];
  }

  // Step 3.4: Activity Adjusted Profile (Bias)
  const ACTIVITY_PRIORITY = ["not_started", "saving", "investing", "saving_and_investing"];
  let bestActivity = "not_started";
  if (current_activities && current_activities.length > 0) {
    current_activities.forEach(a => {
      if (ACTIVITY_PRIORITY.indexOf(a) > ACTIVITY_PRIORITY.indexOf(bestActivity)) {
        bestActivity = a;
      }
    });
  }
  const bias = ACTIVITY_BIAS[bestActivity] || 0;
  const activityLevel = Math.max(1, Math.min(5, PROFILE_LEVEL[scoreProfile] + bias));
  const activityProfile = LEVEL_PROFILE[activityLevel];

  // Step 3.5: Final Consensus Calculation
  const intentLevel = PROFILE_LEVEL[intentProfile];
  const scoreLevel = PROFILE_LEVEL[scoreProfile];
  const actLevel = PROFILE_LEVEL[activityProfile];
  const avgConsensus = (intentLevel + scoreLevel + actLevel) / 3.0;

  const frac = avgConsensus - Math.floor(avgConsensus);
  let finalLevel = Math.floor(avgConsensus);
  if (frac >= 0.75) {
    finalLevel = Math.ceil(avgConsensus);
  }
  
  const finalProfile = LEVEL_PROFILE[Math.max(1, Math.min(5, finalLevel))];
  const alloc = PORTFOLIO_ALLOCATIONS[finalProfile];

  return {
    type: finalProfile,
    score: totalScore,
    risk_level: finalLevel === 1 ? "Low" : finalLevel <= 3 ? "Moderate" : "High",
    equity_display: alloc.equity,
    equity_min: Math.max(0, alloc.equity - 5),
    equity_max: Math.min(100, alloc.equity + 5),
    debt_display: alloc.debt,
    debt_min: Math.max(0, alloc.debt - 5),
    debt_max: Math.min(100, alloc.debt + 5),
    gold: alloc.gold,
    cash: alloc.cash,
    expected_annual_return: alloc.expected_annual_return,
    explanation: {
      why_this: alloc.description,
      what_to_expect: alloc.nextStep
    }
  };
}
