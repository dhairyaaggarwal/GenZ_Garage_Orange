
import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { CircularHeader } from './CircularHeader';
import { setValue, getOnboardingState } from '../utils/onboardingState';
import { Loader2, AlertCircle } from 'lucide-react';

interface SignupScreenProps {
  onContinue: () => void;
  onJumpToStep?: (step: number) => void;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({ onContinue, onJumpToStep }) => {
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const state = getOnboardingState();
    if (state.mobileNumber) setMobile(state.mobileNumber);
    if (state.email) setEmail(state.email);
  }, []);

  const validateMobile = (num: string) => /^\d{10}$/.test(num);
  const validateEmail = (mail: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);

  const handleContinue = async () => {
    setError(null);
    if (!validateMobile(mobile)) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setValue("mobileNumber", mobile);
    setValue("email", email.toLowerCase());
    setIsSubmitting(false);
    onContinue();
  };

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-brand-bg font-sans">
      <CircularHeader currentStep={5} totalSteps={5} onJumpToStep={onJumpToStep} />
      
      <div className="flex-1 flex flex-col items-center px-6 z-10 w-full max-w-md mx-auto mt-6">
         <div className="text-center mb-10">
            <h1 className="text-3xl text-brand-text font-black leading-tight mb-2">
               Create your <span className="italic text-brand-secondary">Orange account</span>
            </h1>
            <p className="text-brand-subtext font-bold uppercase tracking-widest text-[10px]">Safety First</p>
         </div>

         <div className="w-full space-y-4">
            <div className={`bg-white rounded-2xl p-2 border-2 transition-all shadow-sm ${error && !validateMobile(mobile) ? 'border-red-400' : 'border-brand-card focus-within:border-brand-secondary'}`}>
                <div className="flex items-center">
                    <span className="pl-4 font-bold text-brand-muted">+91</span>
                    <input
                        type="tel"
                        maxLength={10}
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                        placeholder="9876543210"
                        className="w-full px-4 py-4 bg-transparent text-lg font-bold text-brand-text placeholder-brand-muted focus:outline-none"
                    />
                </div>
            </div>
            <div className={`bg-white rounded-2xl p-2 border-2 transition-all shadow-sm ${error && !validateEmail(email) ? 'border-red-400' : 'border-brand-card focus-within:border-brand-secondary'}`}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-6 py-4 bg-transparent text-lg font-bold text-brand-text placeholder-brand-muted focus:outline-none"
                />
            </div>
            
            {error && (
              <div className="flex items-center gap-2 text-red-500 bg-red-50 p-4 rounded-xl text-xs font-bold animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
         </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6 pb-12 bg-gradient-to-t from-brand-bg via-brand-bg to-transparent z-20">
         <Button 
            onClick={handleContinue}
            disabled={isSubmitting}
            fullWidth
            className="py-4 text-xl"
         >
            {isSubmitting ? <Loader2 className="animate-spin mx-auto text-brand-text" /> : "Verify & Create Account"}
         </Button>
      </div>
    </div>
  );
};
