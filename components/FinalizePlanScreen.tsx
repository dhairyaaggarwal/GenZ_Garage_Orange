import React, { useEffect, useState, useRef } from 'react';
import { Button } from './Button';
import { CircularHeader } from './CircularHeader';
import { getOnboardingState, persistOnboardingState } from '../utils/onboardingState';
import { Check } from 'lucide-react';

interface FinalizePlanScreenProps {
  onContinue: () => void;
}

const ELEVEN_LABS_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; 
const TEXT_FINAL = "Alright! We have everything we need to build your personalized strategy. Let's take a quick look at your profile.";

const SummaryRow = ({ label, value, progress, isCompleted }: { label: string, value: string, progress: number, isCompleted?: boolean }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/50 relative overflow-hidden transition-all duration-300 hover:scale-[1.01]">
    <div className="flex justify-between items-center mb-2">
        <span className="text-gray-600 font-medium text-sm">{label}</span>
        <div className="flex items-center gap-2">
            <span className="text-gray-900 font-bold text-sm truncate max-w-[150px]">{value}</span>
            {isCompleted && <Check size={16} className="text-green-600" />}
        </div>
    </div>
    <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-orange-500 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
    </div>
  </div>
);

export const FinalizePlanScreen: React.FC<FinalizePlanScreenProps> = ({ onContinue }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const state = getOnboardingState();

  const getExperienceDisplay = () => {
    const exp = state.investmentExperience;
    if (exp === 'investing') return { label: 'Already investing', progress: 85 };
    return { label: 'First-time investor', progress: 20 };
  };

  const getGoalsDisplay = () => {
    const goals = state.futureGoals || [];
    if (goals.length === 0) return { label: 'Not sure yet', progress: 5 };
    const map: Record<string, string> = {
      retire: 'Retire early',
      house: 'Buy a house',
      school: 'Pay for school',
      work_less: 'Work less',
      financial_freedom: 'Financial Independence',
      unknown: 'Exploring'
    };
    const label = map[goals[0]] || goals[0];
    return { label: label + (goals.length > 1 ? ` +${goals.length - 1}` : ''), progress: Math.min(goals.length * 33, 100) };
  };

  const getRiskDisplay = () => {
    const risk = state.riskTolerance;
    const map: Record<string, string> = {
      high: 'High Growth',
      moderate: 'Medium Risk',
      balanced: 'Balanced',
      low: 'Safe & Steady'
    };
    return { label: risk ? map[risk] || risk : 'To be determined', progress: risk ? 100 : 0 };
  };

  const expData = getExperienceDisplay();
  const goalsData = getGoalsDisplay();
  const riskData = getRiskDisplay();

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const playTTS = async (text: string) => {
    stopAudio();
    setIsPlaying(true);
    const apiKey = process.env.ELEVEN_LABS_API_KEY;
    let audio: HTMLAudioElement | null = null;

    if (apiKey) {
      try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_LABS_VOICE_ID}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'xi-api-key': apiKey },
          body: JSON.stringify({
            text: text,
            model_id: "eleven_monolingual_v1",
            voice_settings: { stability: 0.5, similarity_boost: 0.75 }
          })
        });
        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          audio = new Audio(url);
          audioRef.current = audio;
        }
      } catch (e) {
        console.warn("ElevenLabs failed");
      }
    }

    if (!audio) {
      const utterance = new SpeechSynthesisUtterance(text);
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
    const t = setTimeout(() => {
      setShowContent(true);
      playTTS(TEXT_FINAL);
    }, 400);
    return () => { clearTimeout(t); stopAudio(); };
  }, []);

  const handleContinue = () => {
    stopAudio();
    persistOnboardingState();
    onContinue();
  };

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-gradient-to-br from-orange-400 via-rose-300 to-orange-200 font-sans">
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
      <CircularHeader currentStep={4} totalSteps={5} />
      <div className="absolute top-[5.5rem] left-0 w-full flex justify-center pointer-events-none z-20">
        <div className={`transition-opacity duration-300 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex items-center gap-1 h-4">
                <div className="w-0.5 bg-yellow-400 rounded-full animate-[bounce_1s_infinite] h-2"></div>
                <div className="w-0.5 bg-yellow-400 rounded-full animate-[bounce_1s_infinite_0.1s] h-3"></div>
                <div className="w-0.5 bg-yellow-400 rounded-full animate-[bounce_1s_infinite_0.2s] h-2"></div>
            </div>
        </div>
      </div>
      <div className={`flex-1 flex flex-col items-center px-6 z-10 w-full max-w-md mx-auto mt-6 transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
         <h1 className="text-3xl font-gray-900 text-center mb-8 leading-tight drop-shadow-sm shrink-0">
           <span className="font-bold">Finalizing your</span> <br/> <span className="italic font-serif">customized plan</span>
         </h1>
         <div className="w-full space-y-4 mb-10">
            <SummaryRow label="Experience" value={expData.label} progress={expData.progress} isCompleted={true} />
            <SummaryRow label="Financial Goals" value={goalsData.label} progress={goalsData.progress} isCompleted={true} />
            <SummaryRow label="Risk Appetite" value={riskData.label} progress={riskData.progress} isCompleted={true} />
            <SummaryRow label="Time Horizon" value={state.investmentHorizon || 'Long Term'} progress={100} isCompleted={true} />
         </div>
         <div className="w-full bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/40 text-center mb-8">
            <p className="text-gray-900 font-semibold text-lg leading-relaxed italic">
              "We've optimized your strategy to balance {goalsData.label.toLowerCase()} while respecting your comfort for risk."
            </p>
         </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full p-6 pb-10 bg-gradient-to-t from-orange-200 via-orange-200/90 to-transparent z-20">
         <div className="max-w-md mx-auto">
            <Button onClick={handleContinue} className="w-[85%] mx-auto block rounded-full py-4 text-lg transition-all shadow-xl shadow-orange-900/20 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-gray-900 font-extrabold tracking-wide border-none">
               Get My Plan
            </Button>
         </div>
      </div>
    </div>
  );
};