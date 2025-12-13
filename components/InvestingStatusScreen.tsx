import React, { useEffect, useState, useRef } from 'react';
import { Button } from './Button';
import { CircularHeader } from './CircularHeader';

interface InvestingStatusScreenProps {
  onContinue: (selectedStatus: string[]) => void;
}

// Option IDs mapped to Text & Emoji
const STATUS_OPTIONS = [
  { id: 'not_started', text: 'I haven’t started yet', emoji: '🥲' },
  { id: 'saving', text: 'I am saving', emoji: '💰' },
  { id: 'investing', text: 'I am investing', emoji: '📈' },
  { id: 'both', text: 'I am saving and investing', emoji: '🤑' },
];

// Using "Rachel" - High energy, clear
const ELEVEN_LABS_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; 
const VOICE_TEXT = "Are you currently investing or saving towards your financial goals?";

export const InvestingStatusScreen: React.FC<InvestingStatusScreenProps> = ({ onContinue }) => {
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const hasPlayedRef = useRef(false);

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
        console.warn("ElevenLabs failed");
      }
    }

    if (!audio) {
      // Fallback
      const utterance = new SpeechSynthesisUtterance(VOICE_TEXT);
      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find(v => v.name.includes("Natural") || v.name.includes("Google US English"));
      if (naturalVoice) utterance.voice = naturalVoice;
      utterance.rate = 1.15; 
      utterance.pitch = 1.2;
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
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      onContinue(selectedStatus);
  };

  const toggleOption = (id: string) => {
    if (selectedStatus.includes(id)) {
      setSelectedStatus(selectedStatus.filter(s => s !== id));
    } else {
      // Append to maintain order
      setSelectedStatus([...selectedStatus, id]);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-gradient-to-br from-orange-400 via-rose-300 to-purple-400 font-sans">
      
      {/* Background elements - No particles */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>

      {/* Header with Circular Progress (Step 4 of 4) */}
      <CircularHeader currentStep={4} totalSteps={4} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center px-6 z-10 w-full max-w-md mx-auto mt-6 overflow-y-auto no-scrollbar pb-32">
         
         {/* Title */}
         <h1 className="text-4xl text-gray-900 text-center mb-6 leading-tight drop-shadow-sm">
           <span className="font-bold">Are you currently</span> <br/> <span className="italic font-serif">investing or saving?</span>
         </h1>

         {/* Voice Activity Indicator */}
         <div className="h-8 mb-4 flex items-center justify-center min-h-[32px]">
            {isPlaying && (
              <div className="flex items-end gap-1 h-4 transition-opacity duration-300">
                 <div className="w-1 bg-yellow-300 rounded-full animate-[bounce_1s_infinite]"></div>
                 <div className="w-1 bg-yellow-300 rounded-full animate-[bounce_1s_infinite_0.1s] h-full"></div>
                 <div className="w-1 bg-yellow-300 rounded-full animate-[bounce_1s_infinite_0.2s]"></div>
                 <div className="w-1 bg-yellow-300 rounded-full animate-[bounce_1s_infinite_0.3s] h-3/4"></div>
              </div>
            )}
         </div>

         {/* Options List */}
         <div className="w-full space-y-3">
           {STATUS_OPTIONS.map((opt) => {
             const isSelected = selectedStatus.includes(opt.id);
             return (
               <button 
                 key={opt.id}
                 onClick={() => toggleOption(opt.id)}
                 className={`w-full p-5 rounded-[2rem] flex items-center justify-between group transition-all duration-200 border-2 shadow-lg shadow-orange-900/5 ${
                   isSelected 
                     ? 'bg-orange-500 border-orange-500 scale-[1.02] ring-2 ring-white/30' 
                     : 'bg-white/80 backdrop-blur-sm border-transparent hover:border-orange-300 hover:bg-white'
                 }`}
               >
                 <span className={`text-lg font-bold text-left ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                   {opt.text}
                 </span>
                 <span className="text-2xl filter drop-shadow-sm ml-2">{opt.emoji}</span>
               </button>
             );
           })}
         </div>

      </div>

      {/* Bottom CTA */}
      <div className="absolute bottom-0 left-0 w-full p-6 pb-10 bg-gradient-to-t from-purple-300/50 via-purple-200/50 to-transparent z-20">
         <div className="max-w-md mx-auto">
            <Button 
               onClick={handleContinue}
               disabled={selectedStatus.length === 0}
               className="w-[85%] mx-auto block rounded-full py-4 text-lg transition-all shadow-xl shadow-orange-900/20 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-gray-900 font-extrabold tracking-wide border-none"
            >
               Continue
            </Button>
         </div>
      </div>
    </div>
  );
};