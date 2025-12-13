import React, { useState, useEffect } from 'react';
import { getOnboardingState, setValue, persistOnboardingState } from '../utils/onboardingState';
import { Loader2, ArrowLeft, AlertCircle, CheckCircle2, Mail } from 'lucide-react';

interface VerifyEmailOtpScreenProps {
  onVerifySuccess: () => void;
  onChangeEmail: () => void;
}

export const VerifyEmailOtpScreen: React.FC<VerifyEmailOtpScreenProps> = ({ onVerifySuccess, onChangeEmail }) => {
  // State
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [maskedEmail, setMaskedEmail] = useState("in...@example.com");
  
  // Toast state now handles message text and type (success vs info)
  const [toast, setToast] = useState<{message: string, type: 'success' | 'info'} | null>(null);
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  // Initialize
  useEffect(() => {
    const state = getOnboardingState();
    if (state.email) {
      const email = state.email;
      const [local, domain] = email.split('@');
      const maskedLocal = local.length >= 2 ? local.substring(0, 2) : local;
      setMaskedEmail(`${maskedLocal}...@${domain}`);
    }

    // Check persistent cooldown
    const savedCooldownEnd = localStorage.getItem('emailOtpCooldownEnd');
    if (savedCooldownEnd) {
      const remaining = Math.ceil((parseInt(savedCooldownEnd) - Date.now()) / 1000);
      if (remaining > 0) {
        setCooldown(remaining);
      }
    } else {
        // Start initial cooldown if not present (simulating auto-send on mount)
        startCooldown(30);
    }

    // --- DEMO MODE TRIGGER ---
    // Simulate email arrival after 2 seconds
    const demoTimer = setTimeout(() => {
        setToast({ message: "🔔 DEMO: Your OTP code is 123456", type: 'info' });
    }, 2000);

    return () => clearTimeout(demoTimer);
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (cooldown > 0) {
      interval = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldown]);

  // Toast Auto-Dismiss
  useEffect(() => {
    if (toast) {
        const t = setTimeout(() => setToast(null), 5000);
        return () => clearTimeout(t);
    }
  }, [toast]);

  const startCooldown = (seconds: number) => {
    setCooldown(seconds);
    const endTime = Date.now() + (seconds * 1000);
    localStorage.setItem('emailOtpCooldownEnd', endTime.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only accept digits
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(val);
    setError(null);
    setIsSuccess(false);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
    if (pastedData.length === 6) {
      setOtp(pastedData);
      setError(null);
    } else {
      triggerError("Paste a 6-digit code only");
    }
  };

  const triggerError = (msg: string) => {
    setError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    
    // 1. Show "Resent" confirmation
    setToast({ message: `Code resent to ${maskedEmail}`, type: 'success' });
    startCooldown(30);
    setOtp('');
    setError(null);

    // 2. DEMO MODE: Re-trigger the fake email arrival
    setTimeout(() => {
        setToast({ message: "🔔 DEMO: Your OTP code is 123456", type: 'info' });
    }, 2000);
  };

  const handleSubmit = async () => {
    if (otp.length !== 6) return;

    setIsVerifying(true);
    setError(null);

    // Simulate API Network Delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock Validation Logic
    // For demo purposes: '000000' triggers invalid OTP error
    if (otp === '000000') {
      setIsVerifying(false);
      triggerError("Incorrect code. Please try again.");
      setOtp('');
      return;
    }

    // Success Path
    setIsVerifying(false);
    setIsSuccess(true);
    setValue("emailVerified", true);
    setValue("sessionToken", "mock_token_" + Date.now());
    persistOnboardingState();

    // Redirect delay for UX feedback
    setTimeout(() => {
        onVerifySuccess();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#f9f5f0] font-sans text-[#1f2121] flex flex-col relative overflow-hidden">
      
      {/* Toast Notification */}
      {toast && (
        <div 
          className={`fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-lg z-50 animate-in slide-in-from-top-4 fade-in duration-300 flex items-center gap-2 max-w-[90%] whitespace-nowrap ${
            toast.type === 'info' ? 'bg-gray-900 text-white' : 'bg-[#218d8d] text-white'
          }`}
          role="alert"
        >
            {toast.type === 'info' ? <Mail size={18} /> : <CheckCircle2 size={18} />}
            <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <header className="h-16 bg-white border-b border-[#e5e7eb] flex items-center justify-between px-4 z-10 sticky top-0">
        <button 
            onClick={onChangeEmail}
            className="p-2 -ml-2 text-[#1f2121] hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Back"
        >
            <ArrowLeft size={24} />
        </button>
        {/* Using 'Orange' to match app name */}
        <div className="flex items-center gap-2">
            <svg viewBox="0 0 100 100" className="w-8 h-8 shrink-0 drop-shadow-sm">
             <path d="M50 25 C 50 25 65 5 85 15 C 85 15 75 35 50 35" fill="#65a30d" />
             <path d="M50 25 C 50 25 35 5 15 15 C 15 15 25 35 50 35" fill="#4d7c0f" />
             <circle cx="50" cy="60" r="35" fill="url(#orangeGradEmail)" />
             <ellipse cx="35" cy="50" rx="10" ry="5" transform="rotate(-45 35 50)" fill="white" fillOpacity="0.3" />
             <defs>
               <linearGradient id="orangeGradEmail" x1="20" y1="20" x2="80" y2="90" gradientUnits="userSpaceOnUse">
                 <stop offset="0%" stopColor="#fb923c" />
                 <stop offset="100%" stopColor="#ea580c" />
               </linearGradient>
             </defs>
           </svg>
            <div className="font-bold text-lg text-orange-500">Orange</div>
        </div>
        <div className="w-10"></div> {/* Spacer for centering */}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-6 pt-8 pb-8 max-w-md mx-auto w-full">
        
        {/* Title Section */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h1 className="text-2xl md:text-[24px] font-bold text-[#1f2121] mb-2">
                Verify your <span className="italic font-normal">email</span>
            </h1>
            <p className="text-[#626c7c] text-sm md:text-base">
                Enter the code we sent to <br/> <span className="font-semibold">{maskedEmail}</span>
            </p>
        </div>

        {/* Input Section */}
        <div className="w-full mb-2 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-100">
            <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={handleInputChange}
                onPaste={handlePaste}
                className={`
                    w-full h-16 text-center text-3xl font-bold tracking-[0.2em] rounded-xl border
                    bg-white text-[#1f2121] placeholder-gray-300 shadow-sm
                    focus:outline-none transition-all duration-200
                    ${shake ? 'animate-[shake_0.5s_cubic-bezier(.36,.07,.19,.97)_both]' : ''}
                    ${error 
                        ? 'border-[#c0152f] focus:ring-2 focus:ring-[#c0152f]/20' 
                        : isSuccess 
                            ? 'border-[#218d8d] text-[#218d8d] focus:border-[#218d8d]' 
                            : 'border-[#e5e7eb] focus:border-[#3b82f6] focus:ring-[3px] focus:ring-[#3b82f6]/40'
                    }
                `}
                disabled={isVerifying || isSuccess}
                autoFocus
            />
        </div>

        {/* Error Area */}
        <div className="w-full h-6 mb-6">
            {error && (
                <div className="flex items-center justify-center gap-1.5 text-[#c0152f] text-xs font-medium animate-in slide-in-from-top-1 fade-in duration-200" aria-live="polite">
                    <AlertCircle size={14} />
                    <span>{error}</span>
                </div>
            )}
        </div>

        {/* Resend Section */}
        <div className="text-center mb-8 animate-in fade-in duration-500 delay-200">
            <p className="text-[#626c7c] text-sm mb-1">Didn't receive it?</p>
            {cooldown > 0 ? (
                <span className="text-[#626c7c]/50 text-sm font-medium cursor-not-allowed">
                    Resend in 00:{cooldown.toString().padStart(2, '0')}
                </span>
            ) : (
                <button 
                    onClick={handleResend}
                    className="text-[#fbbf24] hover:text-[#f59e1b] text-sm font-semibold transition-colors"
                >
                    Resend code
                </button>
            )}
        </div>

        {/* Continue Button */}
        <div className="w-full mt-auto animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            <button
                onClick={handleSubmit}
                disabled={otp.length !== 6 || isVerifying || isSuccess}
                className={`
                    w-full py-4 rounded-full font-semibold text-lg flex items-center justify-center gap-2
                    transition-all duration-200
                    ${otp.length === 6 && !isVerifying
                        ? 'bg-gradient-to-br from-[#fbbf24] to-[#f59e1b] text-[#1f2121] shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 cursor-pointer' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }
                `}
            >
                {isVerifying ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Verifying...</span>
                    </>
                ) : (
                    "Continue"
                )}
            </button>
        </div>

      </main>

      <style>{`
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
    </div>
  );
};