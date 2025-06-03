import React, { forwardRef } from 'react';

interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ id, label, error, ...rest }, ref) => (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block font-semibold mb-1 text-gray-800 dark:text-gray-200"
      >
        {label}
      </label>
      <input
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
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="text-red-500 text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  )
);

InputField.displayName = 'InputField';