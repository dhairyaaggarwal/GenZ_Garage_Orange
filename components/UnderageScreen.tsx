import React from 'react';
import { CircularHeader } from './CircularHeader';
import { Button } from './Button';

export const UnderageScreen: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-brand-bg font-sans text-brand-text">
      <div className="opacity-30 pointer-events-none">
        <CircularHeader currentStep={1} totalSteps={5} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 z-10 w-full max-w-md mx-auto text-center -mt-20">
         <div className="w-24 h-24 bg-brand-tertiary/20 rounded-full flex items-center justify-center mb-10 border-4 border-brand-tertiary shadow-lg animate-bounce">
            <span className="text-5xl">🛑</span>
         </div>
         <h1 className="text-5xl font-black text-brand-text mb-6 tracking-tight">
           We’re sorry
         </h1>
         <p className="text-2xl text-brand-subtext font-medium leading-relaxed max-w-xs mx-auto">
           You must be <span className="text-brand-text font-black border-b-4 border-brand-tertiary">18+</span> to use Orange.
           <br/><br/>
           See you when you turn 18!
         </p>
      </div>

      <div className="pb-16 px-6 w-full flex justify-center z-20">
         <Button 
           variant="secondary"
           onClick={() => window.location.reload()}
           className="w-[85%]"
         >
           Exit App
         </Button>
      </div>
    </div>
  );
};