import React, { useEffect } from 'react';

interface PlaylistGenerationLoadingScreenProps {
  onComplete: () => void;
}

export const PlaylistGenerationLoadingScreen: React.FC<PlaylistGenerationLoadingScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    // Simulate generation time
    const timer = setTimeout(() => {
      onComplete();
    }, 3500); 
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full bg-[#111827] relative overflow-hidden font-sans">
      
      {/* Subtle Texture Animation - Adjusted for Dark Mode */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.1),_transparent_70%)] animate-pulse"></div>

      {/* Center Visual Element: Glowing Orb */}
      <div className="relative mb-12">
        {/* Outer Glow - Slightly more intense on dark bg */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-orange-500/20 rounded-full blur-[60px] animate-[pulse_4s_ease-in-out_infinite]"></div>
        
        {/* Core Gradient Orb */}
        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-orange-500 via-orange-400 to-yellow-300 shadow-[0_0_60px_rgba(249,115,22,0.4)] animate-[float_5s_ease-in-out_infinite] relative z-10"></div>
        
        {/* Inner Highlight */}
        <div className="absolute top-1/3 left-1/3 w-16 h-16 bg-white/30 rounded-full blur-lg animate-[pulse_3s_ease-in-out_infinite_1s] z-20"></div>
      </div>

      {/* Main Headline */}
      <div className="text-center z-10 px-6 relative">
        <p className="text-orange-500 font-bold tracking-[0.2em] text-sm uppercase mb-3 animate-in fade-in slide-in-from-bottom-2 duration-700">PLAYLISTS</p>
        <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          Invest in <br/>
          multiple items <br/>
          with one tap
        </h1>
      </div>

      {/* Progress Indicator */}
      <div className="flex gap-2 mb-20 animate-in fade-in duration-1000 delay-300">
         <div className="w-2 h-2 bg-orange-500 rounded-full animate-[bounce_1s_infinite]"></div>
         <div className="w-2 h-2 bg-orange-500 rounded-full animate-[bounce_1s_infinite_0.2s]"></div>
         <div className="w-2 h-2 bg-orange-500 rounded-full animate-[bounce_1s_infinite_0.4s]"></div>
      </div>

      {/* Footer Text */}
      <div className="absolute bottom-10 left-0 w-full text-center">
        <p className="text-gray-400 text-sm font-medium animate-pulse">We’re creating your personalised playlist…</p>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
      `}</style>
    </div>
  );
};