import React, { useEffect, useContext } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ApplicationContext, FamilyInfo } from '../applicationContext';
import { Button } from '../../../components/Button';
import { InputField } from '../../../components/InputField';
import { SelectField } from '../../../components/SelectField';

interface FamilyFormValues extends FamilyInfo {}

const Step2: React.FC = () => {
  const { data, updateFamily, nextStep, prevStep } = useContext(ApplicationContext);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    watch,
  } = useForm<FamilyFormValues>({
    defaultValues: data.family,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  // 1) Reset when context changes
  useEffect(() => {
    reset(data.family);
  }, [data.family, reset]);

  // 2) Only update context when form is dirty
  const watchedValues = watch();
  useEffect(() => {
    if (isDirty) {
      updateFamily(watchedValues);
    }
  }, [watchedValues, isDirty, updateFamily]);

  const onSubmit: SubmitHandler<FamilyFormValues> = () => {
    nextStep();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Step 2: Family & Financial Info
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          label="Marital Status"
          id="maritalStatus"
          {...register('maritalStatus', { required: true })}
          error={errors.maritalStatus && 'Required'}
        >
          <option value="">Select</option>
          <option value="single">Single</option>
          <option value="married">Married</option>
          <option value="divorced">Divorced</option>
        </SelectField>

        <InputField
          label="Dependents"
          id="dependents"
          type="number"
          {...register('dependents', { required: true, valueAsNumber: true })}
          error={errors.dependents && 'Required'}
        />

        <SelectField
          label="Employment Status"
          id="employmentStatus"
          {...register('employmentStatus', { required: true })}
          error={errors.employmentStatus && 'Required'}
        >
          <option value="">Select</option>
          <option value="employed">Employed</option>
          <option value="unemployed">Unemployed</option>
          <option value="self-employed">Self-Employed</option>
        </SelectField>

        <InputField
          label="Monthly Income"
          id="monthlyIncome"
          type="number"
          {...register('monthlyIncome', { required: true, valueAsNumber: true })}
          error={errors.monthlyIncome && 'Required'}
        />

        <SelectField
          label="Housing Status"
          id="housingStatus"
          {...register('housingStatus', { required: true })}
          error={errors.housingStatus && 'Required'}
        >
          <option value="">Select</option>
          <option value="owned">Owned</option>
          <option value="rented">Rented</option>
          <option value="living with family">Living with Family</option>
        </SelectField>
      </div>
      <div className="flex justify-between mt-4">
        <Button variant="outline" type="button" onClick={prevStep}>
          Back
        </Button>
        <Button variant="primary" type="submit" disabled={!isValid}>
          Next
        </Button>
      </div>
    </form>
  );
};

export default Step2;