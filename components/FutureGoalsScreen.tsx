
import React, { useEffect, useState, useRef } from 'react';
import { Button } from './Button';
import { CircularHeader } from './CircularHeader';
import { speakBuddy } from '../utils/voice';

interface FutureGoalsScreenProps {
  onContinue: (selectedGoals: string[]) => void;
  onJumpToStep?: (step: number) => void;
}

const goals = [
  { id: 'buy_house', text: 'Buy a house', emoji: '🏡' },
  { id: 'work_less', text: 'Work less', emoji: '⏳' },
  { id: 'retire_early', text: 'Retire early', emoji: '🌅' },
  { id: 'financial_independence', text: 'Be financially independent', emoji: '💸' },
  { id: 'pay_for_school', text: 'Pay for school', emoji: '🎓' },
  { id: 'dont_know', text: 'I don’t know yet', emoji: '🤔' },
];

export const FutureGoalsScreen: React.FC<FutureGoalsScreenProps> = ({ onContinue, onJumpToStep }) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (hasPlayedRef.current) return;
      hasPlayedRef.current = true;
      speakBuddy("What are your future goals?");
    }, 600);
    
    return () => {
      clearTimeout(timer);
      window.speechSynthesis.cancel();
    };
  }, []);

  const toggleGoal = (id: string) => {
    setSelectedGoals(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
  };

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-brand-bg font-sans">
      <CircularHeader currentStep={2} totalSteps={5} onJumpToStep={onJumpToStep} />
      
      <div className="flex-1 flex flex-col items-center px-6 z-10 w-full max-w-md mx-auto overflow-y-auto no-scrollbar pb-32">
         <h1 className="text-4xl text-brand-text text-center font-black mb-6 leading-tight mt-4">
           What are your <span className="italic font-serif text-brand-secondary">future goals?</span>
         </h1>

         <div className="w-full space-y-3">
           {goals.map((goal) => {
             const isSelected = selectedGoals.includes(goal.id);
             return (
               <button 
                 key={goal.id}
                 onClick={() => toggleGoal(goal.id)}
                 className={`w-full p-5 rounded-[1.5rem] flex items-center justify-between group transition-all duration-200 shadow-sm ${
                    isSelected ? 'option-card-selected' : 'option-card-default'
                 }`}
               >
                 <span className="text-lg font-bold text-brand-text">{goal.text}</span>
                 <span className="text-2xl">{goal.emoji}</span>
               </button>
             );
           })}
         </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6 pb-12 bg-gradient-to-t from-brand-bg via-brand-bg to-transparent z-20">
         <div className="max-w-md mx-auto">
            <Button 
               onClick={() => onContinue(selectedGoals)}
               disabled={selectedGoals.length === 0}
               fullWidth
               className="py-4 text-xl"
            >
               Continue
            </Button>
         </div>
      </div>
    </div>
  );
};
