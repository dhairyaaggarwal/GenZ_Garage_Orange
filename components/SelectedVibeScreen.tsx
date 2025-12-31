
import React, { useEffect, useRef, useState } from 'react';
import { Button } from './Button';
import { CircularHeader } from './CircularHeader';
import { speakBuddy } from '../utils/voice';

interface SelectedVibeScreenProps {
  selectedVibes: string[];
  onContinue: () => void;
  onJumpToStep?: (step: number) => void;
}

const VIBE_DISPLAY_MAP: Record<string, { text: string; emoji: string }> = {
  it: { text: 'Tech Giants', emoji: '💻' },
  fintech: { text: 'Modern Finance', emoji: '💳' },
  digital_payments: { text: 'Digital India', emoji: '💸' },
  renewable: { text: 'Green Energy', emoji: '☀️' },
  ev: { text: 'Future Mobility', emoji: '🔋' },
  green_energy: { text: 'Planet First', emoji: '🌱' },
  pharma: { text: 'Life Savers', emoji: '💊' },
  hospitals: { text: 'Safe Infrastructure', emoji: '🏥' },
  biotech: { text: 'Health Innovation', emoji: '🧬' },
};

const VOICE_LINES = [
  "Solid choices! These sectors are the backbone of the new India.",
  "Love that! Investing in things you use every day is a pro move.",
  "Great eye — those areas are set for some exciting growth!",
  "Nice! We'll make sure these vibes are front and center in your plan."
];

export const SelectedVibeScreen: React.FC<SelectedVibeScreenProps> = ({ selectedVibes, onContinue, onJumpToStep }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const hasPlayedRef = useRef(false);

  const voiceText = useRef(VOICE_LINES[Math.floor(Math.random() * VOICE_LINES.length)]).current;

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
           Love the vibe — here’s what you picked
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
           {selectedVibes.length > 0 ? selectedVibes.map((id) => {
             const display = VIBE_DISPLAY_MAP[id];
             if (!display) return null;
             return (
               <div 
                 key={id}
                 className="w-full bg-white p-5 rounded-[2rem] border-2 border-brand-card flex items-center justify-between shadow-sm animate-in slide-in-from-bottom-3 fade-in duration-500"
               >
                 <span className="text-lg font-bold text-brand-text">
                   {display.text}
                 </span>
                 <span className="text-2xl ml-2">{display.emoji}</span>
               </div>
             );
           }) : (
             <div className="w-full bg-white p-8 rounded-[2rem] border-2 border-dashed border-brand-card flex items-center justify-center text-brand-subtext font-bold italic">
               No specific vibes selected
             </div>
           )}
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
