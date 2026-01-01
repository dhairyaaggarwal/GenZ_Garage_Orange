
import React, { useState } from 'react';
import { Home as HomeIcon, GraduationCap, Flame, Menu, Star } from 'lucide-react';
import { Playlist } from '../types';
import { ProfileOverlay } from './ProfileOverlay';
import { getOnboardingState } from '../utils/onboardingState';

interface HomeScreenProps {
  playlists: Playlist[];
  onSelectPlaylist: (playlist: Playlist) => void;
  onCreatePlaylist: () => void;
}

const BRAND_ICONS = [
  { emoji: '🍕', label: 'Zomato', top: '15%', left: '10%', delay: '0s' },
  { emoji: '🎬', label: 'Netflix', top: '22%', left: '25%', delay: '1.2s' },
  { emoji: '🎧', label: 'Spotify', top: '10%', left: '45%', delay: '0.5s' },
  { emoji: '🛍️', label: 'Amazon', top: '18%', left: '70%', delay: '1.8s' },
  { emoji: '🏦', label: 'HDFC', top: '35%', left: '15%', delay: '0.7s' },
  { emoji: '💎', label: 'Reliance', top: '45%', left: '5%', delay: '2.1s' },
  { emoji: '📱', label: 'Apple', top: '30%', left: '55%', delay: '1.4s' },
  { emoji: '🚗', label: 'Tata', top: '42%', left: '35%', delay: '0.3s' },
  { emoji: '💸', label: 'Paytm', top: '38%', left: '85%', delay: '2.5s' },
  { emoji: '💄', label: 'Nykaa', top: '55%', left: '75%', delay: '1.1s' },
  { emoji: '🍦', label: 'Swiggy', top: '65%', left: '15%', delay: '0.9s' },
  { emoji: '🎮', label: 'Nvidia', top: '58%', left: '48%', delay: '1.6s' },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({ playlists, onSelectPlaylist, onCreatePlaylist }) => {
  const [showToast, setShowToast] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const state = getOnboardingState();

  const handleFeatureClick = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  // Logic to check if a curated playlist matches user vibes
  const doesMatchVibe = (playlistId: string) => {
    const userVibes = state.vibes || [];
    if (playlistId === 'digital_first' && (userVibes.includes('it') || userVibes.includes('digital_payments'))) return true;
    if (playlistId === 'make_in_india' && userVibes.includes('india_growth')) return true;
    if (playlistId === 'green_future' && (userVibes.includes('renewable') || userVibes.includes('ev'))) return true;
    return false;
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#120826] text-white font-sans overflow-hidden">
      {showProfile && (
        <ProfileOverlay 
          onClose={() => setShowProfile(false)} 
          onReset={handleReset} 
        />
      )}

      {showToast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 bg-brand-primary text-black px-6 py-3 rounded-full font-black text-xs z-[100] animate-in slide-in-from-top-4 shadow-2xl">
          Coming soon! 🚀
        </div>
      )}

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        <header className="px-6 pt-12 pb-4 flex justify-between items-center relative z-20">
          <div className="w-10"></div>
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-6 h-6">
               <path d="M50 25 C 50 25 65 5 85 15 C 85 15 75 35 50 35" fill="#DFFF4F" />
               <path d="M50 25 C 50 25 35 5 15 15 C 15 15 25 35 50 35" fill="#9B7EEC" />
               <circle cx="50" cy="60" r="35" fill="#FFB7A5" />
            </svg>
          </div>
          <button 
            onClick={() => setShowProfile(true)}
            className="p-2 -mr-2 text-white/60 hover:text-white transition-colors"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* HERO SECTION */}
        <section className="relative h-[380px] w-full mt-[-20px] overflow-hidden">
          {BRAND_ICONS.map((brand, i) => (
            <div 
              key={i}
              className="absolute animate-float"
              style={{ 
                top: brand.top, 
                left: brand.left, 
                animationDelay: brand.delay,
                animationDuration: `${5 + Math.random() * 3}s`
              }}
            >
              <div className="w-14 h-14 bg-white/5 backdrop-blur-xl rounded-[20px] border border-white/10 flex items-center justify-center shadow-2xl transform rotate-[-8deg]">
                <span className="text-2xl">{brand.emoji}</span>
              </div>
            </div>
          ))}

          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-6 pointer-events-none">
            <h1 className="text-6xl font-black tracking-tighter leading-[0.9] mb-4">
              You decide,<br/>
              <span className="italic font-serif text-brand-primary">we guide</span>
            </h1>
            <p className="text-white/60 font-medium text-sm max-w-[280px] leading-relaxed">
              A better way to begin investing at your pace 💪🏽
            </p>
          </div>
        </section>

        <div className="px-6 space-y-8">
          
          <div className="flex gap-4">
            <button onClick={handleFeatureClick} className="flex-1 bg-brand-tertiary p-6 rounded-[2.5rem] text-[#120826] text-left relative overflow-hidden h-[150px]">
              <h3 className="text-xl font-black leading-tight mb-2 uppercase tracking-tighter">Learn to<br/>invest</h3>
              <p className="text-[10px] font-bold text-black/50 leading-tight">Master the basics in<br/>100+ tiny lessons.</p>
              <div className="absolute bottom-[-10px] right-[-10px] text-6xl opacity-20 rotate-12">🎓</div>
            </button>
          </div>

          <button onClick={onCreatePlaylist} className="w-full bg-brand-card rounded-[2.5rem] p-8 text-[#120826] text-left relative overflow-hidden flex justify-between items-center h-[160px] shadow-xl">
            <div className="max-w-[70%] relative z-10">
              <p className="text-[9px] font-black text-black/40 mb-1 uppercase tracking-widest leading-none">Your investing personality</p>
              <h3 className="text-3xl font-black leading-[0.85] uppercase tracking-tighter">CREATE YOUR<br/>OWN <span className="text-[#9B7EEC] italic">PLAYLIST</span></h3>
            </div>
            <div className="relative w-16 h-16 mr-[-20px] rotate-12 shrink-0">
               <div className="absolute top-0 right-0 w-16 h-20 bg-brand-tertiary rounded-2xl shadow-lg border border-black/5"></div>
               <div className="absolute top-2 right-4 w-16 h-20 bg-brand-primary rounded-2xl shadow-lg border border-black/5 -translate-x-4"></div>
            </div>
          </button>

          <div className="space-y-4 pt-4">
             <div className="flex items-center gap-2">
                <Flame size={20} className="text-brand-primary" />
                <h3 className="text-xl font-black uppercase tracking-tight">Popular Playlists</h3>
                <div className="flex items-center gap-1 ml-auto">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-success animate-pulse"></div>
                    <span className="text-[8px] font-black uppercase text-brand-success tracking-widest">Live Updates</span>
                </div>
             </div>
             
             <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6 pb-4">
                {playlists.map((p) => {
                   const isRecommended = doesMatchVibe(p.id);
                   return (
                     <button 
                       key={p.id} 
                       onClick={() => onSelectPlaylist(p)}
                       className={`min-w-[155px] h-[200px] ${p.color} rounded-[2.5rem] p-6 flex flex-col justify-between text-[#120826] shadow-xl text-left active:scale-95 transition-transform relative overflow-hidden`}
                     >
                        {isRecommended && (
                          <div className="absolute top-4 right-4 animate-in zoom-in">
                             <div className="bg-[#120826] text-white p-1 rounded-full"><Star size={10} fill="currentColor" /></div>
                          </div>
                        )}
                        <span className="text-3xl">{p.emoji}</span>
                        <div>
                          {isRecommended && (
                            <p className="text-[7px] font-black text-[#120826]/40 uppercase tracking-widest mb-1">Matches your Vibe</p>
                          )}
                          <h4 className="font-black text-[15px] uppercase leading-none mb-1 tracking-tighter">{p.title}</h4>
                          <p className="text-[11px] font-black text-black/40">↑ {p.returns}</p>
                        </div>
                     </button>
                   );
                })}
             </div>
          </div>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 w-full bg-[#120826]/90 backdrop-blur-3xl border-t border-white/5 flex justify-around items-end py-6 px-4 z-40">
        <button className="flex flex-col items-center gap-1.5 text-brand-primary">
          <HomeIcon size={26} />
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">Home</span>
        </button>
        
        <button onClick={() => setShowToast(true)} className="flex flex-col items-center gap-1.5 text-white transition-colors">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#9B7EEC] via-[#DFFF4F] to-[#FFB7A5] border-2 border-white/80 p-[2px] shadow-[0_0_15px_rgba(155,126,236,0.3)]">
             <div className="w-full h-full bg-white/20 backdrop-blur-sm rounded-full"></div>
          </div>
          <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">Buddy</span>
        </button>

        <button onClick={handleFeatureClick} className="flex flex-col items-center gap-1.5 text-white/20 hover:text-white transition-colors">
          <GraduationCap size={26} />
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">Learn</span>
        </button>
      </nav>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(-8deg); }
          50% { transform: translateY(-25px) rotate(4deg); }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
};
