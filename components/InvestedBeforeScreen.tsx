import React, { useEffect, useRef, useState } from 'react';
import { CircularHeader } from './CircularHeader';

interface InvestedBeforeScreenProps {
  onContinue: (hasInvested: boolean) => void;
}

const VOICE_TEXT = "Have you invested before?";

export const InvestedBeforeScreen: React.FC<InvestedBeforeScreenProps> = ({ onContinue }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selection, setSelection] = useState<boolean | null>(null);
  const hasPlayedRef = useRef(false);

  const playVoice = async () => {
    if (hasPlayedRef.current) return;
    hasPlayedRef.current = true;
    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(VOICE_TEXT);
    utterance.rate = 1.1;
    utterance.onend = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    setTimeout(playVoice, 500);
    return () => { window.speechSynthesis.cancel(); };
  }, []);

  const handleSelection = (value: boolean) => {
    setSelection(value);
    window.speechSynthesis.cancel();
    setTimeout(() => onContinue(value), 300);
  };

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-brand-bg font-sans">
      <CircularHeader currentStep={2} totalSteps={5} />
      
      <div className="flex-1 flex flex-col items-center justify-center px-6 z-10 w-full max-w-md mx-auto -mt-10">
         <h1 className="text-4xl text-brand-text text-center font-black mb-10 leading-tight">
           Have you invested before?
         </h1>
         
         <div className="w-full space-y-4">
           <button 
             onClick={() => handleSelection(true)} 
             className={`w-full p-8 rounded-[2rem] flex items-center justify-between group transition-all duration-200 shadow-sm ${
                selection === true ? 'option-card-selected' : 'option-card-default'
             }`}
           >
             <span className="text-2xl font-black text-brand-text">Yes</span>
             <span className="text-3xl">📈</span>
           </button>
           <button 
             onClick={() => handleSelection(false)} 
             className={`w-full p-8 rounded-[2rem] flex items-center justify-between group transition-all duration-200 shadow-sm ${
                selection === false ? 'option-card-selected' : 'option-card-default'
             }`}
           >
             <span className="text-2xl font-black text-brand-text">No</span>
             <span className="text-3xl">🌱</span>
           </button>
         </div>
      </div>
    </div>
  );
};