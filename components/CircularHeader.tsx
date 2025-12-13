import React from 'react';

interface CircularHeaderProps {
  currentStep: number; // 1 to totalSteps
  totalSteps?: number;
}

export const CircularHeader: React.FC<CircularHeaderProps> = ({ currentStep, totalSteps = 4 }) => {
  const size = 52; // Reduced from 80
  const strokeWidth = 3.5;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  
  // Calculate arc parameters
  const gapAngle = 15; // Gap between segments in degrees
  const availableAngle = 360 - (totalSteps * gapAngle);
  const segmentAngle = availableAngle / totalSteps;
  
  // Convert polar to cartesian
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
    return [
      "M", start.x, start.y, 
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
  };

  return (
    <header className="pt-10 pb-4 flex justify-center w-full z-20 relative">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        
        {/* Segmented Ring SVG */}
        <svg className="absolute inset-0 w-full h-full transform" viewBox={`0 0 ${size} ${size}`}>
          {Array.from({ length: totalSteps }).map((_, index) => {
            const stepNumber = index + 1;
            const startAngle = index * (segmentAngle + gapAngle) + (gapAngle / 2);
            const endAngle = startAngle + segmentAngle;
            
            // Determine state colors
            const isActive = stepNumber === currentStep;
            const isPast = stepNumber < currentStep;
            
            let strokeColor = '#fed7aa'; // Default: orange-200 (dimmed)
            if (isActive) strokeColor = '#ffffff'; // Active: White (or very bright yellow)
            else if (isPast) strokeColor = '#fb923c'; // Past: Orange-400

            return (
              <path
                key={index}
                d={describeArc(center, center, radius, startAngle, endAngle)}
                fill="none"
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                className={`transition-all duration-500 ease-out ${isActive ? 'drop-shadow-md opacity-100' : 'opacity-60'}`}
              />
            );
          })}
        </svg>
        
        {/* Logo in Center */}
        <div className="relative w-6 h-6 shrink-0 z-10 flex items-center justify-center">
           <svg viewBox="0 0 100 100" className="w-5 h-5 shrink-0 drop-shadow-sm">
             <path d="M50 25 C 50 25 65 5 85 15 C 85 15 75 35 50 35" fill="#65a30d" />
             <path d="M50 25 C 50 25 35 5 15 15 C 15 15 25 35 50 35" fill="#4d7c0f" />
             <circle cx="50" cy="60" r="35" fill="url(#orangeGradCirc)" />
             <ellipse cx="35" cy="50" rx="10" ry="5" transform="rotate(-45 35 50)" fill="white" fillOpacity="0.3" />
             <defs>
               <linearGradient id="orangeGradCirc" x1="20" y1="20" x2="80" y2="90" gradientUnits="userSpaceOnUse">
                 <stop offset="0%" stopColor="#fb923c" />
                 <stop offset="100%" stopColor="#ea580c" />
               </linearGradient>
             </defs>
           </svg>
        </div>
      </div>
    </header>
  );
};