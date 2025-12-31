
import React, { useState } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from './Button';

interface CreateVibeScreenProps {
  onContinue: (vibes: string[]) => void;
  onBack: () => void;
}

const VIBES = [
  { id: 'it', label: 'TECH GIANTS', sub: 'THE DIGITAL BACKBONE', emoji: '💻', color: 'bg-[#1D8FA5]' },
  { id: 'fintech', label: 'MODERN FINANCE', sub: 'FUTURE OF MONEY', emoji: '💳', color: 'bg-[#7E57C2]' },
  { id: 'digital_payments', label: 'DIGITAL INDIA', sub: 'SMART PAYMENTS', emoji: '💸', color: 'bg-[#AD3F70]' },
  { id: 'renewable', label: 'GREEN ENERGY', sub: 'SOLAR & WIND FUTURE', emoji: '☀️', color: 'bg-[#FF6D00]' },
  { id: 'ev', label: 'FUTURE MOBILITY', sub: 'ELECTRIC CARS & TECH', emoji: '🔋', color: 'bg-[#2E7D32]' },
  { id: 'green_energy', label: 'PLANET FIRST', sub: 'SUSTAINABLE GROWTH', emoji: '🌱', color: 'bg-[#388E3C]' },
  { id: 'pharma', label: 'LIFE SAVERS', sub: 'MEDICINE & RESEARCH', emoji: '💊', color: 'bg-[#2C5282]' },
  { id: 'hospitals', label: 'SAFE INFRASTRUCTUR', sub: 'MEDICAL CARE LEADERS', emoji: '🏥', color: 'bg-[#434190]' },
  { id: 'biotech', label: 'HEALTH INNOVATION', sub: 'CUTTING EDGE RESEARCH', emoji: '🧬', color: 'bg-[#319795]' },
];

export const CreateVibeScreen: React.FC<CreateVibeScreenProps> = ({ onContinue, onBack }) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="flex flex-col h-full bg-[#121826] text-white font-sans overflow-hidden">
      <header className="px-6 pt-12 flex justify-between items-center z-20 shrink-0">
        <button onClick={onBack} className="p-2 -ml-2 text-white/60 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </button>
        <button 
          onClick={() => onContinue([])} 
          className="text-white/40 font-black uppercase tracking-widest text-[10px] hover:text-white transition-colors border border-white/10 px-4 py-2 rounded-full"
        >
          SKIP VIBE
        </button>
      </header>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 py-8 shrink-0">
          <div className="flex items-center gap-2 mb-2 text-brand-primary">
              <Sparkles size={20} />
              <h2 className="text-xl font-black uppercase tracking-tight">STEP 1: YOUR VIBE</h2>
          </div>
          <h1 className="text-5xl font-black text-[#FFB7A5] uppercase mb-4 tracking-tighter leading-[0.85]">
            PICK WHAT<br/>YOU TRUST
          </h1>
          <p className="text-white/50 text-[14px] font-bold leading-relaxed max-w-[280px]">
            Select sectors you relate to. Buddy will find the best regulated stocks in these areas.
          </p>
        </div>

        <div className="flex-1 px-6 overflow-y-auto no-scrollbar pb-40">
          <div className="grid grid-cols-3 gap-3">
            {VIBES.map((vibe) => {
              const isSelected = selected.includes(vibe.id);
              return (
                <button
                  key={vibe.id}
                  onClick={() => toggle(vibe.id)}
                  className={`aspect-square rounded-[2.5rem] p-3 flex flex-col justify-between transition-all relative overflow-hidden group ${vibe.color} ${isSelected ? 'ring-4 ring-brand-primary scale-105 z-10' : 'opacity-90'}`}
                >
                  <div className="w-10 h-10 rounded-2xl bg-white/30 backdrop-blur-md flex items-center justify-center text-xl shadow-inner shrink-0 text-white">
                    {vibe.emoji}
                  </div>
                  
                  <div className="text-left mt-1">
                    <div className="bg-black/10 p-1.5 rounded-xl mb-1 min-h-[32px] flex items-center">
                      <p className="text-[9px] font-black uppercase leading-tight text-white">{vibe.label}</p>
                    </div>
                    <p className="text-[7px] font-black text-white/60 uppercase tracking-tighter leading-none pl-1">
                      {vibe.sub}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-white rounded-full flex items-center justify-center text-brand-secondary text-[10px] font-black animate-in zoom-in shadow-md">
                      ✓
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#121826] via-[#121826] to-transparent z-30 flex flex-col items-center">
        <Button 
          onClick={() => onContinue(selected)} 
          className={`w-full py-5 text-xl font-black transition-all active:scale-95 ${selected.length > 0 ? 'bg-brand-primary text-black' : 'bg-white/10 text-white/30 border border-white/5'}`}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
