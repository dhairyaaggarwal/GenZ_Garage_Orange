
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
  disabled,
  ...props 
}) => {
  const baseStyles = "relative inline-flex items-center justify-center py-4 px-8 rounded-full font-black tracking-tight transition-all duration-200 active:scale-95 focus:outline-none focus:ring-4 focus:ring-offset-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 select-none overflow-hidden";
  
  const variants = {
    primary: "bg-[#DFFF4F] text-[#1F1F1F] hover:shadow-xl hover:shadow-[#DFFF4F]/30 focus:ring-[#DFFF4F]/40 border-none",
    secondary: "bg-transparent border-2 border-[#9B7EEC] text-[#9B7EEC] hover:bg-[#9B7EEC]/5 focus:ring-[#9B7EEC]/30",
    outline: "border-2 border-[#D8C8EE] text-[#5F5F73] hover:bg-white/50 focus:ring-[#D8C8EE]/30"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
};
