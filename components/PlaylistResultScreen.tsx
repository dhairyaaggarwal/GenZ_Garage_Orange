
import React, { useState } from 'react';
import { InvestmentPlan } from '../types';
import { Button } from './Button';
import { ArrowLeft, ShieldCheck, TrendingUp, ChevronRight, X, Info } from 'lucide-react';
import { calculateRiskProfile } from '../utils/onboardingState';

interface PlaylistResultScreenProps {
  plan: InvestmentPlan;
  onSave: () => void;
  onBack: () => void;
}

export const PlaylistResultScreen: React.FC<PlaylistResultScreenProps> = ({ plan, onSave, onBack }) => {
  const [modalContent, setModalContent] = useState<{ title: string; body: string; emoji: string; color: string } | null>(null);
  const riskProfile = calculateRiskProfile();

  const getEmojiForAsset = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('gold')) return '🌕';
    if (n.includes('nifty') || n.includes('equity') || n.includes('stock')) return '🇮🇳';
    if (n.includes('debt') || n.includes('bond') || n.includes('liquid')) return '🛡️';
    return '✨';
  };

  const getKidFriendlyExplanation = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('nifty 50')) {
      return "The Nifty 50 is like a team of the 50 strongest superheroes in India. When the whole team plays well and wins, you win too!";
    }
    if (n.includes('equity') || n.includes('stock')) {
      return "Imagine buying a tiny slice of your favorite pizza shop. When the shop sells lots of pizza, your tiny slice becomes even bigger and more valuable!";
    }
    if (n.includes('gold')) {
      return "Gold is like a shiny, magical shield. Even when things get a bit scary in the world, this shield stays strong and keeps your treasure safe.";
    }
    if (n.includes('debt') || n.includes('bond')) {
      return "This is like lending your toy to a very good friend. They promise to give it back later and give you a little chocolate as a 'thank you'!";
    }
    if (n.includes('liquid')) {
      return "This is like a super-powered piggy bank. It grows a tiny bit every day, and you can take your money out whenever you want to buy a candy!";
    }
    return "This is a special way Buddy chose to help your money grow bigger while you sleep, based exactly on what you told me!";
  };

  const getColorForAsset = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('equity')) return 'bg-brand-secondary/20';
    if (n.includes('gold')) return 'bg-yellow-500/10';
    return 'bg-white/10';
  };

  return (
    <div className="screen-container bg-[#121826] text-white overflow-hidden">
      
      {/* Asset Explainer Modal - EL5 Style */}
      {modalContent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
           <div className={`${modalContent.color} w-full max-w-sm rounded-[3rem] p-8 text-[#120826] relative overflow-hidden animate-in zoom-in duration-300 shadow-2xl`}>
              <button onClick={() => setModalContent(null)} className="absolute top-6 right-6 p-2 bg-black/10 rounded-full">
                <X size={20} />
              </button>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 shadow-xl text-3xl">{modalContent.emoji}</div>
              <h3 className="text-2xl font-black mb-4 uppercase leading-none tracking-tight">{modalContent.title}</h3>
              <p className="text-sm font-bold leading-relaxed">{modalContent.body}</p>
              <Button onClick={() => setModalContent(null)} fullWidth className="mt-8 bg-[#120826] text-white py-4 rounded-2xl border-none">
                 Got it, Buddy!
              </Button>
           </div>
        </div>
      )}

      {/* Sticky Header */}
      <header className="px-6 pt-12 pb-4 flex items-center justify-between sticky top-0 bg-[#121826]/90 backdrop-blur-md z-[50] shrink-0 border-b border-white/5">
        <button onClick={onBack} className="p-2 -ml-2 text-white/60 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-1.5">
           <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></div>
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Portfolio Ready</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-40">
        <div className="px-6 pb-8 pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h1 className="text-4xl xs:text-5xl font-black tracking-tighter leading-none uppercase">
                {riskProfile.type} <span className="text-brand-primary italic">MIX</span>
              </h1>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center shadow-xl">
                 <TrendingUp size={20} className="text-brand-success mb-1" />
                 <span className="text-[10px] font-black text-brand-success leading-tight">{plan.expectedReturn || riskProfile.expected_annual_return}</span>
              </div>
            </div>
            {/* Removed rationale text block per user request to keep UI clean */}
          </div>
        </div>

        <div className="px-6 space-y-12">
          <section className="space-y-6">
            <div className="flex justify-between items-end">
               <div>
                  <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.2em] mb-1">Asset Breakdown</h3>
                  <div className="flex items-center gap-3">
                     <span className="text-4xl font-black text-brand-primary leading-none">100%</span>
                     <span className="text-xl font-black uppercase tracking-tighter">Personalized</span>
                  </div>
               </div>
               <ShieldCheck className="text-brand-primary/40 mb-1" size={24} />
            </div>

            <div className="space-y-3">
              {plan.allocations.map((alloc, idx) => (
                <button 
                  key={idx}
                  onClick={() => setModalContent({
                    title: alloc.assetClass,
                    body: getKidFriendlyExplanation(alloc.assetClass),
                    emoji: getEmojiForAsset(alloc.assetClass),
                    color: alloc.assetClass.toLowerCase().includes('equity') ? 'bg-[#D8C8EE]' : 'bg-[#FFB7A5]'
                  })}
                  className="w-full bg-white/5 border border-white/5 p-5 rounded-3xl flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all hover:bg-white/10 text-left"
                >
                  <div className="flex items-center gap-4 pointer-events-none flex-1 overflow-hidden">
                    <div className={`w-12 h-12 rounded-2xl ${getColorForAsset(alloc.assetClass)} flex items-center justify-center text-2xl shrink-0`}>
                      {getEmojiForAsset(alloc.assetClass)}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-[13px] uppercase leading-tight truncate">{alloc.assetClass}</h4>
                        <div className="bg-white/10 p-1.5 rounded-full shrink-0">
                          <Info size={12} className="text-white/40" />
                        </div>
                      </div>
                      <p className="text-[9px] text-white/40 font-bold uppercase tracking-wider">Target Weight</p>
                    </div>
                  </div>
                  <span className="font-black text-brand-primary text-xl pointer-events-none ml-4">{alloc.percentage}%</span>
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-4 pb-12">
             <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.2em] mb-1">Your First Steps</h3>
             <div className="space-y-3">
                {plan.firstSteps.map((step, idx) => (
                  <div key={idx} className="flex gap-4 items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                     <div className="w-8 h-8 rounded-full bg-brand-primary text-black flex items-center justify-center font-black text-sm shrink-0">
                        {idx + 1}
                     </div>
                     <p className="text-sm font-bold text-white/80">{step}</p>
                  </div>
                ))}
             </div>
          </section>
        </div>
      </div>

      {/* Floating Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#121826] via-[#121826] to-transparent z-[60]">
        <div className="max-w-md mx-auto">
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
    </div>
  );
};
