
import React, { useState } from 'react';
import { Button } from './Button';
import { CircularHeader } from './CircularHeader';
import { setValue, persistOnboardingState } from '../utils/onboardingState';
import { Check, AlertCircle, Loader2 } from 'lucide-react';

interface SignupScreenProps {
  onContinue: () => void;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({ onContinue }) => {
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [mobileError, setMobileError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [mobileValid, setMobileValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateMobile = (value: string): boolean => {
    if (value.length === 0) {
        setMobileError(null);
        return false;
    }
    if (!/^[6-9]/.test(value)) {
        setMobileError("Starts with 6, 7, 8, or 9");
        return false;
    }
    if (value.length < 10) {
        setMobileError("10 digits required");
        return false;
    }
    setMobileError(null);
    return true;
  };

  const handleMobileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setMobile(digits);
    setMobileValid(validateMobile(digits));
  };

  const validateEmail = (value: string): boolean => {
    if (value.length === 0) return false;
    const basicRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const isValid = basicRegex.test(value.toLowerCase());
    setEmailError(isValid ? null : "Invalid email");
    return isValid;
  };

  const handleEmailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailValid(validateEmail(e.target.value));
  };

  const handleContinue = async () => {
    if (!mobileValid || !emailValid) return;
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setValue("mobileNumber", mobile);
    setValue("email", email.toLowerCase());
    setIsSubmitting(false);
    onContinue();
  };

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-gradient-to-br from-orange-400 via-rose-300 to-orange-200 font-sans">
      <CircularHeader currentStep={5} totalSteps={5} />
      <div className="flex-1 flex flex-col items-center px-6 z-10 w-full max-w-md mx-auto mt-6">
         <div className="text-center mb-10">
            <h1 className="text-3xl text-gray-900 leading-tight drop-shadow-sm mb-2">
               Create your <br/> <span className="font-bold italic">Orange account</span>
            </h1>
            <p className="text-gray-800/70 font-medium text-sm">Step 5: Almost there!</p>
         </div>
         <div className="w-full space-y-4">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-2 border-2 border-transparent focus-within:border-orange-300">
                <input
                    type="tel"
                    value={mobile}
                    onChange={handleMobileInput}
                    placeholder="Mobile number"
                    className="w-full px-6 py-4 bg-transparent text-lg font-bold text-gray-900 placeholder-gray-400 focus:outline-none"
                />
            </div>
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-2 border-2 border-transparent focus-within:border-orange-300">
                <input
                    type="email"
                    value={email}
                    onChange={handleEmailInput}
                    placeholder="Email address"
                    className="w-full px-6 py-4 bg-transparent text-lg font-bold text-gray-900 placeholder-gray-400 focus:outline-none"
                />
            </div>
         </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full p-6 pb-10 bg-gradient-to-t from-orange-200 via-orange-200/90 to-transparent z-20">
         <Button 
            onClick={handleContinue}
            disabled={!mobileValid || !emailValid || isSubmitting}
            className="w-[85%] mx-auto block rounded-full py-4 text-lg font-extrabold tracking-wide"
         >
            {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : "Verify & Create Account"}
         </Button>
      </div>
    </div>
  );
};
