export type ProfileType = "CONSERVATIVE" | "MODERATE" | "BALANCED" | "GROWTH" | "AGGRESSIVE";

export interface RiskProfileData {
  type: ProfileType;
  score: number;
  equity_min: number;
  equity_max: number;
  equity_display: number;
  debt_min: number;
  debt_max: number;
  debt_display: number;
  gold: number;
  cash: number;
  returns: string;
  risk_level: string;
  description: string;
}

export interface UserProfile {
  name: string;
  ageRange: string;
  occupation: string;
  financialGoals: string[];
  investmentInterests: string[];
  motivation: string;
  riskAppetite: 'Low' | 'Medium' | 'High';
  riskProfile?: RiskProfileData;
}

export interface InvestmentAllocation {
  assetClass: string;
  percentage: number;
  color: string;
}

export interface InvestmentPlan {
  allocations: InvestmentAllocation[];
  summary: string;
  rationale: string;
  firstSteps: string[];
  expectedReturn?: string;
  riskLevel?: string;
}

export enum AppState {
  LANDING = 1,
  PROJECTION = 2,
  AUTOMATED_UPDATE = 3,
  DO_NOT_INVEST = 4,
  BUDDY_INTRO = 5,
  ASK_NAME = 6,
  AGE_CONFIRM = 7,
  UNDERAGE = 8,
  INVESTED_BEFORE = 9,
  FUTURE_GOALS = 10,
  SELECTED_GOALS = 11,
  HELP_OPTIONS = 12,
  SELECTED_HELP_OPTIONS = 13,
  INVESTING_STATUS = 14,
  INVESTING_BENEFIT = 15,
  INVESTMENT_DURATION = 16,
  RISK_TOLERANCE = 17,
  FINALIZE_PLAN = 18,
  BUDDY_CELEBRATE = 19,
  SIGNUP = 20,
  VERIFY_EMAIL_OTP = 21,
  LOGIN_EMAIL = 22,
  ANALYZING = 23,
  DASHBOARD = 24,
}