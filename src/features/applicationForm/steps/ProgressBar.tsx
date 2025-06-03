// src/features/applicationForm/steps/ProgressBar.tsx
import React, { useContext } from 'react';
import { ApplicationContext } from '../applicationContext';

const ProgressBar: React.FC = () => {
  const { step } = useContext(ApplicationContext);

  return (
    <div className="mb-6">
      <div className="flex justify-between mb-1">
        <span className={step >= 1 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}>
          Personal
        </span>
        <span className={step >= 2 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}>
          Family
        </span>
        <span className={step >= 3 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}>
          Situation
        </span>
      </div>
      <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded">
        <div
          className={`h-2 bg-blue-600 dark:bg-blue-400 rounded ${
            step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'
          }`}
        />
      </div>
    </div>
  );
};

export default ProgressBar;