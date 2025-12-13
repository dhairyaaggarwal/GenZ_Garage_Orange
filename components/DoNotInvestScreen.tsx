import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import { Award } from 'lucide-react';

interface DoNotInvestScreenProps {
  onContinue: () => void;
  onJumpToStep: (step: number) => void;
  onLogin: () => void;
}

export const DoNotInvestScreen: React.FC<DoNotInvestScreenProps> = ({ onContinue, onJumpToStep, onLogin }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowContent(true), 200);
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-gradient-to-br from-orange-200 via-rose-200 to-orange-100 font-sans">
       {/* Background layers */}
       <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 via-rose-400/10 to-transparent animate-gradient-xy opacity-70"></div>
       
       {/* Atmospheric White Glow Circles */}
       <div className="absolute top-[5%] left-[10%] w-64 h-64 bg-white/30 rounded-full blur-[80px] pointer-events-none animate-pulse"></div>
       <div className="absolute bottom-[25%] right-[-10%] w-80 h-80 bg-white/20 rounded-full blur-[90px] pointer-events-none"></div>
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[600px] max-h-[600px] bg-white/10 rounded-full blur-[130px] pointer-events-none"></div>

       {/* Drifting Particles */}
       <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-white rounded-full opacity-60 animate-[pulse_3s_ease-in-out_infinite]"></div>
       <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-yellow-100 rounded-full opacity-50 animate-[pulse_4s_ease-in-out_infinite_1s]"></div>
       <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-orange-100 rounded-full opacity-40 animate-[pulse_5s_ease-in-out_infinite_2s]"></div>
       
       {/* Header with Centered Logo */}
       <header className="px-6 pt-12 pb-6 flex flex-col items-center w-full z-20 relative gap-6">
          <div className="flex items-center gap-2">
             <svg viewBox="0 0 100 100" className="w-8 h-8 shrink-0 drop-shadow-sm">
               <path d="M50 25 C 50 25 65 5 85 15 C 85 15 75 35 50 35" fill="#65a30d" />
               <path d="M50 25 C 50 25 35 5 15 15 C 15 15 25 35 50 35" fill="#4d7c0f" />
               <circle cx="50" cy="60" r="35" fill="url(#orangeGradDoNot)" />
               <ellipse cx="35" cy="50" rx="10" ry="5" transform="rotate(-45 35 50)" fill="white" fillOpacity="0.3" />
               <defs>
                 <linearGradient id="orangeGradDoNot" x1="20" y1="20" x2="80" y2="90" gradientUnits="userSpaceOnUse">
                   <stop offset="0%" stopColor="#fb923c" />
                   <stop offset="100%" stopColor="#ea580c" />
                 </linearGradient>
               </defs>
             </svg>
             <span className="font-bold text-xl text-gray-900 tracking-tight">Orange</span>
          </div>

          {/* No Progress Bar on Step 4 */}
       </header>

       {/* Main Content */}
       <div className={`flex-1 flex flex-col items-center justify-center px-6 transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          
          {/* Hero Text */}
          <div className="relative mb-2 mt-4 flex items-center gap-4">
            <h1 className="text-7xl font-black text-white drop-shadow-sm tracking-tighter">DO</h1>
            {/* Sticker */}
            <div className="relative bg-gradient-to-br from-yellow-300 to-orange-400 text-gray-900 text-3xl font-black px-4 py-2 -rotate-6 shadow-xl transform hover:scale-105 transition-transform cursor-default z-10 rounded-sm" style={{ clipPath: 'polygon(2% 0%, 100% 2%, 98% 100%, 0% 98%)' }}>
               NOT
            </div>
          </div>
          <h1 className="text-7xl font-black text-white drop-shadow-sm tracking-tighter mb-4">INVEST</h1>
          
          <p className="text-xl text-gray-800 font-medium mb-12 text-center">We’ll do it for you</p>

          {/* Credibility Tags - Moved down and text updated */}
          <div className="flex flex-col gap-4 w-full max-w-sm mb-12 mt-8">
             <div className="flex items-center justify-center gap-3 bg-white/40 backdrop-blur-md py-3 px-6 rounded-2xl border border-white/50 shadow-sm hover:bg-white/50 transition-colors">
                <Award className="w-5 h-5 text-orange-600" />
                <span className="font-semibold text-gray-800 text-sm whitespace-nowrap">For Beginners, GenZ and Women</span>
             </div>
          </div>
       </div>

       {/* Bottom Actions */}
       <div className="pb-10 px-6 w-full flex flex-col items-center gap-6 z-20">
          <Button 
             onClick={onContinue}
             className="w-[85%] rounded-full py-4 text-lg hover:scale-[1.02]"
          >
             Continue
          </Button>
          
          <button 
             onClick={onLogin}
             className="text-sm font-semibold text-gray-700 hover:text-orange-700 transition-colors"
          >
             I already have an account &gt;
          </button>
       </div>
    </div>
  )
}