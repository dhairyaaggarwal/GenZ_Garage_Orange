import React, { useState } from 'react';
import { Button } from './Button';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { setValue, persistOnboardingState } from '../utils/onboardingState';

interface CreatePlaylistGoalScreenProps {
  onBack: () => void;
  onContinue: () => void;
}

const GOALS = [
  {
    id: 'aggressive',
    title: "I want maximum market exposure and I’m comfortable with high risk",
    pills: ["Mostly equities", "High return potential", "High risk", "High volatility", "Long-term focus"]
  },
  {
    id: 'high',
    title: "I want high growth and can handle some short-term ups and downs",
    pills: ["Equity-heavy", "High return potential", "Medium–high risk", "Medium–high volatility", "Long-term focus"]
  },
  {
    id: 'balanced',
    title: "I want balanced growth with moderate risk",
    pills: ["Mix of equities and debt", "Moderate returns", "Moderate risk", "Moderate volatility"]
  },
  {
    id: 'conservative',
    title: "I want slow and steady growth with lower risk",
    pills: ["Debt-heavy", "Lower return potential", "Low risk", "Low volatility"]
  }
];

export const CreatePlaylistGoalScreen: React.FC<CreatePlaylistGoalScreenProps> = ({ onBack, onContinue }) => {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedGoal) {
      setValue('playlistGoal', selectedGoal);
      persistOnboardingState();
      onContinue();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#111827] font-sans overflow-hidden animate-in fade-in duration-300">
      {/* Header */}
      <div className="px-6 pt-12 pb-4 flex items-center justify-between z-20">
        <button onClick={onBack} className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition-colors active:scale-95">
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* Title */}
      <div className="px-6 pb-6">
         <h1 className="text-3xl font-black text-white tracking-tight mb-2 uppercase">WHAT’S YOUR GOAL?</h1>
         <p className="text-gray-400 text-sm font-medium leading-relaxed">Select which investing strategy is right for you</p>
      </div>

      {/* Cards List */}
      <div className="flex-1 overflow-y-auto px-6 pb-32 custom-scrollbar">
         <div className="space-y-4">
            {GOALS.map((goal) => {
               const isSelected = selectedGoal === goal.id;
               return (
                 <div
                   key={goal.id}
                   onClick={() => setSelectedGoal(goal.id)}
                   className={`
                     w-full p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 relative
                     ${isSelected 
                       ? 'bg-gray-800 border-orange-500 shadow-lg shadow-orange-900/20' 
                       : 'bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:bg-gray-800'
                     }
                   `}
                 >
                    <div className="flex justify-between items-start mb-3">
                       <p className={`font-bold text-lg leading-tight pr-4 ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                          {goal.title}
                       </p>
                       {isSelected && <CheckCircle2 className="text-orange-500 shrink-0" size={24} />}
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                       {goal.pills.map((pill, idx) => (
                          <span key={idx} className="px-2.5 py-1 rounded-md bg-gray-700 text-gray-300 text-[10px] font-bold uppercase tracking-wide">
                             {pill}
                          </span>
                       ))}
                    </div>
                 </div>
               );
            })}
         </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 w-full p-6 pb-10 bg-gradient-to-t from-[#111827] via-[#111827]/95 to-transparent z-20 pointer-events-none">
         <div className="max-w-md mx-auto pointer-events-auto">
            <Button 
               onClick={handleNext}
               disabled={!selectedGoal}
               className="w-full rounded-full py-4 text-lg shadow-[0_0_20px_rgba(249,115,22,0.4)] bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-400 hover:to-pink-400 text-white font-bold border-none disabled:opacity-50 disabled:shadow-none transition-all"
            >
               Done
            </Button>
         </div>
      </div>
    </div>
  );
};