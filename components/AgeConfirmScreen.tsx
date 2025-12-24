
import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { CircularHeader } from './CircularHeader';
import { getOnboardingState } from '../utils/onboardingState';

interface AgeConfirmScreenProps {
  onConfirm: (isOver18: boolean) => void;
  onJumpToStep?: (step: number) => void;
}

export const AgeConfirmScreen: React.FC<AgeConfirmScreenProps> = ({ onConfirm, onJumpToStep }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selection, setSelection] = useState<boolean | null>(null);

  const playVoice = async () => {
    setIsPlaying(true);
    const state = getOnboardingState();
    const name = state.first_name || '';
    const utterance = new SpeechSynthesisUtterance(`Nice to meet ya, ${name}! Are you older than 18?`);
    utterance.onend = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    setTimeout(playVoice, 500);
    return () => { window.speechSynthesis.cancel(); };
  }, []);

  const handleSelection = (isOver18: boolean) => {
    setSelection(isOver18);
    setTimeout(() => onConfirm(isOver18), 300);
  };

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-brand-bg font-sans">
      <CircularHeader currentStep={1} totalSteps={5} onJumpToStep={onJumpToStep} />
      
      <div className="flex-1 flex flex-col items-center px-6 z-10 w-full max-w-md mx-auto mt-6">
         <h1 className="text-4xl text-brand-text text-center font-black mb-12 leading-tight">
           Are you over 18?
         </h1>

         <div className="w-full space-y-4">
           <button 
             onClick={() => handleSelection(true)} 
             className={`w-full p-8 rounded-[2rem] flex items-center justify-between group transition-all duration-200 shadow-md ${
                selection === true ? 'option-card-selected' : 'option-card-default'
             }`}
           >
             <span className="text-2xl font-black text-brand-text">Yes</span>
             <span className="text-3xl">✅</span>
           </button>
           <button 
             onClick={() => handleSelection(false)} 
             className={`w-full p-8 rounded-[2rem] flex items-center justify-between group transition-all duration-200 shadow-md ${
                selection === false ? 'option-card-selected' : 'option-card-default'
             }`}
           >
             <span className="text-2xl font-black text-brand-text">No</span>
             <span className="text-3xl">🚫</span>
           </button>
         </div>
      </div>
    </div>
  );
};
