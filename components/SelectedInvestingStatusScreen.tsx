
import React, { useEffect, useRef, useState } from 'react';
import { Button } from './Button';
import { CircularHeader } from './CircularHeader';
import { speakBuddy } from '../utils/voice';

interface SelectedInvestingStatusScreenProps {
  selectedStatus: string[];
  onContinue: () => void;
  onJumpToStep?: (step: number) => void;
}

const STATUS_DISPLAY_MAP: Record<string, { text: string; emoji: string }> = {
  not_started: { text: 'I haven’t started yet', emoji: '🥲' },
  saving: { text: 'I am saving', emoji: '💰' },
  investing: { text: 'I am investing', emoji: '📈' },
  saving_and_investing: { text: 'I am saving and investing', emoji: '🤑' },
};

const VOICE_LINES: Record<string, string> = {
  not_started: "Totally okay — everyone starts somewhere. I’ll help you take your first step.",
  saving: "Saving is a great habit — now we can build on it together.",
  investing: "Nice! You're already investing — I’ll help you level up.",
  saving_and_investing: "Love that balance — saving and investing together sets you up for real growth.",
};

export const SelectedInvestingStatusScreen: React.FC<SelectedInvestingStatusScreenProps> = ({ selectedStatus, onContinue, onJumpToStep }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const hasPlayedRef = useRef(false);

  const generateVoiceText = () => {
    const firstSelection = selectedStatus.length > 0 ? selectedStatus[0] : 'not_started';
    return VOICE_LINES[firstSelection] || VOICE_LINES['not_started'];
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
      <CircularHeader currentStep={3} totalSteps={5} onJumpToStep={onJumpToStep} />

      <div className="flex-1 flex flex-col items-center px-6 z-10 w-full max-w-md mx-auto mt-2 overflow-y-auto no-scrollbar pb-32">
         <h1 className="text-3xl font-black text-brand-text text-center mb-6 leading-tight tracking-tight">
           Got it — here’s where you stand
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
           {selectedStatus.map((id) => {
             const display = STATUS_DISPLAY_MAP[id];
             if (!display) return null;
             return (
               <div 
                 key={id}
                 className="w-full bg-white p-5 rounded-[2rem] border-2 border-brand-card flex items-center justify-between shadow-sm animate-in slide-in-from-bottom-3 fade-in duration-500"
               >
                 <span className="text-lg font-bold text-brand-text text-left">
                   {display.text}
                 </span>
                 <span className="text-2xl ml-2">{display.emoji}</span>
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
