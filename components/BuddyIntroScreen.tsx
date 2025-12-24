
import React, { useEffect, useState, useRef } from 'react';
import { Button } from './Button';

interface BuddyIntroScreenProps {
  onContinue: () => void;
  onJumpToStep: (step: number) => void;
}

const INTRO_TEXT = "Hey there! I'm Buddy—your new financial bestie. Welcome to Orange, where we make your money work as hard as you do! I'm here to make this journey simple, fun, and totally stress-free. Let's get started!";

const DISPLAY_SEGMENTS = [
  "Hey, I'm Buddy! Your new financial bestie.",
  "Welcome to Orange, making your money work for you.",
  "I'll be here to make investing simple and stress-free."
];

const ELEVEN_LABS_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // Rachel - High energy

export const BuddyIntroScreen: React.FC<BuddyIntroScreenProps> = ({ onContinue, onJumpToStep }) => {
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const playVoice = async () => {
      setIsPlaying(true);
      const apiKey = (window as any).ELEVEN_LABS_API_KEY || process.env.ELEVEN_LABS_API_KEY;
      let audio: HTMLAudioElement | null = null;

      // Segment cycling logic synchronized with speech
      const cycleSegments = () => {
        let idx = 0;
        const interval = setInterval(() => {
          if (idx < DISPLAY_SEGMENTS.length - 1) {
            idx++;
            setCurrentSegmentIndex(idx);
          } else {
            clearInterval(interval);
          }
        }, 2200); // Rough timing match for ~6.5s total speech
      };

      if (apiKey) {
        try {
          const response = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_LABS_VOICE_ID}`, 
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'xi-api-key': apiKey },
              body: JSON.stringify({
                text: INTRO_TEXT,
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
          console.warn("ElevenLabs failed");
        }
      }

      if (!audio) {
        const utterance = new SpeechSynthesisUtterance(INTRO_TEXT);
        utterance.rate = 1.15; 
        utterance.pitch = 1.1;
        utterance.onstart = cycleSegments;
        utterance.onend = () => {
          setIsPlaying(false);
          setTimeout(onContinue, 1000);
        };
        window.speechSynthesis.speak(utterance);
      } else {
        audio.onplay = cycleSegments;
        audio.onended = () => {
          setIsPlaying(false);
          setTimeout(onContinue, 1000);
        };
        audio.play().catch(() => {
            setIsPlaying(false);
            setTimeout(onContinue, 1000);
        });
      }
    };

    setTimeout(playVoice, 1000);
    return () => window.speechSynthesis.cancel();
  }, [onContinue]);

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-brand-bg font-sans">
      <div className="absolute top-[10%] right-[10%] w-72 h-72 bg-brand-secondary/10 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[10%] left-[10%] w-80 h-80 bg-brand-tertiary/10 rounded-full blur-[100px] animate-pulse animation-delay-2000"></div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 z-10 w-full max-w-md mx-auto">
        {/* Sun Buddy Orb */}
        <div className="relative mb-16">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-brand-secondary/30 rounded-full blur-3xl animate-[pulse_2s_ease-in-out_infinite]"></div>
           <div className="w-32 h-32 rounded-full bg-gradient-to-br from-brand-secondary via-brand-primary to-brand-tertiary shadow-[0_0_50px_rgba(155,126,236,0.3)] animate-blob relative z-10 flex items-center justify-center border-4 border-white">
              <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm"></div>
           </div>
        </div>

        <div className="w-full min-h-[140px] flex items-center justify-center relative">
          {DISPLAY_SEGMENTS.map((text, index) => (
             <div 
               key={index}
               className={`absolute w-full transition-all duration-500 ease-out transform ${
                 currentSegmentIndex === index ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95 pointer-events-none'
               }`}
             >
               <div className="bg-white p-8 rounded-[40px] text-center relative overflow-hidden shadow-xl border-2 border-brand-card">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-secondary to-brand-tertiary"></div>
                  <p className="text-xl md:text-2xl text-brand-text font-black leading-relaxed tracking-tight">
                    {text}
                  </p>
               </div>
             </div>
          ))}
        </div>
      </div>

      <div className="pb-16 px-6 w-full flex justify-center z-20">
         <Button onClick={() => {
             window.speechSynthesis.cancel();
             onContinue();
         }} className="w-[85%] py-4 text-xl shadow-xl shadow-brand-primary/20">
           Continue
         </Button>
      </div>
    </div>
  );
};
