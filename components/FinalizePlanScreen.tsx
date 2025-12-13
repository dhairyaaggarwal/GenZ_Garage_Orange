import React, { useEffect, useState, useRef } from 'react';
import { Button } from './Button';
import { CircularHeader } from './CircularHeader';
import { getOnboardingState, setValue, persistOnboardingState } from '../utils/onboardingState';
import { Check, AlertCircle } from 'lucide-react';

interface FinalizePlanScreenProps {
  onContinue: () => void;
}

const ELEVEN_LABS_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; 

// TTS Text Segments
const TEXT_INTRO = "Alright, two more quick questions before we start the investment journey for you.";
const TEXT_Q1 = "Are you stressed about money?";
const TEXT_Q2 = "How much help do you need with investing?";

// Summary Component for compact rows
const SummaryRow = ({ label, value, progress, isCompleted }: { label: string, value: string, progress: number, isCompleted?: boolean }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/50 relative overflow-hidden transition-all duration-300">
    <div className="flex justify-between items-center mb-2">
        <span className="text-gray-600 font-medium text-sm">{label}</span>
        <div className="flex items-center gap-2">
            <span className="text-gray-900 font-bold text-sm truncate max-w-[150px]">{value}</span>
            {isCompleted && <Check size={16} className="text-green-600" />}
        </div>
    </div>
    {/* Thin progress bar */}
    <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-orange-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
    </div>
  </div>
);

export const FinalizePlanScreen: React.FC<FinalizePlanScreenProps> = ({ onContinue }) => {
  // Step 0: Intro/Summary -> Step 1: Q1 Active -> Step 2: Q2 Active -> Step 3: Done
  const [uiStep, setUiStep] = useState(0); 
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Data State
  const state = getOnboardingState();
  const [isStressed, setIsStressed] = useState<boolean | null>(null);
  const [helpNeeded, setHelpNeeded] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // --- Data Mappings ---
  const getExperienceDisplay = () => {
    // Derived ONLY from investmentExperience (Yes/No previously saved as investing/never_started)
    const exp = state.investmentExperience;
    if (exp === 'investing') return { label: 'Already investing', progress: 80 };
    if (exp === 'saving_only') return { label: 'Saver', progress: 30 }; // Fallback if set elsewhere
    if (exp === 'saving_and_investing') return { label: 'Saving & Investing', progress: 60 }; // Fallback
    return { label: 'First-time investor', progress: 10 }; // Default for never_started or null
  };

  const getGoalsDisplay = () => {
    const goals = state.futureGoals || [];
    if (goals.length === 0) return { label: 'Not sure yet', progress: 5 };
    
    const map: Record<string, string> = {
      buy_house: 'Buy a house', house: 'Buy a house',
      work_less: 'Work less',
      retire_early: 'Retire early', retire: 'Retire early',
      financial_independence: 'Be financially independent', financial_freedom: 'Be financially independent',
      pay_for_school: 'Pay for school', school: 'Pay for school',
      dont_know_yet: 'Not sure yet', unknown: 'Not sure yet'
    };
    
    // Show first 1-2 goals logic (simplified to first for compactness)
    const label = map[goals[0]] || goals[0];
    const progress = Math.min(goals.length * 40, 100);
    return { label: label + (goals.length > 1 ? ` +${goals.length - 1}` : ''), progress };
  };

  const getRiskDisplay = () => {
    const risk = state.riskTolerance;
    if (!risk) return null;
    const map: Record<string, string> = {
      high: 'High', high_risk: 'High',
      moderate: 'Medium', medium_high_risk: 'Medium',
      balanced: 'Medium', medium_risk: 'Medium',
      low: 'Low', low_risk: 'Low'
    };
    return { label: map[risk] || risk };
  };

  const expData = getExperienceDisplay();
  const goalsData = getGoalsDisplay();
  const riskData = getRiskDisplay();

  // --- Voice Logic ---
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const playTTS = async (text: string, onEnd?: () => void) => {
    stopAudio(); // Ensure clean slate
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
              text: text,
              model_id: "eleven_monolingual_v1",
              voice_settings: { stability: 0.5, similarity_boost: 0.75 }
            })
          }
        );
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
      utterance.rate = 1.15; 
      utterance.pitch = 1.1;
      utterance.onend = () => {
        setIsPlaying(false);
        if (onEnd) onEnd();
      };
      window.speechSynthesis.speak(utterance);
    } else {
      audio.onended = () => {
        setIsPlaying(false);
        audioRef.current = null;
        if (onEnd) onEnd();
      };
      audio.play().catch(() => setIsPlaying(false));
    }
  };

  // --- Sequencing ---

  // 1. Mount: Play Intro, then reveal Q1, then play Q1 TTS
  useEffect(() => {
    // Slight delay to ensure render
    const t = setTimeout(() => {
        playTTS(TEXT_INTRO, () => {
            // Intro finished, move to Step 1 (Reveal Q1)
            setUiStep(1);
        });
    }, 500);
    return () => { clearTimeout(t); stopAudio(); };
  }, []);

  // 2. When Step changes to 1 (Q1 Visible), Play Q1 TTS
  useEffect(() => {
    if (uiStep === 1) {
       // Small delay for visual reveal
       setTimeout(() => playTTS(TEXT_Q1), 400);
    }
  }, [uiStep]);

  // 3. When Step changes to 2 (Q2 Visible), Play Q2 TTS
  useEffect(() => {
    if (uiStep === 2) {
       setTimeout(() => playTTS(TEXT_Q2), 400);
    }
  }, [uiStep]);


  // --- Handlers ---

  const handleStressedSelect = (val: boolean) => {
    stopAudio(); // Interrupt
    setIsStressed(val);
    setValue("stressedAboutMoney", val);
    persistOnboardingState();
    setUiStep(2); // Move to Q2
  };

  const handleHelpSelect = (val: string) => {
    stopAudio(); // Interrupt
    setHelpNeeded(val);
    setValue("helpNeededWithInvesting", val);
    persistOnboardingState();
    setUiStep(3); // Move to Finish
  };

  const handleContinue = () => {
    stopAudio();
    if (isStressed === null || helpNeeded === null) {
      // Should likely not happen due to disabled state, but good safety
      setValidationError("Quick one — are you stressed about money?");
      return;
    }
    persistOnboardingState();
    // In real app: trackEvent("onboarding_completed", getOnboardingState())
    onContinue();
  };

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-gradient-to-br from-orange-400 via-rose-300 to-orange-200 font-sans">
      
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>

      {/* Header */}
      <CircularHeader currentStep={4} totalSteps={4} />

      {/* Voice Activity Indicator */}
      <div className="absolute top-[5.5rem] left-0 w-full flex justify-center pointer-events-none z-20">
        <div className={`transition-opacity duration-300 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex items-center gap-1 h-4">
                <div className="w-0.5 bg-yellow-400 rounded-full animate-[bounce_1s_infinite] h-2"></div>
                <div className="w-0.5 bg-yellow-400 rounded-full animate-[bounce_1s_infinite_0.1s] h-3"></div>
                <div className="w-0.5 bg-yellow-400 rounded-full animate-[bounce_1s_infinite_0.2s] h-2"></div>
            </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center px-6 z-10 w-full max-w-md mx-auto mt-6 overflow-y-auto no-scrollbar pb-32">
         
         <h1 className="text-3xl font-gray-900 text-center mb-6 leading-tight drop-shadow-sm shrink-0">
           <span className="font-bold">We're finalizing your</span> <br/> <span className="italic font-serif">investing plan</span>
         </h1>

         {/* Summary Rows (Always visible at top) */}
         <div className="w-full space-y-3 mb-6">
            <SummaryRow label="Comfort Level" value={expData.label} progress={expData.progress} isCompleted={true} />
            <SummaryRow label="Goals" value={goalsData.label} progress={goalsData.progress} isCompleted={true} />
            {riskData && <SummaryRow label="Risk" value={riskData.label} progress={100} isCompleted={true} />}
            
            {/* Completed Q1 Summary */}
            {uiStep >= 2 && (
               <SummaryRow 
                 label="Stressed" 
                 value={isStressed ? "Yes" : "No"} 
                 progress={100} 
                 isCompleted={true} 
               />
            )}
            
            {/* Completed Q2 Summary */}
            {uiStep >= 3 && (
               <SummaryRow 
                 label="Help Needed" 
                 value={helpNeeded === 'a_lot' ? "A lot" : "A little"} 
                 progress={100} 
                 isCompleted={true} 
               />
            )}
         </div>

         {/* Q1: Stressed about money? */}
         {uiStep === 1 && (
            <div className="w-full bg-white/95 backdrop-blur-md rounded-[2rem] p-6 shadow-xl border border-white/60 animate-in slide-in-from-bottom-4 fade-in duration-500">
               <h3 className="text-xl font-bold text-center text-gray-900 mb-6">Are you stressed about money?</h3>
               <div className="flex flex-col gap-3">
                   <button 
                     onClick={() => handleStressedSelect(true)}
                     className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-orange-400/10 to-orange-400/5 hover:from-orange-400 hover:to-yellow-400 hover:text-gray-900 border border-orange-200 transition-all font-bold text-lg text-gray-800 shadow-sm active:scale-95 text-left"
                   >
                      Yes — I’m stressed about money
                   </button>
                   <button 
                     onClick={() => handleStressedSelect(false)}
                     className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-orange-400/10 to-orange-400/5 hover:from-orange-400 hover:to-yellow-400 hover:text-gray-900 border border-orange-200 transition-all font-bold text-lg text-gray-800 shadow-sm active:scale-95 text-left"
                   >
                      No — I’m not stressed about money
                   </button>
               </div>
            </div>
         )}

         {/* Q2: Help needed? */}
         {uiStep === 2 && (
            <div className="w-full bg-white/95 backdrop-blur-md rounded-[2rem] p-6 shadow-xl border border-white/60 animate-in slide-in-from-bottom-4 fade-in duration-500">
               <h3 className="text-xl font-bold text-center text-gray-900 mb-6">How much help do you need with investing?</h3>
               <div className="flex gap-4">
                   <button 
                     onClick={() => handleHelpSelect('a_lot')}
                     className="flex-1 py-4 rounded-xl bg-gradient-to-r from-orange-400/10 to-orange-400/5 hover:from-orange-400 hover:to-yellow-400 hover:text-gray-900 border border-orange-200 transition-all font-bold text-lg text-gray-800 shadow-sm active:scale-95"
                   >
                      A lot
                   </button>
                   <button 
                     onClick={() => handleHelpSelect('a_little')}
                     className="flex-1 py-4 rounded-xl bg-gradient-to-r from-orange-400/10 to-orange-400/5 hover:from-orange-400 hover:to-yellow-400 hover:text-gray-900 border border-orange-200 transition-all font-bold text-lg text-gray-800 shadow-sm active:scale-95"
                   >
                      A little
                   </button>
               </div>
            </div>
         )}

         {/* Inline Live Preview (Optional per prompt, kept mostly in summary rows but shown here if needed) */}
         {/* Validation Message */}
         {validationError && (
             <div className="mt-4 flex items-center gap-2 text-red-700 bg-red-100 px-4 py-2 rounded-lg animate-in fade-in slide-in-from-bottom-2">
                 <AlertCircle size={16} />
                 <span className="text-sm font-medium">{validationError}</span>
             </div>
         )}

      </div>

      {/* Bottom CTA */}
      <div className="absolute bottom-0 left-0 w-full p-6 pb-10 bg-gradient-to-t from-orange-200 via-orange-200/90 to-transparent z-20">
         <div className="max-w-md mx-auto">
            <Button 
               onClick={handleContinue}
               disabled={uiStep < 3}
               className="w-[85%] mx-auto block rounded-full py-4 text-lg transition-all shadow-xl shadow-orange-900/20 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-gray-900 font-extrabold tracking-wide border-none disabled:opacity-50 disabled:cursor-not-allowed transform disabled:scale-95 disabled:grayscale"
            >
               Continue
            </Button>
         </div>
      </div>
      
      {/* Accessibility Announcement */}
      <div aria-live="polite" className="sr-only">
        {isPlaying ? "Buddy is speaking..." : ""}
      </div>
    </div>
  );
};