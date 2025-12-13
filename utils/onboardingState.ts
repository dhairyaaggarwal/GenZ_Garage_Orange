
export interface UserPlaylist {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  emoji: string;
  color: string;
  iconColor: string;
  trend: string; // Kept for compatibility with detail screen type, even if hidden on card
  details: any; // Stores the specific holdings/returns for this playlist
  createdAt: number;
}

export interface OnboardingState {
  firstName: string | null;
  investmentExperience: string | null;
  investmentHorizon: string | null;
  futureGoals: string[];
  firstFutureGoal: string | null;
  riskTolerance: string | null;
  annualIncomeBracket: string | null;
  selectedHelpOptions: string[];
  firstHelpSelection: string | null;
  selectedInvestingStatus: string[];
  firstInvestingSelection: string | null;
  stressedAboutMoney: boolean | null;
  helpNeededWithInvesting: string | null;
  mobileNumber: string | null;
  email: string | null;
  mobileVerified?: boolean;
  emailVerified?: boolean;
  sessionToken?: string;
  playlistInterests?: string[];
  playlistCompanies?: string[];
  playlistGoal?: string | null;
  myPlaylists: UserPlaylist[];
}

const initialState: OnboardingState = {
  firstName: null,
  investmentExperience: null,
  investmentHorizon: null,
  futureGoals: [],
  firstFutureGoal: null,
  riskTolerance: null,
  annualIncomeBracket: null,
  selectedHelpOptions: [],
  firstHelpSelection: null,
  selectedInvestingStatus: [],
  firstInvestingSelection: null,
  stressedAboutMoney: null,
  helpNeededWithInvesting: null,
  mobileNumber: null,
  email: null,
  mobileVerified: false,
  emailVerified: false,
  sessionToken: undefined,
  playlistInterests: [],
  playlistCompanies: [],
  playlistGoal: null,
  myPlaylists: []
};

export let onboardingState: OnboardingState = { ...initialState };

// Load from local storage if available
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

export function multiSelectToggle(arrayName: 'futureGoals' | 'selectedHelpOptions' | 'selectedInvestingStatus', valueKey: string) {
  let arr = onboardingState[arrayName] || [];
  const index = arr.indexOf(valueKey);
  
  if (index === -1) {
    arr.push(valueKey);
    // Track first selection
    if (arr.length === 1) {
      if (arrayName === 'futureGoals') onboardingState.firstFutureGoal = valueKey;
      if (arrayName === 'selectedHelpOptions') onboardingState.firstHelpSelection = valueKey;
      if (arrayName === 'selectedInvestingStatus') onboardingState.firstInvestingSelection = valueKey;
    }
  } else {
    arr.splice(index, 1);
     // Update first selection if needed
    if (index === 0) {
       if (arr.length > 0) {
        if (arrayName === 'futureGoals') onboardingState.firstFutureGoal = arr[0];
        if (arrayName === 'selectedHelpOptions') onboardingState.firstHelpSelection = arr[0];
        if (arrayName === 'selectedInvestingStatus') onboardingState.firstInvestingSelection = arr[0];
       } else {
        if (arrayName === 'futureGoals') onboardingState.firstFutureGoal = null;
        if (arrayName === 'selectedHelpOptions') onboardingState.firstHelpSelection = null;
        if (arrayName === 'selectedInvestingStatus') onboardingState.firstInvestingSelection = null;
       }
    }
  }
  
  onboardingState[arrayName] = [...arr];
  persistOnboardingState();
}

export function setValue(key: keyof OnboardingState, value: any) {
  (onboardingState as any)[key] = value;
  persistOnboardingState();
}

export function addPlaylist(playlist: UserPlaylist) {
  // Prevent duplicate adds if user clicks multiple times or navigates back
  const exists = onboardingState.myPlaylists.some(p => p.id === playlist.id);
  if (!exists) {
    onboardingState.myPlaylists = [playlist, ...onboardingState.myPlaylists];
    persistOnboardingState();
  }
}
