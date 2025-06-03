// src/components/Button.tsx

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Variants:
   * - "ghost" (transparent background, bordered)
   * - "primary" (filled background)
   * - "outline" (transparent with strong border)
   * - "warning" (yellowish)
   */
  variant?: 'ghost' | 'primary' | 'outline' | 'warning';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'ghost',
  children,
  className = '',
  disabled,
  ...props
}) => {
  // Base styles for every button
  const base =
    'px-4 py-2 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 transition ' +
    'rounded border-2 disabled:cursor-not-allowed';

  // Variant-specific styles (non-disabled)
  const variants: Record<string, string> = {
    ghost:
      'bg-transparent text-gray-800 dark:text-gray-200 border-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-gray-500',
    primary:
      'bg-blue-600 text-white border-transparent hover:bg-blue-700 focus:ring-blue-500',
    outline:
      'bg-transparent text-blue-600 dark:text-blue-300 border-blue-600 dark:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900 focus:ring-blue-500',
    warning:
      'bg-yellow-500 text-white border-transparent hover:bg-yellow-600 focus:ring-yellow-400',
  };

  // Disabled styles for each variant
  const disabledVariants: Record<string, string> = {
    ghost:
      'bg-transparent text-gray-400 dark:text-gray-500 border-gray-300 dark:border-gray-700',
    primary:
      'bg-gray-400 text-gray-200 border-gray-400',
    outline:
      'bg-transparent text-gray-400 dark:text-gray-500 border-gray-400 dark:border-gray-700',
    warning:
      'bg-gray-400 text-gray-200 border-gray-400',
  };

  // Choose appropriate style based on disabled or not
  const variantClass = disabled ? disabledVariants[variant] : variants[variant];

  return (
    <button
      className={`${base} ${variantClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};