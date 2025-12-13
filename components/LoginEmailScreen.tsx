import React, { useState } from 'react';
import { Button } from './Button';
import { ArrowLeft, Check, AlertCircle, Loader2 } from 'lucide-react';
import { setValue, persistOnboardingState } from '../utils/onboardingState';

interface LoginEmailScreenProps {
  onBack: () => void;
  onContinue: () => void;
}

export const LoginEmailScreen: React.FC<LoginEmailScreenProps> = ({ onBack, onContinue }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (value: string): boolean => {
    // Basic length check
    if (value.length < 5 || value.length > 254) return false;
    
    // Regex for basic structure
    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)) return false;

    const [local, domain] = value.split("@");
    if (!local || !domain) return false;

    // Local part constraints
    if (local.startsWith(".") || local.endsWith(".")) return false;
    if (/\.\./.test(local)) return false; // No consecutive dots
    if (/^[0-9]+$/.test(local)) return false; // Cannot be numeric only

    // Domain constraints
    if (domain.startsWith("-") || domain.endsWith("-") || domain.startsWith(".")) return false;

    return true;
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase(); // Convert to lowercase immediately
    setEmail(val);

    if (val.length === 0) {
      setError(null);
      setIsValid(false);
      return;
    }

    if (validateEmail(val)) {
      setError(null);
      setIsValid(true);
    } else {
      // Only show error if length is sufficient to potentially be valid, 
      // or if user pauses (debouncing could be added here, but simple instant feedback is requested)
      // For immediate feedback per prompt:
      setIsValid(false);
      // We set error only if it's clearly invalid after some typing to avoid annoying "invalid" on first char
      if (val.length > 5 && val.includes('@')) {
         setError("Please enter a valid email address (example@domain.com)");
      } else {
         setError(null); // Keep clean until structure emerges
      }
    }
  };

  const handleContinue = async () => {
    if (!isValid) return;
    
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save state
      setValue("email", email); // Using 'email' to be compatible with existing VerifyEmailOtpScreen
      persistOnboardingState();
      
      onContinue();
    } catch (e) {
      console.error(e);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-gradient-to-br from-orange-400 via-rose-300 to-orange-200 font-sans">
      
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>

      {/* Header */}
      <header className="px-6 pt-12 pb-6 flex items-center justify-between w-full z-20 relative">
        <button 
            onClick={onBack}
            className="p-2 -ml-2 text-gray-900 bg-white/30 hover:bg-white/50 rounded-full transition-colors backdrop-blur-md"
            aria-label="Back"
        >
            <ArrowLeft size={24} />
        </button>
        
        {/* Logo */}
        <div className="flex items-center gap-2">
            <svg viewBox="0 0 100 100" className="w-8 h-8 shrink-0 drop-shadow-sm">
             <path d="M50 25 C 50 25 65 5 85 15 C 85 15 75 35 50 35" fill="#65a30d" />
             <path d="M50 25 C 50 25 35 5 15 15 C 15 15 25 35 50 35" fill="#4d7c0f" />
             <circle cx="50" cy="60" r="35" fill="url(#orangeGradLogin)" />
             <ellipse cx="35" cy="50" rx="10" ry="5" transform="rotate(-45 35 50)" fill="white" fillOpacity="0.3" />
             <defs>
               <linearGradient id="orangeGradLogin" x1="20" y1="20" x2="80" y2="90" gradientUnits="userSpaceOnUse">
                 <stop offset="0%" stopColor="#fb923c" />
                 <stop offset="100%" stopColor="#ea580c" />
               </linearGradient>
             </defs>
           </svg>
        </div>
        
        <div className="w-10"></div> {/* Spacer */}
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center px-6 z-10 w-full max-w-md mx-auto mt-6">
         
         <div className="text-center mb-10">
            <h1 className="text-3xl text-gray-900 leading-tight drop-shadow-sm mb-2">
               <span className="font-bold">Enter your</span> <br/> <span className="italic font-serif">email</span>
            </h1>
            <p className="text-gray-900/70 font-medium text-sm">
               Use the same email you used when signing up.
            </p>
         </div>

         {/* Email Input Card */}
         <div className="w-full bg-white/90 backdrop-blur-md rounded-2xl p-2 shadow-lg shadow-orange-900/5 mb-2 border-2 border-transparent focus-within:border-orange-300 transition-all">
            <div className="relative">
                <label htmlFor="loginEmailInput" className="sr-only">Email Address</label>
                <input
                    id="loginEmailInput"
                    type="email"
                    autoComplete="email"
                    maxLength={254}
                    value={email}
                    onChange={handleInput}
                    placeholder="Email address"
                    className="w-full pl-6 pr-12 py-4 bg-transparent text-lg font-bold text-gray-900 placeholder-gray-400 focus:outline-none"
                    aria-invalid={!isValid && email.length > 0}
                />
                
                {/* Status Icon */}
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    {isValid && <Check className="text-green-500 w-6 h-6 animate-in zoom-in duration-200" />}
                    {!isValid && email.length > 0 && error && <AlertCircle className="text-red-500 w-5 h-5 animate-in zoom-in duration-200" />}
                </div>
            </div>
            
            {/* Inline Error */}
            {error && (
                <div className="px-4 pb-2 pt-1 text-xs text-red-600 font-semibold animate-in slide-in-from-top-1">
                    {error}
                </div>
            )}
         </div>

      </div>

      {/* Bottom CTA */}
      <div className="absolute bottom-0 left-0 w-full p-6 pb-10 bg-gradient-to-t from-orange-200 via-orange-200/90 to-transparent z-20">
         <div className="max-w-md mx-auto flex flex-col items-center">
            <Button 
               onClick={handleContinue}
               disabled={!isValid || isSubmitting}
               className="w-[85%] rounded-full py-4 text-lg transition-all shadow-xl shadow-orange-900/20 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-gray-900 font-extrabold tracking-wide border-none disabled:opacity-50 disabled:cursor-not-allowed transform disabled:scale-95 disabled:grayscale flex items-center justify-center gap-2"
            >
               {isSubmitting ? (
                 <>
                   <Loader2 className="w-5 h-5 animate-spin" />
                   <span>Verifying...</span>
                 </>
               ) : (
                 "Continue"
               )}
            </Button>
            
            <p className="mt-4 text-xs text-orange-900/60 text-center max-w-xs leading-snug">
               By tapping continue, you agree to the Terms & Privacy Policy
            </p>
         </div>
      </div>
    </div>
  );
};