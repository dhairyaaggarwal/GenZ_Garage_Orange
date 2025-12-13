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
import { IncomeScreen } from './components/IncomeScreen';
import { InvestmentDurationScreen } from './components/InvestmentDurationScreen';
import { RiskToleranceScreen } from './components/RiskToleranceScreen';
import { HelpOptionsScreen } from './components/HelpOptionsScreen';
import { SelectedHelpOptionsScreen } from './components/SelectedHelpOptionsScreen';
import { FinalizePlanScreen } from './components/FinalizePlanScreen';
import { BuddyCelebrateScreen } from './components/BuddyCelebrateScreen';
import { SignupScreen } from './components/SignupScreen';
import { VerifyEmailOtpScreen } from './components/VerifyEmailOtpScreen';
import { LoginEmailScreen } from './components/LoginEmailScreen';
import { persistOnboardingState, setValue, multiSelectToggle, getOnboardingState } from './utils/onboardingState';

// Updated AppState to include new onboarding steps
enum AppState {
  LANDING = 1,
  PROJECTION = 2,
  AUTOMATED_UPDATE = 3,
  DO_NOT_INVEST = 4,
  BUDDY_INTRO = 5,
  ASK_NAME = 6, // New
  AGE_CONFIRM = 7, // New
  UNDERAGE = 8, // New
  INVESTED_BEFORE = 9,
  FUTURE_GOALS = 10,
  SELECTED_GOALS = 11,
  HELP_OPTIONS = 12,
  SELECTED_HELP_OPTIONS = 13,
  INVESTING_STATUS = 14,
  INVESTING_BENEFIT = 15,
  INCOME = 16,
  INVESTMENT_DURATION = 17,
  RISK_TOLERANCE = 18,
  FINALIZE_PLAN = 19,
  BUDDY_CELEBRATE = 20,
  SIGNUP = 21,
  VERIFY_EMAIL_OTP = 22,
  LOGIN_EMAIL = 23,
}

export default function App() {
  const [currentStep, setCurrentStep] = useState<AppState>(AppState.LANDING);
  const [hasInvestedBefore, setHasInvestedBefore] = useState<boolean>(false);
  // Local state for UI driving, backed by persistent state
  const [userGoals, setUserGoals] = useState<string[]>([]);
  const [userInvestingStatus, setUserInvestingStatus] = useState<string[]>([]);
  const [userHelpOptions, setUserHelpOptions] = useState<string[]>([]);

  useEffect(() => {
    // Initialize persistent state
    persistOnboardingState();
    const state = getOnboardingState();
    if (state.futureGoals) setUserGoals(state.futureGoals);
    if (state.selectedInvestingStatus) setUserInvestingStatus(state.selectedInvestingStatus);
    if (state.selectedHelpOptions) setUserHelpOptions(state.selectedHelpOptions);
  }, []);

  const handleNext = () => {
    if (currentStep === AppState.LANDING) setCurrentStep(AppState.PROJECTION);
    else if (currentStep === AppState.PROJECTION) setCurrentStep(AppState.AUTOMATED_UPDATE);
    else if (currentStep === AppState.AUTOMATED_UPDATE) setCurrentStep(AppState.DO_NOT_INVEST);
    else if (currentStep === AppState.DO_NOT_INVEST) setCurrentStep(AppState.BUDDY_INTRO);
    else if (currentStep === AppState.BUDDY_INTRO) setCurrentStep(AppState.ASK_NAME); // New Flow
    else if (currentStep === AppState.ASK_NAME) setCurrentStep(AppState.AGE_CONFIRM); // New Flow
    // Age confirm handles branching internally via handleAgeConfirm
    else if (currentStep === AppState.INVESTED_BEFORE) setCurrentStep(AppState.FUTURE_GOALS);
    else if (currentStep === AppState.FUTURE_GOALS) setCurrentStep(AppState.SELECTED_GOALS);
    else if (currentStep === AppState.SELECTED_GOALS) setCurrentStep(AppState.HELP_OPTIONS);
    else if (currentStep === AppState.HELP_OPTIONS) setCurrentStep(AppState.SELECTED_HELP_OPTIONS);
    else if (currentStep === AppState.SELECTED_HELP_OPTIONS) setCurrentStep(AppState.INVESTING_STATUS);
    else if (currentStep === AppState.INVESTING_STATUS) setCurrentStep(AppState.INVESTING_BENEFIT);
    else if (currentStep === AppState.INVESTING_BENEFIT) setCurrentStep(AppState.INCOME);
    else if (currentStep === AppState.INCOME) setCurrentStep(AppState.INVESTMENT_DURATION);
    else if (currentStep === AppState.INVESTMENT_DURATION) setCurrentStep(AppState.RISK_TOLERANCE);
    else if (currentStep === AppState.RISK_TOLERANCE) setCurrentStep(AppState.FINALIZE_PLAN);
    else if (currentStep === AppState.FINALIZE_PLAN) setCurrentStep(AppState.BUDDY_CELEBRATE);
    else if (currentStep === AppState.BUDDY_CELEBRATE) setCurrentStep(AppState.SIGNUP);
    else if (currentStep === AppState.SIGNUP) setCurrentStep(AppState.VERIFY_EMAIL_OTP);
    else if (currentStep === AppState.VERIFY_EMAIL_OTP) {
      console.log("Onboarding Complete!");
      alert("Email Verified! Welcome to Orange.");
    }
    else if (currentStep === AppState.LOGIN_EMAIL) {
       setCurrentStep(AppState.VERIFY_EMAIL_OTP);
    }
  };

  const handleAgeConfirm = (isOver18: boolean) => {
    if (isOver18) {
      setCurrentStep(AppState.INVESTED_BEFORE);
    } else {
      setCurrentStep(AppState.UNDERAGE);
    }
  };

  const handleLogin = () => {
    setCurrentStep(AppState.LOGIN_EMAIL);
  };

  const handleBackToLanding = () => {
    setCurrentStep(AppState.LANDING);
  };

  const handleChangeEmail = () => {
     setCurrentStep(AppState.SIGNUP);
  };

  const handleInvestedBeforeSelection = (hasInvested: boolean) => {
    setHasInvestedBefore(hasInvested);
    setValue('investmentExperience', hasInvested ? 'investing' : 'never_started');
    handleNext();
  };

  const handleFutureGoalsSelection = (goals: string[]) => {
    setUserGoals(goals);
    setValue('futureGoals', goals);
    if (goals.length > 0) setValue('firstFutureGoal', goals[0]);
    handleNext();
  };
  
  const handleInvestingStatusSelection = (status: string[]) => {
    setUserInvestingStatus(status);
    setValue('selectedInvestingStatus', status);
    if (status.length > 0) setValue('firstInvestingSelection', status[0]);
    handleNext();
  };
  
  const handleHelpOptionsSelection = (options: string[]) => {
    setUserHelpOptions(options);
    setValue('selectedHelpOptions', options);
    if (options.length > 0) setValue('firstHelpSelection', options[0]);
    handleNext();
  };

  const handleIncomeSelection = (income: string) => {
    setValue('annualIncomeBracket', income);
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

  const handleJumpToStep = (step: number) => {
    if (step >= 1 && step <= 5) {
      setCurrentStep(step);
    }
  };

  return (
    <div className="h-screen w-full font-sans text-gray-900 bg-[#fff7ed] overflow-hidden">
      
      {currentStep === AppState.LANDING && (
        <WelcomeScreen 
          onGetStarted={handleNext} 
          onJumpToStep={handleJumpToStep}
          onLogin={handleLogin}
        />
      )}

      {currentStep === AppState.PROJECTION && (
        <InvestmentProjectionScreen 
          onContinue={handleNext} 
          onJumpToStep={handleJumpToStep}
          onLogin={handleLogin}
        />
      )}

      {currentStep === AppState.AUTOMATED_UPDATE && (
        <AutomatedUpdateScreen
          onContinue={handleNext}
          onJumpToStep={handleJumpToStep}
          onLogin={handleLogin}
        />
      )}

      {currentStep === AppState.DO_NOT_INVEST && (
        <DoNotInvestScreen
          onContinue={handleNext}
          onJumpToStep={handleJumpToStep}
          onLogin={handleLogin}
        />
      )}

      {currentStep === AppState.BUDDY_INTRO && (
        <BuddyIntroScreen
          onContinue={handleNext}
          onJumpToStep={handleJumpToStep}
        />
      )}

      {currentStep === AppState.ASK_NAME && (
        <AskNameScreen
          onContinue={handleNext}
        />
      )}

      {currentStep === AppState.AGE_CONFIRM && (
        <AgeConfirmScreen
          onConfirm={handleAgeConfirm}
        />
      )}

      {currentStep === AppState.UNDERAGE && (
        <UnderageScreen />
      )}

      {currentStep === AppState.INVESTED_BEFORE && (
        <InvestedBeforeScreen
          onContinue={handleInvestedBeforeSelection}
        />
      )}

      {currentStep === AppState.FUTURE_GOALS && (
        <FutureGoalsScreen
          hasInvestedBefore={hasInvestedBefore}
          onContinue={handleFutureGoalsSelection}
        />
      )}

      {currentStep === AppState.SELECTED_GOALS && (
        <SelectedGoalsScreen
          selectedGoalIds={userGoals}
          onContinue={handleNext}
        />
      )}

      {currentStep === AppState.HELP_OPTIONS && (
        <HelpOptionsScreen
          onContinue={handleHelpOptionsSelection}
        />
      )}

      {currentStep === AppState.SELECTED_HELP_OPTIONS && (
        <SelectedHelpOptionsScreen
          selectedHelpOptions={userHelpOptions}
          onContinue={handleNext}
        />
      )}

      {currentStep === AppState.INVESTING_STATUS && (
        <InvestingStatusScreen
          onContinue={handleInvestingStatusSelection}
        />
      )}

      {currentStep === AppState.INVESTING_BENEFIT && (
        <InvestingBenefitScreen
          onContinue={handleNext}
        />
      )}

      {currentStep === AppState.INCOME && (
        <IncomeScreen
          onContinue={handleIncomeSelection}
        />
      )}

      {currentStep === AppState.INVESTMENT_DURATION && (
        <InvestmentDurationScreen
          onContinue={handleDurationSelection}
        />
      )}

      {currentStep === AppState.RISK_TOLERANCE && (
        <RiskToleranceScreen
          onContinue={handleRiskSelection}
        />
      )}

      {currentStep === AppState.FINALIZE_PLAN && (
        <FinalizePlanScreen
          onContinue={handleNext}
        />
      )}

      {currentStep === AppState.BUDDY_CELEBRATE && (
        <BuddyCelebrateScreen
          onContinue={handleNext}
        />
      )}

      {currentStep === AppState.SIGNUP && (
        <SignupScreen
          onContinue={handleNext}
        />
      )}

      {currentStep === AppState.VERIFY_EMAIL_OTP && (
        <VerifyEmailOtpScreen
          onVerifySuccess={handleNext}
          onChangeEmail={handleChangeEmail}
        />
      )}

      {currentStep === AppState.LOGIN_EMAIL && (
        <LoginEmailScreen
          onBack={handleBackToLanding}
          onContinue={handleNext}
        />
      )}

    </div>
  );
}