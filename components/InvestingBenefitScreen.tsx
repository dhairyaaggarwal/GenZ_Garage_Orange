import React, { useEffect, useState, useRef } from 'react';
import { Button } from './Button';
import { CircularHeader } from './CircularHeader';

interface InvestingBenefitScreenProps {
  onContinue: () => void;
}

// Using "Rachel" - High energy, clear
const ELEVEN_LABS_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; 
const VOICE_TEXT = "Investing is a powerful way to grow your money — you can grow up to 6x more by investing compared to saving.";

export const InvestingBenefitScreen: React.FC<InvestingBenefitScreenProps> = ({ onContinue }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationsStarted, setAnimationsStarted] = useState(false);
  const [showInvestingBar, setShowInvestingBar] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Counters for numbers
  const [savingDisplay, setSavingDisplay] = useState(0);
  const [investingDisplay, setInvestingDisplay] = useState(0);

  const hasPlayedRef = useRef(false);
  
  // Accessibility: Check reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Voice Logic (Audio Only) ---
  const playVoice = async () => {
    if (hasPlayedRef.current) return;
    hasPlayedRef.current = true;
    setIsPlaying(true);

    const apiKey = process.env.ELEVEN_LABS_API_KEY;
    let audio: HTMLAudioElement | null = null;

    if (apiKey) {
      try {
        const response = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_LABS_VOICE_ID}`, 
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'xi-api-key': apiKey },
            body: JSON.stringify({
              text: VOICE_TEXT,
              model_id: "eleven_monolingual_v1",
              voice_settings: { stability: 0.5, similarity_boost: 0.75 }
            })
          }
        );
        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          audio = new Audio(url);
        }
      } catch (e) {
        console.warn("ElevenLabs failed, falling back.");
      }
    }

    if (!audio) {
      const utterance = new SpeechSynthesisUtterance(VOICE_TEXT);
      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find(v => v.name.includes("Natural") || v.name.includes("Google US English"));
      if (naturalVoice) utterance.voice = naturalVoice;
      utterance.rate = 1.1; 
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      audio.onended = () => setIsPlaying(false);
      audio.play().catch(() => setIsPlaying(false));
    }
  };

  useEffect(() => {
    playVoice();

    if (prefersReducedMotion) {
      setAnimationsStarted(true);
      setShowInvestingBar(true);
      setSavingDisplay(1);
      setInvestingDisplay(6);
    } else {
      // 1. Start Saving Bar (Left) immediately
      setTimeout(() => setAnimationsStarted(true), 100);

      // 2. Start Investing Bar (Right) after delay
      setTimeout(() => setShowInvestingBar(true), 600);

      // 3. Trigger Confetti
      setTimeout(() => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
      }, 1600);
    }

    return () => { 
        window.speechSynthesis.cancel();
        setIsPlaying(false);
    };
  }, [prefersReducedMotion]);

  // --- Counter Animations ---
  useEffect(() => {
    if (animationsStarted && !prefersReducedMotion) {
        let start = 0;
        const end = 1;
        const duration = 1200;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease Out Quart
            const ease = 1 - Math.pow(1 - progress, 4);
            
            setSavingDisplay(start + (end - start) * ease);

            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }
  }, [animationsStarted, prefersReducedMotion]);

  useEffect(() => {
    if (showInvestingBar && !prefersReducedMotion) {
        let start = 0;
        const end = 6;
        const duration = 1800; // Slower for bigger bar
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease Out Expo
            const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            
            setInvestingDisplay(start + (end - start) * ease);

            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }
  }, [showInvestingBar, prefersReducedMotion]);

  const handleContinue = () => {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      onContinue();
  };

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-gradient-to-br from-orange-50 via-orange-100 to-rose-100 font-sans">
      
      {/* Background - Clean gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>

      {/* Header */}
      <CircularHeader currentStep={4} totalSteps={4} />

      {/* Voice Activity Indicator */}
      <div className="absolute top-[5.5rem] left-0 w-full flex justify-center pointer-events-none z-20">
        <div className={`transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex items-center gap-1 h-4">
                <div className="w-0.5 bg-yellow-400 rounded-full animate-[bounce_1s_infinite] h-2"></div>
                <div className="w-0.5 bg-yellow-400 rounded-full animate-[bounce_1s_infinite_0.1s] h-3"></div>
                <div className="w-0.5 bg-yellow-400 rounded-full animate-[bounce_1s_infinite_0.2s] h-2"></div>
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center px-6 z-10 w-full max-w-md mx-auto mt-6 overflow-y-auto no-scrollbar pb-32">
         
         <h1 className="text-4xl text-gray-900 text-center mb-10 leading-tight drop-shadow-sm">
           <span className="font-bold">Make 6x more</span> <br/> <span className="italic font-serif">by investing</span>
         </h1>

         {/* Chart Container */}
         <div className="w-full flex justify-center items-end gap-6 h-80 mb-8 relative px-4">
             
             {/* Confetti Burst */}
             {showConfetti && !prefersReducedMotion && (
                 <div className="absolute top-0 right-[20%] w-0 h-0 z-50 pointer-events-none">
                    <div className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-[ping_0.8s_ease-out_forwards]"></div>
                    <div className="absolute w-1.5 h-3 bg-orange-500 animate-[spin_1s_ease-out_forwards] translate-x-6 -translate-y-8 opacity-0" style={{ animationName: 'confetti-1' }}></div>
                    <div className="absolute w-2 h-2 bg-rose-400 rounded-sm animate-[bounce_1s_ease-out_forwards] -translate-x-6 -translate-y-12 opacity-0" style={{ animationName: 'confetti-2' }}></div>
                    <div className="absolute w-1 h-4 bg-green-400 rotate-45 animate-[pulse_0.8s_ease-out_forwards] translate-x-12 -translate-y-4 opacity-0" style={{ animationName: 'confetti-3' }}></div>
                 </div>
             )}
             <style>{`
                @keyframes confetti-1 { 0% { opacity: 1; transform: translate(0,0) rotate(0deg); } 100% { opacity: 0; transform: translate(30px, -40px) rotate(180deg); } }
                @keyframes confetti-2 { 0% { opacity: 1; transform: translate(0,0); } 100% { opacity: 0; transform: translate(-30px, -60px); } }
                @keyframes confetti-3 { 0% { opacity: 1; transform: translate(0,0) rotate(45deg); } 100% { opacity: 0; transform: translate(40px, -20px) rotate(90deg); } }
             `}</style>

             {/* Saving Bar (Left) */}
             <div className="flex flex-col items-center justify-end w-28 h-full group relative">
                 {/* Tooltip */}
                 <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                    Saving — Rs 1 Cr (Est.)
                 </div>
                 
                 {/* Value Label */}
                 <div className={`mb-3 text-center transition-all duration-500 ease-out transform ${animationsStarted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                     <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Saving</span>
                     <span className="block text-xl font-bold text-gray-600">₹{savingDisplay.toFixed(2)} Cr</span>
                 </div>
                 
                 {/* Bar */}
                 <div 
                    className="w-full bg-white rounded-t-2xl shadow-sm border border-gray-100 relative overflow-hidden"
                    style={{ 
                        height: animationsStarted ? '16%' : '0%', 
                        transition: prefersReducedMotion ? 'none' : 'height 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                        willChange: 'height'
                    }}
                 >
                    {/* Inner Texture */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-50 to-transparent"></div>
                 </div>
             </div>

             {/* Investing Bar (Right) */}
             <div className="flex flex-col items-center justify-end w-28 h-full group relative">
                 {/* Tooltip */}
                 <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                    Investing — Rs 6 Cr (Est.)
                 </div>

                 {/* Value Label */}
                 <div className={`mb-3 text-center transition-all duration-500 ease-out transform ${showInvestingBar ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                     <span className="block text-xs font-semibold text-orange-600 uppercase tracking-wide mb-1">Investing</span>
                     <span className="block text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-rose-600">₹{investingDisplay.toFixed(2)} Cr</span>
                 </div>

                 {/* Bar */}
                 <div 
                    className={`w-full bg-gradient-to-t from-orange-500 via-orange-400 to-yellow-400 rounded-t-2xl shadow-[0_10px_40px_-10px_rgba(249,115,22,0.5)] relative overflow-hidden flex items-start justify-center ${prefersReducedMotion && 'shadow-none'}`}
                    style={{ 
                        height: showInvestingBar ? '100%' : '0%',
                        transition: prefersReducedMotion ? 'none' : 'height 1.8s cubic-bezier(0.16, 1, 0.3, 1)',
                        willChange: 'height'
                    }}
                 >
                     {/* Gloss/Shine Animation */}
                     <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent translate-y-full animate-[shimmer_2.5s_infinite] pointer-events-none"></div>
                     <style>{`
                        @keyframes shimmer {
                            0% { transform: translateY(100%) translateX(-100%); }
                            100% { transform: translateY(-100%) translateX(100%); }
                        }
                     `}</style>
                     
                     {/* Top Highlight */}
                     <div className="absolute top-0 left-0 w-full h-[2px] bg-white/60"></div>
                 </div>
             </div>
         </div>

         {/* Disclaimer */}
         <p className="text-[11px] text-center text-[#9a9491] font-medium max-w-xs leading-tight mx-auto mb-8 opacity-80">
             Based on Rs 1 Cr goal, assuming 10.26% annual returns for investing vs 4% for savings. Actual returns may vary.
         </p>
         
         {/* Helper Line */}
         <div className={`transition-opacity duration-700 ${showInvestingBar ? 'opacity-100' : 'opacity-0'}`}>
            <p className="text-sm font-semibold text-gray-800 text-center mb-2 px-8">
                Investing puts your money to work, so you don't have to work forever.
            </p>
         </div>

      </div>

      {/* Bottom CTA */}
      <div className="absolute bottom-0 left-0 w-full p-6 pb-10 bg-gradient-to-t from-white via-white/95 to-transparent z-20">
         <div className="max-w-md mx-auto">
            <Button 
               onClick={handleContinue}
               className="w-[85%] mx-auto block rounded-full py-4 text-lg transition-all shadow-xl shadow-orange-500/20 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-gray-900 font-extrabold tracking-wide border-none hover:scale-[1.02] active:scale-95"
            >
               Continue
            </Button>
         </div>
      </div>
      
      {/* Screen Reader Announcements */}
      <div aria-live="polite" className="sr-only">
        {isPlaying ? "Buddy is speaking: Investing is a powerful way to grow your money." : "Audio ended."}
      </div>
    </div>
  );
};