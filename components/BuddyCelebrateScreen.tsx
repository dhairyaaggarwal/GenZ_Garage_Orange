import React, { useEffect, useState, useRef } from 'react';
import { Button } from './Button';
import { persistOnboardingState } from '../utils/onboardingState';

interface BuddyCelebrateScreenProps {
  onContinue: () => void;
}

const ELEVEN_LABS_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; 
const CAPTION_FULL = "Way to go! We have all we need to put together your plan. Can't wait to watch you soar and hit those financial goals.";

// Split text into two distinct segments to show one at a time
const SEGMENT_1 = "Way to go! We have all we need to put together your plan.";
const SEGMENT_2 = "Can't wait to watch you soar and hit those financial goals.";

const WORDS_SEGMENT_1 = SEGMENT_1.split(' ');
const WORDS_SEGMENT_2 = SEGMENT_2.split(' ');
const ALL_WORDS = [...WORDS_SEGMENT_1, ...WORDS_SEGMENT_2];
const SEGMENT_SPLIT_INDEX = WORDS_SEGMENT_1.length;

export const BuddyCelebrateScreen: React.FC<BuddyCelebrateScreenProps> = ({ onContinue }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);
  const [activeSegment, setActiveSegment] = useState<number>(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const stopTTS = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    clearHighlightTimers();
  };

  const clearHighlightTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setHighlightIndex(-1);
    setActiveSegment(0); // Reset to first segment on stop
  };

  const playTTS = async () => {
    stopTTS(); // Stop existing playback
    setIsPlaying(true);
    
    const apiKey = process.env.ELEVEN_LABS_API_KEY;
    let audio: HTMLAudioElement | null = null;
    let durationMs = ALL_WORDS.length * 280; // Fallback duration

    if (apiKey) {
      try {
        const response = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_LABS_VOICE_ID}`, 
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'xi-api-key': apiKey },
            body: JSON.stringify({
              text: CAPTION_FULL,
              model_id: "eleven_monolingual_v1",
              voice_settings: { stability: 0.5, similarity_boost: 0.75 }
            })
          }
        );
        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          audio = new Audio(url);
          audioRef.current = audio;

          // Attempt to get real duration from metadata
          await new Promise((resolve) => {
             audio!.onloadedmetadata = () => {
                if (audio!.duration && audio!.duration !== Infinity) {
                   durationMs = audio!.duration * 1000;
                }
                resolve(true);
             };
             // Safety timeout
             setTimeout(() => resolve(true), 1000);
          });
        }
      } catch (e) {
        console.warn("ElevenLabs failed");
      }
    }

    // Schedule Word Highlights
    if (!prefersReducedMotion) {
      const wordDuration = Math.max(120, Math.floor(durationMs / ALL_WORDS.length));
      
      ALL_WORDS.forEach((_, i) => {
        const start = i * wordDuration;
        const tStart = setTimeout(() => {
          setHighlightIndex(i);
        }, start);
        timersRef.current.push(tStart);
      });

      // Clear highlight slightly after estimated duration
      const tEnd = setTimeout(() => {
          setHighlightIndex(-1);
          setIsPlaying(false);
      }, durationMs + 200);
      timersRef.current.push(tEnd);
    } else {
      // For reduced motion, just manage playing state duration
      const tEnd = setTimeout(() => {
        setIsPlaying(false);
      }, durationMs);
      timersRef.current.push(tEnd);
    }

    // Play Audio
    if (!audio) {
      // Fallback: Browser Speech Synthesis
      const utterance = new SpeechSynthesisUtterance(CAPTION_FULL);
      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find(v => v.name.includes("Natural") || v.name.includes("Google US English"));
      if (naturalVoice) utterance.voice = naturalVoice;
      utterance.rate = 1.1; 
      utterance.onend = () => {
        setIsPlaying(false);
        setHighlightIndex(-1);
      };
      window.speechSynthesis.speak(utterance);
    } else {
      audio.onended = () => {
        setIsPlaying(false);
        setHighlightIndex(-1);
        audioRef.current = null;
      };
      audio.play().catch(() => setIsPlaying(false));
    }
  };

  // Sync active segment with highlight index
  useEffect(() => {
    if (highlightIndex >= SEGMENT_SPLIT_INDEX) {
      setActiveSegment(1);
    } else if (highlightIndex >= 0) {
      setActiveSegment(0);
    }
  }, [highlightIndex]);

  useEffect(() => {
    playTTS();
    return () => stopTTS();
  }, []);

  const handleContinue = () => {
    stopTTS();
    persistOnboardingState();
    onContinue();
  };

  // Accessibility: Replay logic
  const handleReplay = () => {
    playTTS();
  };

  // Long press detection for replay
  const startLongPress = () => {
    longPressTimerRef.current = setTimeout(() => {
        handleReplay();
    }, 600);
  };

  const endLongPress = () => {
    if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
    }
  };

  // Determine which words to display based on active segment
  const currentWords = activeSegment === 0 ? WORDS_SEGMENT_1 : WORDS_SEGMENT_2;
  const globalStartIndex = activeSegment === 0 ? 0 : SEGMENT_SPLIT_INDEX;

  return (
    <div 
      className="flex-1 flex flex-col h-full relative overflow-hidden bg-gradient-to-br from-[#ffedd5] via-[#fdba74] to-[#fca5a5] font-sans select-none"
      onMouseDown={startLongPress}
      onMouseUp={endLongPress}
      onTouchStart={startLongPress}
      onTouchEnd={endLongPress}
    >
      
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-white/20 pointer-events-none mix-blend-overlay"></div>

      {/* Header with Centered Logo */}
      <header className="pt-12 pb-6 flex justify-center w-full z-20 relative">
        <div className="flex items-center gap-2">
           <svg viewBox="0 0 100 100" className="w-10 h-10 shrink-0 drop-shadow-sm">
             <path d="M50 25 C 50 25 65 5 85 15 C 85 15 75 35 50 35" fill="#65a30d" />
             <path d="M50 25 C 50 25 35 5 15 15 C 15 15 25 35 50 35" fill="#4d7c0f" />
             <circle cx="50" cy="60" r="35" fill="url(#orangeGradCel)" />
             <ellipse cx="35" cy="50" rx="10" ry="5" transform="rotate(-45 35 50)" fill="white" fillOpacity="0.3" />
             <defs>
               <linearGradient id="orangeGradCel" x1="20" y1="20" x2="80" y2="90" gradientUnits="userSpaceOnUse">
                 <stop offset="0%" stopColor="#fb923c" />
                 <stop offset="100%" stopColor="#ea580c" />
               </linearGradient>
             </defs>
           </svg>
           <span className="font-bold text-2xl text-gray-900 tracking-tight">Orange</span>
        </div>
      </header>

      {/* Yellow Gradient Voice Indicator (Near Header) */}
      <div className={`absolute top-28 left-0 w-full flex justify-center transition-opacity duration-300 pointer-events-none ${isPlaying ? 'opacity-100' : 'opacity-0'}`}>
         <div className="h-1 w-24 bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-pulse rounded-full" />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 z-10 w-full max-w-md mx-auto relative">
        
        {/* Buddy Orb - Updated to look like a glowing sun/yolk */}
        <div className="relative mb-16 animate-in fade-in duration-500 zoom-in-95">
           {/* Outer Glows */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] bg-orange-300/20 rounded-full blur-[60px] animate-pulse"></div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-yellow-200/30 rounded-full blur-[40px] animate-pulse delay-150"></div>
           
           {/* The Core Orb */}
           <div className="w-40 h-40 rounded-full relative z-10 flex items-center justify-center shadow-[0_20px_50px_rgba(234,88,12,0.3)] animate-[float_6s_ease-in-out_infinite]">
              {/* Radial Gradient Background */}
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,#fef08a_0%,#fbbf24_40%,#f97316_80%,#ea580c_100%)]"></div>
              
              {/* Inner Rim Highlight (Top Left) */}
              <div className="absolute inset-0 rounded-full shadow-[inset_2px_2px_12px_rgba(255,255,255,0.6)]"></div>
              
              {/* Distinct Outer Ring */}
              <div className="absolute -inset-1 rounded-full border border-white/30 bg-transparent"></div>
              <div className="absolute -inset-3 rounded-full border border-orange-300/20 bg-transparent"></div>
           </div>
        </div>

        {/* Caption Area - Showing only current segment (2 lines max visually) */}
        <div className="text-center w-full max-w-[95%] mb-8 min-h-[80px] flex items-center justify-center" aria-label={CAPTION_FULL}>
            <div className="block text-2xl md:text-3xl font-medium text-gray-900 leading-tight tracking-wide transition-all duration-300">
              {currentWords.map((word, i) => {
                const globalIndex = globalStartIndex + i;
                const isActive = globalIndex === highlightIndex;
                const showHighlight = isActive && !prefersReducedMotion;
                
                return (
                  <span key={globalIndex} className="relative inline-block mx-[3px] py-1">
                    {/* Gradient Blurb Overlay */}
                    <span 
                      className={`absolute inset-0 -mx-1 -my-0.5 rounded-lg transition-opacity duration-[150ms] ease-out ${showHighlight ? 'opacity-100' : 'opacity-0'}`}
                      style={{ background: 'linear-gradient(90deg, #fcd34d 0%, #fbbf24 100%)', zIndex: -1 }}
                    />
                    {/* Text */}
                    <span className={`relative z-10 transition-colors duration-200 ${isActive ? 'text-gray-900 font-bold' : 'text-gray-800'}`}>
                      {word}
                    </span>
                  </span>
                );
              })}
            </div>
        </div>

      </div>

      {/* Bottom CTA */}
      <div className="pb-12 px-6 w-full flex justify-center z-20">
         <Button 
           onClick={handleContinue}
           className="w-[85%] rounded-full py-4 text-lg hover:scale-[1.02] transition-transform shadow-xl shadow-orange-500/20 bg-gradient-to-r from-orange-500 to-yellow-500 text-gray-900 font-bold border-none"
         >
           Continue
         </Button>
      </div>

      {/* Accessibility Controls */}
      <button 
        onClick={handleReplay} 
        className="sr-only" 
        aria-label="Replay Buddy audio"
      >
        Replay Audio
      </button>

      {/* Accessibility Announcement */}
      <div aria-live="polite" className="sr-only">
        {isPlaying ? `Buddy is speaking: ${activeSegment === 0 ? SEGMENT_1 : SEGMENT_2}` : "Audio ended."}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};