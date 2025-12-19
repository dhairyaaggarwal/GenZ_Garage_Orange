import React, { useEffect, useState, useRef } from 'react';
import { Button } from './Button';
import { CircularHeader } from './CircularHeader';
import { Volume2 } from 'lucide-react';

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
  const [showLabels, setShowLabels] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
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

    // Try ElevenLabs if API key exists
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

    // Fallback to SpeechSynthesis
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
    // Play audio on mount
    playVoice();

    if (prefersReducedMotion) {
      // Skip animations
      setAnimationsStarted(true);
      setShowInvestingBar(true);
      setShowLabels(true);
    } else {
      // Sequence Animations
      // 1. Start Saving Bar (Left) immediately
      setAnimationsStarted(true);

      // 2. Start Investing Bar (Right) after delay
      setTimeout(() => setShowInvestingBar(true), 250);

      // 3. Trigger Confetti & Labels near end of investing bar animation (approx 1.2s total)
      setTimeout(() => {
        setShowConfetti(true);
        // Remove confetti DOM after burst
        setTimeout(() => setShowConfetti(false), 900);
      }, 1250);

      // 4. Show Labels pop
      setTimeout(() => setShowLabels(true), 1350);
    }

    return () => { 
        window.speechSynthesis.cancel();
        setIsPlaying(false);
    };
  }, [prefersReducedMotion]);

  const handleContinue = () => {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      onContinue();
  };

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-gradient-to-br from-orange-50 via-orange-100 to-rose-100 font-sans">
      
      {/* Background - Clean gradient, no particles */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>

      {/* Header with Circular Progress (Step 4 of 5) */}
      <CircularHeader currentStep={4} totalSteps={5} />

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
         
         {/* Title */}
         <h1 className="text-4xl text-gray-900 text-center mb-10 leading-tight drop-shadow-sm">
           <span className="font-bold">Make 6x more</span> <br/> <span className="italic font-serif">by investing</span>
         </h1>

         {/* Chart Container */}
         <div className="w-full flex justify-center items-end gap-6 h-72 mb-8 relative px-4">
             
             {/* Confetti Burst */}
             {showConfetti && !prefersReducedMotion && (
                 <div className="absolute top-0 right-[15%] w-1 h-1 z-50">
                    {/* CSS Confetti Particles */}
                    <div className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-[ping_0.6s_ease-out_forwards]"></div>
                    <div className="absolute w-1.5 h-3 bg-orange-500 animate-[spin_0.8s_ease-out_forwards] translate-x-4 -translate-y-8"></div>
                    <div className="absolute w-2 h-2 bg-rose-400 rounded-sm animate-[bounce_0.8s_ease-out_forwards] -translate-x-4 -translate-y-10"></div>
                    <div className="absolute w-1 h-4 bg-green-400 rotate-45 animate-[pulse_0.5s_ease-out_forwards] translate-x-8 -translate-y-4"></div>
                    <div className="absolute w-2 h-2 bg-blue-400 rounded-full animate-[ping_0.7s_ease-out_forwards] -translate-x-8 -translate-y-6"></div>
                 </div>
             )}

             {/* Saving Bar (Left) */}
             <div className="flex flex-col items-center justify-end w-28 h-full group relative">
                 {/* Tooltip (Accessible) */}
                 <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                    Saving — Rs 1 Cr (Est.)
                 </div>
                 
                 {/* Value Label */}
                 <div className={`mb-3 text-center transition-all duration-300 ease-out transform ${showLabels ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'}`}>
                     <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Saving</span>
                     <span className="block text-xl font-bold text-gray-800">₹1 Cr</span>
                 </div>
                 
                 {/* Bar */}
                 <div 
                    className="w-full bg-orange-50 rounded-t-2xl shadow-sm border border-orange-100/50 relative overflow-hidden transition-all ease-[cubic-bezier(0.33,1,0.68,1)]"
                    style={{ 
                        height: animationsStarted ? '16%' : '0%', 
                        transitionDuration: prefersReducedMotion ? '0s' : '1000ms' 
                    }}
                 >
                    {/* Subtle inner gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent"></div>
                 </div>
             </div>

             {/* Investing Bar (Right) */}
             <div className="flex flex-col items-center justify-end w-28 h-full group relative">
                 {/* Tooltip */}
                 <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                    Investing — Rs 6 Cr (Est.)
                 </div>

                 {/* Value Label */}
                 <div className={`mb-3 text-center transition-all duration-300 ease-out transform ${showLabels ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'}`}>
                     <span className="block text-xs font-semibold text-orange-600 uppercase tracking-wide mb-1">Investing</span>
                     <span className="block text-2xl font-extrabold text-gray-900 drop-shadow-sm">₹6 Cr</span>
                 </div>

                 {/* Bar */}
                 <div 
                    className={`w-full bg-gradient-to-t from-orange-500 to-yellow-400 rounded-t-2xl shadow-[0_10px_30px_-10px_rgba(249,115,22,0.4)] relative overflow-hidden flex items-start justify-center transition-all ease-[cubic-bezier(0.33,1,0.68,1)] ${prefersReducedMotion && 'shadow-[0_0_15px_rgba(251,146,60,0.6)]'}`}
                    style={{ 
                        height: showInvestingBar ? '100%' : '0%',
                        transitionDuration: prefersReducedMotion ? '0s' : '1200ms'
                    }}
                 >
                     {/* Gloss highlight */}
                     <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 via-transparent to-transparent pointer-events-none"></div>
                     <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-black/5 to-transparent pointer-events-none"></div>
                 </div>
             </div>
         </div>

         {/* Disclaimer */}
         <p className="text-[11px] text-center text-[#9a9491] font-medium max-w-xs leading-tight mx-auto mb-8">
             Based on Rs 1 Cr over 30 years, with a savings rate of 1% and a market return rate of 10.26%. Past performance is not a guarantee of future returns.
         </p>
         
         {/* Helper Line */}
         <p className="text-sm font-semibold text-gray-800 text-center mb-2">
            Investing is the most powerful way to grow your money.
         </p>

      </div>

      {/* Bottom CTA */}
      <div className="absolute bottom-0 left-0 w-full p-6 pb-10 bg-gradient-to-t from-white via-white/90 to-transparent z-20">
         <div className="max-w-md mx-auto">
            <Button 
               onClick={handleContinue}
               className="w-[85%] mx-auto block rounded-full py-4 text-lg transition-all shadow-xl shadow-orange-500/20 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-gray-900 font-extrabold tracking-wide border-none"
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