import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { CircularHeader } from './CircularHeader';

interface AgeConfirmScreenProps {
  onConfirm: (isOver18: boolean) => void;
}

const ELEVEN_LABS_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; 
const VOICE_TEXT = "Nice to meet ya! Are you older than 18? This is the legal age to start investing.";

export const AgeConfirmScreen: React.FC<AgeConfirmScreenProps> = ({ onConfirm }) => {
  const [isPlaying, setIsPlaying] = useState(false);

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

  const handleSelection = (isOver18: boolean) => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    onConfirm(isOver18);
  };

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-gradient-to-br from-orange-400 via-rose-300 to-orange-200 font-sans">
      <CircularHeader currentStep={1} totalSteps={5} />
      <div className="flex-1 flex flex-col items-center px-6 z-10 w-full max-w-md mx-auto mt-6">
         <h1 className="text-4xl text-gray-900 text-center mb-6 leading-tight drop-shadow-sm">
           <span className="font-bold">Are you</span> <br/> <span className="italic font-serif font-light">over 18?</span>
         </h1>
         <div className={`mb-10 text-center transition-all duration-300 ${isPlaying ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
             <span className="relative inline-block px-3 py-1">
                 <span className="absolute inset-0 bg-yellow-300/60 rounded-lg blur-sm animate-pulse"></span>
                 <span className="relative z-10 text-sm font-medium text-gray-900 leading-relaxed">
                   Nice to meet ya! Are you older than 18? <br/> This is the legal age to start investing.
                 </span>
             </span>
         </div>
         <div className="w-full space-y-4">
           <button onClick={() => handleSelection(true)} className="w-full bg-white/80 backdrop-blur-md border-2 border-white hover:border-orange-400 p-6 rounded-[2rem] flex items-center justify-between group transition-all duration-200 shadow-lg shadow-orange-900/5 hover:scale-[1.02] active:scale-95">
             <span className="text-2xl font-bold text-gray-800">Yes</span>
             <span className="text-3xl filter drop-shadow-sm">✅</span>
           </button>
           <button onClick={() => handleSelection(false)} className="w-full bg-white/80 backdrop-blur-md border-2 border-white hover:border-orange-400 p-6 rounded-[2rem] flex items-center justify-between group transition-all duration-200 shadow-lg shadow-orange-900/5 hover:scale-[1.02] active:scale-95">
             <span className="text-2xl font-bold text-gray-800">No</span>
             <span className="text-3xl filter drop-shadow-sm">⛔️</span>
           </button>
         </div>
      </div>
    </div>
  );
};