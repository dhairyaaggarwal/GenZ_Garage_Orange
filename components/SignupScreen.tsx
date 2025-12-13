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

  // --- Mobile Validation Logic ---
  const validateMobile = (value: string): boolean => {
    if (value.length === 0) {
        setMobileError(null);
        return false;
    }
    
    // Check Prefix
    if (!/^[6-9]/.test(value)) {
        setMobileError("Mobile numbers must start with 6, 7, 8, or 9");
        return false;
    }

    // Check Length
    if (value.length < 10) {
        setMobileError("Please enter a valid 10-digit mobile number");
        return false;
    }

    setMobileError(null);
    return true;
  };

  const handleMobileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Filter non-digits immediately
    let digits = e.target.value.replace(/\D/g, "");
    // Enforce max length 10
    if (digits.length > 10) digits = digits.slice(0, 10);
    
    setMobile(digits);
    const isValid = validateMobile(digits);
    setMobileValid(isValid);
  };

  const handleMobilePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text');
    const digits = text.replace(/\D/g, "");
    
    if (digits.length === 0) return;
    
    const sliced = digits.slice(0, 10);
    setMobile(sliced);
    const isValid = validateMobile(sliced);
    setMobileValid(isValid);
  };


  // --- Email Validation Logic ---
  const validateEmail = (value: string): boolean => {
    const emailLower = value.toLowerCase();
    
    if (emailLower.length === 0) {
        setEmailError(null);
        return false;
    }

    // Basic Regex for structure
    const basicRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    
    if (!basicRegex.test(emailLower)) {
         setEmailError("Please enter a valid email address");
         return false;
    }

    // Advanced Checks
    const [local, domain] = emailLower.split("@");
    
    // Numeric-only local part check
    if (/^[0-9]+$/.test(local)) {
        setEmailError("Email cannot be numbers only");
        return false;
    }

    // Dot checks
    if (local.startsWith(".") || local.endsWith(".")) {
        setEmailError("Email cannot start or end with a dot");
        return false;
    }
    if (/\.\./.test(local)) {
        setEmailError("Email cannot have consecutive dots");
        return false;
    }

    // Domain checks
    if (domain.startsWith("-") || domain.endsWith("-") || domain.startsWith(".")) {
         setEmailError("Invalid domain format");
         return false;
    }

    setEmailError(null);
    return true;
  };

  const handleEmailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    const isValid = validateEmail(val);
    setEmailValid(isValid);
  };


  // --- Submission ---
  const handleContinue = async () => {
    if (!mobileValid || !emailValid) return;

    setIsSubmitting(true);

    // Simulate Backend API Call
    try {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network

        // Save State
        setValue("mobileNumber", mobile);
        setValue("email", email.toLowerCase());
        persistOnboardingState();
        
        // Navigate to Email OTP
        onContinue(); 
    } catch (error) {
        console.error(error);
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
      <CircularHeader currentStep={5} totalSteps={5} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center px-6 z-10 w-full max-w-md mx-auto mt-6 overflow-y-auto no-scrollbar pb-32">
         
         <div className="text-center mb-10">
            <h1 className="text-3xl text-gray-900 leading-tight drop-shadow-sm mb-2">
               Start your <br/> <span className="font-bold italic">investing journey</span>
            </h1>
            <p className="text-gray-800/70 font-medium text-sm">Please enter your phone and email</p>
         </div>

         {/* Mobile Input Card */}
         <div className="w-full bg-white/90 backdrop-blur-md rounded-2xl p-2 shadow-lg shadow-orange-900/5 mb-4 border-2 border-transparent focus-within:border-orange-300 transition-all">
            <div className="relative">
                <label htmlFor="mobileInput" className="sr-only">Mobile Number</label>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 font-bold border-r border-gray-300 pr-3 mr-1">+91</span>
                </div>
                <input
                    id="mobileInput"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={10}
                    value={mobile}
                    onChange={handleMobileInput}
                    onPaste={handleMobilePaste}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full pl-16 pr-12 py-4 bg-transparent text-lg font-bold text-gray-900 placeholder-gray-400 focus:outline-none"
                    aria-invalid={!!mobileError}
                    aria-describedby={mobileError ? "mobile-error" : undefined}
                />
                
                {/* Status Icon */}
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    {mobileValid && <Check className="text-green-500 w-6 h-6 animate-in zoom-in duration-200" />}
                    {!mobileValid && mobile.length > 0 && mobileError && <AlertCircle className="text-red-500 w-5 h-5 animate-in zoom-in duration-200" />}
                </div>
            </div>
            
            {/* Inline Error */}
            {mobileError && (
                <div id="mobile-error" className="px-4 pb-2 pt-1 text-xs text-red-600 font-semibold animate-in slide-in-from-top-1" role="alert">
                    {mobileError}
                </div>
            )}
         </div>

         {/* Email Input Card */}
         <div className="w-full bg-white/90 backdrop-blur-md rounded-2xl p-2 shadow-lg shadow-orange-900/5 mb-8 border-2 border-transparent focus-within:border-orange-300 transition-all">
            <div className="relative">
                <label htmlFor="emailInput" className="sr-only">Email Address</label>
                <input
                    id="emailInput"
                    type="email"
                    autoComplete="email"
                    maxLength={254}
                    value={email}
                    onChange={handleEmailInput}
                    placeholder="Enter your email address"
                    className="w-full pl-6 pr-12 py-4 bg-transparent text-lg font-bold text-gray-900 placeholder-gray-400 focus:outline-none"
                    aria-invalid={!!emailError}
                    aria-describedby={emailError ? "email-error" : undefined}
                />
                
                {/* Status Icon */}
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    {emailValid && <Check className="text-green-500 w-6 h-6 animate-in zoom-in duration-200" />}
                    {!emailValid && email.length > 0 && emailError && <AlertCircle className="text-red-500 w-5 h-5 animate-in zoom-in duration-200" />}
                </div>
            </div>

            {/* Inline Error */}
            {emailError && (
                <div id="email-error" className="px-4 pb-2 pt-1 text-xs text-red-600 font-semibold animate-in slide-in-from-top-1" role="alert">
                    {emailError}
                </div>
            )}
         </div>

      </div>

      {/* Bottom CTA */}
      <div className="absolute bottom-0 left-0 w-full p-6 pb-10 bg-gradient-to-t from-orange-200 via-orange-200/90 to-transparent z-20">
         <div className="max-w-md mx-auto flex flex-col items-center">
            <Button 
               onClick={handleContinue}
               disabled={!mobileValid || !emailValid || isSubmitting}
               className="w-[85%] rounded-full py-4 text-lg transition-all shadow-xl shadow-orange-900/20 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-gray-900 font-extrabold tracking-wide border-none disabled:opacity-50 disabled:cursor-not-allowed transform disabled:scale-95 disabled:grayscale flex items-center justify-center gap-2"
            >
               {isSubmitting ? (
                 <>
                   <Loader2 className="w-5 h-5 animate-spin" />
                   <span>Sending OTP...</span>
                 </>
               ) : (
                 "Continue"
               )}
            </Button>
            
            <p className="mt-4 text-xs text-orange-900/60 text-center max-w-xs leading-snug">
               By continuing, you agree to our <a href="#" className="underline font-semibold hover:text-orange-800">Terms</a> and <a href="#" className="underline font-semibold hover:text-orange-800">Privacy Policy</a>.
            </p>
         </div>
      </div>
    </div>
  );
};