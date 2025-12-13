import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Button } from './Button';
import { ArrowRight, ArrowLeft, Check, Sparkles, HelpCircle } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const steps = [
  { id: 'intro', title: "Let's start with you" },
  { id: 'stage', title: "Where do you stand?" },
  { id: 'goals', title: "What are you dreaming of?" },
  { id: 'interests', title: "What vibes with you?" },
  { id: 'risk', title: "The Sleep Test" },
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    ageRange: '',
    occupation: '',
    financialGoals: [],
    investmentInterests: [],
    motivation: '',
    riskAppetite: 'Medium'
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(profile);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const updateProfile = (key: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const toggleSelection = (key: 'financialGoals' | 'investmentInterests', value: string) => {
    setProfile(prev => {
      const list = prev[key];
      if (list.includes(value)) {
        return { ...prev, [key]: list.filter(item => item !== value) };
      } else {
        return { ...prev, [key]: [...list, value] };
      }
    });
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return profile.name.length > 0;
      case 1: return profile.ageRange && profile.occupation;
      case 2: return profile.financialGoals.length > 0;
      case 3: return true; // Optional
      case 4: return true; // Default selected
      default: return false;
    }
  };

  // Helper for "Orange Tip"
  const OrangeTip = ({ text }: { text: string }) => (
    <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex gap-3 text-orange-800 text-sm mb-6 animate-in fade-in slide-in-from-bottom-2">
      <Sparkles className="flex-shrink-0 w-5 h-5 text-orange-500" />
      <p>{text}</p>
    </div>
  );

  // Render Steps
  const renderStep = () => {
    switch (currentStep) {
      case 0: // Intro
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <OrangeTip text="We aren't like other apps. We want to know the 'Why' before the 'How'." />
            
            <div className="group">
              <label className="block text-gray-700 font-medium mb-2 text-lg">What should we call you?</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => updateProfile('name', e.target.value)}
                placeholder="Type your name..."
                className="w-full p-4 text-xl border-b-2 border-orange-200 bg-transparent focus:border-orange-500 focus:outline-none placeholder-gray-300 text-gray-900 transition-colors"
                autoFocus
              />
            </div>
            
            <div className="group">
              <label className="block text-gray-700 font-medium mb-2 text-lg">
                Why do you want to invest? <span className="text-gray-400 font-normal text-base">(Be honest!)</span>
              </label>
              <textarea
                value={profile.motivation}
                onChange={(e) => updateProfile('motivation', e.target.value)}
                placeholder="E.g., I want to be independent, I want to travel the world, or I just want my money to stop sleeping in the bank."
                className="w-full p-4 rounded-xl bg-white border border-orange-100 focus:border-orange-400 focus:ring-4 focus:ring-orange-50 focus:outline-none resize-none h-32 transition-all placeholder-gray-400 text-gray-700"
              />
            </div>
          </div>
        );

      case 1: // Stage
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <OrangeTip text="Your life stage helps us decide how flexible your money needs to be." />
            
            <div className="space-y-3">
              <label className="block text-gray-700 font-medium text-lg">I am currently a...</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'Student', label: 'Student 📚' },
                  { id: 'Professional', label: 'Working Pro 💼' },
                  { id: 'Homemaker', label: 'Homemaker 🏡' },
                  { id: 'Freelancer', label: 'Freelancer 💻' },
                  { id: 'Entrepreneur', label: 'Founder 🚀' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => updateProfile('occupation', opt.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      profile.occupation === opt.id 
                        ? 'border-orange-500 bg-orange-50 text-orange-900 shadow-sm' 
                        : 'border-white bg-white hover:border-orange-200 text-gray-600 hover:bg-orange-50/50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="block text-gray-700 font-medium text-lg">My Age Range</label>
              <div className="flex flex-wrap gap-3">
                {['18-22', '23-28', '29-35', '35+'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => updateProfile('ageRange', opt)}
                    className={`px-6 py-3 rounded-full border-2 transition-all font-medium ${
                      profile.ageRange === opt 
                        ? 'border-orange-500 bg-orange-50 text-orange-900' 
                        : 'border-transparent bg-white text-gray-600 hover:bg-orange-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2: // Goals
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <OrangeTip text="Knowing your destination is the most important part of the map." />
            
            <p className="text-gray-600 mb-4 font-medium">Select your top goals (pick at least 1)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Emergency Fund', icon: '🛡️', desc: "Rainy day money" },
                { label: 'Travel', icon: '✈️', desc: "See the world" },
                { label: 'Higher Education', icon: '🎓', desc: "Upskilling" },
                { label: 'Buying a Home', icon: '🏠', desc: "My own space" },
                { label: 'Financial Freedom', icon: '🏖️', desc: "Retire early" },
                { label: 'Big Purchase', icon: '🚗', desc: "Car, Gadgets" },
                { label: 'Just Grow Wealth', icon: '📈', desc: "Beat inflation" }
              ].map((goal) => (
                <button
                  key={goal.label}
                  onClick={() => toggleSelection('financialGoals', goal.label)}
                  className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
                    profile.financialGoals.includes(goal.label)
                      ? 'border-orange-500 bg-orange-50 text-orange-900 shadow-md' 
                      : 'border-white bg-white hover:border-orange-200 text-gray-600 hover:bg-orange-50/30'
                  }`}
                >
                  <span className="text-2xl bg-white p-2 rounded-full shadow-sm">{goal.icon}</span>
                  <div className="text-left">
                    <span className="font-bold block">{goal.label}</span>
                    <span className="text-xs opacity-70">{goal.desc}</span>
                  </div>
                  {profile.financialGoals.includes(goal.label) && <Check size={20} className="ml-auto text-orange-500" />}
                </button>
              ))}
            </div>
          </div>
        );

      case 3: // Interests
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
             <OrangeTip text="Investing is personal. We can match you with themes you actually care about." />
             
             <p className="text-gray-600 mb-4 font-medium">Any themes that excite you? (Optional)</p>
             <div className="flex flex-wrap gap-3">
               {[
                 { id: 'Green Planet', label: 'Green Planet 🌱' },
                 { id: 'Tech & Future', label: 'Tech & Future 🤖' },
                 { id: 'Gold & Stability', label: 'Gold & Safety ✨' },
                 { id: 'India Growth Story', label: 'India Growth 🇮🇳' },
                 { id: 'Top 50 Brands', label: 'Big Reliable Brands 🏢' },
                 { id: 'Next Gen Startups', label: 'Startups 🦄' }
               ].map((interest) => (
                 <button
                   key={interest.id}
                   onClick={() => toggleSelection('investmentInterests', interest.id)}
                   className={`px-5 py-3 rounded-full border-2 transition-all ${
                     profile.investmentInterests.includes(interest.id)
                       ? 'border-orange-500 bg-orange-50 text-orange-900 font-medium' 
                       : 'border-white bg-white text-gray-600 hover:bg-orange-50'
                   }`}
                 >
                   {interest.label}
                 </button>
               ))}
             </div>
          </div>
        );

      case 4: // Risk -> The Sleep Test
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <OrangeTip text="This is the 'Sleep Test'. We need to know what keeps you calm when markets get bumpy." />
            
            <p className="text-xl font-bold text-gray-900 leading-snug">
              Imagine you invest ₹10,000 today. Next week, the market drops and it's worth ₹8,000. What do you do?
            </p>
            
            <div className="space-y-4">
              {[
                { val: 'Low', label: 'Panic & Sell 😰', desc: "I'd rather keep my money safe than chase big returns. Sleep > Gains." },
                { val: 'Medium', label: 'Do Nothing & Wait 🧘‍♀️', desc: "I know it goes up and down. I'll just close the app and wait." },
                { val: 'High', label: 'Buy More! It\'s a sale 🛍️', desc: "I'm bold. I view drops as a discount to build wealth." }
              ].map((risk) => (
                <button
                  key={risk.val}
                  onClick={() => updateProfile('riskAppetite', risk.val)}
                  className={`w-full p-5 rounded-xl border-2 text-left transition-all group ${
                    profile.riskAppetite === risk.val
                      ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200 ring-offset-2 shadow-md' 
                      : 'border-white bg-white hover:border-orange-200 hover:bg-orange-50/30'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className={`font-bold text-lg ${profile.riskAppetite === risk.val ? 'text-orange-700' : 'text-gray-800'}`}>
                      {risk.label}
                    </span>
                    {profile.riskAppetite === risk.val && <Check size={20} className="text-orange-500" />}
                  </div>
                  <p className="text-gray-500 text-sm group-hover:text-gray-700 transition-colors">{risk.desc}</p>
                </button>
              ))}
            </div>
          </div>
        );
      
      default: return null;
    }
  };

  return (
    <div className="max-w-xl mx-auto w-full px-6 pb-10">
      <div className="mb-8 pt-4">
        <div className="flex justify-between text-sm font-medium text-orange-800 mb-2">
           <span>Step {currentStep + 1} of {steps.length}</span>
           <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
        </div>
        <div className="h-2 bg-orange-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-orange-500 transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-6 font-sans">
        {steps[currentStep].title}
      </h2>

      <div className="min-h-[350px]">
        {renderStep()}
      </div>

      <div className="flex gap-4 pt-8">
        {currentStep > 0 && (
          <Button variant="secondary" onClick={handleBack} className="flex items-center gap-2 pl-4 pr-6">
            <ArrowLeft size={20} /> Back
          </Button>
        )}
        <Button 
          variant="primary" 
          onClick={handleNext} 
          disabled={!isStepValid()}
          fullWidth={currentStep === 0}
          className="flex-1 flex justify-center items-center gap-2"
        >
          {currentStep === steps.length - 1 ? 'Reveal My Plan' : 'Next'}
          {currentStep < steps.length - 1 && <ArrowRight size={20} />}
        </Button>
      </div>
    </div>
  );
};
