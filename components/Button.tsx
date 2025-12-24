import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "py-3 px-8 rounded-full font-bold transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-center";
  
  const variants = {
    // Primary: Lime/Neon Yellow-Green background with Dark text
    primary: "bg-[#DFFF4F] text-[#1F1F1F] hover:shadow-lg hover:shadow-[#DFFF4F]/40 focus:ring-[#DFFF4F] border-none",
    // Secondary: Soft Purple border and text
    secondary: "bg-transparent border-2 border-[#9B7EEC] text-[#9B7EEC] hover:bg-[#9B7EEC]/10 focus:ring-[#9B7EEC]",
    // Outline: Neutral muted
    outline: "border-2 border-[#D8C8EE] text-[#5F5F73] hover:bg-white focus:ring-[#D8C8EE]"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};