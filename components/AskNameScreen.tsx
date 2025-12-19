import React, { useState, useEffect, useRef } from 'react';
import { Button } from './Button';
import { CircularHeader } from './CircularHeader';
import { Mic, Volume2 } from 'lucide-react';
import { setValue, persistOnboardingState } from '../utils/onboardingState';

interface AskNameScreenProps {
  onContinue: () => void;
}

const ELEVEN_LABS_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; 
const VOICE_TEXT = "To get started, what’s your first name?";

export const AskNameScreen: React.FC<AskNameScreenProps> = ({ onContinue }) => {
  const [name, setName] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const playVoice = async () => {
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
        console.warn("ElevenLabs failed");
      }
    }

    if (!audio) {
      const utterance = new SpeechSynthesisUtterance(VOICE_TEXT);
      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find(v => v.name.includes("Natural") || v.name.includes("Google US English"));
      if (naturalVoice) utterance.voice = naturalVoice;
      utterance.rate = 1.1;
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      audio.onended = () => setIsPlaying(false);
      audio.play().catch(() => setIsPlaying(false));
    }
  };

  useEffect(() => {
    setTimeout(playVoice, 500);
    return () => { window.speechSynthesis.cancel(); };
  }, []);

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = 'en-US';
      recognition.start();
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        const firstName = transcript.split(' ')[0];
        setName(firstName);
      };
    }
  };

  const handleContinue = () => {
    if (name.trim()) {
      setValue('firstName', name.trim());
      persistOnboardingState();
      onContinue();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-gradient-to-br from-orange-300 via-orange-200 to-rose-300 font-sans">
      <CircularHeader currentStep={1} totalSteps={5} />
      <div className="flex-1 flex flex-col items-center px-6 z-10 w-full max-w-md mx-auto mt-8">
         <h1 className="text-4xl text-gray-900 text-center mb-10 leading-tight drop-shadow-sm">
           <span className="font-bold">What's your</span> <br/> <span className="italic font-serif font-light text-gray-800">first name?</span>
         </h1>
         <div className="w-[85%] relative mb-6">
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="First name"
              autoFocus
              className="w-full bg-white/90 backdrop-blur-md px-6 py-4 rounded-full text-xl text-gray-900 placeholder-gray-400 border-2 border-transparent focus:border-orange-400 focus:outline-none shadow-lg shadow-orange-900/5 transition-all text-center"
            />
            <button onClick={startListening} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-600 transition-colors p-2">
              <Mic size={20} />
            </button>
         </div>
         <div className="flex items-center gap-2 text-gray-800/60 font-medium text-sm">
            <span>To get started, what’s your first name?</span>
            <button onClick={playVoice} className={`${isPlaying ? 'text-orange-600' : 'text-gray-500 hover:text-orange-600'}`}>
               <Volume2 size={16} className={isPlaying ? 'animate-pulse' : ''} />
            </button>
         </div>
      </div>
      <div className="pb-10 px-6 w-full flex justify-center z-20">
         <Button onClick={handleContinue} disabled={!name.trim()} className="w-[85%] rounded-full py-4 text-lg hover:scale-[1.02] transition-transform shadow-xl shadow-orange-500/20 bg-gradient-to-r from-orange-500 to-yellow-500 text-gray-900 font-bold border-none disabled:opacity-50 disabled:cursor-not-allowed">
           Continue
         </Button>
      </div>
    </div>
  );
};