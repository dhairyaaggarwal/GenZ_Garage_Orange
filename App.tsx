
import React, { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { BuddyIntroScreen } from './components/BuddyIntroScreen';
import { AskNameScreen } from './components/AskNameScreen';
import { AgeConfirmScreen } from './components/AgeConfirmScreen';
import { UnderageScreen } from './components/UnderageScreen';
import { FutureGoalsScreen } from './components/FutureGoalsScreen';
import { SelectedGoalsScreen } from './components/SelectedGoalsScreen';
import { HelpOptionsScreen } from './components/HelpOptionsScreen';
import { SelectedHelpOptionsScreen } from './components/SelectedHelpOptionsScreen';
import { InvestingStatusScreen } from './components/InvestingStatusScreen';
import { SelectedInvestingStatusScreen } from './components/SelectedInvestingStatusScreen';
import { InvestmentDurationScreen } from './components/InvestmentDurationScreen';
import { RiskToleranceScreen } from './components/RiskToleranceScreen';
import { FinalizePlanScreen } from './components/FinalizePlanScreen';
import { SignupScreen } from './components/SignupScreen';
import { VerifyEmailOtpScreen } from './components/VerifyEmailOtpScreen';
import { AnalyzingScreen } from './components/AnalyzingScreen';
import { PlaylistResultScreen } from './components/PlaylistResultScreen';
import { HomeScreen } from './components/HomeScreen';
import { PlaylistDetailScreen } from './components/PlaylistDetailScreen';
import { VibeScreen } from './components/VibeScreen';
import { CompanySelectionScreen } from './components/CompanySelectionScreen';
import { GoalSelectionScreen } from './components/GoalSelectionScreen';
import { persistOnboardingState, setValue, getOnboardingState, getStepFromState, getStateFromStep } from './utils/onboardingState';
import { InvestmentPlan, AppState, Playlist } from './types';

const INITIAL_PLAYLISTS: Playlist[] = [
  { 
    id: "make_in_india", 
    title: "Make In India", 
    emoji: "🇮🇳", 
    returns: "24.5%", 
    numericReturn: 0.245, 
    color: "bg-[#FFB7A5]",
    description: "Focuses on Indian manufacturing giants benefiting from government push and localization.",
    items: [
      { name: "Tata Motors", returns: "28%", weight: "40%", icon: "🚗" },
      { name: "L&T", returns: "18%", weight: "30%", icon: "🏗️" },
      { name: "Reliance Ind", returns: "15%", weight: "30%", icon: "💎" }
    ]
  },
  { 
    id: "digital_first", 
    title: "Digital First", 
    emoji: "🌐", 
    returns: "31.2%", 
    numericReturn: 0.312, 
    color: "bg-[#DFFF4F]",
    description: "The stars of Digital India. Includes top tech services and consumer platforms.",
    items: [
      { name: "Zomato", returns: "45%", weight: "35%", icon: "🍕" },
      { name: "Infosys", returns: "12%", weight: "35%", icon: "💻" },
      { name: "PB Fintech", returns: "22%", weight: "30%", icon: "🛡️" }
    ]
  },
  { 
    id: "women_led", 
    title: "Women Led", 
    emoji: "👸", 
    returns: "19.8%", 
    numericReturn: 0.198, 
    color: "bg-[#D8C8EE]",
    description: "Companies with strong female leadership and those focused on the growing women's economy.",
    items: [
      { name: "Nykaa", returns: "18%", weight: "40%", icon: "💄" },
      { name: "HUL", returns: "12%", weight: "30%", icon: "🧴" },
      { name: "Titan", returns: "24%", weight: "30%", icon: "⌚" }
    ]
  },
  { 
    id: "green_future", 
    title: "Green Future", 
    emoji: "🌱", 
    returns: "28.1%", 
    numericReturn: 0.281, 
    color: "bg-[#BFFFC1]",
    description: "Sustainability leaders driving India's net-zero transition and renewable energy boom.",
    items: [
      { name: "Tata Power", returns: "32%", weight: "40%", icon: "⚡" },
      { name: "Adani Green", returns: "35%", weight: "30%", icon: "☀️" },
      { name: "JSW Energy", returns: "22%", weight: "30%", icon: "🌊" }
    ]
  },
];

export default function App() {
  const [currentStep, setCurrentStep] = useState<AppState>(AppState.LANDING);
  const [generatedPlan, setGeneratedPlan] = useState<InvestmentPlan | null>(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>(INITIAL_PLAYLISTS);

  // Simulated Live Market Feed (Zerodha Mock)
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaylists(prev => prev.map(p => {
        const fluctuation = (Math.random() - 0.5) * 0.002; // Tiny realistic fluctuation
        const newReturn = p.numericReturn + fluctuation;
        return {
          ...p,
          numericReturn: newReturn,
          returns: `${(newReturn * 100).toFixed(1)}%`
        };
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    persistOnboardingState();
  }, []);

  const handleNext = () => {
    setCurrentStep(prev => (prev + 1) as AppState);
  };

  const handleJumpToOnboardingStep = (step: number) => {
    setCurrentStep(getStateFromStep(step));
  };

  const handleAgeConfirm = (isOver18: boolean) => {
    setValue('is_over_18', isOver18);
    if (isOver18) {
      setCurrentStep(AppState.FUTURE_GOALS);
    } else {
      setCurrentStep(AppState.UNDERAGE);
    }
  };

  const handleAnalysisComplete = (plan: InvestmentPlan) => {
    setGeneratedPlan(plan);
    setCurrentStep(AppState.PLAYLIST_RESULT);
  };

  const handleViewPlaylist = (playlist: Playlist) => {
    setSelectedPlaylistId(playlist.id);
    setCurrentStep(AppState.PLAYLIST_DETAIL);
  };

  const handleFutureGoalsSelection = (goals: string[]) => {
    setValue('future_goals', goals);
    setCurrentStep(AppState.SELECTED_GOALS);
  };
  
  const handleHelpOptionsSelection = (options: string[]) => {
    setValue('investment_needs', options);
    setCurrentStep(AppState.SELECTED_HELP);
  };

  const handleInvestingStatusSelection = (status: string[]) => {
    setValue('current_activities', status);
    setCurrentStep(AppState.SELECTED_STATUS);
  };

  const handleDurationSelection = (duration: string) => {
    setValue('investment_horizon', duration);
    setCurrentStep(AppState.RISK_TOLERANCE);
  };

  const handleRiskSelection = (risk: string) => {
    setValue('risk_temperament', risk);
    setCurrentStep(AppState.FINALIZE_PLAN);
  };

  const state = getOnboardingState();
  const selectedPlaylist = playlists.find(p => p.id === selectedPlaylistId);

  return (
    <div className="h-screen w-full font-sans text-brand-text bg-[#E9DDF3] overflow-hidden">
      {currentStep === AppState.LANDING && <WelcomeScreen onGetStarted={handleNext} onJumpToStep={handleJumpToOnboardingStep} onLogin={() => setCurrentStep(AppState.SIGNUP)} />}
      {currentStep === AppState.BUDDY_INTRO && <BuddyIntroScreen onContinue={handleNext} onJumpToStep={handleJumpToOnboardingStep} />}
      
      {currentStep === AppState.ASK_NAME && <AskNameScreen onContinue={handleNext} onJumpToStep={handleJumpToOnboardingStep} />}
      {currentStep === AppState.AGE_CONFIRM && <AgeConfirmScreen onConfirm={handleAgeConfirm} onJumpToStep={handleJumpToOnboardingStep} />}
      {currentStep === AppState.UNDERAGE && <UnderageScreen />}

      {currentStep === AppState.FUTURE_GOALS && <FutureGoalsScreen onContinue={handleFutureGoalsSelection} onJumpToStep={handleJumpToOnboardingStep} />}
      {currentStep === AppState.SELECTED_GOALS && (
        <SelectedGoalsScreen 
          selectedGoalIds={state.future_goals} 
          onContinue={() => setCurrentStep(AppState.HELP_OPTIONS)} 
          onJumpToStep={handleJumpToOnboardingStep}
        />
      )}

      {currentStep === AppState.HELP_OPTIONS && <HelpOptionsScreen onContinue={handleHelpOptionsSelection} onJumpToStep={handleJumpToOnboardingStep} />}
      {currentStep === AppState.SELECTED_HELP && (
        <SelectedHelpOptionsScreen 
          selectedHelpOptions={state.investment_needs} 
          onContinue={() => setCurrentStep(AppState.INVESTING_STATUS)} 
          onJumpToStep={handleJumpToOnboardingStep}
        />
      )}

      {currentStep === AppState.INVESTING_STATUS && <InvestingStatusScreen onContinue={handleInvestingStatusSelection} onJumpToStep={handleJumpToOnboardingStep} />}
      {currentStep === AppState.SELECTED_STATUS && (
        <SelectedInvestingStatusScreen 
          selectedStatus={state.current_activities} 
          onContinue={() => setCurrentStep(AppState.INVESTMENT_DURATION)} 
          onJumpToStep={handleJumpToOnboardingStep}
        />
      )}

      {currentStep === AppState.INVESTMENT_DURATION && <InvestmentDurationScreen onContinue={handleDurationSelection} onJumpToStep={handleJumpToOnboardingStep} />}
      {currentStep === AppState.RISK_TOLERANCE && <RiskToleranceScreen onContinue={handleRiskSelection} onJumpToStep={handleJumpToOnboardingStep} />}
      {currentStep === AppState.FINALIZE_PLAN && <FinalizePlanScreen onContinue={handleNext} onJumpToStep={handleJumpToOnboardingStep} />}

      {currentStep === AppState.SIGNUP && <SignupScreen onContinue={handleNext} onJumpToStep={handleJumpToOnboardingStep} />}
      {currentStep === AppState.VERIFY_EMAIL_OTP && <VerifyEmailOtpScreen onVerifySuccess={() => setCurrentStep(AppState.ANALYZING)} onChangeEmail={() => setCurrentStep(AppState.SIGNUP)} onJumpToStep={handleJumpToOnboardingStep} />}

      {currentStep === AppState.ANALYZING && <AnalyzingScreen onComplete={handleAnalysisComplete} />}
      
      {currentStep === AppState.PLAYLIST_RESULT && generatedPlan && (
        <PlaylistResultScreen 
          plan={generatedPlan} 
          onSave={() => setCurrentStep(AppState.HOME)} 
          onBack={() => setCurrentStep(AppState.HOME)} 
        />
      )}

      {currentStep === AppState.HOME && (
        <HomeScreen 
          playlists={playlists}
          onSelectPlaylist={handleViewPlaylist} 
          onCreatePlaylist={() => setCurrentStep(AppState.CREATE_VIBE)} 
        />
      )}

      {currentStep === AppState.PLAYLIST_DETAIL && selectedPlaylist && (
        <PlaylistDetailScreen playlist={selectedPlaylist} onBack={() => setCurrentStep(AppState.HOME)} />
      )}

      {/* "Create Playlist" Flow */}
      {currentStep === AppState.CREATE_VIBE && (
        <VibeScreen onContinue={(vibes) => {
          setValue('investment_needs', vibes);
          setCurrentStep(AppState.CREATE_COMPANIES);
        }} onBack={() => setCurrentStep(AppState.HOME)} />
      )}
      {currentStep === AppState.CREATE_COMPANIES && (
        <CompanySelectionScreen onContinue={(companies) => {
          setCurrentStep(AppState.CREATE_GOAL);
        }} onBack={() => setCurrentStep(AppState.CREATE_VIBE)} />
      )}
      {currentStep === AppState.CREATE_GOAL && (
        <GoalSelectionScreen onContinue={(goal) => {
          setValue('risk_temperament', goal);
          setCurrentStep(AppState.ANALYZING);
        }} onBack={() => setCurrentStep(AppState.CREATE_COMPANIES)} />
      )}
    </div>
  );
}
