import React, { useState } from 'react';
import { Button } from './Button';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { setValue, persistOnboardingState } from '../utils/onboardingState';

interface CreatePlaylistInterestsScreenProps {
  onBack: () => void;
  onContinue: () => void;
}

const INTERESTS_DATA = [
  { id: "IT & Software", emoji: "💻", color: "from-blue-500 to-cyan-400" },
  { id: "Fintech", emoji: "💳", color: "from-indigo-500 to-purple-500" },
  { id: "Digital Payments", emoji: "💸", color: "from-violet-500 to-fuchsia-500" },
  { id: "Renewable Energy", emoji: "☀️", color: "from-amber-400 to-orange-500" },
  { id: "EV & Battery Tech", emoji: "🔋", color: "from-emerald-400 to-teal-500" },
  { id: "Green Energy", emoji: "🌱", color: "from-green-500 to-emerald-700" },
  { id: "Pharma", emoji: "💊", color: "from-sky-400 to-blue-500" },
  { id: "Hospitals", emoji: "🏥", color: "from-blue-400 to-indigo-500" },
  { id: "Biotech", emoji: "🧬", color: "from-teal-400 to-cyan-500" },
  { id: "FMCG", emoji: "🛒", color: "from-orange-400 to-red-400" },
  { id: "Retail & E-commerce", emoji: "🛍️", color: "from-pink-500 to-rose-500" },
  { id: "Fashion", emoji: "👗", color: "from-fuchsia-500 to-pink-600" },
  { id: "Infrastructure", emoji: "🏗️", color: "from-stone-500 to-stone-600" },
  { id: "Real Estate", emoji: "🏠", color: "from-amber-600 to-orange-700" },
  { id: "Capital Goods", emoji: "⚙️", color: "from-slate-500 to-slate-600" },
  { id: "Banking (Private)", emoji: "🏦", color: "from-blue-600 to-blue-800" },
  { id: "PSU Banking", emoji: "🏛️", color: "from-indigo-600 to-indigo-800" },
  { id: "Insurance", emoji: "🛡️", color: "from-rose-500 to-red-600" },
  { id: "Oil & Gas", emoji: "🛢️", color: "from-orange-600 to-amber-700" },
  { id: "Metals & Mining", emoji: "⛏️", color: "from-zinc-500 to-stone-700" },
  { id: "Chemicals", emoji: "⚗️", color: "from-lime-500 to-green-600" },
  { id: "Railways", emoji: "🚂", color: "from-blue-800 to-indigo-900" },
  { id: "Make in India", emoji: "🦁", color: "from-orange-500 to-red-600" },
  { id: "Defence", emoji: "⚔️", color: "from-emerald-700 to-green-900" },
  { id: "Bharat (Rural India)", emoji: "🌾", color: "from-yellow-500 to-amber-600" },
  { id: "High-Growth Companies", emoji: "🚀", color: "from-purple-600 to-indigo-600" },
  { id: "Value Investing", emoji: "💎", color: "from-cyan-600 to-blue-700" },
  { id: "Logistics", emoji: "🚚", color: "from-amber-500 to-orange-600" },
  { id: "Auto", emoji: "🚗", color: "from-red-500 to-rose-700" },
  { id: "Telecom", emoji: "📡", color: "from-blue-500 to-indigo-600" }
];

export const CreatePlaylistInterestsScreen: React.FC<CreatePlaylistInterestsScreenProps> = ({ onBack, onContinue }) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleNext = () => {
    setValue('playlistInterests', selectedInterests);
    persistOnboardingState();
    onContinue();
  };

  const handleSkip = () => {
    setValue('playlistInterests', []);
    persistOnboardingState();
    onContinue();
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#111827] font-sans overflow-hidden animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="px-6 pt-12 pb-4 flex items-center justify-between z-20">
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition-colors active:scale-95"
        >
          <ArrowLeft size={24} />
        </button>
        <button 
          onClick={handleSkip}
          className="text-sm font-bold text-gray-500 hover:text-white transition-colors px-3 py-1 rounded-full hover:bg-white/5"
        >
          Skip
        </button>
      </div>

      {/* Title Section */}
      <div className="px-6 pb-6">
         <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2 uppercase">
            Choose your <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">Vibe</span>
         </h1>
         <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-xs">
            Select categories that excite you to personalize your investing playlist.
         </p>
      </div>

      {/* Grid Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-32 custom-scrollbar">
         <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {INTERESTS_DATA.map((item) => {
              const isSelected = selectedInterests.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggleInterest(item.id)}
                  className={`
                    relative group overflow-hidden rounded-2xl p-4 text-left transition-all duration-300
                    bg-gradient-to-br ${item.color}
                    ${isSelected ? 'ring-[3px] ring-white scale-[0.98] z-10' : 'hover:scale-[1.02] opacity-85 hover:opacity-100'}
                  `}
                  style={{ aspectRatio: '1/1', minHeight: '110px' }}
                >
                   {/* Selection Indicator Overlay */}
                   {isSelected && (
                      <div className="absolute top-2 right-2 bg-white text-black rounded-full p-0.5 shadow-md z-20 animate-in zoom-in duration-200">
                         <CheckCircle2 size={16} strokeWidth={3} />
                      </div>
                   )}

                   {/* Content */}
                   <div className="flex flex-col h-full justify-between z-10 relative">
                      <span className="text-3xl filter drop-shadow-md transform group-hover:scale-110 transition-transform duration-300 origin-top-left">
                        {item.emoji}
                      </span>
                      <span className="font-bold text-sm text-white leading-tight drop-shadow-md pr-1">
                        {item.id}
                      </span>
                   </div>
                   
                   {/* Subtle Shine Effect */}
                   <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </button>
              );
            })}
         </div>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 w-full p-6 pb-10 bg-gradient-to-t from-[#111827] via-[#111827]/95 to-transparent z-20 pointer-events-none">
         <div className="max-w-md mx-auto pointer-events-auto">
            <Button 
               onClick={handleNext}
               disabled={selectedInterests.length === 0}
               className="w-full rounded-full py-4 text-lg shadow-[0_0_20px_rgba(249,115,22,0.4)] bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-400 hover:to-pink-400 text-white font-bold border-none disabled:opacity-50 disabled:shadow-none transition-all"
            >
               Continue ({selectedInterests.length})
            </Button>
         </div>
      </div>

    </div>
  );
};