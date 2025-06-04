// src/features/applicationForm/StepsWrapper.tsx

import React, { Suspense, useContext } from 'react';
import { ApplicationContext } from './applicationContext';
import ProgressBar from './steps/ProgressBar';

// Lazy‐load each step
const Step1 = React.lazy(() => import('./steps/Step1'));
const Step2 = React.lazy(() => import('./steps/Step2'));
const Step3 = React.lazy(() => import('./steps/Step3'));

const StepsWrapper: React.FC = () => {
  const { step } = useContext(ApplicationContext);

  let CurrentStepComponent: React.FC;
  switch (step) {
    case 1:
      CurrentStepComponent = Step1;
      break;
    case 2:
      CurrentStepComponent = Step2;
      break;
    case 3:
    default:
      CurrentStepComponent = Step3;
      break;
  }

  return (

    <div className="flex-1 flex flex-col max-w-3xl mx-auto mt-6 w-full px-4 ">
      {/* Progress bar at top */}
      <div className="mb-4">
        <ProgressBar />
      </div>

   
      <div className="flex-1 overflow-y-auto pb-6">
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-full">
              <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
            </div>
          }
        >
          <CurrentStepComponent />
        </Suspense>
      </div>
    </div>
  );
};

export default StepsWrapper;