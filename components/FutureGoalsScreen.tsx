import React, { useEffect, useState, useRef } from 'react';
import { Button } from './Button';
import { CircularHeader } from './CircularHeader';

interface FutureGoalsScreenProps {
  hasInvestedBefore: boolean;
  onContinue: (selectedGoals: string[]) => void;
}

// Using "Rachel" - High energy, clear
const ELEVEN_LABS_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; 

const goals = [
  { id: 'house', text: 'Buy a house', emoji: '🏡' },
  { id: 'work_less', text: 'Work less', emoji: '⏳' },
  { id: 'retire', text: 'Retire early', emoji: '🌅' },
  { id: 'financial_freedom', text: 'Be financially independent', emoji: '💸' },
  { id: 'school', text: 'Pay for school', emoji: '🎓' },
  { id: 'unknown', text: 'I don’t know yet', emoji: '🤔' },
];

export const FutureGoalsScreen: React.FC<FutureGoalsScreenProps> = ({ hasInvestedBefore, onContinue }) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const hasPlayedRef = useRef(false);

  // Dynamic voice text logic
  const voiceText = hasInvestedBefore
    ? "Awesome, you're ahead of the game. What are your financial goals? Feel free to select as many options as you want."
    : "Nothing to worry, I'm here with you in this journey. Can you tell me what are our future goals? Feel free to select as many options as you want.";

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
      onContinue(selectedGoals);
  };

  const toggleGoal = (id: string) => {
    if (selectedGoals.includes(id)) {
      setSelectedGoals(selectedGoals.filter(g => g !== id));
    } else {
      // Add to end (preserves selection order)
      setSelectedGoals([...selectedGoals, id]);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-gradient-to-br from-orange-400 via-rose-300 to-orange-200 font-sans">
      
      {/* Background elements - No particles */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>

      {/* Header with Circular Progress (Step 2 of 5) */}
      <CircularHeader currentStep={2} totalSteps={5} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center px-6 z-10 w-full max-w-md mx-auto overflow-y-auto no-scrollbar pb-32">
         
         {/* Title */}
         <h1 className="text-4xl text-gray-900 text-center mb-2 leading-tight drop-shadow-sm mt-4">
           <span className="font-bold">What are your</span> <br/> <span className="italic font-serif">future goals?</span>
         </h1>

         {/* Voice Activity Indicator - Shows ONLY when speaking */}
         <div className="h-8 mb-2 flex items-center justify-center min-h-[32px]">
            {isPlaying && (
              <div className="flex items-end gap-1 h-4 transition-opacity duration-300">
                 <div className="w-1 bg-yellow-300 rounded-full animate-[bounce_1s_infinite]"></div>
                 <div className="w-1 bg-yellow-300 rounded-full animate-[bounce_1s_infinite_0.1s] h-full"></div>
                 <div className="w-1 bg-yellow-300 rounded-full animate-[bounce_1s_infinite_0.2s]"></div>
                 <div className="w-1 bg-yellow-300 rounded-full animate-[bounce_1s_infinite_0.3s] h-3/4"></div>
              </div>
            )}
         </div>

         {/* Static Helper Text */}
         <p className="text-orange-900/70 text-sm font-medium tracking-wide text-center max-w-[80%] mb-6">
            Feel free to select as many options as you want.
         </p>

         {/* Goals List */}
         <div className="w-full space-y-3">
           {goals.map((goal) => {
             const isSelected = selectedGoals.includes(goal.id);
             return (
               <button 
                 key={goal.id}
                 onClick={() => toggleGoal(goal.id)}
                 className={`w-full p-5 rounded-[1.5rem] flex items-center justify-between group transition-all duration-200 border-2 shadow-lg shadow-orange-900/5 ${
                   isSelected 
                     ? 'bg-orange-500 border-orange-500 scale-[1.02] ring-2 ring-white/30' 
                     : 'bg-white/80 backdrop-blur-sm border-transparent hover:border-orange-300 hover:bg-white'
                 }`}
               >
                 <span className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                   {goal.text}
                 </span>
                 <span className="text-2xl filter drop-shadow-sm">{goal.emoji}</span>
               </button>
             );
           })}
         </div>

      </div>

      {/* Bottom CTA */}
      <div className="absolute bottom-0 left-0 w-full p-6 pb-10 bg-gradient-to-t from-rose-300 via-rose-300/90 to-transparent z-20">
         <div className="max-w-md mx-auto">
            <Button 
               onClick={handleContinue}
               disabled={selectedGoals.length === 0}
               className="w-full rounded-full py-4 text-lg transition-all shadow-xl shadow-orange-900/20 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-gray-900 font-extrabold tracking-wide border-none"
            >
               Continue
            </Button>
         </div>
      </div>
    </div>
  );
};