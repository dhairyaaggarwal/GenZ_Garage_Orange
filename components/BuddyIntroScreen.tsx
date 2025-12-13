import React, { useEffect, useState, useRef } from 'react';
import { Button } from './Button';

interface BuddyIntroScreenProps {
  onContinue: () => void;
  onJumpToStep: (step: number) => void;
}

const segments = [
  "Hey, I'm Buddy! Your new financial bestie and guide.",
  "Welcome to Orange, the app that's all about making your money work for you.",
  "I'll be here to make investing simple, fun, and stress-free."
];

// Using "Rachel" - High energy, clear, classic narrator/assistant voice
const ELEVEN_LABS_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; 

export const BuddyIntroScreen: React.FC<BuddyIntroScreenProps> = ({ onContinue, onJumpToStep }) => {
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState<number>(0);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);
  const hasStartedRef = useRef(false);
  
  // Track if we are strictly using fallback (Synthesis) to avoid mixed voices
  const [useFallbackMode, setUseFallbackMode] = useState<boolean>(false);
  const [voicesLoaded, setVoicesLoaded] = useState<boolean>(false);

  // Load voices explicitly for browsers that load them async (like Chrome)
  useEffect(() => {
    const handleVoicesChanged = () => {
      setVoicesLoaded(true);
    };
    
    window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
    // Check if voices are already loaded
    if (window.speechSynthesis.getVoices().length > 0) {
      setVoicesLoaded(true);
    }

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const getPreferredVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return null;

    // To avoid robotic sounds, prefer "Google", "Microsoft" or "Natural" voices over generic system ones.
    const naturalVoice = voices.find(v => v.name.includes("Natural") || v.name.includes("Google US English"));
    if (naturalVoice) return naturalVoice;

    // High quality common voices
    const hqVoice = voices.find(v => v.name.includes("Samantha") || v.name.includes("Daniel") || v.name.includes("Microsoft Zira"));
    return hqVoice || voices[0];
  };

  // Fetch Audio using ElevenLabs
  const fetchElevenLabsAudio = async (text: string): Promise<HTMLAudioElement> => {
    const apiKey = process.env.ELEVEN_LABS_API_KEY;
    if (!apiKey) throw new Error("No API Key");

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_LABS_VOICE_ID}`, 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_monolingual_v1",
          // High stability for consistency, slightly boosted similarity for clarity
          voice_settings: { stability: 0.5, similarity_boost: 0.75 }
        })
      }
    );

    if (!response.ok) throw new Error("API Request Failed");

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    return new Audio(url);
  };

  useEffect(() => {
    const preload = async () => {
      // If we already decided to use fallback or don't have an API key, skip fetching
      if (!process.env.ELEVEN_LABS_API_KEY) {
        setUseFallbackMode(true);
        setIsAudioLoaded(true);
        return;
      }

      const audios: (HTMLAudioElement | null)[] = [];
      let failureCount = 0;

      for (const text of segments) {
        try {
          const audio = await fetchElevenLabsAudio(text);
          audios.push(audio);
        } catch (e) {
          console.warn("Audio fetch failed for segment, switching to fallback.");
          failureCount++;
          audios.push(null);
        }
      }

      // If any segment failed, force fallback for ALL to ensure consistency
      if (failureCount > 0) {
        setUseFallbackMode(true);
      } else {
        audioRefs.current = audios;
      }
      
      setIsAudioLoaded(true);
    };

    preload();

    return () => {
      audioRefs.current.forEach(a => { if (a) a.pause(); });
      window.speechSynthesis.cancel();
    };
  }, []);

  // Playback Logic
  useEffect(() => {
    // Wait for audio decision (loaded) AND voices to be ready if we are in fallback mode
    if (!isAudioLoaded || (useFallbackMode && !voicesLoaded)) return;
    if (hasStartedRef.current) return;
    
    hasStartedRef.current = true;

    const playSegment = async (index: number) => {
      if (index >= segments.length) {
        setTimeout(onContinue, 1000);
        return;
      }

      setCurrentSegmentIndex(index);

      if (!useFallbackMode && audioRefs.current[index]) {
        // --- Strategy A: ElevenLabs Audio ---
        const audio = audioRefs.current[index]!;
        audio.onended = () => setTimeout(() => playSegment(index + 1), 400);
        try {
          await audio.play();
        } catch (e) {
          // If autoplay blocks, just move on
          setTimeout(() => playSegment(index + 1), 3000);
        }
      } else {
        // --- Strategy B: Browser Speech Synthesis (High Energy) ---
        const utterance = new SpeechSynthesisUtterance(segments[index]);
        const voice = getPreferredVoice();
        
        if (voice) {
          utterance.voice = voice;
          utterance.lang = voice.lang;
        }

        // TUNING FOR ENERGY:
        // Rate: > 1.0 makes it sound faster and more excited.
        // Pitch: > 1.0 makes it sound brighter/younger.
        utterance.rate = 1.15; 
        utterance.pitch = 1.2; 
        utterance.volume = 1.0;

        utterance.onend = () => {
           setTimeout(() => playSegment(index + 1), 400);
        };
        
        const safetyTimeout = setTimeout(() => {
           if (window.speechSynthesis.speaking) {
             window.speechSynthesis.cancel();
             playSegment(index + 1);
           }
        }, 8000);

        utterance.onend = () => {
          clearTimeout(safetyTimeout);
          setTimeout(() => playSegment(index + 1), 400);
        };

        window.speechSynthesis.speak(utterance);
      }
    };

    // Tiny delay to ensure UI is rendered
    setTimeout(() => playSegment(0), 500);

  }, [isAudioLoaded, useFallbackMode, voicesLoaded, onContinue]);

  const handleManualContinue = () => {
    audioRefs.current.forEach(a => a && a.pause());
    window.speechSynthesis.cancel();
    onContinue();
  };

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-gradient-to-br from-orange-200 via-rose-200 to-orange-100 font-sans">
      
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 via-rose-400/10 to-transparent animate-gradient-xy opacity-70"></div>

      {/* Atmospheric White Glow Circles */}
      <div className="absolute top-[5%] left-[10%] w-64 h-64 bg-white/30 rounded-full blur-[80px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[25%] right-[-10%] w-80 h-80 bg-white/20 rounded-full blur-[90px] pointer-events-none"></div>

      {/* Header with Centered Logo */}
      <header className="px-6 pt-12 pb-6 flex flex-col items-center w-full z-20 relative gap-6">
        <div className="flex items-center gap-2">
           <svg viewBox="0 0 100 100" className="w-8 h-8 shrink-0 drop-shadow-sm">
             <path d="M50 25 C 50 25 65 5 85 15 C 85 15 75 35 50 35" fill="#65a30d" />
             <path d="M50 25 C 50 25 35 5 15 15 C 15 15 25 35 50 35" fill="#4d7c0f" />
             <circle cx="50" cy="60" r="35" fill="url(#orangeGradBuddy)" />
             <ellipse cx="35" cy="50" rx="10" ry="5" transform="rotate(-45 35 50)" fill="white" fillOpacity="0.3" />
             <defs>
               <linearGradient id="orangeGradBuddy" x1="20" y1="20" x2="80" y2="90" gradientUnits="userSpaceOnUse">
                 <stop offset="0%" stopColor="#fb923c" />
                 <stop offset="100%" stopColor="#ea580c" />
               </linearGradient>
             </defs>
           </svg>
           <span className="font-bold text-xl text-gray-900 tracking-tight">Orange</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 z-10 w-full max-w-md mx-auto">
        
        {/* Animated Orb - Energy Pulse */}
        <div className="relative mb-12 transform transition-transform duration-700 hover:scale-105">
           {/* Outer Glow Halo */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-orange-400/30 rounded-full blur-2xl animate-[pulse_2s_ease-in-out_infinite]"></div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-yellow-400/20 rounded-full blur-xl animate-[pulse_1.5s_ease-in-out_infinite_reverse]"></div>
           
           {/* Core Orb */}
           <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 via-orange-400 to-rose-500 shadow-[0_0_50px_rgba(251,146,60,0.8)] animate-blob relative z-10 flex items-center justify-center ring-4 ring-white/20">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-orange-300/80 to-white/40 blur-[1px]"></div>
           </div>
        </div>

        {/* Text Area with Highlight Box */}
        <div className="w-full min-h-[160px] flex items-center justify-center relative">
          {segments.map((text, index) => (
             <div 
               key={index}
               className={`absolute w-full transition-all duration-300 ease-out transform ${
                 currentSegmentIndex === index 
                   ? 'opacity-100 translate-y-0 scale-100 blur-0' 
                   : 'opacity-0 translate-y-8 scale-95 blur-sm pointer-events-none'
               }`}
             >
               {/* The Rectangular Highlight Box */}
               <div className="bg-white/95 backdrop-blur-xl border border-white/60 p-6 rounded-2xl shadow-2xl shadow-orange-900/10 text-center relative overflow-hidden group mx-4">
                  {/* Decorative top accent bar */}
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 via-rose-400 to-yellow-400"></div>
                  
                  <p className="text-xl md:text-2xl text-gray-800 font-bold leading-relaxed tracking-tight mt-2">
                    {text}
                  </p>
               </div>
             </div>
          ))}
        </div>
        
      </div>

      {/* Bottom CTA */}
      <div className="pb-10 px-6 w-full flex justify-center z-20">
         <Button 
           onClick={handleManualContinue}
           className="w-[85%] rounded-full py-4 text-lg hover:scale-[1.02] transition-transform shadow-xl shadow-orange-500/20"
         >
           Let's Go!
         </Button>
      </div>
    </div>
  );
};