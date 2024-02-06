import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { updateSettings } from '../../app/settingsSlice';
import { useEffect } from 'react';

export function useReactHookForm({ settingCategory, defaultValues, submit, mode }) {
  const setting = useSelector((state) => state.settings[settingCategory]);
  const isDefaultSettings = useSelector((state) => state.settings.isDefault);
  const dispatch = useDispatch();

  let defValues;
  if (defaultValues && typeof defaultValues === 'function') {
    defaultValues().then((v) => (defValues = v));
  } else defValues = setting;

  const {
    handleSubmit,
    reset,
    formState: { isDirty: isUpdated, errors, dirtyFields, isLoading, isSubmitting, isValid },
    control,
    setValue,
    watch,
  } = useForm({ defaultValues: defaultValues || setting, mode: mode || 'onSubmit' });

  const onSubmit = () => {
    handleSubmit((data) => {
      submit
        ? submit(data)
        : dispatch(updateSettings({ category: settingCategory, settings: data }));
      reset(data);
    })();
  };
  const onCancel = (callback) => {
    reset(defValues);
    callback?.(defValues);
  };

  useEffect(() => {
    if (isDefaultSettings) reset(defValues);
  }, [isDefaultSettings, defValues, reset]);

  return {
    control,
    isUpdated,
    errors,
    dirtyFields,
    isLoading,
    isSubmitting,
    isValid,
    setValue,
    onSubmit,
    onCancel,
    watch,
  };
}
