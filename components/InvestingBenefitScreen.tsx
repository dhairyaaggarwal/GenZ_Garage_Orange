
import React, { useEffect, useState, useRef } from 'react';
import { Button } from './Button';
import { CircularHeader } from './CircularHeader';
import { speakBuddy } from '../utils/voice';

interface InvestingBenefitScreenProps {
  onContinue: () => void;
}

const VOICE_TEXT = "Investing is a powerful way to grow your money — you can grow up to 6x more by investing compared to saving.";

export const InvestingBenefitScreen: React.FC<InvestingBenefitScreenProps> = ({ onContinue }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationsStarted, setAnimationsStarted] = useState(false);
  const [showInvestingBar, setShowInvestingBar] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const hasPlayedRef = useRef(false);
  
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const playVoice = () => {
      if (hasPlayedRef.current) return;
      hasPlayedRef.current = true;
      setIsPlaying(true);
      speakBuddy(VOICE_TEXT, () => setIsPlaying(false));
    };

    const timer = setTimeout(playVoice, 800);

    if (prefersReducedMotion) {
      setAnimationsStarted(true);
      setShowInvestingBar(true);
      setShowLabels(true);
    } else {
      setAnimationsStarted(true);
      setTimeout(() => setShowInvestingBar(true), 250);
      setTimeout(() => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 900);
      }, 1250);
      setTimeout(() => setShowLabels(true), 1350);
    }

    return () => { 
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        clearTimeout(timer);
    };
  }, [prefersReducedMotion]);

  const handleContinue = () => {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      onContinue();
  };

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-gradient-to-br from-orange-50 via-orange-100 to-rose-100 font-sans">
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
      <CircularHeader currentStep={4} totalSteps={5} />

      <div className="absolute top-[5.5rem] left-0 w-full flex justify-center pointer-events-none z-20">
        <div className={`transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex items-center gap-1 h-4">
                <div className="w-0.5 bg-yellow-400 rounded-full animate-[bounce_1s_infinite] h-2"></div>
                <div className="w-0.5 bg-yellow-400 rounded-full animate-[bounce_1s_infinite_0.1s] h-3"></div>
                <div className="w-0.5 bg-yellow-400 rounded-full animate-[bounce_1s_infinite_0.2s] h-2"></div>
            </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center px-6 z-10 w-full max-w-md mx-auto mt-6 overflow-y-auto no-scrollbar pb-32">
         <h1 className="text-4xl text-gray-900 text-center mb-10 leading-tight drop-shadow-sm">
           <span className="font-bold">Make 6x more</span> <br/> <span className="italic font-serif">by investing</span>
         </h1>

         <div className="w-full flex justify-center items-end gap-6 h-72 mb-8 relative px-4">
             {showConfetti && !prefersReducedMotion && (
                 <div className="absolute top-0 right-[15%] w-1 h-1 z-50">
                    <div className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-[ping_0.6s_ease-out_forwards]"></div>
                    <div className="absolute w-1.5 h-3 bg-orange-500 animate-[spin_0.8s_ease-out_forwards] translate-x-4 -translate-y-8"></div>
                    <div className="absolute w-2 h-2 bg-rose-400 rounded-sm animate-[bounce_0.8s_ease-out_forwards] -translate-x-4 -translate-y-10"></div>
                    <div className="absolute w-1 h-4 bg-green-400 rotate-45 animate-[pulse_0.5s_ease-out_forwards] translate-x-8 -translate-y-4"></div>
                    <div className="absolute w-2 h-2 bg-blue-400 rounded-full animate-[ping_0.7s_ease-out_forwards] -translate-x-8 -translate-y-6"></div>
                 </div>
             )}

             <div className="flex flex-col items-center justify-end w-28 h-full group relative">
                 <div className={`mb-3 text-center transition-all duration-300 ease-out transform ${showLabels ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'}`}>
                     <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Saving</span>
                     <span className="block text-xl font-bold text-gray-800">₹1 Cr</span>
                 </div>
                 <div 
                    className="w-full bg-orange-50 rounded-t-2xl shadow-sm border border-orange-100/50 relative overflow-hidden transition-all ease-[cubic-bezier(0.33,1,0.68,1)]"
                    style={{ 
                        height: animationsStarted ? '16%' : '0%', 
                        transitionDuration: prefersReducedMotion ? '0s' : '1000ms' 
                    }}
                 >
                    <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent"></div>
                 </div>
             </div>

             <div className="flex flex-col items-center justify-end w-28 h-full group relative">
                 <div className={`mb-3 text-center transition-all duration-300 ease-out transform ${showLabels ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'}`}>
                     <span className="block text-xs font-semibold text-orange-600 uppercase tracking-wide mb-1">Investing</span>
                     <span className="block text-2xl font-extrabold text-gray-900 drop-shadow-sm">₹6 Cr</span>
                 </div>
                 <div 
                    className={`w-full bg-gradient-to-t from-orange-500 to-yellow-400 rounded-t-2xl shadow-[0_10px_30px_-10px_rgba(249,115,22,0.4)] relative overflow-hidden flex items-start justify-center transition-all ease-[cubic-bezier(0.33,1,0.68,1)] ${prefersReducedMotion && 'shadow-[0_0_15px_rgba(251,146,60,0.6)]'}`}
                    style={{ 
                        height: showInvestingBar ? '100%' : '0%',
                        transitionDuration: prefersReducedMotion ? '0s' : '1200ms'
                    }}
                 >
                     <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 via-transparent to-transparent pointer-events-none"></div>
                     <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-black/5 to-transparent pointer-events-none"></div>
                 </div>
             </div>
         </div>

         <p className="text-[11px] text-center text-[#9a9491] font-medium max-w-xs leading-tight mx-auto mb-8">
             Based on Rs 1 Cr over 30 years, with a savings rate of 1% and a market return rate of 10.26%. Past performance is not a guarantee of future returns.
         </p>
         
         <p className="text-sm font-semibold text-gray-800 text-center mb-2">
            Investing is the most powerful way to grow your money.
         </p>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6 pb-10 bg-gradient-to-t from-white via-white/90 to-transparent z-20">
         <div className="max-w-md mx-auto">
            <Button 
               onClick={handleContinue}
               className="w-[85%] mx-auto block rounded-full py-4 text-lg transition-all shadow-xl shadow-orange-500/20 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-gray-900 font-extrabold tracking-wide border-none"
            >
               Continue
            </Button>
         </div>
      </div>
    </div>
  );
};
