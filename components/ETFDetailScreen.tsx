
import React, { useState } from 'react';
import { ArrowLeft, BadgeCheck, PieChart, Info, CheckCircle2, Circle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Button } from './Button';

interface ETFDetailScreenProps {
  etf: {
    name: string;
    symbol: string;
    color?: string;
  };
  onBack: () => void;
}

// Mock Data for ETFs
const ETF_DB: Record<string, any> = {
  "Nifty 50 ETF": {
    description: "Think of this as the 'India Top 50' playlist. You're investing in the 50 biggest, most reliable companies in the country all at once. It's the simplest way to bet on India's growth.",
    trendValue: "↑ 14.2%",
    isPositive: true,
    price: "245.50",
    returns: { '1y': 14.2, '3y': 45.0, '5y': 95.0 },
    holdings: [
        { name: "HDFC Bank", allocation: "13.5%", sector: "Banking" },
        { name: "Reliance Ind.", allocation: "10.2%", sector: "Energy" },
        { name: "ICICI Bank", allocation: "7.8%", sector: "Banking" },
        { name: "Infosys", allocation: "5.6%", sector: "IT Services" },
        { name: "ITC", allocation: "4.1%", sector: "FMCG" },
        { name: "TCS", allocation: "3.9%", sector: "IT Services" }
    ]
  },
  "Sensex ETF": {
    description: "This is the 'Hall of Fame' of Indian business. You get a slice of the 30 oldest and strongest companies in India. If you want rock-solid reliability, this is it.",
    trendValue: "↑ 13.8%",
    isPositive: true,
    price: "720.10",
    returns: { '1y': 13.8, '3y': 42.0, '5y': 88.0 },
    holdings: [
        { name: "HDFC Bank", allocation: "15.1%", sector: "Banking" },
        { name: "Reliance Ind.", allocation: "12.3%", sector: "Energy" },
        { name: "ICICI Bank", allocation: "8.5%", sector: "Banking" },
        { name: "Infosys", allocation: "6.2%", sector: "IT Services" },
        { name: "L&T", allocation: "4.5%", sector: "Construction" }
    ]
  },
  "Bank Nifty ETF": {
    description: "Love banks? This bundles the biggest banks in India into one package. Instead of guessing which single bank will win, you bet on all the big ones growing together.",
    trendValue: "↑ 18.5%",
    isPositive: true,
    price: "480.25",
    returns: { '1y': 18.5, '3y': 60.0, '5y': 110.0 },
    holdings: [
        { name: "HDFC Bank", allocation: "28.0%", sector: "Banking" },
        { name: "ICICI Bank", allocation: "23.5%", sector: "Banking" },
        { name: "SBI", allocation: "11.0%", sector: "Banking" },
        { name: "Kotak Bank", allocation: "9.5%", sector: "Banking" },
        { name: "Axis Bank", allocation: "9.0%", sector: "Banking" }
    ]
  },
  "Bharat 22 ETF": {
    description: "The 'Government's Choice' mix. This includes 22 heavy-hitter companies where the Government of India has a stake. These are solid, steady giants.",
    trendValue: "↑ 35.4%",
    isPositive: true,
    price: "85.40",
    returns: { '1y': 35.4, '3y': 95.0, '5y': 150.0 },
    holdings: [
        { name: "L&T", allocation: "18.0%", sector: "Construction" },
        { name: "ITC", allocation: "16.0%", sector: "FMCG" },
        { name: "NTPC", allocation: "12.0%", sector: "Power" },
        { name: "Power Grid", allocation: "10.0%", sector: "Power" },
        { name: "SBI", allocation: "8.0%", sector: "Banking" }
    ]
  },
  "CPSE ETF": {
    description: "This invests your money into companies owned by the Indian Government. They run essential things like electricity and fuel, making them very stable.",
    trendValue: "↑ 42.1%",
    isPositive: true,
    price: "92.15",
    returns: { '1y': 42.1, '3y': 110.0, '5y': 180.0 },
    holdings: [
        { name: "NTPC", allocation: "19.5%", sector: "Power" },
        { name: "Power Grid", allocation: "18.2%", sector: "Power" },
        { name: "ONGC", allocation: "15.0%", sector: "Oil & Gas" },
        { name: "Coal India", allocation: "14.0%", sector: "Mining" },
        { name: "BEL", allocation: "8.0%", sector: "Defense" }
    ]
  }
};

const DEFAULT_ETF = {
  description: "Think of an ETF like a fruit basket. Instead of buying just one apple or one orange (one company), you buy the whole basket so you get a taste of everything!",
  trendValue: "↑ 12.0%",
  isPositive: true,
  price: "100.00",
  returns: { '1y': 12.0, '3y': 36.0, '5y': 72.0 },
  holdings: [
      { name: "Top Stock A", allocation: "10.0%", sector: "Sector A" },
      { name: "Top Stock B", allocation: "8.0%", sector: "Sector B" }
  ]
};

const CAR_IMAGES = [
    "https://freepngimg.com/thumb/car/80860-racer-scuderia-formula-ferrari-vettel-sebastian-one.png",
    "https://www.pngall.com/wp-content/uploads/12/Red-Formula-1-Car-PNG-Image.png",
    "https://cdn.pixabay.com/photo/2020/05/25/18/50/race-car-5220261_1280.png"
];

const timeFrames = ['1W', '1M', '1Y', '5Y'];

export const ETFDetailScreen: React.FC<ETFDetailScreenProps> = ({ etf, onBack }) => {
  const [activeTab, setActiveTab] = useState('5Y');
  const [tmAmount, setTmAmount] = useState(10000);
  const [tmPeriod, setTmPeriod] = useState<'1y' | '3y' | '5y'>('3y');
  const [carImageIndex, setCarImageIndex] = useState(0);

  const details = ETF_DB[etf.name] || DEFAULT_ETF;

  // Selection state for Direct Indexing feel
  const [selectedIndices, setSelectedIndices] = useState<number[]>(
    details.holdings.map((_: any, i: number) => i)
  );

  const toggleSelection = (index: number) => {
    if (selectedIndices.includes(index)) {
        setSelectedIndices(selectedIndices.filter(i => i !== index));
    } else {
        setSelectedIndices([...selectedIndices, index]);
    }
  };

  // Chart Data Generation
  const generateData = () => {
    let value = 100;
    return Array.from({ length: 40 }, (_, i) => {
      value = value + (Math.random() - 0.4) * 10;
      return { name: i, value: Math.max(50, value) };
    });
  };
  const data = generateData();

  // Time Machine Logic
  const returnPercentage = details.returns[tmPeriod];
  const tmFinalValue = tmAmount * (1 + (returnPercentage / 100));

  const getLogoUrl = (name: string) => 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128`;

  return (
    <div className="flex-1 h-full bg-white flex flex-col font-sans overflow-hidden animate-in slide-in-from-right duration-300 relative z-50">
      
      {/* Header Row */}
      <div className="px-4 py-4 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-30 border-b border-gray-50">
         <div className="flex items-center gap-3">
             <button 
               onClick={onBack} 
               className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95 text-gray-900"
             >
                 <ArrowLeft size={24} strokeWidth={2.5} />
             </button>
             
             <div className="flex flex-col">
                 <span className="font-bold text-gray-900 text-lg leading-tight">
                   {etf.name}
                 </span>
                 <span className="text-xs text-gray-500 font-medium">{etf.symbol}</span>
             </div>
         </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-28 custom-scrollbar">
          
          <div className="px-6 pt-6">
             {/* Stats Section */}
             <div className="mb-6">
                 <div className="inline-flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md mb-2">
                    <span className="text-xs font-bold text-blue-700">ETF</span>
                    <Info size={12} className="text-blue-600" />
                 </div>
                 
                 <div className="flex justify-between items-end">
                    <div>
                        <p className="text-gray-500 font-medium text-xs uppercase tracking-wide mb-0.5">Current NAV</p>
                        <span className="text-4xl font-black tracking-tight text-gray-900">₹{details.price}</span>
                    </div>
                    <div className="text-right mb-1">
                        <span className={`text-lg font-bold flex items-center justify-end gap-1 ${details.isPositive ? 'text-green-600' : 'text-red-500'}`}>
                            {details.trendValue}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium uppercase">Past 1 Year</span>
                    </div>
                 </div>
             </div>

             {/* Performance Chart */}
             <div className="h-56 w-full mb-6 -ml-2">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="etfColorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" hide />
                        <YAxis hide domain={['auto', 'auto']} />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#f97316" 
                          strokeWidth={2.5} 
                          fillOpacity={1} 
                          fill="url(#etfColorValue)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
             </div>

             {/* Timeframe Tabs */}
             <div className="flex gap-2 mb-10 justify-between bg-gray-50 p-1 rounded-xl">
                 {timeFrames.map((tf) => (
                     <button
                        key={tf}
                        onClick={() => setActiveTab(tf)}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                            activeTab === tf 
                            ? 'bg-white text-orange-600 shadow-sm' 
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                     >
                        {tf}
                     </button>
                 ))}
             </div>
             
             {/* --- TIME MACHINE WIDGET --- */}
             <div className="relative mb-12 isolate">
                 
                 {/* 3D F1 Car Image */}
                 <div className="absolute -top-16 -right-2 w-56 h-40 z-50 pointer-events-none">
                     <img 
                       src={CAR_IMAGES[carImageIndex]} 
                       alt="F1 Car" 
                       className="w-full h-full object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.4)] transform -rotate-2"
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
                 <div className="bg-[#1e293b] rounded-[2rem] p-6 pb-8 text-white relative shadow-xl border border-gray-700 overflow-hidden">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none"></div>

                     <div className="relative z-10 mb-6 pr-10">
                         <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-1 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                             TIME MACHINE
                         </h3>
                         <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                             See the power of this ETF
                         </p>
                     </div>

                     <div className="relative z-10 mb-8">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-gray-400 text-xs font-bold">Invested</span>
                            <span className="text-2xl font-black text-orange-400">₹{tmAmount.toLocaleString()}</span>
                        </div>
                        <input 
                            type="range" 
                            min="1000" 
                            max="100000" 
                            step="1000"
                            value={tmAmount}
                            onChange={(e) => setTmAmount(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer accent-orange-500 hover:accent-orange-400"
                         />
                     </div>

                     <div className="relative z-10 flex gap-2 mb-6 bg-black/20 p-1.5 rounded-xl border border-white/5">
                        {['1y', '3y', '5y'].map((p) => (
                           <button
                             key={p}
                             onClick={() => setTmPeriod(p as any)}
                             className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                                 tmPeriod === p 
                                 ? 'bg-orange-500 text-white shadow-lg' 
                                 : 'text-gray-400 hover:text-white'
                             }`}
                           >
                             {p} ago
                           </button>
                        ))}
                     </div>

                     <div className="relative z-10 bg-white/10 rounded-xl p-4 border border-white/10 backdrop-blur-md">
                         <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Current Value</p>
                         <div className="flex items-center justify-between">
                             <span className="text-3xl font-black text-white tracking-tight">₹{Math.round(tmFinalValue).toLocaleString()}</span>
                             <span className="text-green-400 text-sm font-bold flex items-center gap-1 bg-green-900/30 px-2 py-1 rounded">
                                 +{Math.abs(returnPercentage)}%
                             </span>
                         </div>
                     </div>
                 </div>
             </div>

             {/* About Section */}
             <div className="space-y-8">
                <div>
                    <h3 className="font-bold text-gray-900 text-lg uppercase tracking-tight mb-3">About {etf.name}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed font-medium bg-gray-50 p-4 rounded-2xl border border-gray-100">
                       {details.description}
                    </p>
                </div>

                {/* Top Holdings List */}
                <div>
                   <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-gray-900 text-lg uppercase tracking-tight">Top Holdings</h3>
                      <span className="text-xs text-gray-400 font-bold bg-gray-100 px-2 py-1 rounded-md">Top {details.holdings.length}</span>
                   </div>

                   <div className="space-y-3">
                       {details.holdings.map((item: any, idx: number) => {
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

                                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 font-bold text-sm shrink-0">
                                       {item.name[0]}
                                    </div>
                                    <div>
                                        <div className={`font-bold text-sm leading-tight ${isSelected ? 'text-gray-900' : 'text-gray-500'}`}>{item.name}</div>
                                        <div className="text-xs text-gray-500 font-medium mt-0.5">{item.sector}</div>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col items-end">
                                    <span className={`text-sm font-bold ${isSelected ? 'text-gray-900' : 'text-gray-400'}`}>{item.allocation}</span>
                                    <div className="flex items-center gap-1">
                                       <PieChart size={10} className="text-gray-400" />
                                       <span className="text-[10px] text-gray-400 font-medium">weight</span>
                                    </div>
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
             <Button 
                className="w-full rounded-2xl py-4 text-lg font-bold shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:grayscale"
                disabled={selectedIndices.length === 0}
             >
                Invest in {selectedIndices.length === details.holdings.length ? etf.name : `${selectedIndices.length} items`}
             </Button>
         </div>
      </div>

    </div>
  );
};
