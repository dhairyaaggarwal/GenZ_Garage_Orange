import React from 'react';
import { Button } from './Button';
import { getOnboardingState, addPlaylist, UserPlaylist } from '../utils/onboardingState';
import { X } from 'lucide-react';

interface PlaylistResultScreenProps {
  onContinue: () => void;
  onInvestLater: () => void;
}

export const PlaylistResultScreen: React.FC<PlaylistResultScreenProps> = ({ onContinue, onInvestLater }) => {
  const state = getOnboardingState();
  const interestList = state.playlistInterests || [];
  const goal = state.playlistGoal || "Balanced";

  const getLogoUrl = (domain: string) => 
    `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=128`;

  // Indian Market Data - Mock Generation
  const coreItems = [
    { name: "Nifty 50 Index", sub: "↑ 14% past 1Y", pct: "40%", color: "bg-orange-600", icon: "🇮🇳" },
    { name: "Nifty Next 50", sub: "↑ 35% past 1Y", pct: "20%", color: "bg-amber-500", icon: "🚀" },
    { name: "Gold BeES", sub: "Safe Haven", pct: "15%", color: "bg-yellow-500", icon: "✨" },
    { name: "Liquid BeES", sub: "Stability", pct: "15%", color: "bg-teal-600", icon: "💧" },
    { name: "Nifty Midcap", sub: "High Growth", pct: "10%", color: "bg-red-500", icon: "📈" }
  ];

  const interestItems = [
    { name: "Banking (Pvt)", sub: "↑ 12% past 1Y", pct: "5%", color: "bg-blue-600", icon: "🏦" },
    { name: "IT Sector", sub: "↑ 20% past 1Y", pct: "5%", color: "bg-indigo-500", icon: "💻" },
    { name: "Auto Sector", sub: "↑ 45% past 1Y", pct: "5%", color: "bg-rose-600", icon: "🚗" },
    { name: "Pharma", sub: "↑ 15% past 1Y", pct: "5%", color: "bg-cyan-600", icon: "💊" }
  ];

  const companyItems = [
    { name: "Reliance Ind.", sub: "↑ 22% past 1Y", pct: "5%", domain: "ril.com" },
    { name: "HDFC Bank", sub: "↑ 5% past 1Y", pct: "4%", domain: "hdfcbank.com" },
    { name: "TCS", sub: "↑ 18% past 1Y", pct: "4%", domain: "tcs.com" },
    { name: "Tata Motors", sub: "↑ 60% past 1Y", pct: "4%", domain: "tatamotors.com" },
    { name: "ITC", sub: "↑ 30% past 1Y", pct: "3%", domain: "itc.in" },
  ];

  const handleContinue = () => {
    // 1. Construct the detailed playlist data based on user choices
    const count = (state.myPlaylists?.length || 0) + 1;
    const goalMap: Record<string, string> = {
        aggressive: "Aggressive Growth",
        high: "High Growth",
        balanced: "Balanced Growth",
        conservative: "Stable Growth"
    };

    const newPlaylist: UserPlaylist = {
        id: `quiz-gen-${Date.now()}`,
        title: `My Investing Playlist #${count}`,
        subtitle: "Created for you",
        // Removed badge property as requested
        emoji: "🎯",
        color: "bg-white",
        iconColor: "bg-orange-50",
        trend: "↑ 18.2%", // Estimated/Mocked
        createdAt: Date.now(),
        details: {
            description: `A personalized collection curated for your goal of ${goalMap[goal] || "growth"}, focusing on themes you love like ${interestList.slice(0, 2).join(" & ") || "Market Leaders"}.`,
            trendValue: "↑ 18.2%",
            isPositive: true,
            // Saving the structured report data for the UserPlaylistDetailScreen
            reportData: {
                core: coreItems,
                interests: interestItems,
                companies: companyItems
            },
            // Legacy holdings for compatibility if needed elsewhere
            holdings: [
                ...coreItems.map(i => ({ name: i.name, trend: i.sub, allocation: i.pct, color: "text-gray-900", domain: "" })),
                ...companyItems.map(i => ({ name: i.name, trend: i.sub, allocation: i.pct, color: "text-gray-900", domain: i.domain }))
            ],
            returns: { '1y': 18.2, '3y': 45.5, '5y': 78.0 }
        }
    };

    // 2. Save to State
    addPlaylist(newPlaylist);

    // 3. Continue flow (Goes to Home via App.tsx logic)
    onContinue();
  };

  const renderDonut = (pct: number, colorClass: string) => (
    <div className="w-8 h-8 relative shrink-0">
        <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg]">
            <path className="text-gray-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="6" />
            <path className={colorClass} strokeDasharray={`${pct}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
        </svg>
    </div>
  );

  const renderToggle = (pct: string) => (
     <div className="flex items-center gap-3">
        <span className="font-bold text-white text-base">{pct}</span>
        <div className="w-5 h-5 rounded-full border-2 border-gray-600 relative flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-gray-500 rounded-full"></div>
        </div>
     </div>
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-[#111827] font-sans overflow-hidden animate-in fade-in duration-500 text-white">
      
      {/* Header */}
      <div className="px-6 pt-12 pb-2 z-20 bg-[#111827] sticky top-0 shadow-xl shadow-[#111827]/50">
         <div className="flex items-center gap-2 mb-2">
            <svg viewBox="0 0 100 100" className="w-6 h-6 shrink-0 drop-shadow-sm">
                <path d="M50 25 C 50 25 65 5 85 15 C 85 15 75 35 50 35" fill="none" stroke="white" strokeWidth="4" />
                <path d="M50 25 C 50 25 35 5 15 15 C 15 15 25 35 50 35" fill="none" stroke="white" strokeWidth="4" />
            </svg>
            <span className="font-bold text-lg tracking-tight text-white">Orange</span>
         </div>
         <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-4 leading-none">Your New Playlist</h1>
         
         <div className="flex justify-between items-start gap-4 mb-2">
             <p className="text-gray-400 text-xs leading-relaxed max-w-[65%]">
                We’ve created a playlist curated for you based on your core investing goals, interests and favorite companies.
             </p>
             <div className="bg-gray-800 p-3 rounded-2xl border border-gray-700 w-[30%] flex flex-col items-center text-center shadow-lg shrink-0">
                 <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-2 text-lg shadow-inner">
                    🚀
                 </div>
                 <p className="text-[10px] font-bold text-gray-300 leading-tight">My Investing Playlist #{(state.myPlaylists?.length || 0) + 1}</p>
             </div>
         </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar pb-40 scroll-smooth">
         
         {/* CORE */}
         <div className="mb-10 animate-in slide-in-from-bottom-4 duration-700 delay-100">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-2xl font-black text-white flex items-center gap-2">
                        <span className="text-orange-500">60%</span> CORE
                    </h3>
                    <p className="text-xs text-gray-400 font-medium mt-1">Providing higher growth with higher risk</p>
                </div>
                {renderDonut(60, "text-orange-500")}
            </div>

            <div className="space-y-5">
               {coreItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between group">
                     <div className="flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-2xl ${item.color} flex items-center justify-center text-xl shadow-lg shrink-0`}>
                           {item.icon}
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-base leading-tight mb-0.5">{item.name}</h4>
                            <p className="text-[10px] text-gray-400 font-medium">{item.sub}</p>
                        </div>
                     </div>
                     {renderToggle(item.pct)}
                  </div>
               ))}
            </div>
         </div>

         <div className="w-full h-px bg-gray-800 mb-8"></div>

         {/* INTERESTS */}
         <div className="mb-10 animate-in slide-in-from-bottom-4 duration-700 delay-200">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-2xl font-black text-white flex items-center gap-2">
                        <span className="text-orange-500">20%</span> INTERESTS
                    </h3>
                    <p className="text-xs text-gray-400 font-medium mt-1">Chosen from your interests</p>
                </div>
                {renderDonut(20, "text-orange-500")}
            </div>

            <div className="space-y-5">
               {interestItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between group">
                     <div className="flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-2xl ${item.color} flex items-center justify-center text-xl shadow-lg shrink-0`}>
                           {item.icon}
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-base leading-tight mb-0.5">{item.name}</h4>
                            <p className="text-[10px] text-gray-400 font-medium">{item.sub}</p>
                        </div>
                     </div>
                     {renderToggle(item.pct)}
                  </div>
               ))}
            </div>
         </div>

         <div className="w-full h-px bg-gray-800 mb-8"></div>

         {/* COMPANIES */}
         <div className="mb-8 animate-in slide-in-from-bottom-4 duration-700 delay-300">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-2xl font-black text-white flex items-center gap-2">
                        <span className="text-orange-500">20%</span> COMPANIES
                    </h3>
                    <p className="text-xs text-gray-400 font-medium mt-1">From companies you like</p>
                </div>
                {renderDonut(20, "text-orange-500")}
            </div>

            <div className="space-y-5">
               {companyItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between group">
                     <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center overflow-hidden p-1 shrink-0">
                           <img 
                              src={getLogoUrl(item.domain)} 
                              alt={item.name} 
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                 const target = e.target as HTMLImageElement;
                                 target.style.display = 'none';
                                 if (target.parentElement) {
                                    target.parentElement.style.backgroundColor = '#fed7aa';
                                    target.parentElement.innerHTML = `<span class="text-xs font-bold text-orange-800">${item.name.substring(0, 1)}</span>`;
                                 }
                              }}
                           />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-base leading-tight mb-0.5">{item.name}</h4>
                            <p className="text-[10px] text-gray-400 font-medium">{item.sub}</p>
                        </div>
                     </div>
                     {renderToggle(item.pct)}
                  </div>
               ))}
            </div>
         </div>

      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 w-full bg-[#111827] border-t border-gray-800 p-6 pb-10 z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
         <div className="max-w-md mx-auto flex flex-col gap-4">
            <Button 
               onClick={handleContinue}
               className="w-full rounded-full py-4 text-lg bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-400 hover:to-pink-400 text-white font-bold border-none shadow-lg shadow-orange-900/40 transition-all"
            >
               Save my playlist
            </Button>
            <button 
               onClick={onInvestLater}
               className="flex items-center justify-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors py-2"
            >
               <X size={16} /> Don't save
            </button>
         </div>
      </div>

    </div>
  );
};