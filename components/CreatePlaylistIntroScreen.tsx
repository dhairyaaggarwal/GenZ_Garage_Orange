import React from 'react';
import { Button } from './Button';
import { ArrowLeft } from 'lucide-react';

interface CreatePlaylistIntroScreenProps {
  onBack: () => void;
  onContinue: () => void;
}

const BACKGROUND_TILES = [
  { text: "Nifty 50", sub: "Top 50 India", color: "bg-blue-600" },
  { text: "Tata Power", sub: "↑ 89% 1Y", color: "bg-green-600" },
  { text: "Gold BeES", sub: "Safety", color: "bg-yellow-500" },
  { text: "IT Sector", sub: "TCS, Infy", color: "bg-purple-600" },
  { text: "HDFC Bank", sub: "Leader", color: "bg-indigo-500" },
  { text: "Zomato", sub: "High Growth", color: "bg-rose-500" },
  { text: "EV Tech", sub: "Future", color: "bg-teal-500" },
  { text: "Sun Pharma", sub: "Health", color: "bg-cyan-600" },
  { text: "ITC", sub: "Dividends", color: "bg-orange-500" },
  { text: "Defense", sub: "HAL, BEL", color: "bg-emerald-600" },
];

export const CreatePlaylistIntroScreen: React.FC<CreatePlaylistIntroScreenProps> = ({ onBack, onContinue }) => {
  return (
    <div className="flex-1 flex flex-col h-full bg-[#111827] font-sans overflow-hidden relative">
      
      {/* Background Tiles Layer - Angled Grid */}
      <div className="absolute top-[-5%] left-[-15%] w-[130%] h-[70%] flex flex-wrap content-start gap-3 opacity-30 rotate-[-12deg] scale-110 pointer-events-none">
          {/* Rendering tiles twice to ensure coverage */}
          {[...BACKGROUND_TILES, ...BACKGROUND_TILES].map((tile, i) => (
             <div key={i} className={`w-28 h-28 rounded-2xl ${tile.color} p-3 flex flex-col justify-between shadow-lg transform transition-transform`}>
                <div className="w-5 h-5 bg-white/30 rounded-full"></div>
                <div>
                   <p className="text-white font-bold text-sm leading-tight mb-0.5">{tile.text}</p>
                   <p className="text-white/80 text-[10px] font-medium">{tile.sub}</p>
                </div>
             </div>
          ))}
      </div>

      {/* Gradient Overlay to fade into black at bottom for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#111827]/40 via-[#111827]/90 to-[#111827]"></div>

      {/* Header */}
      <div className="px-6 pt-12 pb-2 flex items-center justify-between z-20">
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition-colors active:scale-95"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* Main Content (Bottom Aligned) */}
      <div className="flex-1 flex flex-col justify-end px-8 pb-12 z-20">
        
        <div className="mb-2 animate-in slide-in-from-bottom-10 duration-700">
            <span className="text-white text-lg font-medium block opacity-90">Create a</span>
            <h1 className="text-5xl font-black text-white tracking-tighter mt-1 mb-4 uppercase drop-shadow-lg">
              PLAYLIST
            </h1>
        </div>

        <p className="text-gray-400 text-sm leading-relaxed mb-10 max-w-xs animate-in slide-in-from-bottom-8 duration-700 delay-100">
           Answer a few questions and our AI will generate a personalized investing playlist for you.
        </p>

        {/* Steps List */}
        <div className="space-y-6 mb-12 animate-in slide-in-from-bottom-6 duration-700 delay-200">
           {[
             "Interests that excite you",
             "Companies you relate to",
             "Your investment goal"
           ].map((step, idx) => (
             <div key={idx} className="flex items-center gap-4 group">
                <div className="w-8 h-8 rounded-full bg-white text-gray-900 font-bold flex items-center justify-center text-sm shrink-0 shadow-md group-hover:scale-110 transition-transform">
                  {idx + 1}
                </div>
                <span className="text-white font-bold text-lg">{step}</span>
             </div>
           ))}
        </div>

        {/* Button */}
        <div className="animate-in slide-in-from-bottom-4 duration-700 delay-300">
          <Button 
            onClick={onContinue} 
            className="w-full py-4 text-lg rounded-full bg-white hover:bg-gray-100 text-gray-900 font-extrabold border-none shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:shadow-[0_0_35px_rgba(255,255,255,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
          >
            Get Started
          </Button>
        </div>
      </div>

    </div>
  );
};