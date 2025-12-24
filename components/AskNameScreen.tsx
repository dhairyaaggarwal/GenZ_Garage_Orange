
import React, { useState, useEffect, useRef } from 'react';
import { Button } from './Button';
import { CircularHeader } from './CircularHeader';
import { Mic, Volume2 } from 'lucide-react';
import { setValue, persistOnboardingState } from '../utils/onboardingState';

interface AskNameScreenProps {
  onContinue: () => void;
  onJumpToStep?: (step: number) => void;
}

const VOICE_TEXT = "I am so excited to help you! To get us moving, what’s your first name?";
const ELEVEN_LABS_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; 

export const AskNameScreen: React.FC<AskNameScreenProps> = ({ onContinue, onJumpToStep }) => {
  const [name, setName] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasPlayedRef = useRef(false);

  const playVoice = async () => {
    setIsPlaying(true);
    const apiKey = (window as any).ELEVEN_LABS_API_KEY || process.env.ELEVEN_LABS_API_KEY;
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
        console.warn("ElevenLabs failed");
      }
    }

    if (!audio) {
      const utterance = new SpeechSynthesisUtterance(VOICE_TEXT);
      utterance.rate = 1.15; 
      utterance.pitch = 1.1;
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      audio.onended = () => setIsPlaying(false);
      audio.play().catch(() => setIsPlaying(false));
    }
  };

  useEffect(() => {
    if (!hasPlayedRef.current) {
      setTimeout(playVoice, 800);
      hasPlayedRef.current = true;
    }
    return () => window.speechSynthesis.cancel();
  }, []);

  const handleContinue = () => {
    if (name.trim()) {
      setValue('first_name', name.trim());
      persistOnboardingState();
      window.speechSynthesis.cancel();
      onContinue();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filteredValue = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    setName(filteredValue);
  };

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-brand-bg font-sans">
      <CircularHeader currentStep={1} totalSteps={5} onJumpToStep={onJumpToStep} />
      <div className="flex-1 flex flex-col items-center px-6 z-10 w-full max-w-md mx-auto mt-12">
         <h1 className="text-4xl text-brand-text text-center font-black mb-12 leading-tight tracking-tight">
           What's your <br/> <span className="italic text-brand-secondary font-serif">first name?</span>
         </h1>
         <div className="w-full relative mb-8">
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={handleInputChange}
              placeholder="E.g. Priya"
              autoFocus
              className="w-full bg-white px-8 py-5 rounded-[2.5rem] text-2xl text-brand-text placeholder-brand-muted border-2 border-brand-card focus:border-brand-secondary focus:outline-none transition-all text-center shadow-sm"
            />
            <button className="absolute right-6 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-secondary p-2">
              <Mic size={24} />
            </button>
         </div>
         <div className="flex items-center gap-3 text-brand-subtext font-bold text-sm bg-white/50 px-6 py-2.5 rounded-full border border-brand-card shadow-sm">
            <span>Buddy wants to know!</span>
            <button 
              onClick={() => {
                window.speechSynthesis.cancel();
                playVoice();
              }} 
              className={`${isPlaying ? 'text-brand-secondary' : 'text-brand-muted hover:text-brand-text'} transition-colors`}
              aria-label="Replay Buddy's voice"
            >
               <Volume2 size={22} className={isPlaying ? 'animate-pulse' : ''} />
            </button>
         </div>
      </div>
      <div className="pb-16 px-6 w-full flex justify-center z-20">
         <Button onClick={handleContinue} disabled={!name.trim()} className="w-[85%] py-4 text-xl shadow-xl shadow-brand-primary/20">
           Continue
         </Button>
      </div>
    </div>
  );
};
