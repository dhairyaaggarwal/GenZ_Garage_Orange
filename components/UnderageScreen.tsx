import React from 'react';
import { CircularHeader } from './CircularHeader';
import { Button } from './Button';

export const UnderageScreen: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-gradient-to-br from-orange-400 via-rose-300 to-orange-200 font-sans">
      
      {/* Background - Clean */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>

      {/* Dimmed Header */}
      <div className="opacity-50 pointer-events-none grayscale">
        <CircularHeader currentStep={2} totalSteps={4} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 z-10 w-full max-w-md mx-auto text-center -mt-20">
         
         <h1 className="text-5xl font-extrabold text-gray-900 mb-6 drop-shadow-sm tracking-tight">
           We’re sorry
         </h1>
         
         <p className="text-xl text-gray-800 font-medium leading-relaxed max-w-xs mx-auto">
           You must be 18 years old or older to use Orange.
           <br/><br/>
           Hopefully we’ll see you back here soon.
         </p>

      </div>

      {/* Bottom CTA */}
      <div className="pb-10 px-6 w-full flex justify-center z-20">
         <button 
           onClick={() => window.location.reload()}
           className="text-gray-700 font-bold text-sm px-6 py-3 rounded-full border border-gray-400/50 hover:bg-white/20 transition-all"
         >
           Exit
         </button>
      </div>
    </div>
  );
};