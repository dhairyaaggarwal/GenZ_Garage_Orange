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
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  // Initialize
  useEffect(() => {
    const state = getOnboardingState();
    if (state.mobileNumber) {
      const m = state.mobileNumber;
      if (m.length === 10) {
        setMaskedNumber(`${m.slice(0, 2)}XXXX${m.slice(6)}`);
      }
    }
    
    // Focus first input
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, []);

  // Timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleInputChange = (index: number, value: string) => {
    // Only digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take last char if multiple
    setOtp(newOtp);
    setError(null);

    // Auto-advance
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
    
    // Check if complete for auto-submit optionality or just enabling button
    if (newOtp.every(d => d !== '') && index === 5 && value !== '') {
        // Optional: Trigger submit automatically?
        // handleSubmit(newOtp); 
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // If empty, move back and delete prev
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

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/\D/g, '');
    
    if (text.length === 6) {
      const digits = text.split('');
      setOtp(digits);
      setError(null);
      // Focus last input
      inputsRef.current[5]?.focus();
    } else {
      setError("Paste a 6-digit code only");
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    setError(null);
    setCanResend(false);
    setTimeLeft(30);
    
    // Simulate API Call
    console.log("Resending OTP...");
    // In real app: api.post('/resend-otp', ...)
    
    // Announce
    const message = `Code resent to ${maskedNumber}`;
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'assertive');
    announcement.className = 'sr-only';
    announcement.innerText = message;
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  };

  const handleSubmit = async () => {
    const code = otp.join('');
    if (code.length !== 6) return;

    setIsSubmitting(true);
    setError(null);

    // Simulate Network
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate Validation
    // For demo: "000000" is failure, anything else is success
    if (code === '000000') {
        setError("Incorrect code. Please try again.");
        setIsSubmitting(false);
        // Clear inputs? Or focus first?
        setOtp(Array(6).fill(''));
        inputsRef.current[0]?.focus();
        return;
    }

    // Success
    setValue("mobileVerified", true);
    setValue("sessionToken", "mock_session_token_" + Date.now());
    persistOnboardingState();
    
    setIsSubmitting(false);
    onVerifySuccess();
  };

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-gradient-to-br from-orange-400 via-rose-300 to-orange-200 font-sans">
      
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>

      {/* Header */}
      <CircularHeader currentStep={5} totalSteps={5} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center px-6 z-10 w-full max-w-md mx-auto mt-6 overflow-y-auto no-scrollbar">
         
         <div className="text-center mb-8">
            <h1 className="text-3xl text-gray-900 leading-tight drop-shadow-sm mb-2">
               <span className="font-bold">Verify your mobile</span>
            </h1>
            <p className="text-gray-800/80 font-medium text-sm">
               Enter the 6-digit code we sent to <br/><span className="font-bold text-gray-900">{maskedNumber}</span>
            </p>
         </div>

         {/* OTP Input Group */}
         <div 
           className="flex gap-2 mb-6 justify-center w-full max-w-[320px]"
           onPaste={handlePaste}
         >
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
                 className="w-12 h-14 rounded-xl border-2 border-white/50 bg-white/40 backdrop-blur-md text-center text-2xl font-bold text-gray-900 shadow-sm focus:border-orange-500 focus:bg-white focus:outline-none transition-all"
                 aria-label={`Digit ${i + 1} of 6`}
               />
            ))}
         </div>

         {/* Hidden Input for Assistive Tech / Fallback Paste */}
         <input 
           ref={hiddenInputRef}
           type="text" 
           className="sr-only" 
           inputMode="numeric"
           maxLength={6}
           aria-hidden="true"
           tabIndex={-1}
         />

         {/* Error Message */}
         {error && (
             <div className="flex items-center gap-2 text-red-700 bg-red-100/80 backdrop-blur-sm px-4 py-2 rounded-lg mb-6 animate-in zoom-in duration-200" role="alert">
                 <AlertCircle size={16} />
                 <span className="text-sm font-bold">{error}</span>
             </div>
         )}

         {/* Resend Timer */}
         <div className="text-center mb-8">
            <p className="text-sm text-gray-800 font-medium mb-1">Didn't receive the code?</p>
            {canResend ? (
               <button 
                 onClick={handleResend}
                 className="text-orange-800 font-bold underline hover:text-orange-900 transition-colors"
               >
                 Resend code
               </button>
            ) : (
               <p className="text-gray-600 font-medium opacity-70" aria-live="polite">
                 Resend in 00:{timeLeft.toString().padStart(2, '0')}
               </p>
            )}
         </div>

         {/* Change Number Link */}
         <button 
           onClick={onChangeNumber}
           className="text-sm text-gray-700 font-medium hover:text-orange-800 transition-colors mb-8"
         >
            Change phone number
         </button>

      </div>

      {/* Bottom CTA */}
      <div className="absolute bottom-0 left-0 w-full p-6 pb-10 bg-gradient-to-t from-orange-200 via-orange-200/90 to-transparent z-20">
         <div className="max-w-md mx-auto flex flex-col items-center">
            <Button 
               onClick={handleSubmit}
               disabled={otp.some(d => d === '') || isSubmitting}
               className="w-[85%] rounded-full py-4 text-lg transition-all shadow-xl shadow-orange-900/20 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-gray-900 font-extrabold tracking-wide border-none disabled:opacity-50 disabled:cursor-not-allowed transform disabled:scale-95 disabled:grayscale flex items-center justify-center gap-2"
            >
               {isSubmitting ? (
                 <>
                   <Loader2 className="w-5 h-5 animate-spin" />
                   <span>Verifying...</span>
                 </>
               ) : (
                 "Verify"
               )}
            </Button>
            
            <p className="mt-4 text-xs text-orange-900/60 text-center max-w-xs leading-snug">
               By verifying, you confirm this mobile number belongs to you.
            </p>
         </div>
      </div>
    </div>
  );
};