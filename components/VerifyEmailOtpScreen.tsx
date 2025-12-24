
import React, { useState, useEffect } from 'react';
import { getOnboardingState, setValue, persistOnboardingState } from '../utils/onboardingState';
import { Loader2, ArrowLeft, AlertCircle, Mail } from 'lucide-react';
import { Button } from './Button';
import { CircularHeader } from './CircularHeader';

interface VerifyEmailOtpScreenProps {
  onVerifySuccess: () => void;
  onChangeEmail: () => void;
  onJumpToStep?: (step: number) => void;
}

export const VerifyEmailOtpScreen: React.FC<VerifyEmailOtpScreenProps> = ({ onVerifySuccess, onChangeEmail, onJumpToStep }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [maskedEmail, setMaskedEmail] = useState("in...@example.com");
  const [toast, setToast] = useState<{message: string, type: 'success' | 'info'} | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const state = getOnboardingState();
    if (state.email) {
      const email = state.email;
      const [local, domain] = email.split('@');
      const maskedLocal = local.length >= 2 ? local.substring(0, 2) : local;
      setMaskedEmail(`${maskedLocal}...@${domain}`);
    }

    const savedCooldownEnd = localStorage.getItem('emailOtpCooldownEnd');
    if (savedCooldownEnd) {
      const remaining = Math.ceil((parseInt(savedCooldownEnd) - Date.now()) / 1000);
      if (remaining > 0) {
        setCooldown(remaining);
      }
    } else {
        startCooldown(30);
    }

    const demoTimer = setTimeout(() => {
        setToast({ message: "Your demo code is 123456", type: 'info' });
    }, 2000);

    return () => clearTimeout(demoTimer);
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (cooldown > 0) {
      interval = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldown]);

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
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(val);
    setError(null);
    setIsSuccess(false);
  };

  const triggerError = (msg: string) => {
    setError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setToast({ message: `Code resent to ${maskedEmail}`, type: 'success' });
    startCooldown(30);
    setOtp('');
    setError(null);
  };

  const handleSubmit = async () => {
    if (otp.length !== 6) return;
    setIsVerifying(true);
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (otp === '000000') {
      setIsVerifying(false);
      triggerError("Incorrect code. Please try again.");
      setOtp('');
      return;
    }
    setIsVerifying(false);
    setIsSuccess(true);
    setValue("emailVerified", true);
    setValue("sessionToken", "mock_token_" + Date.now());
    persistOnboardingState();
    setTimeout(() => {
        onVerifySuccess();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-brand-bg font-sans text-brand-text flex flex-col relative overflow-hidden">
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-lg z-50 animate-in slide-in-from-top-4 fade-in duration-300 flex items-center gap-2 max-w-[90%] whitespace-nowrap bg-brand-secondary text-white`} role="alert">
            <Mail size={18} />
            <span className="text-sm font-bold">{toast.message}</span>
        </div>
      )}

      <CircularHeader currentStep={5} totalSteps={5} onJumpToStep={onJumpToStep} />

      <main className="flex-1 flex flex-col items-center px-6 pt-4 pb-8 max-w-md mx-auto w-full z-10">
        <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-brand-text mb-4 leading-tight">
                Verify your <span className="italic font-serif text-brand-secondary">email</span>
            </h1>
            <p className="text-brand-subtext font-medium text-lg">
                Enter the code we sent to <br/> <span className="font-bold text-brand-text">{maskedEmail}</span>
            </p>
        </div>

        <div className="w-full mb-4 px-4">
            <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={handleInputChange}
                className={`
                    w-full h-20 text-center text-4xl font-black tracking-[0.2em] rounded-3xl border-2
                    bg-white text-brand-text placeholder-brand-muted shadow-sm
                    focus:outline-none transition-all duration-200
                    ${shake ? 'animate-shake' : ''}
                    ${error 
                        ? 'border-red-400' 
                        : isSuccess 
                            ? 'border-brand-success text-brand-secondary' 
                            : 'border-brand-card focus:border-brand-secondary focus:ring-4 focus:ring-brand-secondary/10'
                    }
                `}
                disabled={isVerifying || isSuccess}
                autoFocus
            />
        </div>

        <div className="w-full h-8 mb-8 text-center">
            {error && (
                <div className="flex items-center justify-center gap-1.5 text-red-500 text-sm font-bold" aria-live="polite">
                    <AlertCircle size={14} />
                    <span>{error}</span>
                </div>
            )}
        </div>

        <div className="text-center mb-12">
            <p className="text-brand-subtext font-medium text-sm mb-2">Didn't receive it?</p>
            {cooldown > 0 ? (
                <span className="text-brand-muted text-sm font-bold">
                    Resend in 00:{cooldown.toString().padStart(2, '0')}
                </span>
            ) : (
                <button onClick={handleResend} className="text-brand-secondary hover:text-brand-text text-sm font-black transition-colors underline underline-offset-4">
                    Resend code
                </button>
            )}
        </div>

        <div className="w-full mt-auto">
            <Button
                onClick={handleSubmit}
                disabled={otp.length !== 6 || isVerifying || isSuccess}
                fullWidth
                className="py-4 text-xl flex items-center justify-center gap-2"
            >
                {isVerifying ? (
                    <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>Verifying...</span>
                    </>
                ) : (
                    "Verify & Continue"
                )}
            </Button>
        </div>
      </main>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
};
