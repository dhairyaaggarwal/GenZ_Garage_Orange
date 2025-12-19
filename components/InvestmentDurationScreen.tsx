import React, { useEffect, useState, useRef } from 'react';
import { Button } from './Button';
import { CircularHeader } from './CircularHeader';

interface InvestmentDurationScreenProps {
  onContinue: (duration: string) => void;
}

const DURATION_OPTIONS = [
  { id: "5_years", label: "5 years" },
  { id: "10_years", label: "10 years" },
  { id: "20_years", label: "20 years" },
  { id: "30_years", label: "30 years" },
  { id: "30plus_years", label: "30+ years" }
];

const ELEVEN_LABS_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; 
const VOICE_TEXT = "How long do you think you want to invest your money for? Short-term gains can be sweet, but thinking long-term is where the real magic happens.";

export const InvestmentDurationScreen: React.FC<InvestmentDurationScreenProps> = ({ onContinue }) => {
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const hasPlayedRef = useRef(false);

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
        console.warn("ElevenLabs failed");
      }
    }

    if (!audio) {
      const utterance = new SpeechSynthesisUtterance(VOICE_TEXT);
      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find(v => v.name.includes("Natural") || v.name.includes("Google US English"));
      if (naturalVoice) utterance.voice = naturalVoice;
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
    setTimeout(playVoice, 500);
    return () => { 
        window.speechSynthesis.cancel();
        setIsPlaying(false);
    };
  }, []);

  const handleContinue = () => {
    if (selectedDuration) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      onContinue(selectedDuration);
    }
  };

  const handleSelection = (id: string) => {
    setSelectedDuration(id);
  };

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-gradient-to-br from-orange-50 via-orange-100 to-rose-100 font-sans">
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
      <CircularHeader currentStep={4} totalSteps={5} />
      <div className="absolute top-[5.5rem] left-0 w-full flex justify-center pointer-events-none z-20">
        <div className={`transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex items-center gap-1 h-4">
                <div className="w-0.5 bg-yellow-400 rounded-full animate-[bounce_1s_infinite] h-2"></div>
                <div className="w-0.5 bg-yellow-400 rounded-full animate-[bounce_1s_infinite_0.1s] h-3"></div>
                <div className="w-0.5 bg-yellow-400 rounded-full animate-[bounce_1s_infinite_0.2s] h-2"></div>
            </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center px-6 z-10 w-full max-w-md mx-auto mt-6 overflow-hidden">
         <h1 className="text-3xl text-gray-900 text-center mb-6 leading-tight drop-shadow-sm shrink-0">
           <span className="font-bold">How long do you</span> <br/> <span className="italic font-serif">plan to invest?</span>
         </h1>
         <div className="w-full flex-1 overflow-y-auto no-scrollbar pb-32 space-y-3">
           {DURATION_OPTIONS.map((option) => {
             const isSelected = selectedDuration === option.id;
             return (
               <button key={option.id} onClick={() => handleSelection(option.id)} className={`w-full p-4 rounded-2xl flex items-center justify-center transition-all duration-200 font-bold text-lg border-2 shadow-sm ${isSelected ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-gray-900 border-transparent scale-[1.02] shadow-orange-500/20' : 'bg-white/80 backdrop-blur-sm border-transparent text-gray-700 hover:bg-white hover:scale-[1.01]'}`} aria-label={option.label} aria-pressed={isSelected}>
                 {option.label}
               </button>
             );
           })}
         </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full p-6 pb-10 bg-gradient-to-t from-white via-white/90 to-transparent z-20">
         <div className="max-w-md mx-auto">
            <Button onClick={handleContinue} disabled={!selectedDuration} className="w-[85%] mx-auto block rounded-full py-4 text-lg transition-all shadow-xl shadow-orange-500/20 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-gray-900 font-extrabold tracking-wide border-none disabled:opacity-50 disabled:cursor-not-allowed">
               Continue
            </Button>
         </div>
      </div>
    </div>
  );
};