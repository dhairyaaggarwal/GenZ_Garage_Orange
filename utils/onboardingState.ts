
import { ProfileType, RiskProfileData, AppState } from '../types';

export interface OnboardingState {
  first_name: string | null;
  is_over_18: boolean | null;
  future_goals: string[];
  investment_needs: string[]; // Generic needs (Teach me, etc.)
  vibes: string[]; // Sector interests (Tech, EV, etc.)
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
  vibes: [],
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
 * Maps AppState to the 5-step conceptual progress bar for the Onboarding UI.
 */
export function getStepFromState(state: AppState): number {
  if (state <= AppState.AGE_CONFIRM) return 1;
  if (state <= AppState.SELECTED_GOALS) return 2;
  if (state <= AppState.SELECTED_VIBE || state === AppState.ONBOARDING_VIBE) return 3;
  if (state <= AppState.FINALIZE_PLAN) return 4;
  return 5;
}

export function getStateFromStep(step: number): AppState {
  const mapping: Record<number, AppState> = {
    1: AppState.ASK_NAME,
    2: AppState.FUTURE_GOALS,
    3: AppState.HELP_OPTIONS,
    4: AppState.INVESTING_STATUS,
    5: AppState.SIGNUP
  };
  return mapping[step] || AppState.ASK_NAME;
}

// Factor constants for risk engine
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

const PORTFOLIO_ALLOCATIONS: Record<ProfileType, any> = {
  "CONSERVATIVE": {
    equity: 25, debt: 75, gold: 2, cash: 0,
    expected_annual_return: "4–6%",
    description: "Safety-first mix to protect your capital while beating inflation.",
    nextStep: "Focus on liquid funds and short-term debt."
  },
  "MODERATE": {
    equity: 55, debt: 45, gold: 2, cash: 0,
    expected_annual_return: "7–9%",
    description: "A balanced start for steady growth with manageable swings.",
    nextStep: "Hybrid funds are your best friend."
  },
  "BALANCED": {
    equity: 70, debt: 30, gold: 2, cash: 0,
    expected_annual_return: "10–12%",
    description: "The 'Sweet Spot' for long-term wealth creation.",
    nextStep: "Diversify across large and mid-cap funds."
  },
  "GROWTH": {
    equity: 85, debt: 15, gold: 1, cash: 0,
    expected_annual_return: "12–15%",
    description: "Aggressive growth for long-term ambitions.",
    nextStep: "Focus on sector-specific and small-cap opportunities."
  },
  "AGGRESSIVE": {
    equity: 95, debt: 5, gold: 0, cash: 0,
    expected_annual_return: "15%+",
    description: "Maximum market exposure for the highest possible returns.",
    nextStep: "Ensure you have a 10+ year time horizon."
  }
};

export function calculateRiskProfile(): RiskProfileData {
  const { investment_horizon, risk_temperament, future_goals, current_activities } = onboardingState;

  // 1. Quantitative Score (Horizon + Temperament)
  const q1 = HORIZON_POINTS[investment_horizon || "dont_know"] || 2;
  const q3 = TEMPERAMENT_POINTS[risk_temperament || "moderate"] || 3;
  const baseScore = q1 + q3 + 6; // Standardizing to a ~20 point scale

  let scoreProfile: ProfileType;
  if (baseScore <= 7) scoreProfile = "CONSERVATIVE";
  else if (baseScore <= 10) scoreProfile = "MODERATE";
  else if (baseScore <= 13) scoreProfile = "BALANCED";
  else if (baseScore <= 16) scoreProfile = "GROWTH";
  else scoreProfile = "AGGRESSIVE";

  // 2. Intent Bias (Based on Goals)
  let intentProfile: ProfileType = "MODERATE";
  if (future_goals && future_goals.length > 0) {
    const levels = future_goals.map(g => PROFILE_LEVEL[GOAL_PROFILE[g] || "MODERATE"]);
    const avgGoalLevel = Math.round(levels.reduce((a, b) => a + b, 0) / levels.length);
    intentProfile = LEVEL_PROFILE[Math.max(1, Math.min(5, avgGoalLevel))];
  }

  // 3. Experience Bias (Current Activities)
  let bestActivity = "not_started";
  if (current_activities && current_activities.length > 0) {
    const ACTIVITY_PRIORITY = ["not_started", "saving", "investing", "saving_and_investing"];
    current_activities.forEach(a => {
      if (ACTIVITY_PRIORITY.indexOf(a) > ACTIVITY_PRIORITY.indexOf(bestActivity)) {
        bestActivity = a;
      }
    });
  }
  const bias = ACTIVITY_BIAS[bestActivity] || 0;
  
  // 4. Final Aggregation
  const intentLevel = PROFILE_LEVEL[intentProfile];
  const scoreLevel = PROFILE_LEVEL[scoreProfile];
  const avgLevel = Math.round((intentLevel + scoreLevel) / 2) + bias;
  
  const finalLevel = Math.max(1, Math.min(5, avgLevel));
  const finalProfile = LEVEL_PROFILE[finalLevel];
  const alloc = PORTFOLIO_ALLOCATIONS[finalProfile];

  return {
    type: finalProfile,
    score: baseScore,
    risk_level: finalLevel === 1 ? "Low" : finalLevel <= 3 ? "Moderate" : "High",
    equity_display: alloc.equity,
    equity_min: Math.max(0, alloc.equity - 10),
    equity_max: Math.min(100, alloc.equity + 10),
    debt_display: alloc.debt,
    debt_min: Math.max(0, alloc.debt - 10),
    debt_max: Math.min(100, alloc.debt + 10),
    gold: alloc.gold,
    cash: alloc.cash,
    expected_annual_return: alloc.expected_annual_return,
    explanation: {
      why_this: alloc.description,
      what_to_expect: alloc.nextStep
    }
  };
}
