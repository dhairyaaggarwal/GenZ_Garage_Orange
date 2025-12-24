
import React, { useState, useMemo } from 'react';
import { ArrowLeft, CheckCircle2, ShieldCheck, Info, Unlock, ExternalLink, History } from 'lucide-react';
import { Playlist } from '../types';
import { Button } from './Button';

interface PlaylistDetailScreenProps {
  playlist: Playlist;
  onBack: () => void;
}

export const PlaylistDetailScreen: React.FC<PlaylistDetailScreenProps> = ({ playlist, onBack }) => {
  const [investment, setInvestment] = useState(10000);
  const [isInvesting, setIsInvesting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Dynamic Calculation based on Playlist Returns (Numeric)
  const returnRate = playlist.numericReturn || 0.15;

  // Historical Projection: "If you invested X five years ago, what would it be today?"
  const todaysValue = useMemo(() => {
    // Formula: Past Investment * (1 + Avg Annual Return) ^ 5 years
    return Math.round(investment * Math.pow(1 + returnRate, 5));
  }, [investment, returnRate]);

  const growthMultiplier = useMemo(() => {
    return (todaysValue / investment).toFixed(1);
  }, [todaysValue, investment]);

  const handleInvest = async () => {
    setIsInvesting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsInvesting(false);
    setIsSuccess(true);
    setTimeout(() => {
        setIsSuccess(false);
        onBack();
    }, 3000);
  };

  if (isSuccess) {
      return (
          <div className="h-full flex flex-col items-center justify-center bg-[#121826] text-white p-6 text-center animate-in fade-in duration-500">
              <div className="w-24 h-24 bg-brand-success/20 rounded-full flex items-center justify-center mb-8 border-4 border-brand-success shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                  <CheckCircle2 size={48} className="text-brand-success" />
              </div>
              <h1 className="text-4xl font-black mb-4 uppercase tracking-tight leading-none">SUCCESS!</h1>
              <p className="text-white/60 text-lg font-medium max-w-xs mx-auto mb-12">
                  You just started your journey with the <span className="text-brand-primary">{playlist.title}</span> playlist.
              </p>
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-3">
                  <ShieldCheck className="text-[#DFFF4F]" />
                  <span className="text-xs font-black uppercase tracking-widest text-[#DFFF4F]">Verified by SEBI Standards</span>
              </div>
          </div>
      );
  }

  return (
    <div className="flex flex-col h-full bg-white font-sans text-[#1F1F1F] overflow-y-auto no-scrollbar">
      {/* Header */}
      <header className="px-6 pt-12 pb-4 flex items-center gap-4 sticky top-0 bg-white/80 backdrop-blur-md z-30">
        <button onClick={onBack} className="p-1 -ml-1 text-gray-900 hover:text-[#9B7EEC] transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xl">{playlist.emoji}</span>
          <h1 className="text-lg font-black tracking-tight">{playlist.title}</h1>
        </div>
      </header>

      {/* Dynamic Performance Summary */}
      <div className="px-6 py-6 space-y-2">
        <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#9B7EEC]">
           @orange_buddy_system 
           <div className="w-3 h-3 bg-[#9B7EEC] rounded-full flex items-center justify-center">
              <span className="text-[8px] text-white">✓</span>
           </div>
        </div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live Growth Pulse</p>
        <h2 className="text-5xl font-black text-[#10B981] tracking-tighter">
          ↑ {playlist.returns}
          <span className="text-sm font-bold text-gray-400 ml-2 tracking-normal uppercase">growth</span>
        </h2>
      </div>

      {/* Performance Chart Simulation */}
      <div className="px-6 h-48 mb-8 relative">
        <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
          <path 
            d="M0,120 Q50,110 100,130 T200,90 T300,70 T400,30" 
            fill="none" 
            stroke="#10B981" 
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path 
            d="M0,120 Q50,110 100,130 T200,90 T300,70 T400,30 L400,150 L0,150 Z" 
            fill="url(#chartGrad)" 
            opacity="0.1"
          />
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Safety Markers */}
      <div className="px-6 flex gap-3 mb-10">
          <div className="flex-1 bg-brand-bg/40 p-3 rounded-2xl flex items-center gap-2 border border-brand-card">
              <Unlock size={16} className="text-brand-secondary" />
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase text-brand-secondary leading-tight">No Lock-in</span>
                <span className="text-[7px] font-bold text-brand-subtext uppercase">Withdraw Anytime</span>
              </div>
          </div>
          <div className="flex-1 bg-brand-bg/40 p-3 rounded-2xl flex items-center gap-2 border border-brand-card">
              <ShieldCheck size={16} className="text-brand-success" />
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase text-brand-success leading-tight">SEBI Safe</span>
                <span className="text-[7px] font-bold text-brand-subtext uppercase">Regulated Funds</span>
              </div>
          </div>
      </div>

      {/* Historical Time Machine - Now showing "What If I started 5 years ago?" */}
      <div className="px-6 mb-12">
        <div className="bg-[#121826] rounded-[40px] p-8 relative overflow-hidden text-white shadow-2xl">
           <div className="absolute top-0 right-0 w-32 h-32 bg-[#9B7EEC]/20 rounded-full blur-[60px]"></div>
           <div className="relative z-10">
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                   <History size={18} className="text-brand-primary" />
                   <h3 className="text-2xl font-black italic uppercase tracking-tighter">TIME MACHINE</h3>
                </div>
                <Info size={16} className="text-white/20" />
              </div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-6">Simulation: 2020 vs Today</p>
              
              <div className="flex justify-between items-end mb-8">
                <div>
                   <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Invested in 2020</p>
                   <span className="text-3xl font-black text-white/90">₹{investment.toLocaleString()}</span>
                </div>
                <div className="text-right flex flex-col items-end">
                    <div className="flex items-center gap-1.5 mb-1">
                       <div className="w-1.5 h-1.5 rounded-full bg-brand-success animate-pulse"></div>
                       <p className="text-[10px] font-black text-brand-success uppercase tracking-widest">Value Today</p>
                    </div>
                    <p className="text-3xl font-black text-brand-primary">₹{todaysValue.toLocaleString()}</p>
                    <div className="bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest mt-1">
                      {growthMultiplier}x Growth
                    </div>
                </div>
              </div>
              
              <div className="relative w-full mb-2">
                 <input 
                    type="range" 
                    min="1000" 
                    max="500000" 
                    step="1000"
                    value={investment}
                    onChange={(e) => setInvestment(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-secondary"
                 />
                 <div className="flex justify-between mt-3 text-[8px] font-black text-white/20 uppercase tracking-widest">
                    <span>₹1,000</span>
                    <span>₹5 Lakhs</span>
                 </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/5 flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm">💡</div>
                 <p className="text-[9px] font-bold text-white/50 leading-relaxed uppercase">
                    If you had started with <span className="text-white">₹{investment.toLocaleString()}</span> in 2020, you would have made <span className="text-brand-success">₹{(todaysValue - investment).toLocaleString()}</span> in profit by doing nothing.
                 </p>
              </div>
           </div>
        </div>
      </div>

      {/* Dynamic Holdings Section */}
      <section className="px-6 space-y-6 pb-40">
        <div className="bg-brand-bg/30 p-6 rounded-3xl border border-brand-card">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-black uppercase tracking-tight">Buddy's Rationale</h3>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed font-medium italic">
            "{playlist.description}"
          </p>
        </div>

        <div className="flex justify-between items-center px-2">
           <h3 className="text-xl font-black">Holdings Breakdown</h3>
           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
             LIVE UPDATE <div className="w-1.5 h-1.5 rounded-full bg-brand-success animate-pulse"></div>
           </span>
        </div>

        <div className="space-y-4">
          {playlist.items.map((item, idx) => (
            <div key={idx} className="bg-white border border-gray-100 rounded-3xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#E9DDF3] rounded-2xl flex items-center justify-center text-xl shadow-inner">{item.icon}</div>
                <div>
                   <h4 className="font-bold text-sm text-gray-800">{item.name}</h4>
                   <p className="text-[10px] text-brand-success font-black uppercase tracking-wider">↑ {item.returns}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-black text-lg text-[#9B7EEC]">{item.weight}</span>
                <p className="text-[8px] font-bold text-gray-400 uppercase">Weight</p>
              </div>
            </div>
          ))}
          
          <button className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:border-brand-secondary hover:text-brand-secondary transition-colors">
            <ExternalLink size={12} /> View Complete Sector Details
          </button>
        </div>
      </section>

      {/* Sticky Action Button */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-white via-white/95 to-transparent z-40">
        <Button 
            onClick={handleInvest}
            disabled={isInvesting}
            className="w-full py-5 text-xl font-black bg-[#9B7EEC] text-white border-none shadow-2xl shadow-[#9B7EEC]/30 active:scale-95 transition-transform flex items-center justify-center gap-3"
        >
           {isInvesting ? (
               <>
                <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Syncing with Bank...</span>
               </>
           ) : (
               `Invest ₹${investment.toLocaleString()}`
           )}
        </Button>
      </div>
    </div>
  );
};
