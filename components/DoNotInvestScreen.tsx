import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import { Award, Zap } from 'lucide-react';

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
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-brand-bg font-sans">
       <div className="absolute top-[5%] left-[10%] w-64 h-64 bg-brand-secondary/10 rounded-full blur-[80px] pointer-events-none animate-pulse"></div>

       <header className="px-6 pt-12 pb-6 flex flex-col items-center w-full z-20 relative gap-6">
          <div className="flex items-center gap-2">
             <svg viewBox="0 0 100 100" className="w-10 h-10 shrink-0">
               <circle cx="50" cy="60" r="35" fill="#9B7EEC" />
             </svg>
             <span className="font-black text-2xl text-brand-text tracking-tight">Orange</span>
          </div>
       </header>

       <div className={`flex-1 flex flex-col items-center justify-center px-6 transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="relative mb-2 mt-4 flex items-center gap-4">
            <h1 className="text-7xl font-black text-brand-text tracking-tighter">DO</h1>
            <div className="relative bg-brand-primary text-brand-text text-3xl font-black px-6 py-2 -rotate-6 shadow-[0_5px_20px_rgba(223,255,79,0.4)] transform hover:scale-105 transition-transform cursor-default z-10 rounded-xl">
               NOT
            </div>
          </div>
          <h1 className="text-7xl font-black text-brand-text tracking-tighter mb-10">INVEST</h1>
          
          <p className="text-xl text-brand-subtext font-bold mb-12 text-center max-w-xs">We do the work for you.</p>

          <div className="flex flex-col gap-4 w-full max-w-xs mb-12">
             <div className="flex items-center justify-center gap-3 bg-white py-5 px-6 rounded-3xl border-2 border-brand-card shadow-sm">
                <Zap className="w-6 h-6 text-brand-secondary" />
                <span className="font-black text-brand-text text-lg">Safe & Simple</span>
             </div>
          </div>
       </div>

       <div className="pb-16 px-6 w-full flex flex-col items-center gap-6 z-20">
          <Button 
             onClick={onContinue}
             className="w-[85%] py-4 text-xl"
          >
             Continue
          </Button>
       </div>
    </div>
  )
}