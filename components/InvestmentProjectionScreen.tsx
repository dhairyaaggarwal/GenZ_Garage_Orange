import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import { ArrowRight } from 'lucide-react';

interface InvestmentProjectionScreenProps {
  onContinue: () => void;
  onJumpToStep: (step: number) => void;
  onLogin: () => void;
}

export const InvestmentProjectionScreen: React.FC<InvestmentProjectionScreenProps> = ({ onContinue, onJumpToStep, onLogin }) => {
  const [animateGraph, setAnimateGraph] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    setTimeout(() => setAnimateGraph(true), 200);
  }, []);

  // Generate 28 bars for a smooth curve look (Exponential growth)
  const totalBars = 28;
  const graphData = Array.from({ length: totalBars }, (_, i) => {
    const x = i / (totalBars - 1);
    // Simple quadratic ease-in for growth curve: start at 10%, end at 100%
    return 10 + (90 * (x * x));
  });

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-gradient-to-br from-orange-200 via-rose-200 to-orange-100 font-sans">
      
      {/* Animated Background Gradient Layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 via-rose-400/10 to-transparent animate-gradient-xy opacity-70"></div>

      {/* Atmospheric White Glow Circles */}
      <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-white/30 rounded-full blur-[80px] pointer-events-none animate-pulse"></div>
      <div className="absolute top-[40%] right-[-10%] w-80 h-80 bg-white/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-20%] w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Floating Particles (Fireflies) */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute top-3/4 left-1/3 w-1.5 h-1.5 bg-orange-300 rounded-full opacity-50 animate-bounce delay-700"></div>
      <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-white/40 rounded-full blur-[1px] animate-pulse delay-300"></div>
      <div className="absolute bottom-1/3 right-1/2 w-2 h-2 bg-rose-300/40 rounded-full animate-ping duration-[3000ms]"></div>

      {/* Background Blobs for Depth */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vh] h-[50vh] bg-orange-500/10 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50vh] h-[50vh] bg-rose-500/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      
      {/* Header */}
      <header className="px-6 pt-12 pb-6 flex justify-between items-center w-full z-20 relative">
        <div className="flex items-center gap-2">
           <svg viewBox="0 0 100 100" className="w-8 h-8 shrink-0 drop-shadow-sm">
             <path d="M50 25 C 50 25 65 5 85 15 C 85 15 75 35 50 35" fill="#65a30d" />
             <path d="M50 25 C 50 25 35 5 15 15 C 15 15 25 35 50 35" fill="#4d7c0f" />
             <circle cx="50" cy="60" r="35" fill="url(#orangeGradProj)" />
             <ellipse cx="35" cy="50" rx="10" ry="5" transform="rotate(-45 35 50)" fill="white" fillOpacity="0.3" />
             <defs>
               <linearGradient id="orangeGradProj" x1="20" y1="20" x2="80" y2="90" gradientUnits="userSpaceOnUse">
                 <stop offset="0%" stopColor="#fb923c" />
                 <stop offset="100%" stopColor="#ea580c" />
               </linearGradient>
             </defs>
           </svg>
           <span className="font-bold text-xl text-gray-900 tracking-tight">Orange</span>
        </div>
        <button 
          onClick={onLogin}
          className="text-sm font-medium text-gray-700 hover:text-orange-700 transition-colors backdrop-blur-sm bg-white/30 px-3 py-1.5 rounded-full"
        >
          I already have an account &gt;
        </button>
      </header>

      {/* Segmented Progress Bar (Step 2 of 3) */}
      <div className="px-6 w-full z-20 mb-8 flex gap-2">
         {[1, 2, 3].map((step) => (
           <button 
             key={step} 
             onClick={() => onJumpToStep(step)}
             className={`h-1.5 flex-1 rounded-full transition-all duration-300 cursor-pointer hover:h-2 ${
               step === 2 ? 'bg-gray-900' : 'bg-gray-400/30 hover:bg-gray-400/50'
             }`}
             aria-label={`Go to step ${step}`}
           />
         ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 flex flex-col items-center z-10 w-full max-w-md mx-auto relative overflow-y-auto custom-scrollbar no-scrollbar">
        
        {/* Main Projection Card */}
        <div className="w-full bg-white/80 backdrop-blur-xl rounded-[36px] p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-white/60 mb-6 transform transition-all duration-500 hover:scale-[1.01] hover:shadow-orange-500/10">
          <div className="text-center mb-8 pt-2">
            <h2 className="text-gray-500 text-sm font-medium mb-2 tracking-wide">Most likely portfolio value in 5 years</h2>
            <div className="relative inline-block">
              <span className="text-5xl font-extrabold text-gray-900 tracking-tight">
                ₹2,36,600
              </span>
            </div>
          </div>

          {/* Animated Multi-Bar Graph */}
          <div className="h-48 flex items-end justify-between gap-[2px] px-2 pb-2 relative mt-4">
             {/* Labels */}
             <div className="absolute -bottom-6 left-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">Today</div>
             <div className="absolute -bottom-6 right-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">2029</div>

             {/* Dotted Baseline */}
             <div className="absolute bottom-0 left-0 right-0 border-b-2 border-dashed border-gray-200/50 w-full"></div>

             {graphData.map((height, i) => (
               <div key={i} className="flex-1 flex flex-col justify-end items-center group relative h-full">
                 
                 {/* Label for first item (Today) */}
                 {i === 0 && (
                   <div 
                      className={`absolute bottom-[105%] transition-all duration-700 delay-[800ms] ease-out z-20 ${animateGraph ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                      style={{ bottom: `${height}%`, marginBottom: '8px' }}
                   >
                     <div className="text-gray-500 text-[10px] font-bold bg-white/50 backdrop-blur-sm px-1.5 py-0.5 rounded-md">
                       ₹500
                     </div>
                   </div>
                 )}

                 {/* Bubble for last item */}
                 {i === totalBars - 1 && (
                   <div 
                      className={`absolute bottom-[105%] transition-all duration-700 delay-[1200ms] ease-out z-20 ${animateGraph ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-90'}`}
                      style={{ bottom: `${height}%`, marginBottom: '12px' }}
                   >
                     <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-gray-900/20 whitespace-nowrap flex items-center gap-1">
                       ₹2.3L
                       <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                     </div>
                     {/* Triangle pointer */}
                     <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-gray-900"></div>
                   </div>
                 )}
                 
                 {/* The Bar */}
                 <div 
                   className="w-full rounded-t-[2px] relative overflow-hidden transition-all duration-[1500ms] ease-out"
                   style={{ 
                     height: animateGraph ? `${height}%` : '0%',
                     background: i === totalBars - 1 
                        ? 'linear-gradient(to top, #fb923c, #ea580c)' // Last bar is brighter
                        : 'linear-gradient(to top, #fdba74, #f97316)',
                     opacity: 0.6 + ((i / totalBars) * 0.4), // Fade opacity from left to right
                     width: '60%' // Thin bars
                   }}
                 >
                 </div>
               </div>
             ))}
          </div>
          <div className="mt-6"></div> {/* Spacer for labels */}
        </div>

        {/* Bottom Text */}
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 leading-[1.15] mb-4 max-w-xs mx-auto animate-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-backwards">
          Where your money works <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-rose-600">harder</span> for you
        </h1>

        <div className="mt-auto pb-10 w-full animate-in slide-in-from-bottom-4 duration-700 delay-700 fill-mode-backwards">
           <Button 
             onClick={onContinue}
             className="w-[85%] mx-auto py-4 text-lg hover:scale-[1.02] flex items-center justify-center gap-2 transition-all"
           >
             <span className="font-bold">Get Started</span>
           </Button>
        </div>
      </div>
    </div>
  );
};