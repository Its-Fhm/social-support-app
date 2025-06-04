import React, { useEffect, useContext } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ApplicationContext, FamilyInfo } from '../applicationContext';
import { Button } from '../../../components/Button';
import { InputField } from '../../../components/InputField';
import { SelectField } from '../../../components/SelectField';

interface FamilyFormValues extends FamilyInfo {}

const Step2: React.FC = () => {
  const { t } = useTranslation();
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
        {t('step2.heading')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          label={t('labels.maritalStatus')}
          id="maritalStatus"
          aria-invalid={!!errors.maritalStatus}
          aria-describedby={errors.maritalStatus ? 'maritalStatus-error' : undefined}
          {...register('maritalStatus', { required: t('errors.required') })}
          error={errors.maritalStatus?.message as string}
        >
          <option value="">{t('placeholders.select')}</option>
          <option value="single">{t('options.single')}</option>
          <option value="married">{t('options.married')}</option>
          <option value="divorced">{t('options.divorced')}</option>
        </SelectField>

        <InputField
          label={t('labels.dependents')}
          id="dependents"
          type="number"
          aria-invalid={!!errors.dependents}
          aria-describedby={errors.dependents ? 'dependents-error' : undefined}
          {...register('dependents', { required: t('errors.required'), valueAsNumber: true })}
          error={errors.dependents?.message as string}
        />

        <SelectField
          label={t('labels.employmentStatus')}
          id="employmentStatus"
          aria-invalid={!!errors.employmentStatus}
          aria-describedby={errors.employmentStatus ? 'employmentStatus-error' : undefined}
          {...register('employmentStatus', { required: t('errors.required') })}
          error={errors.employmentStatus?.message as string}
        >
          <option value="">{t('placeholders.select')}</option>
          <option value="employed">{t('options.employed')}</option>
          <option value="unemployed">{t('options.unemployed')}</option>
          <option value="self-employed">{t('options.selfEmployed')}</option>
        </SelectField>

        <InputField
          label={t('labels.monthlyIncome')}
          id="monthlyIncome"
          type="number"
          aria-invalid={!!errors.monthlyIncome}
          aria-describedby={errors.monthlyIncome ? 'monthlyIncome-error' : undefined}
          {...register('monthlyIncome', { required: t('errors.required'), valueAsNumber: true })}
          error={errors.monthlyIncome?.message as string}
        />

        <SelectField
          label={t('labels.housingStatus')}
          id="housingStatus"
          aria-invalid={!!errors.housingStatus}
          aria-describedby={errors.housingStatus ? 'housingStatus-error' : undefined}
          {...register('housingStatus', { required: t('errors.required') })}
          error={errors.housingStatus?.message as string}
        >
          <option value="">{t('placeholders.select')}</option>
          <option value="owned">{t('options.owned')}</option>
          <option value="rented">{t('options.rented')}</option>
          <option value="living with family">{t('options.livingWithFamily')}</option>
        </SelectField>
      </div>
      <div className="flex justify-between mt-4">
        <Button variant="outline" type="button" onClick={prevStep}>
          {t('buttons.back')}
        </Button>
        <Button variant="primary" type="submit" disabled={!isValid}>
          {t('buttons.next')}
        </Button>
      </div>
    </form>
  );
};

export default Step2;