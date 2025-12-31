
import React, { useEffect, useState, useRef } from 'react';
import { Button } from './Button';
import { CircularHeader } from './CircularHeader';
import { speakBuddy } from '../utils/voice';

interface IncomeScreenProps {
  onContinue: (incomeBracket: string) => void;
}

const INCOME_BRACKETS = [
  "Less than Rs 3L",
  "Rs 3L - 4L",
  "Rs 4L - 5L",
  "Rs 5L - 6L",
  "Rs 6L - 7L",
  "Rs 7L - 8L",
  "Rs 8L - 10L",
  "Rs 10L - 12L",
  "Rs 12L - 15L",
  "Rs 15L - 18L",
  "Rs 18L - 22L",
  "Rs 22L - 25L",
  "Rs 25L - 28L",
  "Rs 30L - 35L",
  "Rs 35L - 45L",
  "Rs 45L+"
];

const VOICE_TEXT = "Next — a few quick questions about your financial situation. How much do you make every year?";

export const IncomeScreen: React.FC<IncomeScreenProps> = ({ onContinue }) => {
  const [selectedIncome, setSelectedIncome] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    const playVoice = () => {
      if (hasPlayedRef.current) return;
      hasPlayedRef.current = true;
      setIsPlaying(true);
      speakBuddy(VOICE_TEXT, () => setIsPlaying(false));
    };

    const timer = setTimeout(playVoice, 800);
    return () => { 
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        clearTimeout(timer);
    };
  }, []);

  const handleContinue = () => {
    if (selectedIncome) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      onContinue(selectedIncome);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-gradient-to-br from-orange-400 via-rose-300 to-orange-200 font-sans">
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
      <CircularHeader currentStep={4} totalSteps={4} />

      <div className="absolute top-[5.5rem] left-0 w-full flex justify-center pointer-events-none z-20">
        <div className={`transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex items-center gap-1 h-4">
                <div className="w-0.5 bg-yellow-400 rounded-full animate-[bounce_1s_infinite] h-2"></div>
                <div className="w-0.5 bg-yellow-400 rounded-full animate-[bounce_1s_infinite_0.1s] h-3"></div>
                <div className="w-0.5 bg-yellow-400 rounded-full animate-[bounce_1s_infinite_0.2s] h-2"></div>
            </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center px-6 z-10 w-full max-w-md mx-auto mt-6 overflow-hidden">
         <h1 className="text-3xl font-gray-900 text-center mb-6 leading-tight drop-shadow-sm shrink-0">
           <span className="font-bold">How much do you make</span> <br/> <span className="italic font-serif">annually?</span>
         </h1>

         <div className="w-full flex-1 overflow-y-auto no-scrollbar pb-32 space-y-3">
           {INCOME_BRACKETS.map((bracket) => {
             const isSelected = selectedIncome === bracket;
             return (
               <button 
                 key={bracket}
                 onClick={() => setSelectedIncome(bracket)}
                 className={`w-full p-4 rounded-2xl flex items-center justify-center transition-all duration-200 font-bold text-lg border-2 shadow-sm ${
                   isSelected 
                     ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white border-transparent scale-[1.02] shadow-orange-500/30' 
                     : 'bg-white/80 backdrop-blur-sm border-transparent text-gray-700 hover:bg-white hover:scale-[1.01]'
                 }`}
                 aria-label={bracket}
                 aria-pressed={isSelected}
               >
                 {bracket}
               </button>
             );
           })}
         </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6 pb-10 bg-gradient-to-t from-rose-300 via-rose-300/90 to-transparent z-20">
         <div className="max-w-md mx-auto">
            <Button 
               onClick={handleContinue}
               disabled={!selectedIncome}
               className="w-[85%] mx-auto block rounded-full py-4 text-lg transition-all shadow-xl shadow-orange-900/20 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-gray-900 font-extrabold tracking-wide border-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
               Continue
            </Button>
         </div>
      </div>
    </div>
  );
};
