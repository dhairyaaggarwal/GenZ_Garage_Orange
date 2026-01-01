
import React, { useState, useEffect, useRef } from 'react';
import { CircularHeader } from './CircularHeader';
import { speakBuddy, stopBuddy } from '../utils/voice';

interface AgeConfirmScreenProps {
  onConfirm: (isOver18: boolean) => void;
  onJumpToStep?: (step: number) => void;
}

export const AgeConfirmScreen: React.FC<AgeConfirmScreenProps> = ({ onConfirm, onJumpToStep }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selection, setSelection] = useState<boolean | null>(null);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    const playIntro = () => {
      if (hasPlayedRef.current) return;
      hasPlayedRef.current = true;
      setIsPlaying(true);
      
      // Removed name as per user request to keep speech clean and non-repetitive
      speakBuddy(`Nice to meet you! Are you older than 18?`, () => setIsPlaying(false));
    };

    const timer = setTimeout(playIntro, 800);
    
    return () => {
      clearTimeout(timer);
      stopBuddy();
    };
  }, []);

  const handleSelection = (isOver18: boolean) => {
    setSelection(isOver18);
    stopBuddy();
    setTimeout(() => onConfirm(isOver18), 300);
  };

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-brand-bg font-sans">
      <CircularHeader currentStep={1} totalSteps={5} onJumpToStep={onJumpToStep} />
      
      <div className="flex-1 flex flex-col items-center px-6 z-10 w-full max-w-md mx-auto mt-6">
         <h1 className="text-4xl text-brand-text text-center font-black mb-12 leading-tight">
           Are you <span className="italic font-serif text-brand-secondary">over 18?</span>
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
         
         {isPlaying && (
           <div className="mt-8 flex items-center gap-1.5">
             <div className="w-2.5 h-2.5 bg-brand-secondary rounded-full animate-bounce"></div>
             <div className="w-2.5 h-2.5 bg-brand-secondary rounded-full animate-bounce delay-100"></div>
             <div className="w-2.5 h-2.5 bg-brand-secondary rounded-full animate-bounce delay-200"></div>
           </div>
         )}
      </div>
    </div>
  );
};
