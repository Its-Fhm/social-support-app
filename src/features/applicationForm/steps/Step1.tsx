// src/features/applicationForm/steps/Step1.tsx

import React, { useEffect, useContext } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ApplicationContext, PersonalInfo } from '../applicationContext';
import { Button } from '../../../components/Button';
import { InputField } from '../../../components/InputField';
import { SelectField } from '../../../components/SelectField';

interface PersonalFormValues extends PersonalInfo {}

const Step1: React.FC = () => {
  const { data, updatePersonal, nextStep, resetApplication } = useContext(ApplicationContext);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    watch,
  } = useForm<PersonalFormValues>({
    defaultValues: data.personal,
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  // Sync context if fields changed
  useEffect(() => {
    reset(data.personal);
  }, [data.personal, reset]);

  const watchedValues = watch();
  useEffect(() => {
    if (isDirty) updatePersonal(watchedValues);
  }, [watchedValues, isDirty, updatePersonal]);

  const onSubmit: SubmitHandler<PersonalFormValues> = () => {
    nextStep();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
        Step 1: Personal Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Name"
          id="name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          {...register('name', { required: 'Name is required' })}
          error={errors.name?.message}
        />

        <InputField
          label="National ID"
          id="nationalId"
          aria-invalid={!!errors.nationalId}
          aria-describedby={errors.nationalId ? 'nationalId-error' : undefined}
          {...register('nationalId', {
            required: 'National ID is required',
            pattern: {
              value: /^\d{10}$/,
              message: 'National ID must be exactly 10 digits',
            },
          })}
          error={errors.nationalId?.message}
        />

        <InputField
          label="Date of Birth"
          type="date"
          id="dob"
          aria-invalid={!!errors.dob}
          aria-describedby={errors.dob ? 'dob-error' : undefined}
          {...register('dob', { required: 'Date of Birth is required' })}
          error={errors.dob?.message}
        />

        <SelectField
          label="Gender"
          id="gender"
          aria-invalid={!!errors.gender}
          aria-describedby={errors.gender ? 'gender-error' : undefined}
          {...register('gender', { required: 'Gender is required' })}
          error={errors.gender?.message}
        >
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </SelectField>

        <InputField
          label="Address"
          id="address"
          aria-invalid={!!errors.address}
          aria-describedby={errors.address ? 'address-error' : undefined}
          {...register('address', { required: 'Address is required' })}
          error={errors.address?.message}
        />

        <InputField
          label="City"
          id="city"
          aria-invalid={!!errors.city}
          aria-describedby={errors.city ? 'city-error' : undefined}
          {...register('city', { required: 'City is required' })}
          error={errors.city?.message}
        />

        <InputField
          label="State"
          id="state"
          aria-invalid={!!errors.state}
          aria-describedby={errors.state ? 'state-error' : undefined}
          {...register('state', { required: 'State is required' })}
          error={errors.state?.message}
        />

        <InputField
          label="Country"
          id="country"
          aria-invalid={!!errors.country}
          aria-describedby={errors.country ? 'country-error' : undefined}
          {...register('country', { required: 'Country is required' })}
          error={errors.country?.message}
        />

        <InputField
          label="Phone"
          id="phone"
          type="tel"
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
          {...register('phone', {
            required: 'Phone is required',
            pattern: {
              value: /^[0-9+\-()\s]{7,}$/,
              message: 'Enter a valid phone number',
            },
          })}
          error={errors.phone?.message}
        />

        <InputField
          label="Email"
          id="email"
          type="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email address',
            },
          })}
          error={errors.email?.message}
        />
      </div>

      {/* Reset + Next */}
      <div className="flex justify-between items-center mt-4">
        <Button variant="outline" onClick={resetApplication}>
          Reset All
        </Button>
        <Button variant="primary" type="submit" disabled={!isValid}>
          Next
        </Button>
      </div>
    </form>
  );
};

export default Step1;