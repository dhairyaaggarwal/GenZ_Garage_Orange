
import React, { useEffect, useState, useRef } from 'react';
import { Button } from './Button';
import { CircularHeader } from './CircularHeader';
import { getOnboardingState } from '../utils/onboardingState';
import { Check, Info, ShieldCheck } from 'lucide-react';
import { speakBuddy } from '../utils/voice';

interface FinalizePlanScreenProps {
  onContinue: () => void;
  onJumpToStep?: (step: number) => void;
}

const SummaryRow = ({ label, value, progress, isCompleted }: { label: string, value: string, progress: number, isCompleted?: boolean }) => (
  <div className="bg-white rounded-[2rem] p-5 border-2 border-brand-card relative overflow-hidden transition-all duration-300 shadow-sm">
    <div className="flex justify-between items-center mb-2">
        <span className="text-brand-subtext font-bold text-xs uppercase tracking-widest">{label}</span>
        <div className="flex items-center gap-2">
            <span className="text-brand-text font-black text-sm truncate max-w-[150px]">{value}</span>
            {isCompleted && <div className="bg-brand-secondary/10 p-1 rounded-full"><Check size={12} className="text-brand-secondary" /></div>}
        </div>
    </div>
    <div className="w-full h-1.5 bg-brand-bg rounded-full overflow-hidden">
        <div className="h-full bg-brand-secondary rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
    </div>
  </div>
);

export const FinalizePlanScreen: React.FC<FinalizePlanScreenProps> = ({ onContinue, onJumpToStep }) => {
  const [showContent, setShowContent] = useState(false);
  const hasPlayedRef = useRef(false);
  const state = getOnboardingState();

  useEffect(() => {
    const t = setTimeout(() => {
      setShowContent(true);
      if (!hasPlayedRef.current) {
        hasPlayedRef.current = true;
        speakBuddy("I've put together a plan that grows with you. Ready to see it?");
      }
    }, 400);
    return () => {
      clearTimeout(t);
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-brand-bg font-sans">
      <CircularHeader currentStep={4} totalSteps={5} onJumpToStep={onJumpToStep} />
      
      <div className={`flex-1 flex flex-col items-center px-6 z-10 w-full max-w-md mx-auto mt-6 transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
         <h1 className="text-4xl text-brand-text text-center font-black mb-2 leading-tight">
           Your <span className="italic font-serif text-brand-secondary">Orange Blueprint</span>
         </h1>
         <p className="text-brand-subtext font-medium text-sm mb-8 text-center">We’ve simplified everything just for you.</p>

         <div className="w-full space-y-4 mb-8">
            <SummaryRow 
              label="Style" 
              value={state.current_activities?.includes('investing') ? 'Growth Master' : 'Early Starter'} 
              progress={state.current_activities?.includes('investing') ? 90 : 30} 
              isCompleted 
            />
            <SummaryRow 
              label="Goal" 
              value={state.future_goals?.[0] || 'Dreaming Big'} 
              progress={100} 
              isCompleted 
            />
            <SummaryRow 
              label="Comfort" 
              value={state.risk_temperament ? state.risk_temperament.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Balanced'} 
              progress={100} 
              isCompleted 
            />
         </div>

         <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 border-2 border-brand-card flex flex-col items-center gap-3 text-center mb-8 shadow-inner">
            <div className="bg-brand-tertiary/20 p-2 rounded-xl text-brand-tertiary">
                <div className="w-10 h-10 bg-brand-tertiary/20 rounded-xl flex items-center justify-center">
                    <Info size={20} className="text-brand-tertiary" />
                </div>
            </div>
            <p className="text-brand-text font-bold leading-relaxed">
              "This plan is just a starting point. You can adjust your speed anytime."
            </p>
         </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6 pb-12 bg-gradient-to-t from-brand-bg via-brand-bg to-transparent z-20">
         <div className="max-w-md mx-auto space-y-4">
            <div className="flex justify-center items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-muted">
                <ShieldCheck size={14} className="text-brand-success" />
                <span>Zero Commitment to Start</span>
            </div>
            <Button onClick={onContinue} fullWidth className="py-5 text-xl shadow-xl shadow-brand-primary/20">
               Reveal My Strategy
            </Button>
         </div>
      </div>
    </div>
  );
};
