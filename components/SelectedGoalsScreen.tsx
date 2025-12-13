import React, { useEffect, useRef, useState } from 'react';
import { Button } from './Button';
import { CircularHeader } from './CircularHeader';

interface SelectedGoalsScreenProps {
  selectedGoalIds: string[];
  onContinue: () => void;
}

// Mapping IDs to Display Text & Emoji
const GOAL_DISPLAY_MAP: Record<string, { text: string; emoji: string }> = {
  house: { text: 'Buy a house', emoji: '🏡' },
  work_less: { text: 'Work less', emoji: '⏳' },
  retire: { text: 'Retire early', emoji: '🌅' },
  financial_freedom: { text: 'Be financially independent', emoji: '💸' },
  school: { text: 'Pay for school', emoji: '🎓' },
  unknown: { text: 'I don’t know yet', emoji: '🤔' },
};

// Mapping IDs to Voice Lines
const VOICE_LINES: Record<string, string> = {
  retire: "Early retirement — heck, who doesn’t want that?",
  house: "Buying a house — love that goal! It’s a big milestone, and I’ll help you get there.",
  school: "Paying for school can feel overwhelming — but I’ve got your back.",
  work_less: "Work less — more time for the things you love. Love that.",
  financial_freedom: "Financial independence — powerful choice. Let’s build toward it.",
  unknown: "Not sure yet? No worries — we’ll explore options together.",
};

// Using "Rachel" - High energy, clear
const ELEVEN_LABS_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; 

export const SelectedGoalsScreen: React.FC<SelectedGoalsScreenProps> = ({ selectedGoalIds, onContinue }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const hasPlayedRef = useRef(false);

  // --- Generate Single Voice Line based on FIRST selection ---
  const generateVoiceText = () => {
    // Determine the first goal the user selected
    // Note: selectedGoalIds preserves insertion order from previous screen
    const firstSelectedId = selectedGoalIds.length > 0 ? selectedGoalIds[0] : 'unknown';
    
    // Return mapped line or default fallback
    return VOICE_LINES[firstSelectedId] || VOICE_LINES['unknown'];
  };

  const voiceText = useRef(generateVoiceText()).current;

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
              text: voiceText,
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
      const utterance = new SpeechSynthesisUtterance(voiceText);
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
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      onContinue();
  };

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-gradient-to-br from-orange-400 via-rose-300 to-orange-200 font-sans">
      
      {/* Background elements - No particles */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>

      {/* Header with Circular Progress (Step 2 of 4) */}
      <CircularHeader currentStep={2} totalSteps={4} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center px-6 z-10 w-full max-w-md mx-auto mt-6 overflow-y-auto no-scrollbar pb-32">
         
         {/* Title */}
         <h1 className="text-3xl font-bold text-gray-900 text-center mb-6 leading-tight drop-shadow-sm">
           Nice choices — here’s what you picked
         </h1>

         {/* Voice Activity Indicator - Shows ONLY when speaking */}
         <div className="h-6 mb-8 flex items-center justify-center min-h-[24px]">
            {isPlaying && (
              <div className="flex items-center gap-1">
                 <div className="w-8 h-[2px] bg-yellow-300 animate-pulse"></div>
                 <div className="flex items-end gap-[3px] h-4">
                    <div className="w-[3px] bg-yellow-300 rounded-full animate-[bounce_0.8s_infinite] h-2"></div>
                    <div className="w-[3px] bg-yellow-300 rounded-full animate-[bounce_0.8s_infinite_0.1s] h-4"></div>
                    <div className="w-[3px] bg-yellow-300 rounded-full animate-[bounce_0.8s_infinite_0.2s] h-3"></div>
                    <div className="w-[3px] bg-yellow-300 rounded-full animate-[bounce_0.8s_infinite_0.15s] h-2"></div>
                 </div>
                 <div className="w-8 h-[2px] bg-yellow-300 animate-pulse"></div>
              </div>
            )}
         </div>

         {/* Selected Goals Display */}
         <div className="w-full grid gap-3">
           {selectedGoalIds.map((id) => {
             const display = GOAL_DISPLAY_MAP[id];
             if (!display) return null;
             return (
               <div 
                 key={id}
                 className="w-full bg-white/90 backdrop-blur-md p-5 rounded-[1.5rem] flex items-center justify-between shadow-lg shadow-orange-900/5 animate-in slide-in-from-bottom-3 fade-in duration-500"
               >
                 <span className="text-lg font-bold text-gray-800">
                   {display.text}
                 </span>
                 <span className="text-2xl filter drop-shadow-sm">{display.emoji}</span>
               </div>
             );
           })}
         </div>

      </div>

      {/* Bottom CTA */}
      <div className="absolute bottom-0 left-0 w-full p-6 pb-10 bg-gradient-to-t from-rose-300 via-rose-300/90 to-transparent z-20">
         <div className="max-w-md mx-auto">
            <Button 
               onClick={handleContinue}
               className="w-[85%] mx-auto block rounded-full py-4 text-lg transition-all shadow-xl shadow-orange-900/20 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-gray-900 font-extrabold tracking-wide border-none"
            >
               Continue
            </Button>
         </div>
      </div>
    </div>
  );
};