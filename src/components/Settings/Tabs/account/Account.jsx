import { useState } from 'react';
import { toast } from 'sonner';
import { useUser } from '../../../../hooks';
import { UploadImage } from './UploadImage';
import { UserVerificationModal } from '../../UserVerificationModal';
import { InputField } from '../../../Common/InputField';
import { Tab } from '../Tab';
import { useReactHookForm } from '../../useReactHookForm';
import { Controller, useWatch } from 'react-hook-form';
import { Label } from '../../../Common/Label';

export default function Account() {
  const { getCurrentUser, handleUpdateProfile } = useUser();
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const {
    control,
    isUpdated,
    dirtyFields,
    isLoading,
    isSubmitting,
    isValid,
    errors,
    setValue,
    onSubmit,
    onCancel,
  } = useReactHookForm({
    defaultValues: async () => {
      const user = await getCurrentUser();
      return {
        name: user.name,
        email: user.email,
        avatar: {
          src: user.avatar,
        },
      };
    },
    submit: handleSaveChanges,
    mode: 'onChange',
  });

  const [name, email, avatar] = useWatch({ control, name: ['name', 'email', 'avatar'] }) || {};

  const onUpdate = async (password) => await handleUpdateProfile(name, email, password, avatar);

  async function handleSaveChanges() {
    if (dirtyFields.email) return setIsVerificationModalOpen(true);
    await onUpdate('');
  }

  return (
    <Tab
      saveButton={{
        onClick: onSubmit,
        disabled: !isUpdated || !isValid,
      }}
      cancelButton={{
        onClick: onCancel,
        disabled: !isUpdated || !isValid,
      }}
      control={control}
    >
      <div className='space-y-5'>
        <div>
          <h3 className='mb-3 font-bold text-text-secondary'>Avatar</h3>
          <UploadImage
            onChange={(avatar) => setValue('avatar', avatar, { shouldDirty: true })}
            control={control}
            disabled={isLoading || isSubmitting}
          />
        </div>
        <div>
          <Label htmlFor='name' label='Name' error={errors?.name?.message} />
          <Controller
            name='name'
            control={control}
            render={({ field }) => (
              <InputField
                id='name'
                type='text'
                placeholder='Name'
                {...field}
                value={field.value || ''}
                disabled={isLoading || isSubmitting}
              />
            )}
            rules={{
              required: 'Please enter your name',
              minLength: {
                value: 3,
                message: 'Name must be at least 3 characters long',
              },
            }}
          />
        </div>
        <div>
          <Label htmlFor='email' label='Email' error={errors?.email?.message} />
          <Controller
            name='email'
            control={control}
            render={({ field }) => (
              <InputField
                id='email'
                type='email'
                placeholder='Email'
                {...field}
                value={field.value || ''}
                disabled={isLoading || isSubmitting}
              />
            )}
            rules={{
              required: 'Please enter your email address',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: 'Invalid email address',
              },
            }}
          />
        </div>
      </div>

      <UserVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => {
          setIsVerificationModalOpen(false);
          onCancel();
        }}
        onConfirm={async (password) => {
          if (password.length < 8)
            return toast.error('Password must be at least 8 characters long');
          setIsVerificationModalOpen(false);
          onUpdate(password);
        }}
      />
    </Tab>
  );
}
