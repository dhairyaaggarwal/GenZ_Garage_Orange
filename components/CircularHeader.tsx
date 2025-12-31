
import React from 'react';

interface CircularHeaderProps {
  currentStep: number;
  totalSteps?: number;
  onJumpToStep?: (step: number) => void;
}

export const CircularHeader: React.FC<CircularHeaderProps> = ({ currentStep, totalSteps = 5, onJumpToStep }) => {
  const size = 56; 
  const strokeWidth = 5; 
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  
  const gapAngle = 14; 
  const availableAngle = 360 - (totalSteps * gapAngle);
  const segmentAngle = availableAngle / totalSteps;
  
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return ["M", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(" ");
  };

  return (
    <header className="pt-8 pb-4 flex justify-center w-full z-20 shrink-0">
      <div className="relative" style={{ width: size, height: size }}>
        
        {/* BRAND LOGO - Centered Container */}
        <div className="absolute inset-0 flex items-center justify-center p-3 pointer-events-none">
           <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
             <path d="M50 25 C 50 25 65 5 85 15 C 85 15 75 35 50 35" fill="#DFFF4F" />
             <path d="M50 25 C 50 25 35 5 15 15 C 15 15 25 35 50 35" fill="#9B7EEC" />
             <circle cx="50" cy="60" r="30" fill="url(#brandGradHeader)" />
             <defs>
               <linearGradient id="brandGradHeader" x1="20" y1="20" x2="80" y2="90" gradientUnits="userSpaceOnUse">
                 <stop offset="0%" stopColor="#9B7EEC" />
                 <stop offset="100%" stopColor="#FFB7A5" />
               </linearGradient>
             </defs>
           </svg>
        </div>
        
        {/* PROGRESS RING */}
        <svg className="absolute inset-0 w-full h-full transform" viewBox={`0 0 ${size} ${size}`}>
          {Array.from({ length: totalSteps }).map((_, index) => {
            const stepNumber = index + 1;
            const startAngle = index * (segmentAngle + gapAngle) + (gapAngle / 2);
            const endAngle = startAngle + segmentAngle;
            
            const isActive = stepNumber === currentStep;
            const isPast = stepNumber < currentStep;
            
            const trackColor = '#D8C8EE'; 
            let strokeColor = 'transparent';
            if (isActive || isPast) strokeColor = '#9B7EEC'; 

            return (
              <React.Fragment key={index}>
                <path
                  d={describeArc(center, center, radius, startAngle, endAngle)}
                  fill="none"
                  stroke={trackColor}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  className="opacity-30"
                />
                <path
                  d={describeArc(center, center, radius, startAngle, endAngle)}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  onClick={() => onJumpToStep?.(stepNumber)}
                  className={`transition-all duration-700 ease-in-out cursor-pointer ${isActive ? 'stroke-brand-secondary' : 'stroke-brand-secondary/70'}`}
                  style={{ 
                    filter: isActive ? 'drop-shadow(0 0 6px rgba(155, 126, 236, 0.4))' : 'none',
                  }}
                />
              </React.Fragment>
            );
          })}
        </svg>
      </div>
    </header>
  );
};
