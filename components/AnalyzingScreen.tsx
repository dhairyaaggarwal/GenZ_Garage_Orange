
import React, { useEffect, useState } from 'react';
import { generateInvestmentPlan } from '../services/geminiService';
import { getOnboardingState, calculateRiskProfile } from '../utils/onboardingState';
import { InvestmentPlan, UserProfile } from '../types';
import { Loader2, Sparkles } from 'lucide-react';

interface AnalyzingScreenProps {
  onComplete: (plan: InvestmentPlan) => void;
}

const MESSAGES = [
    "Crunching the numbers...",
    "Reviewing your goals...",
    "Matching with top Indian funds...",
    "Optimizing for your risk level...",
    "Buddy is putting it all together...",
    "Almost there! Just a few more seconds."
];

export const AnalyzingScreen: React.FC<AnalyzingScreenProps> = ({ onComplete }) => {
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const messageInterval = setInterval(() => {
        setCurrentMessage(prev => (prev + 1) % MESSAGES.length);
    }, 2500);

    const startAnalysis = async () => {
        const state = getOnboardingState();
        const calculatedRisk = calculateRiskProfile();
        
        const profile: UserProfile = {
            name: state.firstName || 'Friend',
            ageRange: '18-25',
            occupation: 'Beginner Investor',
            financialGoals: state.futureGoals || [],
            investmentInterests: state.selectedHelpOptions || [],
            motivation: state.investmentExperience === 'investing' ? 'Grow wealth further' : 'Start investing journey',
            riskAppetite: (state.riskTolerance === 'high' ? 'High' : state.riskTolerance === 'low' ? 'Low' : 'Medium') as 'Low' | 'Medium' | 'High',
            riskProfile: calculatedRisk
        };

        try {
            const plan = await generateInvestmentPlan(profile);
            onComplete(plan);
        } catch (error) {
            console.error("Analysis failed", error);
            onComplete({
                allocations: [
                    // Fix: Use equity_display and debt_display instead of equity and debt
                    { assetClass: 'Equity (Stock Funds)', percentage: calculatedRisk.equity_display, color: '#f97316' }, 
                    { assetClass: 'Fixed Income (Safe)', percentage: calculatedRisk.debt_display, color: '#fbbf24' },
                    { assetClass: 'Others', percentage: 100 - calculatedRisk.equity_display - calculatedRisk.debt_display, color: '#94a3b8' }
                ],
                summary: `The ${calculatedRisk.type.toLowerCase()} Starter`,
                rationale: `We hit a small snag, but based on your risk score of ${calculatedRisk.score}, this ${calculatedRisk.type} plan is perfect for your goals.`,
                firstSteps: ["Download an investment app", "Complete your KYC", "Start a ₹500 SIP"]
            });
        }
    };

    startAnalysis();

    return () => clearInterval(messageInterval);
  }, [onComplete]);

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-orange-200 px-6 text-center">
      <div className="relative mb-12">
        <div className="w-32 h-32 rounded-full bg-orange-500/20 animate-ping absolute top-0 left-0"></div>
        <div className="w-32 h-32 rounded-full bg-orange-100 flex items-center justify-center relative z-10 shadow-xl">
           <Loader2 className="w-16 h-16 text-orange-500 animate-spin" />
        </div>
        <div className="absolute -top-2 -right-2 bg-yellow-400 p-2 rounded-full shadow-lg animate-bounce">
            <Sparkles className="w-6 h-6 text-gray-900" />
        </div>
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-4 animate-pulse">
        Creating Your Strategy
      </h1>
      
      <p className="text-xl text-gray-700 font-medium h-12 transition-all duration-500">
        {MESSAGES[currentMessage]}
      </p>

      <div className="mt-20 w-full max-w-xs h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-orange-500 animate-[loading_10s_linear_infinite]"></div>
      </div>

      <style>{`
        @keyframes loading {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};
