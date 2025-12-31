
import React, { useEffect, useRef } from 'react';
import { Button } from './Button';
import { speakBuddy } from '../utils/voice';

interface BuddyCelebrateScreenProps {
  onContinue: () => void;
}

const CAPTION_FULL = "Way to go! We have all we need to put together your plan.";

export const BuddyCelebrateScreen: React.FC<BuddyCelebrateScreenProps> = ({ onContinue }) => {
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    const playVoice = () => {
      if (hasPlayedRef.current) return;
      hasPlayedRef.current = true;
      speakBuddy(CAPTION_FULL);
    };

    const timer = setTimeout(playVoice, 800);
    return () => {
      window.speechSynthesis.cancel();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-brand-bg font-sans select-none">
      <header className="pt-12 pb-6 flex justify-center w-full z-20 relative">
        <div className="flex items-center gap-2">
           <svg viewBox="0 0 100 100" className="w-10 h-10 shrink-0 drop-shadow-sm">
             <circle cx="50" cy="60" r="35" fill="url(#themeGradCel)" />
             <defs>
               <linearGradient id="themeGradCel" x1="20" y1="20" x2="80" y2="90" gradientUnits="userSpaceOnUse">
                 <stop offset="0%" stopColor="#9B7EEC" />
                 <stop offset="100%" stopColor="#FFB7A5" />
               </linearGradient>
             </defs>
           </svg>
           <span className="font-black text-2xl text-brand-text tracking-tight">Orange</span>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 z-10 w-full max-w-md mx-auto relative">
        <div className="relative mb-16 animate-in fade-in duration-500 zoom-in-95">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-secondary/20 rounded-full blur-[60px] animate-pulse"></div>
           <div className="w-40 h-40 rounded-full relative z-10 flex items-center justify-center shadow-2xl bg-gradient-to-br from-brand-secondary via-brand-primary to-brand-tertiary border-4 border-white animate-blob">
              <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-md"></div>
           </div>
        </div>

        <div className="text-center w-full max-w-[95%] mb-8">
            <h2 className="text-3xl font-black text-brand-text leading-tight tracking-tight">
              {CAPTION_FULL}
            </h2>
        </div>
      </div>

      <div className="pb-16 px-6 w-full flex justify-center z-20">
         <Button onClick={onContinue} fullWidth className="py-4 text-xl">
           Continue
         </Button>
      </div>
    </div>
  );
};
