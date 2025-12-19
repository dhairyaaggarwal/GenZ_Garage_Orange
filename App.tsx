
import React, { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { InvestmentProjectionScreen } from './components/InvestmentProjectionScreen';
import { AutomatedUpdateScreen } from './components/AutomatedUpdateScreen';
import { BuddyIntroScreen } from './components/BuddyIntroScreen';
import { AskNameScreen } from './components/AskNameScreen';
import { AgeConfirmScreen } from './components/AgeConfirmScreen';
import { UnderageScreen } from './components/UnderageScreen';
import { DoNotInvestScreen } from './components/DoNotInvestScreen';
import { InvestedBeforeScreen } from './components/InvestedBeforeScreen';
import { FutureGoalsScreen } from './components/FutureGoalsScreen';
import { SelectedGoalsScreen } from './components/SelectedGoalsScreen';
import { InvestingStatusScreen } from './components/InvestingStatusScreen';
import { InvestingBenefitScreen } from './components/InvestingBenefitScreen';
import { InvestmentDurationScreen } from './components/InvestmentDurationScreen';
import { RiskToleranceScreen } from './components/RiskToleranceScreen';
import { HelpOptionsScreen } from './components/HelpOptionsScreen';
import { SelectedHelpOptionsScreen } from './components/SelectedHelpOptionsScreen';
import { FinalizePlanScreen } from './components/FinalizePlanScreen';
import { BuddyCelebrateScreen } from './components/BuddyCelebrateScreen';
import { SignupScreen } from './components/SignupScreen';
import { VerifyEmailOtpScreen } from './components/VerifyEmailOtpScreen';
import { LoginEmailScreen } from './components/LoginEmailScreen';
import { AnalyzingScreen } from './components/AnalyzingScreen';
import { Dashboard } from './components/Dashboard';
import { persistOnboardingState, setValue, getOnboardingState, calculateRiskProfile } from './utils/onboardingState';
import { InvestmentPlan, UserProfile, AppState } from './types';

export default function App() {
  const [currentStep, setCurrentStep] = useState<AppState>(AppState.LANDING);
  const [hasInvestedBefore, setHasInvestedBefore] = useState<boolean>(false);
  const [userGoals, setUserGoals] = useState<string[]>([]);
  const [generatedPlan, setGeneratedPlan] = useState<InvestmentPlan | null>(null);

  useEffect(() => {
    persistOnboardingState();
    const state = getOnboardingState();
    if (state.futureGoals) setUserGoals(state.futureGoals);
  }, []);

  const handleNext = () => {
    setCurrentStep(prev => (prev + 1) as AppState);
  };

  const handleAgeConfirm = (isOver18: boolean) => {
    if (isOver18) setCurrentStep(AppState.INVESTED_BEFORE);
    else setCurrentStep(AppState.UNDERAGE);
  };

  const handleLogin = () => setCurrentStep(AppState.LOGIN_EMAIL);
  const handleBackToLanding = () => setCurrentStep(AppState.LANDING);
  const handleChangeEmail = () => setCurrentStep(AppState.SIGNUP);

  const handleAnalysisComplete = (plan: InvestmentPlan) => {
    setGeneratedPlan(plan);
    setCurrentStep(AppState.DASHBOARD);
  };

  const handleInvestedBeforeSelection = (hasInvested: boolean) => {
    setHasInvestedBefore(hasInvested);
    setValue('investmentExperience', hasInvested ? 'investing' : 'never_started');
    handleNext();
  };

  const handleFutureGoalsSelection = (goals: string[]) => {
    setUserGoals(goals);
    setValue('futureGoals', goals);
    handleNext();
  };
  
  const handleInvestingStatusSelection = (status: string[]) => {
    setValue('selectedInvestingStatus', status);
    handleNext();
  };
  
  const handleHelpOptionsSelection = (options: string[]) => {
    setValue('selectedHelpOptions', options);
    handleNext();
  };

  const handleDurationSelection = (duration: string) => {
    setValue('investmentHorizon', duration);
    handleNext();
  };

  const handleRiskSelection = (risk: string) => {
    setValue('riskTolerance', risk);
    handleNext();
  };

  const getUserProfile = (): UserProfile => {
    const state = getOnboardingState();
    return {
      name: state.firstName || 'Friend',
      ageRange: '18-25',
      occupation: 'Investor',
      financialGoals: state.futureGoals || [],
      investmentInterests: state.selectedHelpOptions || [],
      motivation: state.investmentExperience === 'investing' ? 'Grow wealth further' : 'Start investing journey',
      riskAppetite: (state.riskTolerance === 'high' ? 'High' : state.riskTolerance === 'low' ? 'Low' : 'Medium') as 'Low' | 'Medium' | 'High',
      riskProfile: calculateRiskProfile()
    };
  };

  return (
    <div className="h-screen w-full font-sans text-gray-900 bg-[#fff7ed] overflow-hidden">
      {currentStep === AppState.LANDING && <WelcomeScreen onGetStarted={handleNext} onJumpToStep={(s) => setCurrentStep(s as AppState)} onLogin={handleLogin} />}
      {currentStep === AppState.PROJECTION && <InvestmentProjectionScreen onContinue={handleNext} onJumpToStep={(s) => setCurrentStep(s as AppState)} onLogin={handleLogin} />}
      {currentStep === AppState.AUTOMATED_UPDATE && <AutomatedUpdateScreen onContinue={handleNext} onJumpToStep={(s) => setCurrentStep(s as AppState)} onLogin={handleLogin} />}
      {currentStep === AppState.DO_NOT_INVEST && <DoNotInvestScreen onContinue={handleNext} onJumpToStep={(s) => setCurrentStep(s as AppState)} onLogin={handleLogin} />}
      {currentStep === AppState.BUDDY_INTRO && <BuddyIntroScreen onContinue={handleNext} onJumpToStep={(s) => setCurrentStep(s as AppState)} />}
      
      {/* Step 1: Basic Identity */}
      {currentStep === AppState.ASK_NAME && <AskNameScreen onContinue={handleNext} />}
      {currentStep === AppState.AGE_CONFIRM && <AgeConfirmScreen onConfirm={handleAgeConfirm} />}
      {currentStep === AppState.UNDERAGE && <UnderageScreen />}

      {/* Step 2: Experience & Goals */}
      {currentStep === AppState.INVESTED_BEFORE && <InvestedBeforeScreen onContinue={handleInvestedBeforeSelection} />}
      {currentStep === AppState.FUTURE_GOALS && <FutureGoalsScreen hasInvestedBefore={hasInvestedBefore} onContinue={handleFutureGoalsSelection} />}
      {currentStep === AppState.SELECTED_GOALS && <SelectedGoalsScreen selectedGoalIds={userGoals} onContinue={handleNext} />}

      {/* Step 3: Needs & Habits */}
      {currentStep === AppState.HELP_OPTIONS && <HelpOptionsScreen onContinue={handleHelpOptionsSelection} />}
      {currentStep === AppState.SELECTED_HELP_OPTIONS && <SelectedHelpOptionsScreen selectedHelpOptions={getOnboardingState().selectedHelpOptions} onContinue={handleNext} />}
      {currentStep === AppState.INVESTING_STATUS && <InvestingStatusScreen onContinue={handleInvestingStatusSelection} />}

      {/* Step 4: Financial Profile (Risk Quiz) */}
      {currentStep === AppState.INVESTING_BENEFIT && <InvestingBenefitScreen onContinue={handleNext} />}
      {currentStep === AppState.INVESTMENT_DURATION && <InvestmentDurationScreen onContinue={handleDurationSelection} />}
      {currentStep === AppState.RISK_TOLERANCE && <RiskToleranceScreen onContinue={handleRiskSelection} />}
      {currentStep === AppState.FINALIZE_PLAN && <FinalizePlanScreen onContinue={handleNext} />}
      {currentStep === AppState.BUDDY_CELEBRATE && <BuddyCelebrateScreen onContinue={handleNext} />}

      {/* Step 5: Account Creation */}
      {currentStep === AppState.SIGNUP && <SignupScreen onContinue={handleNext} />}
      {currentStep === AppState.VERIFY_EMAIL_OTP && <VerifyEmailOtpScreen onVerifySuccess={handleNext} onChangeEmail={handleChangeEmail} />}
      {currentStep === AppState.LOGIN_EMAIL && <LoginEmailScreen onBack={handleBackToLanding} onContinue={handleNext} />}

      {/* Post-Account: Analysis & Dashboard */}
      {currentStep === AppState.ANALYZING && <AnalyzingScreen onComplete={handleAnalysisComplete} />}
      {currentStep === AppState.DASHBOARD && generatedPlan && (
        <div className="h-full overflow-y-auto bg-white">
            <Dashboard plan={generatedPlan} user={getUserProfile()} onReset={() => setCurrentStep(AppState.LANDING)} />
        </div>
      )}
    </div>
  );
}
