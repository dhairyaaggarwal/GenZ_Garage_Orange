
import React, { useEffect, useState, useRef } from 'react';
import { Button } from './Button';
import { CircularHeader } from './CircularHeader';
import { speakBuddy, stopBuddy } from '../utils/voice';

interface RiskToleranceScreenProps {
  onContinue: (riskTolerance: string) => void;
  onJumpToStep?: (step: number) => void;
}

const RISK_OPTIONS = [
  { 
    id: 'high_reward', 
    text: 'I want maximum growth potential', 
    desc: 'I’m okay with big ups and downs to grow wealth faster.', 
    emoji: '🚀' 
  },
  { 
    id: 'moderate_high', 
    text: 'I want a steady climb', 
    desc: 'I prefer moderate growth with a bit of a safety net.', 
    emoji: '📈' 
  },
  { 
    id: 'moderate', 
    text: 'Balance is everything to me', 
    desc: 'I want my money to grow but safety is just as important.', 
    emoji: '⚖️' 
  },
  { 
    id: 'low', 
    text: 'Safety is my top priority', 
    desc: 'I prefer lower returns if it means my money stays steady.', 
    emoji: '🛡️' 
  }
];

export const RiskToleranceScreen: React.FC<RiskToleranceScreenProps> = ({ onContinue, onJumpToStep }) => {
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    const playVoice = () => {
      if (hasPlayedRef.current) return;
      hasPlayedRef.current = true;
      
      speakBuddy(`How do you feel about your money growing over time? There are no wrong answers here.`);
    };

    const timer = setTimeout(playVoice, 800);
    
    return () => {
      clearTimeout(timer);
      stopBuddy();
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-brand-bg font-sans">
      <CircularHeader currentStep={4} totalSteps={5} onJumpToStep={onJumpToStep} />

      <div className="flex-1 flex flex-col items-center px-6 z-10 w-full max-w-md mx-auto mt-6 overflow-hidden">
         <h1 className="text-3xl text-brand-text text-center font-black mb-10 leading-tight shrink-0">
           What's your <span className="text-brand-secondary italic font-serif">comfort level?</span>
         </h1>

         <div className="w-full flex-1 overflow-y-auto no-scrollbar pb-32 space-y-4">
           {RISK_OPTIONS.map((option) => {
             const isSelected = selectedRisk === option.id;
             return (
               <button 
                 key={option.id}
                 onClick={() => setSelectedRisk(option.id)}
                 className={`w-full p-5 rounded-[2rem] text-left transition-all duration-200 border-2 flex items-start gap-4 ${
                   isSelected 
                     ? 'option-card-selected shadow-lg' 
                     : 'option-card-default'
                 }`}
               >
                 <div className="text-2xl mt-1">{option.emoji}</div>
                 <div>
                    <p className="font-black text-lg text-brand-text leading-tight mb-1">{option.text}</p>
                    <p className="text-xs text-brand-subtext font-medium leading-relaxed">{option.desc}</p>
                 </div>
               </button>
             );
           })}
         </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6 pb-12 bg-gradient-to-t from-brand-bg via-brand-bg to-transparent z-20">
         <div className="max-w-md mx-auto space-y-4">
            <Button 
               onClick={() => selectedRisk && onContinue(selectedRisk)}
               disabled={!selectedRisk}
               fullWidth
               className="py-4 text-xl"
            >
               Continue
            </Button>
         </div>
      </div>
    </div>
  );
};
