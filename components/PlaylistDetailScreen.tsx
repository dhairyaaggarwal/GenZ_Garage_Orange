import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, BadgeCheck, PieChart, CheckCircle2, Circle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface Holding {
  name: string;
  trend: string;
  allocation: string;
  color: string;
  domain: string;
}

interface PlaylistDetail {
  description: string;
  trendValue: string;
  isPositive: boolean;
  holdings: Holding[];
  returns: {
    '1y': number;
    '3y': number;
    '5y': number;
  };
}

interface PlaylistDetailScreenProps {
  playlist: {
    title: string;
    trend: string;
    color: string;
    iconColor: string;
    emoji: string;
  };
  onBack: () => void;
  customDetails?: PlaylistDetail;
}

const timeFrames = ['1W', '1M', '1Y', '5Y'];

const PLAYLIST_DB: Record<string, PlaylistDetail> = {
  "Make in India": {
    description: "Invest in the manufacturing renaissance of India. This collection features defense, infrastructure, and industrial giants driving the nation's self-reliance goals.",
    trendValue: "↑ 28.4%",
    isPositive: true,
    holdings: [
      { name: "Larsen & Toubro", trend: "↑ 145% past 5Y", allocation: "15%", color: "text-green-600", domain: "larsentoubro.com" },
      { name: "Hindustan Aeronautics", trend: "↑ 320% past 5Y", allocation: "15%", color: "text-green-600", domain: "hal-india.co.in" },
      { name: "Tata Steel", trend: "↑ 212% past 5Y", allocation: "12%", color: "text-green-600", domain: "tatasteel.com" },
      { name: "Bharat Electronics", trend: "↑ 185% past 5Y", allocation: "12%", color: "text-green-600", domain: "bel-india.in" },
      { name: "Mazagon Dock", trend: "↑ 400% past 5Y", allocation: "10%", color: "text-green-600", domain: "mazagondock.in" },
      { name: "Siemens", trend: "↑ 80% past 5Y", allocation: "10%", color: "text-green-600", domain: "siemens.com" },
    ],
    returns: { '1y': 28.4, '3y': 85.2, '5y': 145.0 }
  },
  "Green Energy": {
    description: "Invest in companies that make the world cleaner! This collection focuses on sustainable energy, electric vehicles, and future tech in India.",
    trendValue: "↓ 10.29%",
    isPositive: false,
    holdings: [
      { name: "Tata Power", trend: "↑ 194% past 5Y", allocation: "18%", color: "text-green-600", domain: "tatapower.com" },
      { name: "Adani Green", trend: "↑ 300% past 5Y", allocation: "15%", color: "text-green-600", domain: "adanigreenenergy.com" },
      { name: "Suzlon", trend: "↑ 50% past 5Y", allocation: "12%", color: "text-green-600", domain: "suzlon.com" },
      { name: "Borosil Renewables", trend: "↓ 15% past 5Y", allocation: "10%", color: "text-red-500", domain: "borosilrenewables.com" },
      { name: "Jsw Energy", trend: "↑ 80% past 5Y", allocation: "10%", color: "text-green-600", domain: "jsw.in" },
    ],
    returns: { '1y': -5.2, '3y': 12.4, '5y': -10.29 }
  },
  "Startups": {
    description: "High-risk, high-reward. Back the disruptors changing how India eats, pays, and shops. Volatility is expected.",
    trendValue: "↑ 45.2%",
    isPositive: true,
    holdings: [
      { name: "Zomato", trend: "↑ 110% past 1Y", allocation: "20%", color: "text-green-600", domain: "zomato.com" },
      { name: "Paytm", trend: "↓ 60% past 5Y", allocation: "15%", color: "text-red-500", domain: "paytm.com" },
      { name: "Nykaa", trend: "↓ 40% past 5Y", allocation: "15%", color: "text-red-500", domain: "nykaa.com" },
      { name: "PolicyBazaar", trend: "↑ 15% past 5Y", allocation: "15%", color: "text-green-600", domain: "policybazaar.com" },
      { name: "Delhivery", trend: "↑ 5% past 1Y", allocation: "10%", color: "text-green-600", domain: "delhivery.com" },
    ],
    returns: { '1y': 45.2, '3y': 15.0, '5y': 60.5 }
  },
  "Mumbai": {
    description: "The heartbeat of India's economy. Stable, large-cap giants headquartered in the financial capital.",
    trendValue: "↑ 15.1%",
    isPositive: true,
    holdings: [
      { name: "Reliance Ind.", trend: "↑ 120% past 5Y", allocation: "20%", color: "text-green-600", domain: "ril.com" },
      { name: "HDFC Bank", trend: "↑ 60% past 5Y", allocation: "18%", color: "text-green-600", domain: "hdfcbank.com" },
      { name: "TCS", trend: "↑ 150% past 5Y", allocation: "15%", color: "text-green-600", domain: "tcs.com" },
      { name: "SBI", trend: "↑ 180% past 5Y", allocation: "12%", color: "text-green-600", domain: "sbi.co.in" },
      { name: "Kotak Bank", trend: "↑ 40% past 5Y", allocation: "10%", color: "text-green-600", domain: "kotak.com" },
    ],
    returns: { '1y': 15.1, '3y': 42.3, '5y': 88.0 }
  },
  "Your Choices": {
    description: "A personalized collection based on your interest in 'Growth' and 'Tech'. These stocks align with your goal to build wealth long-term.",
    trendValue: "↑ 12.0%",
    isPositive: true,
    holdings: [
      { name: "Nifty 50 ETF", trend: "↑ 85% past 5Y", allocation: "40%", color: "text-green-600", domain: "nseindia.com" },
      { name: "Infosys", trend: "↑ 70% past 5Y", allocation: "20%", color: "text-green-600", domain: "infosys.com" },
      { name: "Tata Motors", trend: "↑ 200% past 5Y", allocation: "20%", color: "text-green-600", domain: "tatamotors.com" },
      { name: "Gold BeES", trend: "↑ 60% past 5Y", allocation: "20%", color: "text-green-600", domain: "google.com" },
    ],
    returns: { '1y': 12.0, '3y': 35.0, '5y': 70.0 }
  }
};

const DEFAULT_PLAYLIST: PlaylistDetail = {
  description: "A diversified collection of top-performing assets curated to balance growth and stability for the long term.",
  trendValue: "↑ 12.5%",
  isPositive: true,
  holdings: [
    { name: "Nifty 50 ETF", trend: "↑ 85% past 5Y", allocation: "40%", color: "text-green-600", domain: "nseindia.com" },
    { name: "Gold BeES", trend: "↑ 60% past 5Y", allocation: "30%", color: "text-green-600", domain: "google.com" },
    { name: "Liquid Fund", trend: "↑ 25% past 5Y", allocation: "30%", color: "text-green-600", domain: "amfiindia.com" },
  ],
  returns: { '1y': 12.5, '3y': 30.0, '5y': 60.0 }
};

const CAR_IMAGES = [
    "https://freepngimg.com/thumb/car/80860-racer-scuderia-formula-ferrari-vettel-sebastian-one.png",
    "https://www.pngall.com/wp-content/uploads/12/Red-Formula-1-Car-PNG-Image.png",
    "https://cdn.pixabay.com/photo/2020/05/25/18/50/race-car-5220261_1280.png",
    "https://purepng.com/public/uploads/large/purepng.com-ferrari-formula-1-carferrariferrari-carsformula-1-carscuderia-ferrari-1701527482860d5b22.png"
];

export const PlaylistDetailScreen: React.FC<PlaylistDetailScreenProps> = ({ playlist, onBack, customDetails }) => {
  const [activeTab, setActiveTab] = useState('5Y');
  const [tmAmount, setTmAmount] = useState(10000);
  const [tmPeriod, setTmPeriod] = useState<'1y' | '3y' | '5y'>('3y');
  const [carImageIndex, setCarImageIndex] = useState(0);

  // Use customDetails if provided, otherwise look up in DB, otherwise use default
  const details = customDetails || PLAYLIST_DB[playlist.title] || DEFAULT_PLAYLIST;

  const [selectedIndices, setSelectedIndices] = useState<number[]>(
    details.holdings.map((_, i) => i)
  );

  const toggleSelection = (index: number) => {
    if (selectedIndices.includes(index)) {
        setSelectedIndices(selectedIndices.filter(i => i !== index));
    } else {
        setSelectedIndices([...selectedIndices, index]);
    }
  };

  const generateData = () => {
    let value = 100;
    return Array.from({ length: 40 }, (_, i) => {
      value = value + (Math.random() - 0.4) * 10;
      return { name: i, value: Math.max(50, value) };
    });
  };

  const data = generateData();
  const returnPercentage = details.returns[tmPeriod];
  const tmFinalValue = tmAmount * (1 + (returnPercentage / 100));

  const getLogoUrl = (domain: string) => {
    return `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=128`;
  };

  return (
    <div className="flex-1 h-full bg-white flex flex-col font-sans overflow-hidden animate-in slide-in-from-right duration-300 relative z-50">
      
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-28 custom-scrollbar">
          
          {/* Header Row */}
          <div className="px-4 py-4 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-30">
             <div className="flex items-center gap-3">
                 <button 
                   onClick={onBack} 
                   className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95 text-gray-900"
                 >
                     <ArrowLeft size={24} strokeWidth={2.5} />
                 </button>
                 
                 <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                     <span className="text-xl">{playlist.emoji || '⚡'}</span>
                     <span className="font-bold text-gray-900 text-lg truncate max-w-[160px] leading-tight">
                       {playlist.title}
                     </span>
                 </div>
             </div>
          </div>

          <div className="px-6 pt-4">
             {/* Stats Section */}
             <div className="mb-6">
                 <div className="inline-flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-md mb-2">
                    <span className="text-xs font-bold text-purple-700">@orange_team</span>
                    <BadgeCheck size={12} className="text-purple-600 fill-purple-200" />
                 </div>
                 
                 <p className="text-gray-500 font-medium text-xs uppercase tracking-wide mb-0.5">Past 5 Years</p>
                 
                 <div className="flex items-center gap-2">
                     <span className={`text-4xl font-extrabold tracking-tight flex items-center gap-1 ${details.isPositive ? 'text-green-600' : 'text-red-500'}`}>
                        {details.trendValue}
                     </span>
                 </div>
             </div>

             {/* Performance Chart */}
             <div className="h-56 w-full mb-6 -ml-2">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={details.isPositive ? "#16a34a" : "#ef4444"} stopOpacity={0.1}/>
                            <stop offset="95%" stopColor={details.isPositive ? "#16a34a" : "#ef4444"} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" hide />
                        <YAxis hide domain={['auto', 'auto']} />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke={details.isPositive ? "#16a34a" : "#ef4444"} 
                          strokeWidth={2.5} 
                          fillOpacity={1} 
                          fill="url(#colorValue)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
             </div>

             {/* Timeframe Tabs */}
             <div className="flex gap-4 mb-8 justify-between px-2">
                 {timeFrames.map((tf) => (
                     <button
                        key={tf}
                        onClick={() => setActiveTab(tf)}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                            activeTab === tf 
                            ? 'bg-orange-500 text-white shadow-md scale-105' 
                            : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
                        }`}
                     >
                        {tf}
                     </button>
                 ))}
             </div>
             
             {/* --- TIME MACHINE WIDGET --- */}
             <div className="relative mt-24 mb-24 px-1 isolate">
                 
                 {/* 3D F1 Car Image */}
                 <div className="absolute -top-20 -right-2 w-64 h-44 z-50 pointer-events-none">
                     <div className="absolute top-[65%] right-[20%] w-24 h-12 bg-orange-500/80 blur-[25px] rounded-full animate-pulse transform -rotate-12"></div>
                     <div className="absolute top-[70%] right-[10%] w-16 h-8 bg-yellow-400/80 blur-[15px] rounded-full animate-pulse delay-75 transform -rotate-12"></div>
                     
                     <img 
                       src={CAR_IMAGES[carImageIndex]} 
                       alt="F1 Car" 
                       className="w-full h-full object-contain drop-shadow-[0_25px_25px_rgba(0,0,0,0.5)] transform -rotate-1"
                       onError={(e) => {
                           if (carImageIndex < CAR_IMAGES.length - 1) {
                               setCarImageIndex(prev => prev + 1);
                           } else {
                               e.currentTarget.style.opacity = '0';
                           }
                       }}
                     />
                 </div>

                 {/* The Widget Card */}
                 <div className="bg-[#0f172a] rounded-[2.5rem] p-8 pb-10 text-white relative shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 overflow-hidden">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none"></div>
                     <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full blur-[60px] -ml-12 -mb-12 pointer-events-none"></div>

                     <div className="relative z-10 mb-8 pr-10">
                         <h3 className="text-3xl font-black italic tracking-tighter uppercase mb-2 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent transform -skew-x-12">
                             TIME MACHINE
                         </h3>
                         <div className="flex flex-col mt-2">
                             <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">If I had invested</span>
                             <span className="text-4xl font-black text-orange-500 tracking-tight">₹{tmAmount.toLocaleString()}</span>
                         </div>
                     </div>

                     <div className="relative z-10 mb-10">
                        <input 
                            type="range" 
                            min="1000" 
                            max="100000" 
                            step="1000"
                            value={tmAmount}
                            onChange={(e) => setTmAmount(parseInt(e.target.value))}
                            className="w-full h-3 bg-gray-700 rounded-full appearance-none cursor-pointer accent-orange-500 hover:accent-orange-400 transition-all focus:outline-none focus:ring-4 focus:ring-orange-500/20"
                         />
                         <div className="flex justify-between mt-3 px-1">
                             <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">₹1K</span>
                             <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">₹1L</span>
                         </div>
                     </div>

                     <div className="relative z-10 flex gap-2 mb-8 bg-gray-800/60 p-2 rounded-2xl border border-white/5 backdrop-blur-sm">
                        {['1y', '3y', '5y'].map((p) => (
                           <button
                             key={p}
                             onClick={() => setTmPeriod(p as any)}
                             className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                                 tmPeriod === p 
                                 ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 scale-100' 
                                 : 'text-gray-400 hover:bg-white/5 hover:text-white'
                             }`}
                           >
                             {p} ago
                           </button>
                        ))}
                     </div>

                     <div className="relative z-10 bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-md">
                         <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2">It would now be worth</p>
                         <div className="flex items-center justify-between">
                             <span className="text-4xl font-black text-white tracking-tight">₹{Math.round(tmFinalValue).toLocaleString()}</span>
                             <span className={`px-3 py-1.5 rounded-lg text-sm font-black flex items-center gap-1 ${returnPercentage >= 0 ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-red-500/20 text-red-400 border border-red-500/20'}`}>
                                 {returnPercentage >= 0 ? '▲' : '▼'} {Math.abs(returnPercentage)}%
                             </span>
                         </div>
                     </div>
                 </div>
             </div>

             {/* About Section */}
             <div className="space-y-6">
                <div>
                    <h3 className="font-bold text-gray-900 text-xl uppercase tracking-tight mb-2">About this Playlist</h3>
                    <p className="text-gray-600 text-sm leading-relaxed font-medium">
                       {details.description}
                    </p>
                </div>

                {/* Holdings List with Selection */}
                <div>
                   <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold text-gray-900 text-lg">{details.holdings.length} items</h4>
                      <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Select to Invest</span>
                   </div>

                   <div className="space-y-3">
                       {details.holdings.map((item, idx) => {
                           const isSelected = selectedIndices.includes(idx);
                           return (
                             <div 
                               key={idx} 
                               onClick={() => toggleSelection(idx)}
                               className={`flex items-center justify-between p-3 rounded-2xl border transition-all duration-200 cursor-pointer active:scale-[0.99] ${
                                   isSelected 
                                   ? 'bg-white border-orange-200 shadow-sm' 
                                   : 'bg-gray-50 border-transparent opacity-75 grayscale-[0.5]'
                               }`}
                             >
                                <div className="flex items-center gap-3">
                                    <div className={`transition-colors duration-200 ${isSelected ? 'text-orange-500' : 'text-gray-300'}`}>
                                        {isSelected ? <CheckCircle2 size={24} fill="currentColor" className="text-white" /> : <Circle size={24} />}
                                    </div>

                                    <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-100 flex items-center justify-center p-1 overflow-hidden">
                                       <img 
                                         src={getLogoUrl(item.domain)} 
                                         alt={item.name} 
                                         className="w-full h-full object-contain mix-blend-multiply" 
                                         onError={(e) => {
                                           (e.target as HTMLImageElement).style.display = 'none';
                                           const parent = (e.target as HTMLImageElement).parentElement;
                                           if (parent) parent.innerHTML = `<span class="text-xs font-bold text-gray-400">${item.name[0]}</span>`;
                                         }}
                                       />
                                    </div>
                                    
                                    <div>
                                        <div className={`font-bold text-base leading-tight ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>{item.name}</div>
                                        <div className={`text-xs font-bold mt-0.5 ${item.color.includes('green') ? 'text-green-600' : 'text-red-500'}`}>
                                            {item.trend}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <span className={`text-sm font-bold ${isSelected ? 'text-green-600' : 'text-gray-400'}`}>{item.allocation}</span>
                                    <PieChart size={14} className={isSelected ? 'text-green-600 fill-green-100' : 'text-gray-300'} />
                                </div>
                             </div>
                           );
                       })}
                   </div>
                </div>
             </div>
          </div>
      </div>

      {/* Bottom Fixed Invest Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-8 z-40 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
         <div className="w-full max-w-md mx-auto">
             <button 
                className="w-full bg-gradient-to-r from-[#FFA54C] to-[#FF7A2F] hover:shadow-orange-500/30 hover:scale-[1.01] active:scale-95 transition-all text-white font-bold text-xl py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale"
                disabled={selectedIndices.length === 0}
             >
                <span className="font-sans">₹</span> Invest {selectedIndices.length > 0 && `in ${selectedIndices.length} items`}
             </button>
         </div>
      </div>

    </div>
  );
};