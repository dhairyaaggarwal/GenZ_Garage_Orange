
import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, Sparkles } from 'lucide-react';
import { Button } from './Button';

interface VibeScreenProps {
  onContinue: (vibes: string[]) => void;
  onBack: () => void;
}

const VIBES = [
  { id: 'it', label: 'Tech Giants', sub: 'The Digital Backbone', emoji: '💻', color: 'bg-cyan-500' },
  { id: 'fintech', label: 'Modern Finance', sub: 'Future of Money', emoji: '💳', color: 'bg-purple-500' },
  { id: 'digital_payments', label: 'Digital India', sub: 'Smart Payments', emoji: '💸', color: 'bg-pink-500' },
  { id: 'renewable', label: 'Green Energy', sub: 'Solar & Wind Future', emoji: '☀️', color: 'bg-orange-500' },
  { id: 'ev', label: 'Future Mobility', sub: 'Electric Cars & Tech', emoji: '🔋', color: 'bg-emerald-500' },
  { id: 'green_energy', label: 'Planet First', sub: 'Sustainable Growth', emoji: '🌱', color: 'bg-green-500' },
  { id: 'pharma', label: 'Life Savers', sub: 'Medicine & Research', emoji: '💊', color: 'bg-blue-500' },
  { id: 'hospitals', label: 'Safe Infrastructure', sub: 'Medical Care Leaders', emoji: '🏥', color: 'bg-indigo-500' },
  { id: 'biotech', label: 'Health Innovation', sub: 'Cutting Edge Research', emoji: '🧬', color: 'bg-teal-500' },
];

export const VibeScreen: React.FC<VibeScreenProps> = ({ onContinue, onBack }) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="flex flex-col h-full bg-[#121826] text-white font-sans overflow-y-auto no-scrollbar">
      <header className="px-6 pt-12 flex justify-between items-center">
        <button onClick={onBack} className="p-2 -ml-2 text-white/60 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </button>
        <button onClick={() => onContinue([])} className="text-white/40 font-bold uppercase tracking-widest text-xs hover:text-white transition-colors border border-white/10 px-4 py-1.5 rounded-full">Skip Vibe</button>
      </header>

      <div className="px-6 py-8">
        <div className="flex items-center gap-2 mb-2">
            <Sparkles className="text-brand-primary" size={20} />
            <h1 className="text-xl font-black uppercase tracking-widest">Step 1: Your Vibe</h1>
        </div>
        <h1 className="text-5xl font-black text-[#FFB7A5] uppercase mb-4 tracking-tighter leading-none">Pick what<br/>you trust</h1>
        <p className="text-white/50 text-sm font-medium leading-relaxed max-w-[280px]">Select sectors you relate to. Buddy will find the best regulated stocks in these areas.</p>
      </div>

      <div className="flex-1 px-6 grid grid-cols-3 gap-4 pb-56">
        {VIBES.map((vibe) => {
          const isSelected = selected.includes(vibe.id);
          return (
            <button
              key={vibe.id}
              onClick={() => toggle(vibe.id)}
              className={`aspect-square rounded-[2.5rem] p-4 flex flex-col justify-between transition-all relative overflow-hidden group ${vibe.color} ${isSelected ? 'ring-4 ring-[#DFFF4F] scale-105 z-10 shadow-xl shadow-black/40' : 'opacity-70 grayscale-[20%] hover:grayscale-0 hover:opacity-100 hover:scale-[1.02]'}`}
            >
              <div className="text-2xl bg-white/20 w-11 h-11 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner">{vibe.emoji}</div>
              <div className="text-left space-y-1">
                  <p className="text-[10px] font-black uppercase leading-tight bg-black/20 p-1.5 rounded-lg inline-block">{vibe.label}</p>
                  <p className="text-[7px] font-bold text-white/70 uppercase tracking-tighter leading-none block">{vibe.sub}</p>
              </div>
              {isSelected && <div className="absolute top-4 right-4 w-6 h-6 bg-[#DFFF4F] rounded-full flex items-center justify-center text-black text-[12px] font-black shadow-lg animate-in zoom-in">✓</div>}
            </button>
          );
        })}
      </div>

      {/* Experience Test Fix: Reassurance microcopy */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#121826] via-[#121826] to-transparent z-50">
        <div className="flex items-center gap-2 mb-5 justify-center bg-white/5 py-3 rounded-2xl border border-white/5">
            <HelpCircle size={14} className="text-brand-tertiary" />
            <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest">
              Choosing "Safe Infrastructure" adds steady growth.
            </p>
        </div>
        <Button 
          onClick={() => onContinue(selected)} 
          className={`w-full py-5 text-xl font-black transition-all active:scale-95 ${selected.length > 0 ? 'bg-[#9B7EEC] text-white shadow-2xl shadow-purple-500/40' : 'bg-white/10 text-white/30'}`}
        >
          {selected.length > 0 ? `Create Mix (${selected.length})` : 'Continue'}
        </Button>
      </div>
    </div>
  );
};
