
import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import { CircularHeader } from './CircularHeader';
import { getOnboardingState } from '../utils/onboardingState';

interface InvestingStatusScreenProps {
  onContinue: (selectedStatus: string[]) => void;
  onJumpToStep?: (step: number) => void;
}

const STATUS_OPTIONS = [
  { id: 'not_started', text: 'I haven’t started yet', emoji: '🥲' },
  { id: 'saving', text: 'I am saving', emoji: '💰' },
  { id: 'investing', text: 'I am investing', emoji: '📈' },
  { id: 'saving_and_investing', text: 'I am saving and investing', emoji: '🤑' },
];

export const InvestingStatusScreen: React.FC<InvestingStatusScreenProps> = ({ onContinue, onJumpToStep }) => {
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  useEffect(() => {
    const state = getOnboardingState();
    const name = state.first_name || 'Friend';
    const utterance = new SpeechSynthesisUtterance(`${name}, are you currently investing or saving?`);
    window.speechSynthesis.speak(utterance);
    return () => window.speechSynthesis.cancel();
  }, []);

  const toggleOption = (id: string) => {
    setSelectedStatus(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-brand-bg font-sans">
      <CircularHeader currentStep={3} totalSteps={5} onJumpToStep={onJumpToStep} />
      
      <div className="flex-1 flex flex-col items-center px-6 z-10 w-full max-w-md mx-auto overflow-y-auto no-scrollbar pb-32">
         <h1 className="text-4xl text-brand-text text-center mb-6 leading-tight mt-4">
           Are you currently investing or saving?
         </h1>

         <div className="w-full space-y-3">
           {STATUS_OPTIONS.map((opt) => {
             const isSelected = selectedStatus.includes(opt.id);
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
              onClick={() => onContinue(selectedStatus)} 
              disabled={selectedStatus.length === 0} 
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
