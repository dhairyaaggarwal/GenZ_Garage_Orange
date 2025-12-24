
import React, { useEffect, useState } from 'react';
import { generateInvestmentPlan } from '../services/geminiService';
import { getOnboardingState, calculateRiskProfile } from '../utils/onboardingState';
import { InvestmentPlan, UserProfile } from '../types';
import { Loader2, Sparkles, ShieldCheck, Heart } from 'lucide-react';

interface AnalyzingScreenProps {
  onComplete: (plan: InvestmentPlan) => void;
}

const MESSAGES = [
    "Crunching numbers...",
    "Reviewing your dreams...",
    "Finding top Indian funds...",
    "Matching with SEBI regulated leaders...",
    "Ensuring your money stays safe...",
    "Buddy is personalizing your mix...",
    "Almost there, superstar!"
];

export const AnalyzingScreen: React.FC<AnalyzingScreenProps> = ({ onComplete }) => {
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
        setCurrentMessage(prev => (prev + 1) % MESSAGES.length);
    }, 2500);

    const startAnalysis = async () => {
        const state = getOnboardingState();
        const profile: UserProfile = {
            name: state.first_name || 'Friend',
            financialGoals: state.future_goals || [],
            investmentInterests: state.investment_needs || [],
            riskProfile: calculateRiskProfile()
        };

        try {
            const plan = await generateInvestmentPlan(profile);
            onComplete(plan);
        } catch (error) {
            onComplete({
                allocations: [{ assetClass: 'Equity', percentage: 70, color: '#9B7EEC' }],
                summary: 'Growth Plan',
                rationale: 'Diversified for growth.',
                firstSteps: ['KYC', 'SIP'],
                expectedReturn: '10%',
                riskLevel: 'Moderate'
            });
        }
    };

    startAnalysis();
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center bg-brand-bg px-6 text-center">
      <div className="relative mb-16 scale-110">
        <div className="w-40 h-40 rounded-full bg-brand-secondary/10 animate-pulse absolute top-0 left-0"></div>
        <div className="w-40 h-40 rounded-full bg-white border-4 border-brand-card flex items-center justify-center relative z-10 shadow-2xl">
           <Loader2 className="w-20 h-20 text-brand-secondary animate-spin" />
        </div>
        <div className="absolute -top-4 -right-4 bg-brand-primary p-3 rounded-full shadow-lg animate-bounce">
            <Sparkles className="w-8 h-8 text-brand-text" />
        </div>
        <div className="absolute -bottom-4 -left-4 bg-white p-2 rounded-full shadow-md">
            <ShieldCheck className="w-6 h-6 text-brand-success" />
        </div>
      </div>
      
      <h1 className="text-4xl font-black text-brand-text mb-6 tracking-tight">
        Buddy is <span className="text-brand-secondary">Thinking...</span>
      </h1>
      
      <p className="text-xl text-brand-subtext font-bold h-16 max-w-xs mx-auto">
        {MESSAGES[currentMessage]}
      </p>

      <div className="mt-20 w-full max-w-xs h-3 bg-white/50 rounded-full overflow-hidden border border-brand-card">
        <div className="h-full bg-brand-secondary animate-[loading_8s_linear_infinite]"></div>
      </div>

      {/* Increased contrast for readability */}
      <div className="mt-12 flex items-center gap-2 text-[14px] font-black uppercase tracking-widest text-[#1F1F1F]">
        <Heart size={18} className="text-[#9B7EEC] fill-[#9B7EEC]" />
        <span>Made by GenZ for the GenZ xoxo</span>
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
