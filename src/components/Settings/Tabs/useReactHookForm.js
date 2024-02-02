import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { updateSettings } from '../../../app/settingsSlice';

export function useReactHookForm(settingCategory) {
  const setting = useSelector((state) => state.settings[settingCategory]);
  const dispatch = useDispatch();
  const {
    handleSubmit,
    reset,
    formState: { isDirty: isUpdated, defaultValues },
    control,
    setValue,
    getValues,
  } = useForm({ defaultValues: setting });

  const onSubmit = () => {
    handleSubmit((data) => {
      dispatch(updateSettings({ category: settingCategory, settings: data }));
      reset(data);
    })();
  };
  const onCancel = (callback) => {
    reset(setting);
    callback?.(setting);
  };

  return {
    control,
    isUpdated,
    defaultValues,
    setValue,
    getValues,
    onSubmit,
    onCancel,
  };
}
