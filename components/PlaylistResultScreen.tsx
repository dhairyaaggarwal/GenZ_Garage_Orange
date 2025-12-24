
import React, { useState } from 'react';
import { InvestmentPlan } from '../types';
import { Button } from './Button';
import { ArrowLeft, Sparkles, ShieldCheck, TrendingUp, Lock, AlertTriangle, ChevronRight, X, Info } from 'lucide-react';
import { getOnboardingState, calculateRiskProfile } from '../utils/onboardingState';

interface PlaylistResultScreenProps {
  plan: InvestmentPlan;
  onSave: () => void;
  onBack: () => void;
}

export const PlaylistResultScreen: React.FC<PlaylistResultScreenProps> = ({ plan, onSave, onBack }) => {
  const [showNiftyModal, setShowNiftyModal] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [showGoldModal, setShowGoldModal] = useState(false);
  
  const state = getOnboardingState();
  const riskProfile = calculateRiskProfile();
  
  const hasVibes = state.investment_needs && state.investment_needs.length > 0;
  const totalEquity = riskProfile.equity_display;
  const coreEquityAlloc = hasVibes ? Math.round(totalEquity * 0.7) : totalEquity;
  const interestEquityAlloc = totalEquity - coreEquityAlloc;
  
  const safetyAlloc = riskProfile.debt_display;
  const goldAlloc = riskProfile.gold;

  return (
    <div className="flex flex-col h-full bg-[#121826] text-white font-sans overflow-y-auto no-scrollbar pb-40">
      
      {/* 5-Year Old Explainer: Top 50 Giants */}
      {showNiftyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-[#D8C8EE] w-full max-w-sm rounded-[3rem] p-8 text-[#120826] relative overflow-hidden">
              <button onClick={() => setShowNiftyModal(false)} className="absolute top-6 right-6 p-2 bg-black/10 rounded-full">
                <X size={20} />
              </button>
              <div className="w-16 h-16 bg-[#9B7EEC] rounded-2xl flex items-center justify-center mb-6 shadow-xl text-3xl">🇮🇳</div>
              <h3 className="text-2xl font-black mb-4 uppercase leading-none">Top 50 Indian Giants</h3>
              <div className="space-y-4">
                 <p className="text-sm font-bold leading-relaxed">
                   Imagine India has a big team of its <span className="text-[#9B7EEC]">50 best players</span> (big companies like Reliance, Tata, and HDFC).
                 </p>
                 <p className="text-sm font-bold leading-relaxed">
                   When you invest in this, you're buying a ticket to the whole team's success! If the team wins, you win. It's the simplest way to grow with India.
                 </p>
              </div>
              <Button onClick={() => setShowNiftyModal(false)} fullWidth className="mt-8 bg-[#120826] text-white py-4 rounded-2xl border-none">
                 Got it, Buddy!
              </Button>
           </div>
        </div>
      )}

      {/* 5-Year Old Explainer: Safety Bucket (Bonds) */}
      {showSafetyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-[#FFB7A5] w-full max-w-sm rounded-[3rem] p-8 text-[#120826] relative overflow-hidden">
              <button onClick={() => setShowSafetyModal(false)} className="absolute top-6 right-6 p-2 bg-black/10 rounded-full text-[#120826]">
                <X size={20} />
              </button>
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-xl text-3xl">🛡️</div>
              <h3 className="text-2xl font-black mb-4 uppercase leading-none">The Safety Bucket</h3>
              <div className="space-y-4">
                 <p className="text-sm font-bold leading-relaxed">
                   Think of this like a <span className="text-brand-success underline">Magic Vault</span> for your money.
                 </p>
                 <p className="text-sm font-bold leading-relaxed">
                   We put your money in "Bonds"—which is like lending your pocket money to a very reliable friend (like the Government). They promise to keep it safe and give you a little <span className="italic">"Thank You"</span> gift (interest) every single year.
                 </p>
              </div>
              <Button onClick={() => setShowSafetyModal(false)} fullWidth className="mt-8 bg-[#120826] text-white py-4 rounded-2xl border-none">
                 Sweet!
              </Button>
           </div>
        </div>
      )}

      {/* 5-Year Old Explainer: Digital Gold */}
      {showGoldModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-brand-primary w-full max-w-sm rounded-[3rem] p-8 text-[#120826] relative overflow-hidden">
              <button onClick={() => setShowGoldModal(false)} className="absolute top-6 right-6 p-2 bg-black/10 rounded-full text-[#120826]">
                <X size={20} />
              </button>
              <div className="w-16 h-16 bg-[#120826] rounded-2xl flex items-center justify-center mb-6 shadow-xl text-3xl">🌕</div>
              <h3 className="text-2xl font-black mb-4 uppercase leading-none">Digital Gold</h3>
              <div className="space-y-4">
                 <p className="text-sm font-bold leading-relaxed">
                   Gold is like a <span className="text-orange-600">Golden Shield</span>. Even when the world gets messy, gold stays shiny and valuable.
                 </p>
                 <p className="text-sm font-bold leading-relaxed">
                   "Digital" means we buy real gold for you and keep it in a giant safe. You don't have to carry it, but you own it! It's like having a treasure chest that grows with you.
                 </p>
              </div>
              <Button onClick={() => setShowGoldModal(false)} fullWidth className="mt-8 bg-[#120826] text-white py-4 rounded-2xl border-none">
                 Awesome!
              </Button>
           </div>
        </div>
      )}

      {/* Header */}
      <header className="px-6 pt-12 pb-4 flex items-center justify-between sticky top-0 bg-[#121826]/90 backdrop-blur-md z-50">
        <button onClick={onBack} className="p-2 -ml-2 text-white/60 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-1.5">
           <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></div>
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Portfolio Ready</span>
        </div>
      </header>

      {/* Hero Profile Summary */}
      <div className="px-6 pb-8 pt-4">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <h1 className="text-5xl font-black tracking-tighter leading-none uppercase">
              {riskProfile.type} <span className="text-brand-primary italic">MIX</span>
            </h1>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center shadow-xl">
               <TrendingUp size={20} className="text-brand-success mb-1" />
               <span className="text-[10px] font-black text-brand-success leading-tight">{riskProfile.expected_annual_return}</span>
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform">
                <Sparkles size={48} />
             </div>
             <p className="text-sm font-medium text-white/80 leading-relaxed italic relative z-10">
                "{riskProfile.explanation.why_this}"
             </p>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-12">
        
        {/* GROWTH PORTION (EQUITY) */}
        <section className="space-y-4">
          <div className="flex justify-between items-end">
             <div>
                <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.2em] mb-1">Growth Engine</h3>
                <div className="flex items-center gap-3">
                   <span className="text-4xl font-black text-brand-secondary leading-none">{totalEquity}%</span>
                   <span className="text-xl font-black uppercase tracking-tighter">EQUITY</span>
                </div>
             </div>
             <ShieldCheck className="text-brand-secondary/40 mb-1" size={24} />
          </div>

          <div className="space-y-3">
            {/* Core (Top 50 Giants) */}
            <div 
              onClick={() => setShowNiftyModal(true)}
              className="bg-white/5 border border-white/5 p-4 rounded-3xl flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform hover:bg-white/10"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-secondary/20 flex items-center justify-center text-xl">🇮🇳</div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-black text-sm uppercase">Top 50 Indian Giants</h4>
                    <div className="bg-white/10 p-1 rounded-full"><Info size={10} className="text-white/40" /></div>
                  </div>
                  <p className="text-[9px] text-white/40 font-bold uppercase tracking-wider">India's Strongest Companies</p>
                </div>
              </div>
              <span className="font-black text-brand-primary">{coreEquityAlloc}%</span>
            </div>

            {/* Smart Selection (Vibes) */}
            {interestEquityAlloc > 0 && (
              <div className="bg-white/5 border border-white/5 p-4 rounded-3xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-xl">✨</div>
                  <div>
                    <h4 className="font-black text-sm uppercase">Smart Vibe Mix</h4>
                    <p className="text-[9px] text-white/40 font-bold uppercase tracking-wider">Themes you care about</p>
                  </div>
                </div>
                <span className="font-black text-brand-primary">{interestEquityAlloc}%</span>
              </div>
            )}
          </div>
        </section>

        {/* SAFETY PORTION */}
        <section className="space-y-4">
          <div className="flex justify-between items-end">
             <div>
                <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.2em] mb-1">Stability & safety</h3>
                <div className="flex items-center gap-3">
                   <span className="text-4xl font-black text-[#FFB7A5] leading-none">{safetyAlloc + goldAlloc}%</span>
                   <span className="text-xl font-black uppercase tracking-tighter">SECURE</span>
                </div>
             </div>
             <Lock className="text-[#FFB7A5]/40 mb-1" size={24} />
          </div>

          <div className="space-y-3">
             <div 
                onClick={() => setShowSafetyModal(true)}
                className="bg-white/5 border border-white/5 p-4 rounded-3xl flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform hover:bg-white/10"
             >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl">🛡️</div>
                    <div>
                        <div className="flex items-center gap-1.5">
                            <h4 className="font-black text-sm uppercase">Safety Bucket</h4>
                            <div className="bg-white/10 p-1 rounded-full"><Info size={10} className="text-white/40" /></div>
                        </div>
                        <p className="text-[9px] text-white/40 font-bold uppercase tracking-wider">Protecting your capital</p>
                    </div>
                </div>
                <span className="font-black text-white/80">{safetyAlloc}%</span>
             </div>

             {goldAlloc > 0 && (
                <div 
                    onClick={() => setShowGoldModal(true)}
                    className="bg-white/5 border border-white/5 p-4 rounded-3xl flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform hover:bg-white/10"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-xl">🌕</div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <h4 className="font-black text-sm uppercase">Digital Gold</h4>
                                <div className="bg-white/10 p-1 rounded-full"><Info size={10} className="text-white/40" /></div>
                            </div>
                            <p className="text-[9px] text-white/40 font-bold uppercase tracking-wider">Inflation protection</p>
                        </div>
                    </div>
                    <span className="font-black text-white/80">{goldAlloc}%</span>
                </div>
             )}
          </div>
        </section>
      </div>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#121826] via-[#121826] to-transparent z-[60]">
        <Button 
            onClick={onSave} 
            fullWidth 
            className="py-5 text-xl font-black bg-brand-secondary text-white border-none shadow-2xl shadow-brand-secondary/40 active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          Save My Playlist <ChevronRight size={20} />
        </Button>
        <button 
            onClick={onBack} 
            className="w-full text-center mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors"
        >
          ✕ Review Profile
        </button>
      </div>
    </div>
  );
};
