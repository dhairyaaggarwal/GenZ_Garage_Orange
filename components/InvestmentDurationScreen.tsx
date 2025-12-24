
import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import { CircularHeader } from './CircularHeader';

interface InvestmentDurationScreenProps {
  onContinue: (duration: string) => void;
  onJumpToStep?: (step: number) => void;
}

const DURATION_OPTIONS = [
  { id: "lt_5", label: "Fewer than 5 years" },
  { id: "5_10", label: "5–10 years" },
  { id: "10_20", label: "10–20 years" },
  { id: "20_30", label: "20–30 years" },
  { id: "30_plus", label: "30+ years" },
  { id: "dont_know", label: "I don’t know yet" }
];

export const InvestmentDurationScreen: React.FC<InvestmentDurationScreenProps> = ({ onContinue, onJumpToStep }) => {
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);

  useEffect(() => {
    const utterance = new SpeechSynthesisUtterance("How long do you plan to invest?");
    utterance.rate = 1.1;
    window.speechSynthesis.speak(utterance);
    return () => window.speechSynthesis.cancel();
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-brand-bg font-sans">
      <CircularHeader currentStep={4} totalSteps={5} onJumpToStep={onJumpToStep} />
      
      <div className="flex-1 flex flex-col items-center px-6 z-10 w-full max-w-md mx-auto mt-6 overflow-hidden">
         <h1 className="text-3xl text-brand-text text-center mb-6 leading-tight shrink-0">
           How long do you plan to invest?
         </h1>

         <div className="w-full flex-1 overflow-y-auto no-scrollbar pb-32 space-y-3">
           {DURATION_OPTIONS.map((option) => {
             const isSelected = selectedDuration === option.id;
             return (
               <button 
                 key={option.id} 
                 onClick={() => setSelectedDuration(option.id)} 
                 className={`w-full p-4 rounded-2xl flex items-center justify-center transition-all duration-200 font-bold text-lg border-2 ${
                   isSelected ? 'option-card-selected' : 'option-card-default'
                 }`}
               >
                 {option.label}
               </button>
             );
           })}
         </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6 pb-12 bg-gradient-to-t from-brand-bg via-brand-bg to-transparent z-20">
         <div className="max-w-md mx-auto">
            <Button 
              onClick={() => selectedDuration && onContinue(selectedDuration)} 
              disabled={!selectedDuration} 
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
