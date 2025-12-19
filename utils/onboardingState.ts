import { ProfileType, RiskProfileData } from '../types';

export interface OnboardingState {
  firstName: string | null;
  investmentExperience: string | null;
  investmentHorizon: string | null;
  futureGoals: string[];
  firstFutureGoal: string | null;
  riskTolerance: string | null;
  selectedHelpOptions: string[];
  firstHelpSelection: string | null;
  selectedInvestingStatus: string[];
  firstInvestingSelection: string | null;
  mobileNumber: string | null;
  email: string | null;
  mobileVerified?: boolean;
  emailVerified?: boolean;
  sessionToken?: string;
}

const initialState: OnboardingState = {
  firstName: null,
  investmentExperience: null,
  investmentHorizon: null,
  futureGoals: [],
  firstFutureGoal: null,
  riskTolerance: null,
  selectedHelpOptions: [],
  firstHelpSelection: null,
  selectedInvestingStatus: [],
  firstInvestingSelection: null,
  mobileNumber: null,
  email: null,
  mobileVerified: false,
  emailVerified: false,
  sessionToken: undefined
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
 * EXACT Backend Portfolio Logic
 */
const PORTFOLIO_ALLOCATIONS: Record<ProfileType, Omit<RiskProfileData, 'type' | 'score'>> = {
  "CONSERVATIVE": {
    equity_min: 20, equity_max: 30, equity_display: 25,
    debt_min: 70, debt_max: 80, debt_display: 75,
    gold: 2, cash: 0, returns: "4-5%", risk_level: "Low",
    description: "Capital preservation focused"
  },
  "MODERATE": {
    equity_min: 50, equity_max: 60, equity_display: 55,
    debt_min: 40, debt_max: 50, debt_display: 45,
    gold: 2, cash: 0, returns: "6-7%", risk_level: "Moderate",
    description: "Balanced safety and growth"
  },
  "BALANCED": {
    equity_min: 65, equity_max: 75, equity_display: 70,
    debt_min: 25, debt_max: 35, debt_display: 30,
    gold: 2, cash: 0, returns: "8-10%", risk_level: "Moderate-High",
    description: "Growth with safety cushion"
  },
  "GROWTH": {
    equity_min: 80, equity_max: 90, equity_display: 85,
    debt_min: 10, debt_max: 20, debt_display: 15,
    gold: 1, cash: 0, returns: "10-12%", risk_level: "High",
    description: "Aggressive growth focus"
  },
  "AGGRESSIVE": {
    equity_min: 90, equity_max: 100, equity_display: 95,
    debt_min: 0, debt_max: 10, debt_display: 5,
    gold: 0, cash: 0, returns: "12-15%", risk_level: "Very High",
    description: "Maximum growth, accept volatility"
  }
};

const HORIZON_POINTS: Record<string, number> = {
  "5_years": 1,
  "10_years": 3,
  "20_years": 4,
  "30_years": 5,
  "30plus_years": 5
};

const TOLERANCE_POINTS: Record<string, number> = {
  "very_low": 1,
  "low": 2,
  "moderate": 3,
  "moderate_high": 4,
  "high_reward": 5
};

export function calculateRiskProfile(): RiskProfileData {
  const { investmentHorizon, riskTolerance } = onboardingState;

  const q1 = HORIZON_POINTS[investmentHorizon || "10_years"] || 3;
  const q2 = q1; // Q2 is same as Q1 per spec
  const q3 = TOLERANCE_POINTS[riskTolerance || "moderate"] || 3;
  const q4 = 3; // Default moderate

  const total_score = q1 + q2 + q3 + q4;

  let type: ProfileType = "MODERATE";
  if (total_score <= 7) type = "CONSERVATIVE";
  else if (total_score <= 12) type = "MODERATE";
  else if (total_score <= 17) type = "BALANCED";
  else if (total_score <= 20) type = "GROWTH";
  else type = "AGGRESSIVE";

  return {
    type,
    score: total_score,
    ...PORTFOLIO_ALLOCATIONS[type]
  };
}