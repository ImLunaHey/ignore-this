import { cn } from '@/cn';
import { InputHTMLAttributes } from 'react';

export const Input = ({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) => {
  const baseStyles = 'border rounded px-2';
  const lightStyles = 'bg-white text-black border-[#e4e4e7]';
  const darkStyles = 'dark:bg-[#111214] dark:text-white dark:border-[#222327]';
  return <input className={cn(baseStyles, lightStyles, darkStyles, className)} {...props} />;
};
