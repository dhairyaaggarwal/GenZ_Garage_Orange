import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import { ArrowRight } from 'lucide-react';

interface AutomatedUpdateScreenProps {
  onContinue: () => void;
  onJumpToStep: (step: number) => void;
  onLogin: () => void;
}

export const AutomatedUpdateScreen: React.FC<AutomatedUpdateScreenProps> = ({ onContinue, onJumpToStep, onLogin }) => {
  const [animateCard, setAnimateCard] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    setTimeout(() => setAnimateCard(true), 200);
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-gradient-to-br from-orange-200 via-rose-200 to-orange-100 font-sans">
      
      {/* Animated Background Gradient Layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 via-rose-400/10 to-transparent animate-gradient-xy opacity-70"></div>

      {/* Atmospheric White Glow Circles */}
      <div className="absolute top-[5%] left-[10%] w-64 h-64 bg-white/30 rounded-full blur-[80px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[25%] right-[-10%] w-80 h-80 bg-white/20 rounded-full blur-[90px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[600px] max-h-[600px] bg-white/10 rounded-full blur-[130px] pointer-events-none"></div>

      {/* Floating Particles (Fireflies) */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute top-3/4 left-1/3 w-1.5 h-1.5 bg-orange-300 rounded-full opacity-50 animate-bounce delay-700"></div>
      <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-white/40 rounded-full blur-[1px] animate-pulse delay-300"></div>
      <div className="absolute bottom-1/3 right-1/2 w-2 h-2 bg-rose-300/40 rounded-full animate-ping duration-[3000ms]"></div>

      {/* Background Blobs for Depth */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vh] h-[50vh] bg-orange-500/10 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50vh] h-[50vh] bg-rose-500/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      
      {/* Header */}
      <header className="px-6 pt-12 pb-6 flex justify-between items-center w-full z-20 relative">
        <div className="flex items-center gap-2">
           <svg viewBox="0 0 100 100" className="w-8 h-8 shrink-0 drop-shadow-sm">
             <path d="M50 25 C 50 25 65 5 85 15 C 85 15 75 35 50 35" fill="#65a30d" />
             <path d="M50 25 C 50 25 35 5 15 15 C 15 15 25 35 50 35" fill="#4d7c0f" />
             <circle cx="50" cy="60" r="35" fill="url(#orangeGradAuto)" />
             <ellipse cx="35" cy="50" rx="10" ry="5" transform="rotate(-45 35 50)" fill="white" fillOpacity="0.3" />
             <defs>
               <linearGradient id="orangeGradAuto" x1="20" y1="20" x2="80" y2="90" gradientUnits="userSpaceOnUse">
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

      {/* Segmented Progress Bar (Step 3 of 3) */}
      <div className="px-6 w-full z-20 mb-4 flex gap-2">
         {[1, 2, 3].map((step) => (
           <button 
             key={step} 
             onClick={() => onJumpToStep(step)}
             className={`h-1.5 flex-1 rounded-full transition-all duration-300 cursor-pointer hover:h-2 ${
               step === 3 ? 'bg-gray-900' : 'bg-gray-400/30 hover:bg-gray-400/50'
             }`}
             aria-label={`Go to step ${step}`}
           />
         ))}
      </div>

      {/* Main Content Wrapper - Hiding scrollbar explicitly */}
      <div 
        className="flex-1 px-6 flex flex-col items-center z-10 w-full max-w-md mx-auto relative overflow-y-auto"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        {/* Main "Mobile Screen" Card */}
        <div 
          className={`w-full flex-1 flex flex-col justify-center bg-white/30 backdrop-blur-2xl rounded-[40px] border border-white/60 shadow-[0_20px_60px_-15px_rgba(249,115,22,0.15)] mb-6 transform transition-all duration-1000 ease-out relative overflow-hidden ${
            animateCard ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ minHeight: '380px' }}
        >
          {/* Subtle inner gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/10 pointer-events-none"></div>

          {/* Center Section: Orb and Message */}
          <div className="flex flex-col items-center px-6">
            {/* Glowing Orb */}
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-300 via-orange-400 to-rose-500 blur-md animate-pulse absolute top-0 left-0 opacity-50"></div>
              <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-orange-300 to-yellow-200 shadow-[0_0_60px_rgba(251,146,60,0.6)] relative z-10 animate-blob"></div>
              {/* Inner highlight */}
              <div className="absolute top-4 right-6 w-8 h-8 rounded-full bg-white/40 blur-lg z-20"></div>
            </div>

            {/* Gradient Message Bubble - Overlapping slightly */}
            <div className="w-full bg-gradient-to-br from-white/95 via-orange-50/90 to-white/95 backdrop-blur-md border border-white/80 p-5 rounded-2xl shadow-lg shadow-orange-500/5 relative z-20 -mt-6 transform hover:scale-[1.02] transition-transform">
               <p className="text-center text-gray-800 font-medium leading-relaxed">
                 Your Automated portfolio is on the rise! It has gone up <span className="font-bold text-orange-600">3.41%</span> since last week.
               </p>
            </div>
          </div>
        </div>

        {/* Bottom Headline - Outside Card */}
        <h1 
          className={`text-2xl md:text-3xl font-extrabold text-center text-gray-900 leading-[1.2] mb-6 max-w-xs mx-auto transition-all duration-1000 delay-300 ${
            animateCard ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Start your financial<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-rose-600">Journey Today</span>
        </h1>

        {/* CTA Button - Outside Card */}
        <div className={`w-full pb-8 transition-all duration-1000 delay-500 ${animateCard ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
           <Button 
             onClick={onContinue}
             className="w-[95%] mx-auto py-4 text-lg hover:scale-[1.02] flex items-center justify-center gap-2 transition-all"
           >
             <span className="font-bold tracking-wide">Get Started</span>
           </Button>
        </div>
      </div>
    </div>
  );
};