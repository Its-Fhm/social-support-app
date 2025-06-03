import React, { forwardRef } from 'react';

interface SelectFieldProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ id, label, error, children, ...rest }, ref) => (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block font-semibold mb-1 text-gray-800 dark:text-gray-200"
      >
        {label}
      </label>
      <select
        id={id}
        ref={ref}
        className="
          w-full
          p-2
          border-2
          border-gray-300 dark:border-gray-600
          bg-white dark:bg-gray-800
          text-gray-900 dark:text-gray-100
          rounded-md
          focus:outline-none focus:ring-2 focus:ring-blue-500
        "
        {...rest}
      >
        {children}
      </select>
      {error && (
        <p id={`${id}-error`} role="alert" className="text-red-500 text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  )
);

SelectField.displayName = 'SelectField';