import React, { useState, useEffect, useRef } from 'react';
import { Button } from './Button';
import { CircularHeader } from './CircularHeader';
import { getOnboardingState, setValue, persistOnboardingState } from '../utils/onboardingState';
import { Loader2, AlertCircle } from 'lucide-react';

interface VerifyMobileOtpScreenProps {
  onVerifySuccess: () => void;
  onChangeNumber: () => void;
}

export const VerifyMobileOtpScreen: React.FC<VerifyMobileOtpScreenProps> = ({ onVerifySuccess, onChangeNumber }) => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [timeLeft, setTimeLeft] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [maskedNumber, setMaskedNumber] = useState("98XXXX7890");
  const [canResend, setCanResend] = useState(false);
  
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const state = getOnboardingState();
    if (state.mobileNumber) {
      const m = state.mobileNumber;
      if (m.length === 10) {
        setMaskedNumber(`${m.slice(0, 2)}XXXX${m.slice(6)}`);
      }
    }
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError(null);
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputsRef.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setError(null);
    setCanResend(false);
    setTimeLeft(30);
  };

  const handleSubmit = async () => {
    const code = otp.join('');
    if (code.length !== 6) return;
    setIsSubmitting(true);
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (code === '000000') {
        setError("Incorrect code. Please try again.");
        setIsSubmitting(false);
        setOtp(Array(6).fill(''));
        inputsRef.current[0]?.focus();
        return;
    }
    setValue("mobileVerified", true);
    setValue("sessionToken", "mock_session_token_" + Date.now());
    persistOnboardingState();
    setIsSubmitting(false);
    onVerifySuccess();
  };

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-brand-dark font-sans text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-indigo/30 via-brand-dark to-brand-dark"></div>
      <CircularHeader currentStep={5} totalSteps={5} />

      <div className="flex-1 flex flex-col items-center px-6 z-10 w-full max-w-md mx-auto mt-6 overflow-y-auto no-scrollbar">
         <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white mb-4">
               Verify your <span className="italic font-normal text-brand-purple">mobile</span>
            </h1>
            <p className="text-brand-subtext font-medium text-base">
               Enter the 6-digit code sent to <br/><span className="text-white font-bold">{maskedNumber}</span>
            </p>
         </div>

         <div className="flex gap-2 mb-10 justify-center w-full max-w-[320px]">
            {otp.map((digit, i) => (
               <input
                 key={i}
                 ref={el => { inputsRef.current[i] = el; }}
                 type="text"
                 inputMode="numeric"
                 maxLength={1}
                 value={digit}
                 onChange={(e) => handleInputChange(i, e.target.value)}
                 onKeyDown={(e) => handleKeyDown(i, e)}
                 className="w-12 h-16 rounded-2xl border-2 border-white/10 bg-white/5 backdrop-blur-md text-center text-3xl font-black text-white shadow-xl focus:border-brand-purple focus:bg-white/10 focus:outline-none transition-all"
                 aria-label={`Digit ${i + 1} of 6`}
               />
            ))}
         </div>

         {error && (
             <div className="flex items-center gap-2 text-brand-pink bg-brand-pink/10 backdrop-blur-sm px-6 py-3 rounded-2xl mb-8 animate-in zoom-in" role="alert">
                 <AlertCircle size={18} />
                 <span className="text-sm font-bold">{error}</span>
             </div>
         )}

         <div className="text-center mb-10">
            <p className="text-sm text-brand-subtext font-medium mb-2">Didn't receive the code?</p>
            {canResend ? (
               <button onClick={handleResend} className="text-brand-cyan font-bold underline hover:text-white transition-colors">
                 Resend code
               </button>
            ) : (
               <p className="text-brand-muted font-bold" aria-live="polite">
                 Resend in 00:{timeLeft.toString().padStart(2, '0')}
               </p>
            )}
         </div>

         <button onClick={onChangeNumber} className="text-sm text-brand-muted font-bold hover:text-white transition-colors mb-10">
            Change phone number
         </button>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6 pb-16 bg-gradient-to-t from-brand-dark via-brand-dark/90 to-transparent z-20">
         <div className="max-w-md mx-auto">
            <Button 
               onClick={handleSubmit}
               disabled={otp.some(d => d === '') || isSubmitting}
               fullWidth
               className="py-4 text-xl flex items-center justify-center gap-2"
            >
               {isSubmitting ? (
                 <>
                   <Loader2 className="w-6 h-6 animate-spin" />
                   <span>Verifying...</span>
                 </>
               ) : (
                 "Verify"
               )}
            </Button>
         </div>
      </div>
    </div>
  );
};