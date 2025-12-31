
import React, { useState, useEffect, useCallback } from 'react';
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
import { CreateVibeScreen } from './components/CreateVibeScreen';
import { SelectedVibeScreen } from './components/SelectedVibeScreen';
import { CompanySelectionScreen } from './components/CompanySelectionScreen';
import { GoalSelectionScreen } from './components/GoalSelectionScreen';
import { persistOnboardingState, setValue, getOnboardingState, getStateFromStep } from './utils/onboardingState';
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
];

export default function App() {
  const [currentStep, setCurrentStep] = useState<AppState>(AppState.LANDING);
  const [generatedPlan, setGeneratedPlan] = useState<InvestmentPlan | null>(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>(INITIAL_PLAYLISTS);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaylists(prev => prev.map(p => {
        const fluctuation = (Math.random() - 0.5) * 0.001;
        const newReturn = p.numericReturn + fluctuation;
        return {
          ...p,
          numericReturn: newReturn,
          returns: `${(newReturn * 100).toFixed(1)}%`
        };
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    persistOnboardingState();
  }, [currentStep]);

  const handleJumpToOnboardingStep = useCallback((step: number) => {
    setCurrentStep(getStateFromStep(step));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentStep(prev => (prev + 1) as AppState);
  }, []);

  const handleAgeConfirm = (isOver18: boolean) => {
    setValue('is_over_18', isOver18);
    if (isOver18) {
      setCurrentStep(AppState.FUTURE_GOALS);
    } else {
      setCurrentStep(AppState.UNDERAGE);
    }
  };

  const handleVibeSelection = (vibes: string[]) => {
    setValue('vibes', vibes);
    setCurrentStep(AppState.SELECTED_VIBE);
  };

  const handleHelpOptionsSelection = (options: string[]) => {
    setValue('investment_needs', options);
    setCurrentStep(AppState.SELECTED_HELP);
  };

  const handleAnalysisComplete = (plan: InvestmentPlan) => {
    setGeneratedPlan(plan);
    setCurrentStep(AppState.PLAYLIST_RESULT);
  };

  const state = getOnboardingState();
  const selectedPlaylist = playlists.find(p => p.id === selectedPlaylistId);

  return (
    <div 
      className="h-full w-full font-sans text-brand-text bg-brand-bg overflow-hidden flex flex-col" 
      style={{ 
        paddingTop: 'env(safe-area-inset-top)', 
        paddingBottom: 'env(safe-area-inset-bottom)' 
      }} 
      role="main"
    >
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {currentStep === AppState.LANDING && <WelcomeScreen onGetStarted={handleNext} onJumpToStep={handleJumpToOnboardingStep} onLogin={() => setCurrentStep(AppState.SIGNUP)} />}
        {currentStep === AppState.BUDDY_INTRO && <BuddyIntroScreen onContinue={handleNext} onJumpToStep={handleJumpToOnboardingStep} />}
        
        {currentStep === AppState.ASK_NAME && <AskNameScreen onContinue={handleNext} onJumpToStep={handleJumpToOnboardingStep} />}
        {currentStep === AppState.AGE_CONFIRM && <AgeConfirmScreen onConfirm={handleAgeConfirm} onJumpToStep={handleJumpToOnboardingStep} />}
        {currentStep === AppState.UNDERAGE && <UnderageScreen />}

        {currentStep === AppState.FUTURE_GOALS && <FutureGoalsScreen onContinue={(goals) => { setValue('future_goals', goals); setCurrentStep(AppState.SELECTED_GOALS); }} onJumpToStep={handleJumpToOnboardingStep} />}
        {currentStep === AppState.SELECTED_GOALS && <SelectedGoalsScreen selectedGoalIds={state.future_goals} onContinue={() => setCurrentStep(AppState.HELP_OPTIONS)} onJumpToStep={handleJumpToOnboardingStep} />}

        {currentStep === AppState.HELP_OPTIONS && <HelpOptionsScreen onContinue={handleHelpOptionsSelection} onJumpToStep={handleJumpToOnboardingStep} />}
        {currentStep === AppState.SELECTED_HELP && <SelectedHelpOptionsScreen selectedHelpOptions={state.investment_needs} onContinue={() => setCurrentStep(AppState.ONBOARDING_VIBE)} onJumpToStep={handleJumpToOnboardingStep} />}

        {currentStep === AppState.ONBOARDING_VIBE && <VibeScreen isOnboarding onContinue={handleVibeSelection} onBack={() => setCurrentStep(AppState.HELP_OPTIONS)} />}
        {currentStep === AppState.SELECTED_VIBE && <SelectedVibeScreen selectedVibes={state.vibes} onContinue={() => setCurrentStep(AppState.INVESTING_STATUS)} onJumpToStep={handleJumpToOnboardingStep} />}

        {currentStep === AppState.INVESTING_STATUS && <InvestingStatusScreen onContinue={(status) => { setValue('current_activities', status); setCurrentStep(AppState.SELECTED_STATUS); }} onJumpToStep={handleJumpToOnboardingStep} />}
        {currentStep === AppState.SELECTED_STATUS && <SelectedInvestingStatusScreen selectedStatus={state.current_activities} onContinue={() => setCurrentStep(AppState.INVESTMENT_DURATION)} onJumpToStep={handleJumpToOnboardingStep} />}

        {currentStep === AppState.INVESTMENT_DURATION && <InvestmentDurationScreen onContinue={(dur) => { setValue('investment_horizon', dur); setCurrentStep(AppState.RISK_TOLERANCE); }} onJumpToStep={handleJumpToOnboardingStep} />}
        {currentStep === AppState.RISK_TOLERANCE && <RiskToleranceScreen onContinue={(risk) => { setValue('risk_temperament', risk); setCurrentStep(AppState.FINALIZE_PLAN); }} onJumpToStep={handleJumpToOnboardingStep} />}
        {currentStep === AppState.FINALIZE_PLAN && <FinalizePlanScreen onContinue={handleNext} onJumpToStep={handleJumpToOnboardingStep} />}

        {currentStep === AppState.SIGNUP && <SignupScreen onContinue={handleNext} onJumpToStep={handleJumpToOnboardingStep} />}
        {currentStep === AppState.VERIFY_EMAIL_OTP && <VerifyEmailOtpScreen onVerifySuccess={() => setCurrentStep(AppState.ANALYZING)} onChangeEmail={() => setCurrentStep(AppState.SIGNUP)} onJumpToStep={handleJumpToOnboardingStep} />}

        {currentStep === AppState.ANALYZING && <AnalyzingScreen onComplete={handleAnalysisComplete} />}
        
        {currentStep === AppState.PLAYLIST_RESULT && generatedPlan && (
          <PlaylistResultScreen plan={generatedPlan} onSave={() => setCurrentStep(AppState.HOME)} onBack={() => setCurrentStep(AppState.FINALIZE_PLAN)} />
        )}

        {currentStep === AppState.HOME && <HomeScreen playlists={playlists} onSelectPlaylist={(p) => { setSelectedPlaylistId(p.id); setCurrentStep(AppState.PLAYLIST_DETAIL); }} onCreatePlaylist={() => setCurrentStep(AppState.CREATE_VIBE)} />}

        {currentStep === AppState.PLAYLIST_DETAIL && selectedPlaylist && <PlaylistDetailScreen playlist={selectedPlaylist} onBack={() => setCurrentStep(AppState.HOME)} />}

        {currentStep === AppState.CREATE_VIBE && <CreateVibeScreen onContinue={(v) => { setValue('vibes', v); setCurrentStep(AppState.CREATE_COMPANIES); }} onBack={() => setCurrentStep(AppState.HOME)} />}
        {currentStep === AppState.CREATE_COMPANIES && <CompanySelectionScreen onContinue={() => setCurrentStep(AppState.CREATE_GOAL)} onBack={() => setCurrentStep(AppState.CREATE_VIBE)} />}
        {currentStep === AppState.CREATE_GOAL && <GoalSelectionScreen onContinue={(g) => { setValue('risk_temperament', g); setCurrentStep(AppState.ANALYZING); }} onBack={() => setCurrentStep(AppState.CREATE_COMPANIES)} />}
      </div>
    </div>
  );
}
