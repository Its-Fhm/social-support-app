// src/features/applicationForm/steps/Step3.tsx

import React, { useEffect, useContext, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ApplicationContext,
  ApplicationData,
  SituationInfo,
} from '../applicationContext';
import { TextAreaField } from '../../../components/TextAreaField';
import { Button } from '../../../components/Button';
import { useAiSuggestion } from '../../../hooks/useAiSuggestion';
import { situationSchema, SituationSchema } from '../../../utils/validators';

const Step3: React.FC = () => {
  const { data, updateSituation, prevStep, resetApplication } =
    useContext(ApplicationContext);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<SituationSchema>({
    defaultValues: data.situation,
    resolver: zodResolver(situationSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const { loading, error, sections, generate } = useAiSuggestion();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalText, setModalText] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  useEffect(() => {
    reset(data.situation);
  }, [data.situation, reset]);

  const watchedValues = watch() as SituationInfo;
  useEffect(() => {
    const orig = data.situation;
    if (
      watchedValues.currentFinancial !== orig.currentFinancial ||
      watchedValues.employmentCircumstances !== orig.employmentCircumstances ||
      watchedValues.reason !== orig.reason
    ) {
      updateSituation(watchedValues);
    }
  }, [watchedValues, data.situation, updateSituation]);

  const onSubmit: SubmitHandler<SituationSchema> = () => {
    setSubmitted(true);
  };

  const handleHelpClick = async () => {
    const currentSituation = watch() as SituationInfo;
    const fullData: ApplicationData = {
      personal: data.personal,
      family: data.family,
      situation: currentSituation,
    };

    const result = await generate(fullData);
    if (result) {
      const combined = [
        `Current Financial Situation:\n${result.currentFinancial}`,
        '',
        `Employment Circumstances:\n${result.employmentCircumstances}`,
        '',
        `Reason for Applying:\n${result.reason}`,
      ].join('\n');

      setModalText(combined);
      setShowModal(true);
    }
  };

  const onAccept = () => {
    const financialPattern =
      /^Current Financial Situation:\s*([\s\S]*?)(?=\n[A-Za-z ]+?:|$)/im;
    const employmentPattern =
      /Employment Circumstances:\s*([\s\S]*?)(?=\n[A-Za-z ]+?:|$)/im;
    const reasonPattern = /Reason for Applying:\s*([\s\S]*)$/im;

    const financialMatch = financialPattern.exec(modalText);
    const employmentMatch = employmentPattern.exec(modalText);
    const reasonMatch = reasonPattern.exec(modalText);

    const updated: SituationInfo = {
      currentFinancial:
        financialMatch?.[1]?.trim() || data.situation.currentFinancial,
      employmentCircumstances:
        employmentMatch?.[1]?.trim() ||
        data.situation.employmentCircumstances,
      reason: reasonMatch?.[1]?.trim() || data.situation.reason,
    };

    updateSituation(updated);
    reset(updated);
    setShowModal(false);
  };

  const onDiscard = () => {
    setModalText('');
    setShowModal(false);
  };

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Success!
        </h2>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          Your application has been successfully submitted.
        </p>
        <div className="flex justify-center">
          <Button
            variant="primary"
            onClick={() => {
              resetApplication();
            }}
          >
            Submit a New Application
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Step 3: Situation Descriptions
        </h2>

        <TextAreaField
          id="currentFinancial"
          label="Current Financial Situation"
          error={errors.currentFinancial?.message}
          {...register('currentFinancial', { required: true })}
        />
        <TextAreaField
          id="employmentCircumstances"
          label="Employment Circumstances"
          error={errors.employmentCircumstances?.message}
          {...register('employmentCircumstances', { required: true })}
        />
        <TextAreaField
          id="reason"
          label="Reason for Applying"
          error={errors.reason?.message}
          {...register('reason', { required: true })}
        />

        {error && <p className="text-red-500">{error}</p>}

        <div className="flex flex-col sm:flex-row justify-between mt-4 space-y-2 sm:space-y-0 sm:space-x-2">
          <Button variant="outline" type="button" onClick={prevStep}>
            Back
          </Button>
          <Button
            variant="ghost"
            type="button"
            onClick={handleHelpClick}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? 'Generating…' : 'Help Me Write'}
          </Button>
          <Button variant="primary" type="submit" disabled={!isValid}>
            Submit
          </Button>
        </div>
      </form>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg max-w-lg w-full">
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
              AI‐Generated Suggestions
            </h3>
            <textarea
              value={modalText}
              onChange={(e) => setModalText(e.target.value)}
              className="w-full h-64 mb-4 p-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onDiscard}>
                Discard
              </Button>
              <Button variant="primary" onClick={onAccept}>
                Accept
              </Button>
              <Button variant="ghost" onClick={() => setShowModal(false)}>
                Edit
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Step3;