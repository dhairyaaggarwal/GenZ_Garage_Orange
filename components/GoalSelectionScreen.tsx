
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './Button';

interface GoalSelectionScreenProps {
  onContinue: (goalId: string) => void;
  onBack: () => void;
}

const GOALS = [
  { 
    id: 'aggressive', 
    title: 'I want maximum market exposure and I’m comfortable with high risk', 
    tags: ['MOSTLY EQUITIES', 'HIGH RETURN POTENTIAL', 'HIGH RISK', 'HIGH VOLATILITY', 'LONG-TERM FOCUS']
  },
  { 
    id: 'growth', 
    title: 'I want high growth and can handle some short-term ups and downs', 
    tags: ['EQUITY-HEAVY', 'HIGH RETURN POTENTIAL', 'MEDIUM-HIGH RISK', 'MEDIUM-HIGH VOLATILITY', 'LONG-TERM FOCUS']
  },
  { 
    id: 'balanced', 
    title: 'I want balanced growth with moderate risk', 
    tags: ['MIX OF EQUITIES AND DEBT', 'MODERATE RETURNS', 'MODERATE RISK', 'MODERATE VOLATILITY']
  },
  { 
    id: 'conservative', 
    title: 'I want slow and steady growth with lower risk', 
    tags: ['DEBT-HEAVY', 'LOWER RETURN POTENTIAL', 'LOW RISK', 'LOW VOLATILITY']
  }
];

export const GoalSelectionScreen: React.FC<GoalSelectionScreenProps> = ({ onContinue, onBack }) => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full bg-[#121826] text-white font-sans overflow-y-auto no-scrollbar">
      <header className="px-6 pt-12 flex items-center">
        <button onClick={onBack} className="p-2 -ml-2 text-white/60 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </button>
      </header>

      <div className="px-6 py-8">
        <h1 className="text-4xl font-black uppercase mb-4 tracking-tight">What's your goal?</h1>
        <p className="text-white/50 text-sm font-medium">Select which investing strategy is right for you</p>
      </div>

      <div className="flex-1 px-6 space-y-4 pb-40">
        {GOALS.map((goal) => {
          const isSelected = selected === goal.id;
          return (
            <button
              key={goal.id}
              onClick={() => setSelected(goal.id)}
              className={`w-full p-6 rounded-3xl text-left border-2 transition-all bg-white/5 ${isSelected ? 'border-[#9B7EEC] bg-white/10' : 'border-transparent'}`}
            >
              <p className="font-black text-lg mb-4 leading-tight">{goal.title}</p>
              <div className="flex flex-wrap gap-2">
                {goal.tags.map(tag => (
                  <span key={tag} className="text-[8px] font-black uppercase tracking-wider bg-white/10 px-2 py-1 rounded-md text-white/60">{tag}</span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#121826] via-[#121826] to-transparent z-50">
        <Button 
          onClick={() => selected && onContinue(selected)} 
          disabled={!selected}
          className={`w-full py-4 text-lg font-black bg-gradient-to-r from-[#F472B6] to-[#9B7EEC] text-white`}
        >
          Done
        </Button>
      </div>
    </div>
  );
};
