
import React from 'react';

interface CircularHeaderProps {
  currentStep: number;
  totalSteps?: number;
  onJumpToStep?: (step: number) => void;
}

export const CircularHeader: React.FC<CircularHeaderProps> = ({ currentStep, totalSteps = 5, onJumpToStep }) => {
  const size = 64; // Reduced size
  const strokeWidth = 6; // Thicker stroke for better visibility
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  
  const gapAngle = 12;
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
    <header className="pt-10 pb-4 flex justify-center w-full z-20 relative">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="absolute inset-0 w-full h-full transform" viewBox={`0 0 ${size} ${size}`}>
          {Array.from({ length: totalSteps }).map((_, index) => {
            const stepNumber = index + 1;
            const startAngle = index * (segmentAngle + gapAngle) + (gapAngle / 2);
            const endAngle = startAngle + segmentAngle;
            
            const isActive = stepNumber === currentStep;
            const isPast = stepNumber < currentStep;
            
            let strokeColor = '#D8C8EE'; // Inactive - softer purple
            if (isActive) strokeColor = '#9B7EEC'; // Active - Brand Purple
            if (isPast) strokeColor = '#9B7EEC99'; // Past - Semi-transparent Purple

            return (
              <path
                key={index}
                d={describeArc(center, center, radius, startAngle, endAngle)}
                fill="none"
                stroke={strokeColor}
                strokeWidth={isActive ? strokeWidth + 1 : strokeWidth}
                strokeLinecap="round"
                onClick={() => onJumpToStep?.(stepNumber)}
                className="transition-all duration-500 ease-out cursor-pointer hover:stroke-brand-secondary/70"
                style={{ 
                  filter: isActive ? 'drop-shadow(0 0 2px rgba(155, 126, 236, 0.5))' : 'none'
                }}
              />
            );
          })}
        </svg>
      </div>
    </header>
  );
};
