import React, { useEffect, useContext } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ApplicationContext, PersonalInfo } from '../applicationContext';
import { Button } from '../../../components/Button';
import { InputField } from '../../../components/InputField';
import { SelectField } from '../../../components/SelectField';

interface PersonalFormValues extends PersonalInfo {}

const Step1: React.FC = () => {
  const { t } = useTranslation();
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

  // Custom validator for National ID: count digits and show remaining if not 10
  const validateNationalId = (value: string) => {
    const digitCount = (value.match(/\d/g) || []).length;
    if (digitCount === 10) return true;
    const remaining = 10 - digitCount;
    return t('errors.nationalIdRemaining', { count: remaining });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
        {t('step1.heading')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label={t('labels.name')}
          id="name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          {...register('name', { required: t('errors.nameRequired') })}
          error={errors.name?.message as string}
        />

        <InputField
          label={t('labels.nationalId')}
          id="nationalId"
          aria-invalid={!!errors.nationalId}
          aria-describedby={errors.nationalId ? 'nationalId-error' : undefined}
          {...register('nationalId', {
            required: t('errors.nationalIdRequired'),
            validate: validateNationalId,
          })}
          error={errors.nationalId?.message as string}
        />

        <InputField
          label={t('labels.dob')}
          type="date"
          id="dob"
          aria-invalid={!!errors.dob}
          aria-describedby={errors.dob ? 'dob-error' : undefined}
          {...register('dob', { required: t('errors.dobRequired') })}
          error={errors.dob?.message as string}
        />

        <SelectField
          label={t('labels.gender')}
          id="gender"
          aria-invalid={!!errors.gender}
          aria-describedby={errors.gender ? 'gender-error' : undefined}
          {...register('gender', { required: t('errors.genderRequired') })}
          error={errors.gender?.message as string}
        >
          <option value="">{t('placeholders.select')}</option>
          <option value="male">{t('options.male')}</option>
          <option value="female">{t('options.female')}</option>
          <option value="other">{t('options.other')}</option>
        </SelectField>

        <InputField
          label={t('labels.address')}
          id="address"
          aria-invalid={!!errors.address}
          aria-describedby={errors.address ? 'address-error' : undefined}
          {...register('address', { required: t('errors.addressRequired') })}
          error={errors.address?.message as string}
        />

        <InputField
          label={t('labels.city')}
          id="city"
          aria-invalid={!!errors.city}
          aria-describedby={errors.city ? 'city-error' : undefined}
          {...register('city', { required: t('errors.cityRequired') })}
          error={errors.city?.message as string}
        />

        <InputField
          label={t('labels.state')}
          id="state"
          aria-invalid={!!errors.state}
          aria-describedby={errors.state ? 'state-error' : undefined}
          {...register('state', { required: t('errors.stateRequired') })}
          error={errors.state?.message as string}
        />

        <InputField
          label={t('labels.country')}
          id="country"
          aria-invalid={!!errors.country}
          aria-describedby={errors.country ? 'country-error' : undefined}
          {...register('country', { required: t('errors.countryRequired') })}
          error={errors.country?.message as string}
        />

        <InputField
          label={t('labels.phone')}
          id="phone"
          type="tel"
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
          {...register('phone', {
            required: t('errors.phoneRequired'),
            pattern: {
              value: /^[0-9+\-()\s]{7,}$/,
              message: t('errors.invalidPhone'),
            },
          })}
          error={errors.phone?.message as string}
        />

        <InputField
          label={t('labels.email')}
          id="email"
          type="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          {...register('email', {
            required: t('errors.emailRequired'),
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: t('errors.invalidEmail'),
            },
          })}
          error={errors.email?.message as string}
        />
      </div>

      {/* Reset + Next */}
      <div className="flex justify-between items-center mt-4">
        <Button variant="outline" onClick={resetApplication}>
          {t('buttons.resetAll')}
        </Button>
        <Button variant="primary" type="submit" disabled={!isValid}>
          {t('buttons.next')}
        </Button>
      </div>
    </form>
  );
};

export default Step1;