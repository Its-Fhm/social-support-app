// src/components/TextAreaField.tsx

import React, { forwardRef } from 'react';

interface TextAreaFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Unique identifier for the textarea (used by the <label htmlFor="...">) */
  id: string;
  /** Label text to display above the textarea */
  label: string;
  /** Optional error message to display below the textarea */
  error?: string;
}

/**
 * TextAreaField:
 * - Renders a label, a <textarea> with thicker borders, and an optional error message.
 * - Forwards the ref so React Hook Form (or other libraries) can attach directly to the <textarea>.
 * - Includes dark-mode variants and padding for mobile-friendliness.
 */
export const TextAreaField = forwardRef<
  HTMLTextAreaElement,
  TextAreaFieldProps
>(({ id, label, error, ...rest }, ref) => (
  <div className="mb-4">
    <label
      htmlFor={id}
      className="block font-semibold mb-1 text-gray-800 dark:text-gray-200"
    >
      {label}
    </label>
    <textarea
      id={id}
      ref={ref}
      className="
        w-full
        p-3
        border-2
        border-gray-300 dark:border-gray-600
        bg-white dark:bg-gray-800
        text-gray-900 dark:text-gray-100
        rounded-md
        focus:outline-none focus:ring-2 focus:ring-blue-500
        resize-y
        min-h-[6rem]
      "
      {...rest}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
));

TextAreaField.displayName = 'TextAreaField';