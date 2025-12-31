
import React, { useState, useEffect, useRef } from 'react';
import { Button } from './Button';
import { CircularHeader } from './CircularHeader';
import { Mic } from 'lucide-react';
import { setValue, persistOnboardingState } from '../utils/onboardingState';
import { speakBuddy, stopBuddy } from '../utils/voice';

interface AskNameScreenProps {
  onContinue: () => void;
  onJumpToStep?: (step: number) => void;
}

const VOICE_TEXT = "I am so excited to help you! To get us moving, what’s your first name?";

export const AskNameScreen: React.FC<AskNameScreenProps> = ({ onContinue, onJumpToStep }) => {
  const [name, setName] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (hasPlayedRef.current) return;
      hasPlayedRef.current = true;
      setIsPlaying(true);
      speakBuddy(VOICE_TEXT, () => setIsPlaying(false));
    }, 800);

    return () => {
      clearTimeout(timer);
      stopBuddy();
    };
  }, []);

  const handleContinue = () => {
    if (name.trim()) {
      setValue('first_name', name.trim());
      persistOnboardingState();
      stopBuddy();
      onContinue();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filteredValue = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    setName(filteredValue);
  };

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-brand-bg font-sans">
      <CircularHeader currentStep={1} totalSteps={5} onJumpToStep={onJumpToStep} />
      <div className="flex-1 flex flex-col items-center px-6 z-10 w-full max-w-md mx-auto mt-12">
         <h1 className="text-4xl text-brand-text text-center font-black mb-12 leading-tight tracking-tight">
           What's your <br/> <span className="italic text-brand-secondary font-serif">first name?</span>
         </h1>
         <div className="w-full relative mb-8">
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={handleInputChange}
              placeholder="E.g. Priya"
              autoFocus
              className="w-full bg-white px-8 py-5 rounded-[2.5rem] text-2xl text-brand-text placeholder-brand-muted border-2 border-brand-card focus:border-brand-secondary focus:outline-none transition-all text-center shadow-sm"
            />
            <button className="absolute right-6 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-secondary p-2">
              <Mic size={24} />
            </button>
         </div>
      </div>
      <div className="pb-16 px-6 w-full flex justify-center z-20">
         <Button onClick={handleContinue} disabled={!name.trim()} className="w-[85%] py-4 text-xl shadow-xl shadow-brand-primary/20">
           Continue
         </Button>
      </div>
    </div>
  );
};
