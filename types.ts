
export type ProfileType = "CONSERVATIVE" | "MODERATE" | "BALANCED" | "GROWTH" | "AGGRESSIVE";

export interface RiskProfileData {
  type: ProfileType;
  score: number;
  risk_level: string;
  equity_display: number;
  equity_min: number;
  equity_max: number;
  debt_display: number;
  debt_min: number;
  debt_max: number;
  gold: number;
  cash: number;
  expected_annual_return: string;
  explanation: {
    why_this: string;
    what_to_expect: string;
  };
}

export interface UserProfile {
  name: string;
  financialGoals: string[];
  investmentInterests: string[];
  riskProfile?: RiskProfileData;
  ageRange?: string;
  occupation?: string;
  motivation?: string;
  riskAppetite?: string;
}

export interface PlaylistItem {
  name: string;
  returns: string;
  weight: string;
  icon: string;
}

export interface PerformancePoint {
  date: string;
  value: number;
}

export interface Playlist {
  id: string;
  title: string;
  emoji: string;
  returns: string;
  numericReturn: number;
  description: string;
  items: PlaylistItem[];
  color: string;
  historicalData?: PerformancePoint[];
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

export interface NewsItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  sourceUrl: string;
  date: string;
  brands: { logo: string; name: string }[];
  insight: string;
}

export enum AppState {
  LANDING = 1,
  BUDDY_INTRO = 2,
  ASK_NAME = 3,
  AGE_CONFIRM = 4,
  UNDERAGE = 5,
  FUTURE_GOALS = 6,
  HELP_OPTIONS = 7,
  INVESTING_STATUS = 8,
  INVESTMENT_DURATION = 9,
  RISK_TOLERANCE = 10,
  FINALIZE_PLAN = 11,
  SIGNUP = 12,
  VERIFY_EMAIL_OTP = 13,
  ANALYZING = 14,
  PLAYLIST_RESULT = 15,
  HOME = 16,
  PLAYLIST_DETAIL = 17,
  CREATE_VIBE = 18,
  CREATE_COMPANIES = 19,
  CREATE_GOAL = 20,
  SELECTED_GOALS = 21,
  SELECTED_HELP = 22,
  SELECTED_STATUS = 23,
}
