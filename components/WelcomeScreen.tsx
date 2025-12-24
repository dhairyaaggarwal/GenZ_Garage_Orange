import React, { useState, useEffect } from 'react';
import { Button } from './Button';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onJumpToStep: (step: number) => void;
  onLogin: () => void;
}

const phrases = [
  "Welcome to Orange",
  "Made for Beginners",
  "We'll Guide You, Step by Step",
  "We do the Hardwork for you"
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted, onJumpToStep, onLogin }) => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        setFade(true);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-brand-bg font-sans">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[60vh] h-[60vh] bg-brand-secondary/20 rounded-full blur-[100px] animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vh] h-[50vh] bg-brand-tertiary/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>

      {/* Header */}
      <header className="px-6 pt-12 pb-6 flex justify-between items-center w-full z-20 relative">
        <div className="flex items-center gap-2">
           <svg viewBox="0 0 100 100" className="w-10 h-10 shrink-0 drop-shadow-sm">
             <path d="M50 25 C 50 25 65 5 85 15 C 85 15 75 35 50 35" fill="#DFFF4F" />
             <path d="M50 25 C 50 25 35 5 15 15 C 15 15 25 35 50 35" fill="#9B7EEC" />
             <circle cx="50" cy="60" r="35" fill="url(#themeGradWelcome)" />
             <defs>
               <linearGradient id="themeGradWelcome" x1="20" y1="20" x2="80" y2="90" gradientUnits="userSpaceOnUse">
                 <stop offset="0%" stopColor="#9B7EEC" />
                 <stop offset="100%" stopColor="#FFB7A5" />
               </linearGradient>
             </defs>
           </svg>
           <span className="font-black text-2xl text-brand-text tracking-tight">Orange</span>
        </div>
        <button 
          onClick={onLogin} 
          className="text-sm font-bold text-brand-secondary hover:underline transition-colors px-4 py-2"
        >
          Login &gt;
        </button>
      </header>

      {/* Center Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 z-10 text-center">
        <h1 
          className={`text-4xl md:text-7xl font-black tracking-tight transition-all duration-700 ease-in-out transform ${
            fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Using a deeper, more vibrant gradient for better visibility */}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6D28D9] via-[#9B7EEC] to-[#F97316] leading-tight py-4 inline-block drop-shadow-sm">
            {phrases[currentPhraseIndex]}
          </span>
        </h1>
      </div>

      {/* Bottom Action Area */}
      <div className="pb-16 px-6 w-full flex justify-center z-10">
        <Button 
          onClick={onGetStarted} 
          className="w-[85%] py-4 text-xl group hover:scale-[1.05] transition-all shadow-xl shadow-brand-primary/20"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};