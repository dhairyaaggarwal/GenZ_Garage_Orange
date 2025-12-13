import React, { useState, useEffect } from 'react';
import { Search, Plus, Lightbulb, Users, Zap, Briefcase, Shield, Globe, X, TrendingUp, Factory, Building2, Rocket, Leaf, Monitor, Landmark, PieChart, Sparkles, CheckCircle2 } from 'lucide-react';
import { getOnboardingState } from '../utils/onboardingState';

interface HomeScreenProps {
  onPlaylistClick?: (playlist: any) => void;
  onRetakeQuiz?: () => void;
  onStockClick?: (stock: any) => void;
  onETFClick?: (etf: any) => void;
}

interface InfoModalData {
  title: string;
  text: string;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onPlaylistClick, onRetakeQuiz, onStockClick, onETFClick }) => {
  const [infoModal, setInfoModal] = useState<InfoModalData | null>(null);
  const [activeCategory, setActiveCategory] = useState("Orange Featured");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [myPlaylists, setMyPlaylists] = useState<any[]>([]);
  
  // Search Overlay State
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchTab, setActiveSearchTab] = useState("Stocks");

  // Load My Playlists from State
  useEffect(() => {
    const state = getOnboardingState();
    if (state.myPlaylists) {
      // Sort most recent first
      const sorted = [...state.myPlaylists].sort((a, b) => b.createdAt - a.createdAt);
      // Map to card format
      const mapped = sorted.map(p => ({
        ...p,
        // Override detail specific fields if needed for card display
        customDetails: p.details, // We attach the detailed breakdown here for the detail screen to use
        isUserGenerated: true
      }));
      setMyPlaylists(mapped);
    }
  }, []);

  // Ensure voices are loaded for TTS
  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speakText = (text: string) => {
    window.speechSynthesis.cancel(); // Stop any current speech
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Select a voice: Prefer Indian English, then Natural/Premium, then Default
    const voices = window.speechSynthesis.getVoices();
    const indianVoice = voices.find(v => v.lang.includes('en-IN') || v.name.includes('India'));
    const naturalVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Samantha") || v.name.includes("Natural"));
    
    if (indianVoice) {
        utterance.voice = indianVoice;
        utterance.rate = 1.0; // Indian voices can be fast
    } else if (naturalVoice) {
        utterance.voice = naturalVoice;
        utterance.rate = 1.0;
    }
    
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const stopText = () => {
    window.speechSynthesis.cancel();
  };

  const handleOpenInfo = (title: string, text: string) => {
    setInfoModal({ title, text });
    speakText(text);
  };

  const handleCloseInfo = () => {
    setInfoModal(null);
    stopText();
  };

  // --- Main Screen Data ---
  const categories = ["Orange Featured", "Most Popular", "Industry", "Momentum"];

  // Static playlists
  const staticPlaylists = [
    { 
      title: "Make in India", 
      trend: "↑ 28% past 1Y", 
      color: "bg-blue-50", 
      iconColor: "bg-blue-600",
      emoji: "🇮🇳" 
    },
    { 
      title: "Mumbai", 
      trend: "↑ 15% past 1Y", 
      color: "bg-yellow-50", 
      iconColor: "bg-yellow-500",
      emoji: "🏙️" 
    },
    { 
      title: "Startups", 
      trend: "↑ 45% past 1Y", 
      color: "bg-purple-50", 
      iconColor: "bg-purple-600",
      emoji: "🚀" 
    },
    { 
      title: "Green Energy", 
      trend: "↑ 32% past 1Y", 
      color: "bg-emerald-50", 
      iconColor: "bg-emerald-600",
      emoji: "🌱" 
    },
  ];

  // Merge static playlists with user generated playlists
  // User playlists come first
  const allPlaylists = [...myPlaylists, ...staticPlaylists];

  const communityPicks = [
    { title: "Ravi's Dividend Gems", author: "By Ravi K.", color: "bg-indigo-50" },
    { title: "Priya's Growth Pot", author: "By Priya S.", color: "bg-rose-50" },
    { title: "Safe Haven", author: "By Amit M.", color: "bg-teal-50" },
  ];

  const popularStocks = [
    { name: "Reliance", domain: "ril.com", symbol: "RELIANCE" },
    { name: "TCS", domain: "tcs.com", symbol: "TCS" },
    { name: "HDFC Bank", domain: "hdfcbank.com", symbol: "HDFCBANK" },
    { name: "Infosys", domain: "infosys.com", symbol: "INFY" },
    { name: "ICICI Bank", domain: "icicibank.com", symbol: "ICICIBANK" },
    { name: "ITC", domain: "itc.in", symbol: "ITC" },
    { name: "Tata Motors", domain: "tatamotors.com", symbol: "TATAMOTORS" },
    { name: "Airtel", domain: "airtel.in", symbol: "BHARTIARTL" },
    { name: "Asian Paints", domain: "asianpaints.com", symbol: "ASIANPAINT" },
    { name: "L&T", domain: "larsentoubro.com", symbol: "LT" },
  ];

  const popularEtfs = [
    { name: "Nifty 50 ETF", symbol: "NIFTYBEES", color: "bg-green-600" },
    { name: "Sensex ETF", symbol: "SENSEX", color: "bg-orange-600" },
    { name: "Bank Nifty ETF", symbol: "BANKBEES", color: "bg-red-600" },
    { name: "Bharat 22 ETF", symbol: "ICICIB22", color: "bg-blue-800" },
    { name: "CPSE ETF", symbol: "CPSEETF", color: "bg-purple-700" },
  ];

  // Robust Logo Fetching using Google's Favicon Service
  const getLogoUrl = (domain: string) => {
    return `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=128`;
  };

  // --- Search Data (No Emojis) ---
  const searchData = {
    Stocks: [
       { name: "Reliance Industries", symbol: "RELIANCE", desc: "Energy, Textiles, Retail", domain: "ril.com" },
       { name: "Tata Consultancy Services", symbol: "TCS", desc: "Global IT Services", domain: "tcs.com" },
       { name: "HDFC Bank", symbol: "HDFCBANK", desc: "Banking Leader", domain: "hdfcbank.com" },
       { name: "Infosys", symbol: "INFY", desc: "Digital Services", domain: "infosys.com" },
       { name: "ICICI Bank", symbol: "ICICIBANK", desc: "Private Banking", domain: "icicibank.com" },
       { name: "Zomato", symbol: "ZOMATO", desc: "Food Delivery", domain: "zomato.com" },
       { name: "Nykaa", symbol: "NYKAA", desc: "Beauty & Fashion", domain: "nykaa.com" },
    ],
    "ETF's": [
       { name: "Nifty 50 ETF", symbol: "NIFTYBEES", desc: "Top 50 India Companies", type: "ETF" },
       { name: "Gold BeES", symbol: "GOLDBEES", desc: "Physical Gold", type: "ETF" },
       { name: "Bank Nifty ETF", symbol: "BANKBEES", desc: "Banking Sector", type: "ETF" },
       { name: "Sensex ETF", symbol: "SENSEX", desc: "Top 30 Companies", type: "ETF" },
       { name: "Bharat 22 ETF", symbol: "ICICIB22", desc: "Government Enterprises", type: "ETF" },
    ],
    "Mutual Funds": [
       { name: "Parag Parikh Flexi Cap", symbol: "PPFAS", desc: "Diversified Equity", type: "MF" },
       { name: "SBI Bluechip Fund", symbol: "SBIBLUE", desc: "Large Cap Growth", type: "MF" },
       { name: "Axis Small Cap Fund", symbol: "AXISSMALL", desc: "High Growth Potential", type: "MF" },
       { name: "Quant Active Fund", symbol: "QUANTACT", desc: "Multi Cap Strategy", type: "MF" },
    ],
    Playlists: [
       { name: "Make in India", desc: "Manufacturing Hub", type: "PL" },
       { name: "Green Energy", desc: "Sustainable Future", type: "PL" },
       { name: "Startups", desc: "High Risk High Reward", type: "PL" },
       { name: "Mumbai Giants", desc: "Headquartered in Mumbai", type: "PL" },
       { name: "Tech Titans", desc: "Software & Services", type: "PL" },
    ]
  };

  const handleSearchResultClick = (item: any, category: string) => {
    setIsSearchActive(false);
    
    if (category === "Stocks") {
      if (onStockClick) {
        onStockClick({
          name: item.name,
          symbol: item.symbol || "NSE",
          domain: item.domain || ""
        });
      }
    } else if (category === "ETF's") {
      if (onETFClick) {
        onETFClick({
          name: item.name,
          symbol: item.symbol || "ETF"
        });
      }
    } else if (category === "Mutual Funds") {
      // Reuse ETF Detail screen for Mutual Funds for now
      if (onETFClick) {
        onETFClick({
          name: item.name,
          symbol: "MF"
        });
      }
    } else if (category === "Playlists") {
      if (onPlaylistClick) {
        // Construct playlist object compatible with PlaylistDetailScreen
        onPlaylistClick({
          title: item.name,
          trend: "↑ 15% past 1Y", 
          color: "bg-blue-50",
          iconColor: "bg-blue-600",
          emoji: "⚡"
        });
      }
    }
  };

  // --- Search Overlay Render ---
  if (isSearchActive) {
    return (
        <div className="flex-1 h-full bg-gray-50 flex flex-col font-sans animate-in fade-in duration-200">
           {/* Header */}
           <div className="px-4 pt-10 pb-2 bg-white border-b border-gray-100 shadow-sm z-30 sticky top-0">
              <div className="flex items-center gap-3 mb-4">
                 <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      autoFocus
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-base font-medium text-gray-900"
                      placeholder="Search stocks, ETFs, mutual funds, or playlists"
                    />
                 </div>
                 <button 
                   onClick={() => {
                       setIsSearchActive(false);
                       setSearchQuery("");
                   }}
                   className="text-orange-600 font-semibold text-base px-1 whitespace-nowrap active:opacity-70"
                 >
                   Cancel
                 </button>
              </div>

              {/* Tabs */}
              <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-2">
                 {["Stocks", "ETF's", "Mutual Funds", "Playlists"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveSearchTab(tab)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
                         activeSearchTab === tab 
                           ? 'bg-orange-50 text-orange-700 border-orange-100 shadow-sm' 
                           : 'bg-white text-gray-500 border-transparent hover:bg-gray-100'
                      }`}
                    >
                      {tab}
                    </button>
                 ))}
              </div>
           </div>

           {/* Content */}
           <div className="flex-1 overflow-y-auto px-4 py-6">
              {!searchQuery ? (
                 <div className="flex flex-col items-center justify-center h-64 text-center opacity-60">
                    <p className="text-gray-400 font-medium text-lg leading-relaxed max-w-xs">
                       Start typing to explore companies, ETFs, MF categories, playlists, and people on Orange.
                    </p>
                 </div>
              ) : (
                 <div className="space-y-3 pb-20">
                    {/* Render results based on active tab and query */}
                    {searchData[activeSearchTab as keyof typeof searchData]
                      .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((item, idx) => (
                        <div 
                           key={idx} 
                           onClick={() => handleSearchResultClick(item, activeSearchTab)}
                           className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-gray-100 hover:border-orange-200 transition-colors cursor-pointer active:scale-[0.99]"
                        >
                           {/* Icon/Logo - Strictly No Emojis */}
                           <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {'domain' in item ? (
                                 <img 
                                    src={getLogoUrl(item.domain)} 
                                    alt={item.name} 
                                    className="w-8 h-8 object-contain"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        if (target.nextElementSibling) target.nextElementSibling.classList.remove('hidden');
                                    }}
                                 />
                              ) : (
                                 // Generic Icons based on type
                                 activeSearchTab === "ETF's" ? <TrendingUp size={22} className="text-gray-400" /> :
                                 activeSearchTab === "Mutual Funds" ? <PieChart size={22} className="text-gray-400" /> :
                                 activeSearchTab === "Playlists" ? <Briefcase size={22} className="text-gray-400" /> :
                                 <Building2 size={22} className="text-gray-400" />
                              )}
                              {/* Fallback for broken stock logos */}
                              <div className="hidden w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold">
                                {item.name[0]}
                              </div>
                           </div>
                           
                           <div className="flex-1">
                              <h4 className="text-gray-900 font-bold text-base leading-tight">{item.name}</h4>
                              <p className="text-gray-500 text-xs font-medium mt-0.5 uppercase tracking-wide opacity-80">{item.desc}</p>
                           </div>
                        </div>
                    ))}
                    
                    {/* Empty Result State */}
                    {searchData[activeSearchTab as keyof typeof searchData].filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                       <div className="text-center py-10">
                          <p className="text-gray-900 font-bold text-lg mb-1">No results found</p>
                          <p className="text-gray-400 text-sm">We couldn't find anything for "{searchQuery}" in {activeSearchTab}</p>
                       </div>
                    )}
                 </div>
              )}
           </div>
        </div>
    );
  }

  // --- Main Home Screen Render ---
  return (
    <div className="flex-1 h-full overflow-y-auto bg-gray-50 pb-28 font-sans relative">
      
      {/* 1. Header + Search */}
      <div className="px-6 pt-10 pb-2 bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
        <div className="flex justify-between items-center mb-1">
           <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Discover</h1>
           <button className="p-2 bg-orange-50 rounded-full text-orange-600 hover:bg-orange-100 transition-colors">
              <Plus size={20} strokeWidth={2.5} />
           </button>
        </div>
        <p className="text-gray-500 text-sm mb-4 font-medium">Find the best investments for you</p>
        
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            readOnly
            onClick={() => setIsSearchActive(true)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all sm:text-sm font-medium cursor-text"
            placeholder="Search stocks, ETFs & playlists"
          />
        </div>
      </div>

      <div className="pt-6">
        
        {/* 2. Playlists Section - REDESIGNED */}
        <section className="px-6 mb-10">
          <div className="flex justify-between items-center mb-4">
             <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">Playlists</h2>
                <button 
                  onClick={() => handleOpenInfo('What is a playlist?', 'A playlist is a curated group of Indian stocks, ETFs, or funds built around a theme.')}
                  className="p-1 rounded-full text-gray-400 hover:text-orange-500 transition-colors focus:outline-none"
                >
                    <Lightbulb size={16} />
                </button>
             </div>

             {/* + Create Button */}
             <button 
               onClick={() => setShowCreateModal(true)}
               className="text-sm font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-4 py-1.5 rounded-full transition-colors flex items-center gap-1"
             >
               <Plus size={16} strokeWidth={3} />
               Create
             </button>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-5 -mx-6 px-6">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat 
                    ? 'bg-gray-900 text-white shadow-md' 
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Card List - Merged User Generated + Static */}
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6">
             {allPlaylists.map((playlist, idx) => {
               // Determine if this is a user generated playlist for slight style tweaks (Orange Accent)
               const isUserGenerated = (playlist as any).isUserGenerated;
               const subText = isUserGenerated ? (playlist.subtitle || "Created for you") : playlist.trend;
               const subColorClass = isUserGenerated ? "text-gray-400" : "text-green-600 bg-green-50 px-1.5 py-0.5 rounded-md";

               return (
                 <div 
                   key={idx} 
                   onClick={() => onPlaylistClick && onPlaylistClick(playlist)}
                   className={`min-w-[160px] h-[190px] relative bg-white rounded-[24px] p-5 flex flex-col justify-between shadow-sm border border-gray-100 hover:shadow-md transition-all active:scale-[0.98] cursor-pointer group ${isUserGenerated ? 'border-orange-100 ring-1 ring-orange-50' : ''}`}
                 >
                    {/* Orange Dot for User Playlists */}
                    {isUserGenerated && (
                      <div className="absolute top-5 right-5 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    )}

                    {/* Icon Square */}
                    <div className={`w-12 h-12 rounded-xl ${playlist.iconColor || 'bg-gray-50'} flex items-center justify-center shadow-sm text-2xl group-hover:scale-110 transition-transform`}>
                      {playlist.emoji || '⚡'}
                    </div>
                    
                    {/* Text Content */}
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1 line-clamp-2">{playlist.title}</h3>
                      <p className={`text-xs font-semibold ${subColorClass} line-clamp-1`}>
                        {subText}
                      </p>
                    </div>
                 </div>
               );
             })}
          </div>
          
          <div className="mt-2 flex justify-center">
             <button 
                onClick={() => handleOpenInfo('What is a playlist?', 'A playlist is a pre-made collection of stocks or ETFs. Like a music playlist, but for investing!')}
                className="flex items-center gap-2 text-sm font-bold text-orange-600 bg-orange-50 px-4 py-2 rounded-full hover:bg-orange-100 transition-colors"
             >
                <Lightbulb size={16} />
                What is a playlist?
             </button>
          </div>
        </section>

        {/* 3. Popular Stocks (India Only) */}
        <section className="px-6 mb-10 border-t border-gray-100 pt-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">Popular Stocks</h2>
              <button 
                  onClick={() => handleOpenInfo('What is a stock?', 'A stock represents a small piece of ownership in a company. When you buy a stock, you become a partial owner of that business.')}
                  className="p-1 rounded-full text-gray-400 hover:text-orange-500 transition-colors focus:outline-none"
                >
                    <Lightbulb size={16} />
                </button>
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">India</span>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-6 px-6">
            {popularStocks.map((stock, idx) => (
              <div 
                key={idx} 
                onClick={() => onStockClick && onStockClick(stock)}
                className="min-w-[110px] bg-white border border-gray-200 rounded-2xl p-3 flex flex-col items-center gap-3 shadow-sm hover:border-orange-200 transition-all cursor-pointer active:scale-95"
              >
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden border border-gray-100 p-1.5 shadow-sm">
                  <img 
                    src={getLogoUrl(stock.domain)}
                    alt={stock.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Fallback
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      if (target.nextElementSibling) {
                        target.nextElementSibling.classList.remove('hidden');
                      }
                    }}
                  />
                  {/* Fallback Text Initial */}
                  <div className="hidden w-full h-full flex items-center justify-center bg-orange-100 text-orange-600 text-sm font-bold rounded-full">
                    {stock.name[0]}
                  </div>
                </div>
                <div className="text-center w-full">
                  <p className="text-sm font-bold text-gray-900 leading-tight truncate w-full">{stock.name}</p>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">{stock.symbol}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-center">
             <button 
                onClick={() => handleOpenInfo('What is a Stock?', 'A stock is a share in the ownership of a company. As the company grows, the value of your stock grows too.')}
                className="flex items-center gap-2 text-sm font-bold text-orange-600 bg-orange-50 px-4 py-2 rounded-full hover:bg-orange-100 transition-colors"
             >
                <Lightbulb size={16} />
                What is a Stock?
             </button>
          </div>
        </section>

        {/* 4. Popular ETFs (India Only) */}
        <section className="px-6 mb-10 border-t border-gray-100 pt-8">
           <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">Popular ETFs</h2>
              <button 
                  onClick={() => handleOpenInfo('What is an ETF?', 'An ETF (Exchange Traded Fund) is a basket of securities that trades on an exchange just like a stock. It offers instant diversification.')}
                  className="p-1 rounded-full text-gray-400 hover:text-orange-500 transition-colors focus:outline-none"
                >
                    <Lightbulb size={16} />
                </button>
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-6 px-6">
            {popularEtfs.map((etf, idx) => (
              <div 
                key={idx} 
                onClick={() => onETFClick && onETFClick(etf)}
                className="min-w-[150px] bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer active:scale-95"
              >
                 <div className="flex justify-between items-start mb-3">
                    <div className={`w-9 h-9 rounded-lg ${etf.color} flex items-center justify-center text-white font-bold text-[10px] shadow-sm`}>
                       ETF
                    </div>
                    <TrendingUp size={16} className="text-gray-300" />
                 </div>
                 <p className="text-sm font-bold text-gray-900 leading-tight mb-0.5">{etf.name}</p>
                 <p className="text-[10px] text-gray-400 font-medium">{etf.symbol}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-center">
             <button 
                onClick={() => handleOpenInfo('What is an ETF?', 'An ETF is like a basket of stocks. Instead of buying one company, you buy a slice of the whole market (like Nifty 50).')}
                className="flex items-center gap-2 text-sm font-bold text-orange-600 bg-orange-50 px-4 py-2 rounded-full hover:bg-orange-100 transition-colors"
             >
                <Lightbulb size={16} />
                What is an ETF?
             </button>
          </div>
        </section>

        {/* 5. Community Picks */}
        <section className="px-6 mb-6 border-t border-gray-100 pt-8">
          <div className="flex items-center gap-2 mb-4">
             <h2 className="text-xl font-bold text-gray-900">Community Picks</h2>
             <button 
                  onClick={() => handleOpenInfo('What are community picks?', 'These are playlists and portfolios created by experienced members of the Orange community.')}
                  className="p-1 rounded-full text-gray-400 hover:text-orange-500 transition-colors focus:outline-none"
                >
                    <Lightbulb size={16} />
                </button>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-6 px-6">
             {communityPicks.map((pick, idx) => (
               <div key={idx} className={`min-w-[220px] h-28 ${pick.color} rounded-2xl p-5 flex flex-col justify-center border border-black/5 hover:scale-[1.02] transition-transform shadow-sm`}>
                  <h3 className="font-bold text-gray-900 mb-1 text-lg">{pick.title}</h3>
                  <div className="flex items-center gap-2 mt-auto">
                    <div className="w-6 h-6 rounded-full bg-white/50 flex items-center justify-center text-gray-600">
                       <Users size={14} />
                    </div>
                    <p className="text-xs text-gray-600 font-semibold">{pick.author}</p>
                  </div>
               </div>
             ))}
          </div>

          <div className="mt-4 flex justify-center">
             <button 
                onClick={() => handleOpenInfo('What are Community Picks?', 'Community Picks are portfolios shared by other investors like you. It’s a great way to see what others are buying.')}
                className="flex items-center gap-2 text-sm font-bold text-orange-600 bg-orange-50 px-4 py-2 rounded-full hover:bg-orange-100 transition-colors"
             >
                <Lightbulb size={16} />
                What are Community Picks?
             </button>
          </div>
        </section>

      </div>

      {/* Info Bottom Sheet / Modal */}
      {infoModal && (
          <div className="fixed inset-0 z-[60] flex items-end justify-center px-4 pb-24 pointer-events-none">
              {/* Backdrop */}
              <div 
                 className="absolute inset-0 bg-black/20 backdrop-blur-[2px] pointer-events-auto transition-opacity animate-in fade-in duration-300"
                 onClick={handleCloseInfo}
              ></div>
              
              {/* Sheet */}
              <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 pointer-events-auto animate-in slide-in-from-bottom-10 fade-in duration-300 ring-1 ring-black/5">
                  <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2 text-orange-600 mb-1">
                          <div className="bg-orange-100 p-1.5 rounded-full">
                             <Lightbulb size={18} className="fill-orange-500 text-orange-500" />
                          </div>
                          <span className="text-xs font-bold uppercase tracking-wider text-orange-800">Did you know?</span>
                      </div>
                      <button onClick={handleCloseInfo} className="text-gray-400 hover:text-gray-600 p-1 bg-gray-50 rounded-full">
                          <X size={20} />
                      </button>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{infoModal.title}</h3>
                  <p className="text-gray-700 text-base leading-relaxed">{infoModal.text}</p>
                  <div className="mt-4 flex justify-end">
                      <button 
                        onClick={handleCloseInfo}
                        className="text-sm font-bold text-orange-600 hover:text-orange-700 px-4 py-2 rounded-full hover:bg-orange-50 transition-colors"
                      >
                        Got it
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Create Playlist Modal / Bottom Sheet */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" onClick={() => setShowCreateModal(false)}></div>
          <div className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] p-6 relative z-10 animate-in slide-in-from-bottom-full duration-300 shadow-2xl">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Create Playlist</h3>
                <button onClick={() => setShowCreateModal(false)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Option 1: AI/Quiz */}
              <div 
                className="p-5 rounded-3xl border-2 border-orange-100 bg-orange-50/60 hover:border-orange-200 hover:bg-orange-50 transition-all cursor-pointer group active:scale-[0.99]"
                onClick={() => { setShowCreateModal(false); onRetakeQuiz?.(); }}
              >
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-orange-500 shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-300">
                       <Sparkles size={24} className="fill-orange-100" />
                    </div>
                    <div className="flex-1">
                       <h4 className="font-bold text-gray-900 text-lg mb-1">We make it for you</h4>
                       <p className="text-gray-600 text-sm leading-relaxed mb-4 font-medium">Complete our quiz to get a personalised playlist created for you.</p>
                       <button className="text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-2.5 rounded-xl shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/30 transition-all">
                         Take the quiz
                       </button>
                    </div>
                  </div>
              </div>
            </div>

            {/* Handle Bar for mobile feel */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-200 rounded-full sm:hidden"></div>
          </div>
        </div>
      )}
    </div>
  );
};