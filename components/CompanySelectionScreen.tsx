
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './Button';

interface CompanySelectionScreenProps {
  onContinue: (companies: string[]) => void;
  onBack: () => void;
}

const COMPANIES = [
  { id: 'tata', name: 'Tata Group', logo: '🏛️' },
  { id: 'reliance', name: 'Reliance Industries', logo: '💎' },
  { id: 'hdfc', name: 'HDFC Bank', logo: '🏦' },
  { id: 'icici', name: 'ICICI Bank', logo: '💳' },
  { id: 'infosys', name: 'Infosys', logo: '💻' },
  { id: 'tcs', name: 'TCS', logo: '🚀' },
  { id: 'wipro', name: 'Wipro', logo: '🧼' },
  { id: 'paytm', name: 'Paytm', logo: '💸' },
  { id: 'zomato', name: 'Zomato', logo: '🍕' },
];

export const CompanySelectionScreen: React.FC<CompanySelectionScreenProps> = ({ onContinue, onBack }) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="flex flex-col h-full bg-[#121826] text-white font-sans overflow-y-auto no-scrollbar">
      <header className="px-6 pt-12 flex items-center">
        <button onClick={onBack} className="p-2 -ml-2 text-white/60 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </button>
      </header>

      <div className="px-6 py-8">
        <h1 className="text-4xl font-black uppercase mb-2">Companies</h1>
        <h1 className="text-5xl font-black text-[#FFB7A5] uppercase mb-4">You are excited about</h1>
        <p className="text-white/50 text-sm font-medium">Select the brands you trust or relate to.</p>
      </div>

      <div className="flex-1 px-6 grid grid-cols-3 gap-4 pb-40">
        {COMPANIES.map((company) => {
          const isSelected = selected.includes(company.id);
          return (
            <button
              key={company.id}
              onClick={() => toggle(company.id)}
              className={`aspect-square rounded-[2rem] p-4 flex flex-col items-center justify-center transition-all bg-white/5 border-2 ${isSelected ? 'border-[#9B7EEC] bg-white/10' : 'border-transparent'}`}
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl mb-3 shadow-lg">{company.logo}</div>
              <span className="text-[10px] font-black uppercase text-center leading-tight text-white/60">{company.name}</span>
            </button>
          );
        })}
      </div>

      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#121826] via-[#121826] to-transparent z-50 flex flex-col items-center gap-4">
        <Button onClick={() => onContinue(selected)} className="w-full py-4 text-lg font-black bg-gradient-to-r from-[#F472B6] to-[#9B7EEC] text-white">
          Next
        </Button>
        <button onClick={() => onContinue([])} className="text-white/40 font-bold uppercase tracking-widest text-xs">Skip</button>
      </div>
    </div>
  );
};
