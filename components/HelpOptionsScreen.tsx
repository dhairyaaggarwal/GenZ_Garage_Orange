
import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import { CircularHeader } from './CircularHeader';
import { getOnboardingState } from '../utils/onboardingState';

interface HelpOptionsScreenProps {
  onContinue: (selectedOptions: string[]) => void;
  onJumpToStep?: (step: number) => void;
}

const HELP_OPTIONS = [
  { id: 'teach_me', text: 'Teach me about investing', emoji: '📘' },
  { id: 'invest_on_my_own', text: 'Let me invest on my own', emoji: '📈' },
  { id: 'personalized_insights', text: 'Personalized investing insights', emoji: '💡' },
  { id: 'dont_know', text: 'I don’t know yet', emoji: '🤷‍♀️' },
];

export const HelpOptionsScreen: React.FC<HelpOptionsScreenProps> = ({ onContinue, onJumpToStep }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  useEffect(() => {
    const text = `How can we help achieve your goals?`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.15;
    window.speechSynthesis.speak(utterance);
    return () => window.speechSynthesis.cancel();
  }, []);

  const toggleOption = (id: string) => {
    setSelectedOptions(prev => prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id]);
  };

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-brand-bg font-sans">
      <CircularHeader currentStep={3} totalSteps={5} onJumpToStep={onJumpToStep} />
      
      <div className="flex-1 flex flex-col items-center px-6 z-10 w-full max-w-md mx-auto overflow-y-auto no-scrollbar pb-32">
         <h1 className="text-4xl text-brand-text text-center mb-6 leading-tight mt-4">
           How can we help achieve your goals?
         </h1>

         <div className="w-full space-y-3">
           {HELP_OPTIONS.map((opt) => {
             const isSelected = selectedOptions.includes(opt.id);
             return (
               <button 
                 key={opt.id} 
                 onClick={() => toggleOption(opt.id)} 
                 className={`w-full p-5 rounded-[2rem] flex items-center justify-between group transition-all duration-200 border-2 ${
                   isSelected ? 'option-card-selected' : 'option-card-default'
                 }`}
               >
                 <span className={`text-lg font-bold text-left text-brand-text`}>
                   {opt.text}
                 </span>
                 <span className="text-2xl ml-2">{opt.emoji}</span>
               </button>
             );
           })}
         </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6 pb-12 bg-gradient-to-t from-brand-bg via-brand-bg to-transparent z-20">
         <div className="max-w-md mx-auto">
            <Button 
              onClick={() => onContinue(selectedOptions)} 
              disabled={selectedOptions.length === 0} 
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
