
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './Button';
import { CircularHeader } from './CircularHeader';
import { speakBuddy } from '../utils/voice';

interface VibeScreenProps {
  onContinue: (vibes: string[]) => void;
  onBack: () => void;
  isOnboarding?: boolean;
}

const VIBES = [
  { id: 'it', label: 'TECH GIANTS', sub: 'DIGITAL BACKBONE', emoji: '💻', color: 'bg-[#1D8FA5]' },
  { id: 'fintech', label: 'FINANCE', sub: 'FUTURE OF MONEY', emoji: '💳', color: 'bg-[#7E57C2]' },
  { id: 'digital_payments', label: 'DIGITAL INDIA', sub: 'PAYMENTS', emoji: '💸', color: 'bg-[#AD3F70]' },
  { id: 'renewable', label: 'RENEWABLE', sub: 'SOLAR & WIND', emoji: '☀️', color: 'bg-[#FF6D00]' },
  { id: 'ev', label: 'EV TECH', sub: 'MOBILITY', emoji: '🔋', color: 'bg-[#2E7D32]' },
  { id: 'green_energy', label: 'PLANET', sub: 'SUSTAINABLE', emoji: '🌱', color: 'bg-[#388E3C]' },
  { id: 'pharma', label: 'PHARMA', sub: 'HEALTHCARE', emoji: '💊', color: 'bg-[#2C5282]' },
  { id: 'hospitals', label: 'MEDICAL', sub: 'INFRASTRUCTURE', emoji: '🏥', color: 'bg-[#434190]' },
  { id: 'biotech', label: 'BIOTECH', sub: 'INNOVATION', emoji: '🧬', color: 'bg-[#319795]' },
];

const VOICE_PROMPT = "Select the sectors you relate to and we will align your strategy accordingly";

export const VibeScreen: React.FC<VibeScreenProps> = ({ onContinue, onBack, isOnboarding = false }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (hasPlayedRef.current) return;
      hasPlayedRef.current = true;
      speakBuddy(VOICE_PROMPT);
    }, 800);
    
    return () => {
      clearTimeout(timer);
      window.speechSynthesis.cancel();
    };
  }, []);

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="screen-container bg-brand-bg text-brand-text">
      <CircularHeader currentStep={3} totalSteps={5} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 pt-4 pb-6 shrink-0 text-center">
          <h1 className="text-3xl xs:text-4xl font-black uppercase tracking-tighter leading-none mb-2 text-brand-text">
            PICK WHAT<br/>
            <span className="text-brand-secondary italic font-serif">YOU TRUST</span>
          </h1>
        </div>

        <div className="flex-1 px-4 overflow-y-auto no-scrollbar pb-40">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto">
            {VIBES.map((vibe) => {
              const isSelected = selected.includes(vibe.id);
              return (
                <button
                  key={vibe.id}
                  onClick={() => toggle(vibe.id)}
                  className={`aspect-square rounded-[1.5rem] xs:rounded-[2.5rem] p-3 flex flex-col justify-between transition-all relative overflow-hidden group shadow-sm ${vibe.color} ${isSelected ? 'ring-4 ring-brand-secondary scale-[1.05] z-10' : 'opacity-90'}`}
                >
                  <div className="w-8 h-8 xs:w-10 xs:h-10 rounded-xl bg-white/30 backdrop-blur-md flex items-center justify-center text-lg xs:text-xl shadow-inner shrink-0 text-white">
                    {vibe.emoji}
                  </div>
                  
                  <div className="text-left mt-1">
                    <div className="bg-black/10 p-1.5 rounded-xl mb-1 min-h-[32px] flex items-center">
                      <p className="text-[8px] xs:text-[10px] font-black uppercase leading-tight text-white">{vibe.label}</p>
                    </div>
                    <p className="text-[6px] xs:text-[8px] font-black text-white/70 uppercase tracking-tighter leading-none pl-0.5">
                      {vibe.sub}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="absolute top-2 right-2 xs:top-3 xs:right-3 w-4 h-4 xs:w-5 xs:h-5 bg-white rounded-full flex items-center justify-center text-brand-secondary text-[8px] xs:text-[10px] font-black animate-in zoom-in shadow-md">
                      ✓
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-brand-bg via-brand-bg/95 to-transparent z-30">
        <div className="max-w-md mx-auto flex flex-col items-center">
            <Button 
                onClick={() => onContinue(selected)} 
                disabled={selected.length === 0}
                className="w-full py-5 text-xl font-black bg-brand-primary text-brand-text border-none shadow-xl shadow-brand-primary/30"
            >
                Continue
            </Button>
            <button 
                onClick={onBack} 
                className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-brand-muted hover:text-brand-text transition-colors flex items-center gap-1"
            >
                ← BACK
            </button>
        </div>
      </div>
    </div>
  );
};
