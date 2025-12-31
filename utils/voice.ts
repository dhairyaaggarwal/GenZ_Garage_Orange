
/**
 * Centralized utility for Buddy's voice.
 * Focuses on a high-energy, compassionate, and natural-sounding female voice.
 */

let isPrimed = false;
let activeUtterance: SpeechSynthesisUtterance | null = null;
let voices: SpeechSynthesisVoice[] = [];

// Pre-load voices immediately
if (typeof window !== 'undefined' && window.speechSynthesis) {
  const loadVoices = () => {
    voices = window.speechSynthesis.getVoices();
  };
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

/**
 * Primes the speech synthesis engine. 
 * MUST be called during a user-initiated event (like a button click).
 */
export const primeBuddy = () => {
  if (typeof window === 'undefined' || !window.speechSynthesis || isPrimed) return;
  
  // Speak a silent, empty utterance to "unlock" the audio context in the browser
  const silent = new SpeechSynthesisUtterance("");
  silent.volume = 0;
  window.speechSynthesis.speak(silent);
  isPrimed = true;
  console.log("Buddy engine primed and unlocked.");
};

export const getBuddyVoice = (): SpeechSynthesisVoice | null => {
  if (voices.length === 0) {
    voices = window.speechSynthesis.getVoices();
  }
  
  if (voices.length === 0) return null;

  // Preference list for vibrant, friendly female voices
  // Added Indian English variants for a more compassionate local feel
  const preferredPatterns = [
    "Google UK English Female", 
    "en-IN",                    // Indian English generic
    "Heera",                    // Microsoft Indian English
    "Google English (India)",   // Chrome Indian English
    "Samantha",                 // iOS Natural
    "Microsoft Aria",           // Natural English
    "Google US English Female",
    "female",
    "natural"
  ];

  for (const pattern of preferredPatterns) {
    const found = voices.find(v => v.name.includes(pattern) || v.lang.includes(pattern));
    if (found) return found;
  }

  return voices.find(v => v.lang.startsWith('en')) || voices[0];
};

/**
 * Buddy's Voice Signature:
 * Rate 1.15 (Energetic but not rushed)
 * Pitch 1.05 (Warm, compassionate, and natural)
 */
export const speakBuddy = (text: string, onEnd?: () => void) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  // 1. Force resume and cancel any existing speech
  window.speechSynthesis.resume();
  window.speechSynthesis.cancel();

  // 2. Minimal delay (40ms) to ensure clean state without losing the user-activation window
  setTimeout(() => {
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Global ref to stop GC
    activeUtterance = utterance;
    
    const voice = getBuddyVoice();
    if (voice) {
      utterance.voice = voice;
    }

    // TWEAKED: Compassionate but high-energy
    utterance.rate = 1.15; 
    utterance.pitch = 1.05;
    utterance.volume = 1.0;

    utterance.onend = () => {
      activeUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (event) => {
      activeUtterance = null;
      console.warn("Buddy Voice Playback Issue:", event.error);
      // CRITICAL: We DO NOT call onEnd() here anymore.
      // This prevents the screen from skipping if the browser blocks the voice.
    };

    window.speechSynthesis.speak(utterance);
    window.speechSynthesis.resume();
  }, 40);
};

export const stopBuddy = () => {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    activeUtterance = null;
  }
};
