import React from 'react';
import { ApplicationProvider } from './applicationContext';
import StepsWrapper from './StepsWrapper';

const ApplicationForm: React.FC = () => {
  return (
    <ApplicationProvider>
      <StepsWrapper />
    </ApplicationProvider>
  );
};

export default ApplicationForm;
