import { PasswordInput } from '../../Common/PasswordInput';
import { useUser } from '../../../hooks';
import { Tab } from './Tab';
import { useReactHookForm } from '../useReactHookForm';
import { Controller } from 'react-hook-form';
import { Label } from '../../Common/Label';

export default function Password() {
  const { handleUpdatePassword } = useUser();
  const { control, isUpdated, isSubmitting, isValid, errors, onSubmit, onCancel, watch } =
    useReactHookForm({
      defaultValues: {
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      },
      mode: 'onChange',
      submit: async () =>
        await handleUpdatePassword(watch('currentPassword'), watch('newPassword')),
    });

  return (
    <Tab
      saveButton={{
        text: 'Change Password',
        onClick: onSubmit,
        disabled: !isUpdated || !isValid || isSubmitting,
      }}
      cancelButton={{
        onClick: onCancel,
        disabled: !isUpdated || !isValid,
      }}
      control={control}
    >
      <div className='space-y-5'>
        <div>
          <Label
            htmlFor='currentPassword'
            error={errors?.currentPassword?.message}
            label='Current password'
          />
          <Controller
            control={control}
            name='currentPassword'
            render={({ field }) => (
              <PasswordInput id='currentPassword' placeholder='Current password' {...field} />
            )}
            rules={{
              required: 'Please enter your current password',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters long',
              },
            }}
          />
        </div>
        <div>
          <Label htmlFor='newPassword' label='New password' error={errors?.newPassword?.message} />
          <Controller
            control={control}
            name='newPassword'
            render={({ field }) => (
              <PasswordInput id='newPassword' placeholder='New password' {...field} />
            )}
            rules={{
              required: 'Please enter your new password',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters long',
              },
            }}
          />
        </div>
        <div>
          <Label
            htmlFor='confirmNewPassword'
            label='Confirm new password'
            error={errors?.confirmNewPassword?.message}
          />
          <Controller
            control={control}
            name='confirmNewPassword'
            render={({ field }) => (
              <PasswordInput
                id='confirmNewPassword'
                placeholder='Confirm new password'
                {...field}
              />
            )}
            rules={{
              required: 'Please confirm your new password',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters long',
              },
              validate: (value) => value === watch('newPassword') || 'Passwords do not match',
            }}
          />
        </div>
      </div>
    </Tab>
  );
}
