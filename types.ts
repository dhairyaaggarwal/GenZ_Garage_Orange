export interface UserProfile {
  name: string;
  ageRange: string;
  occupation: string;
  financialGoals: string[];
  investmentInterests: string[];
  motivation: string;
  riskAppetite: 'Low' | 'Medium' | 'High';
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
}

export enum AppState {
  LANDING,
  PROJECTION,
  ONBOARDING,
  ANALYZING,
  DASHBOARD
}
