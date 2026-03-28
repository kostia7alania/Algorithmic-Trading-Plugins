import React from 'react';

interface ProgressBarProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value'> {
  value: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, className = '', ...props }) => {
  return (
    <input
      type="range"
      min="0"
      max="100"
      step="0.1"
      value={value}
      className={`w-full accent-[#1db954] cursor-pointer outline-none ${className}`}
      {...props}
    />
  );
};