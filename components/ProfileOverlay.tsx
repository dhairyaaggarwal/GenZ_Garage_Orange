
import React from 'react';
import { X, User, Target, Zap, LogOut, RefreshCw } from 'lucide-react';
import { getOnboardingState, calculateRiskProfile } from '../utils/onboardingState';

interface ProfileOverlayProps {
  onClose: () => void;
  onReset: () => void;
}

export const ProfileOverlay: React.FC<ProfileOverlayProps> = ({ onClose, onReset }) => {
  const state = getOnboardingState();
  const riskProfile = calculateRiskProfile();

  const GOAL_EMOJIS: Record<string, string> = {
    buy_house: '🏡',
    work_less: '⏳',
    retire_early: '🌅',
    financial_independence: '💸',
    pay_for_school: '🎓',
    dont_know: '🤔',
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#120826] text-white animate-in slide-in-from-right duration-300 flex flex-col">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 flex justify-between items-center">
        <h2 className="text-xl font-black uppercase tracking-widest">My Account</h2>
        <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
          <X size={24} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pb-12 space-y-10">
        {/* Profile Card */}
        <div className="flex flex-col items-center text-center mt-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#9B7EEC] to-[#FFB7A5] p-1 mb-4">
             <div className="w-full h-full bg-[#120826] rounded-full flex items-center justify-center text-4xl">
                👤
             </div>
          </div>
          <h1 className="text-3xl font-black tracking-tight">{state.first_name || 'Orange User'}</h1>
          <p className="text-white/40 text-xs font-black uppercase tracking-[0.2em] mt-1">{state.email}</p>
        </div>

        {/* Strategy Section */}
        <section className="space-y-4">
           <div className="flex items-center gap-2 mb-2">
              <Zap size={18} className="text-brand-primary" />
              <h3 className="text-xs font-black uppercase tracking-widest text-white/40">Your Style</h3>
           </div>
           <div className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] flex items-center justify-between">
              <div>
                <h4 className="text-2xl font-black uppercase tracking-tighter text-brand-primary">
                  {riskProfile.type} <span className="italic font-serif">Mix</span>
                </h4>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">
                  Expected Return: {riskProfile.expected_annual_return}
                </p>
              </div>
              <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center">
                 <Target className="text-brand-primary" />
              </div>
           </div>
        </section>

        {/* Goals Section */}
        <section className="space-y-4">
           <div className="flex items-center gap-2 mb-2">
              <Target size={18} className="text-[#FFB7A5]" />
              <h3 className="text-xs font-black uppercase tracking-widest text-white/40">Goals Tracked</h3>
           </div>
           <div className="grid grid-cols-2 gap-3">
              {state.future_goals.length > 0 ? (
                state.future_goals.map((goal) => (
                  <div key={goal} className="bg-white/5 border border-white/10 p-4 rounded-3xl flex flex-col items-center text-center gap-2">
                    <span className="text-2xl">{GOAL_EMOJIS[goal] || '🎯'}</span>
                    <span className="text-[10px] font-black uppercase tracking-tight leading-tight">
                      {goal.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))
              ) : (
                <p className="col-span-2 text-white/20 text-xs italic">No goals selected yet.</p>
              )}
           </div>
        </section>

        {/* Actions */}
        <div className="pt-6 space-y-3">
           <button 
             onClick={onReset}
             className="w-full bg-white/5 border border-white/10 p-5 rounded-3xl flex items-center justify-between hover:bg-white/10 transition-colors"
           >
              <div className="flex items-center gap-3">
                 <RefreshCw size={20} className="text-brand-secondary" />
                 <span className="font-black text-sm uppercase">Recalculate Profile</span>
              </div>
           </button>
           <button 
             onClick={() => window.location.reload()}
             className="w-full bg-white/5 border border-white/10 p-5 rounded-3xl flex items-center justify-between hover:bg-white/10 transition-colors"
           >
              <div className="flex items-center gap-3">
                 <LogOut size={20} className="text-red-400" />
                 <span className="font-black text-sm uppercase text-red-400">Logout</span>
              </div>
           </button>
        </div>
      </div>
      
      <div className="p-8 text-center">
         <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Orange v1.0.4 — Made for GenZ</p>
      </div>
    </div>
  );
};
