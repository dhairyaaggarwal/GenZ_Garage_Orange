import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { ArrowRight } from 'lucide-react';

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
      setFade(false); // Start fade out
      setTimeout(() => {
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        setFade(true); // Start fade in
      }, 500); // Wait for fade out to complete
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-gradient-to-br from-orange-100 via-orange-200 to-rose-200 animate-gradient-xy font-sans">
      {/* Background Shapes for extra warmth */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vh] h-[50vh] bg-orange-300/20 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vh] h-[50vh] bg-rose-300/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>

      {/* Atmospheric White Glow Circles */}
      <div className="absolute top-[15%] right-[5%] w-64 h-64 bg-white/30 rounded-full blur-[80px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[20%] left-[10%] w-80 h-80 bg-white/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[500px] max-h-[500px] bg-white/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header with Logo */}
      <header className="px-6 pt-12 pb-6 flex justify-between items-center w-full z-20 relative">
        <div className="flex items-center gap-2">
           <svg viewBox="0 0 100 100" className="w-8 h-8 shrink-0 drop-shadow-sm">
             <path d="M50 25 C 50 25 65 5 85 15 C 85 15 75 35 50 35" fill="#65a30d" />
             <path d="M50 25 C 50 25 35 5 15 15 C 15 15 25 35 50 35" fill="#4d7c0f" />
             <circle cx="50" cy="60" r="35" fill="url(#orangeGradWelcome)" />
             <ellipse cx="35" cy="50" rx="10" ry="5" transform="rotate(-45 35 50)" fill="white" fillOpacity="0.3" />
             <defs>
               <linearGradient id="orangeGradWelcome" x1="20" y1="20" x2="80" y2="90" gradientUnits="userSpaceOnUse">
                 <stop offset="0%" stopColor="#fb923c" />
                 <stop offset="100%" stopColor="#ea580c" />
               </linearGradient>
             </defs>
           </svg>
           <span className="font-bold text-xl text-gray-900 tracking-tight">Orange</span>
        </div>
        <button 
          onClick={onLogin} 
          className="text-sm font-medium text-gray-700 hover:text-orange-700 transition-colors backdrop-blur-sm bg-white/30 px-3 py-1.5 rounded-full"
        >
          I already have an account &gt;
        </button>
      </header>

      {/* Segmented Progress Bar (Step 1 of 3) */}
      <div className="px-6 w-full z-20 mb-8 flex gap-2">
         {[1, 2, 3].map((step) => (
           <button 
             key={step} 
             onClick={() => onJumpToStep(step)}
             className={`h-1.5 flex-1 rounded-full transition-all duration-300 cursor-pointer hover:h-2 ${
               step === 1 ? 'bg-gray-900' : 'bg-gray-400/30 hover:bg-gray-400/50'
             }`}
             aria-label={`Go to step ${step}`}
           />
         ))}
      </div>

      {/* Center Content */}
      <div className="flex-1 flex items-center justify-center px-6 z-10">
        <h1 
          className={`text-4xl md:text-6xl font-extrabold text-center tracking-tight transition-all duration-700 ease-in-out transform ${
            fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-rose-600 drop-shadow-sm leading-tight">
            {phrases[currentPhraseIndex]}
          </span>
        </h1>
      </div>

      {/* Bottom Action Area */}
      <div className="pb-12 px-6 w-full flex justify-center z-10">
        <Button 
          onClick={onGetStarted} 
          className="w-[85%] py-4 text-lg flex items-center justify-center gap-2 group hover:scale-[1.02] transition-all"
        >
          <span className="font-bold">Get Started</span>
        </Button>
      </div>
    </div>
  );
};