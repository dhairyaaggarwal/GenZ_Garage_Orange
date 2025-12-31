
import React, { useEffect, useRef, useState } from 'react';
import { Button } from './Button';
import { CircularHeader } from './CircularHeader';
import { speakBuddy } from '../utils/voice';

interface SelectedGoalsScreenProps {
  selectedGoalIds: string[];
  onContinue: () => void;
  onJumpToStep?: (step: number) => void;
}

const GOAL_DISPLAY_MAP: Record<string, { text: string; emoji: string }> = {
  buy_house: { text: 'Buy a house', emoji: '🏡' },
  work_less: { text: 'Work less', emoji: '⏳' },
  retire_early: { text: 'Retire early', emoji: '🌅' },
  financial_independence: { text: 'Be financially independent', emoji: '💸' },
  pay_for_school: { text: 'Pay for school', emoji: '🎓' },
  dont_know: { text: 'I don’t know yet', emoji: '🤔' },
};

const VOICE_LINES: Record<string, string> = {
  retire_early: "Early retirement — heck, who doesn’t want that?",
  buy_house: "Buying a house — love that goal! It’s a big milestone, and I’ll help you get there.",
  pay_for_school: "Paying for school can feel overwhelming — but I’ve got your back.",
  work_less: "Work less — more time for the things you love. Love that.",
  financial_independence: "Financial independence — powerful choice. Let’s build toward it.",
  dont_know: "Not sure yet? No worries — we’ll explore options together.",
};

export const SelectedGoalsScreen: React.FC<SelectedGoalsScreenProps> = ({ selectedGoalIds, onContinue, onJumpToStep }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const hasPlayedRef = useRef(false);

  const generateVoiceText = () => {
    const firstSelectedId = selectedGoalIds.length > 0 ? selectedGoalIds[0] : 'dont_know';
    return VOICE_LINES[firstSelectedId] || VOICE_LINES['dont_know'];
  };

  const voiceText = useRef(generateVoiceText()).current;

  useEffect(() => {
    const playVoice = () => {
      if (hasPlayedRef.current) return;
      hasPlayedRef.current = true;
      setIsPlaying(true);
      speakBuddy(voiceText, () => setIsPlaying(false));
    };

    const timer = setTimeout(playVoice, 800);
    return () => { 
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        clearTimeout(timer);
    };
  }, [voiceText]);

  const handleContinue = () => {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      onContinue();
  };

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-brand-bg font-sans">
      <CircularHeader currentStep={2} totalSteps={5} onJumpToStep={onJumpToStep} />

      <div className="flex-1 flex flex-col items-center px-6 z-10 w-full max-w-md mx-auto mt-2 overflow-y-auto no-scrollbar pb-32">
         <h1 className="text-3xl font-black text-brand-text text-center mb-6 leading-tight tracking-tight">
           Nice choices — here’s what you picked
         </h1>

         <div className="h-6 mb-8 flex items-center justify-center min-h-[24px]">
            {isPlaying && (
              <div className="flex items-center gap-1">
                 <div className="w-8 h-[2px] bg-brand-secondary/40 animate-pulse"></div>
                 <div className="flex items-end gap-[3px] h-4">
                    <div className="w-[3px] bg-brand-secondary rounded-full animate-[bounce_0.8s_infinite] h-2"></div>
                    <div className="w-[3px] bg-brand-secondary rounded-full animate-[bounce_0.8s_infinite_0.1s] h-4"></div>
                    <div className="w-[3px] bg-brand-secondary rounded-full animate-[bounce_0.8s_infinite_0.2s] h-3"></div>
                    <div className="w-[3px] bg-brand-secondary rounded-full animate-[bounce_0.8s_infinite_0.15s] h-2"></div>
                 </div>
                 <div className="w-8 h-[2px] bg-brand-secondary/40 animate-pulse"></div>
              </div>
            )}
         </div>

         <div className="w-full grid gap-3">
           {selectedGoalIds.map((id) => {
             const display = GOAL_DISPLAY_MAP[id];
             if (!display) return null;
             return (
               <div 
                 key={id}
                 className="w-full bg-white p-5 rounded-[1.5rem] border-2 border-brand-card flex items-center justify-between shadow-sm animate-in slide-in-from-bottom-3 fade-in duration-500"
               >
                 <span className="text-lg font-bold text-brand-text">
                   {display.text}
                 </span>
                 <span className="text-2xl">{display.emoji}</span>
               </div>
             );
           })}
         </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6 pb-12 bg-gradient-to-t from-brand-bg via-brand-bg to-transparent z-20">
         <div className="max-w-md mx-auto">
            <Button 
               onClick={handleContinue}
               fullWidth
               className="py-4 text-xl shadow-xl shadow-brand-primary/20"
            >
               Continue
            </Button>
         </div>
      </div>
    </div>
  );
};
