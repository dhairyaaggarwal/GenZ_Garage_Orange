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
    return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase();
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
      setIsValid(false);
      if (val.length > 5 && val.includes('@')) {
         setError("Please enter a valid email address");
      }
    }
  };

  const handleContinue = async () => {
    if (!isValid) return;
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setValue("email", email);
    persistOnboardingState();
    setIsSubmitting(false);
    onContinue();
  };

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-brand-bg font-sans text-brand-text">
      <header className="px-6 pt-12 pb-6 flex items-center justify-between w-full z-20 relative">
        <button onClick={onBack} className="p-2 -ml-2 text-brand-secondary hover:text-brand-text rounded-full transition-colors" aria-label="Back">
            <ArrowLeft size={24} />
        </button>
        <span className="font-black text-2xl text-brand-text tracking-tight">Orange</span>
        <div className="w-10"></div>
      </header>

      <div className="flex-1 flex flex-col items-center px-6 z-10 w-full max-w-md mx-auto mt-12">
         <div className="text-center mb-10">
            <h1 className="text-4xl text-brand-text font-black leading-tight mb-4">
               Welcome back to <br/> <span className="italic font-serif text-brand-secondary">Orange</span>
            </h1>
            <p className="text-brand-subtext font-medium text-lg">
               Enter your email to sign in.
            </p>
         </div>

         <div className="w-full bg-white rounded-3xl p-2 border-2 border-brand-card focus-within:border-brand-secondary transition-all shadow-sm">
            <div className="relative">
                <input
                    type="email"
                    value={email}
                    onChange={handleInput}
                    placeholder="Email address"
                    className="w-full pl-6 pr-12 py-5 bg-transparent text-xl font-bold text-brand-text placeholder-brand-muted focus:outline-none"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    {isValid && <Check className="text-brand-secondary w-6 h-6 animate-in zoom-in" />}
                    {error && <AlertCircle className="text-red-400 w-5 h-5 animate-in zoom-in" />}
                </div>
            </div>
         </div>
         {error && (
            <p className="mt-2 text-red-500 text-sm font-bold text-center">{error}</p>
         )}
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6 pb-16 bg-gradient-to-t from-brand-bg via-brand-bg to-transparent z-20">
         <div className="max-w-md mx-auto">
            <Button 
               onClick={handleContinue}
               disabled={!isValid || isSubmitting}
               fullWidth
               className="py-4 text-xl flex items-center justify-center gap-2"
            >
               {isSubmitting ? (
                 <>
                   <Loader2 className="w-6 h-6 animate-spin" />
                   <span>Signing in...</span>
                 </>
               ) : (
                 "Continue"
               )}
            </Button>
         </div>
      </div>
    </div>
  );
};