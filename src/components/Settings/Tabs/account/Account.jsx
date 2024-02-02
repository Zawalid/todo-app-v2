import { useState } from 'react';
import { toast } from 'sonner';
import { useUser } from '../../../../hooks';
import { UploadImage } from './UploadImage';
import { UserVerificationModal } from '../../UserVerificationModal';
import { InputField } from '../../../Common/InputField';
import { Tab } from '../Tab';
import { useReactHookForm } from '../../useReactHookForm';
import { Controller, useWatch } from 'react-hook-form';
import { PiInfo } from 'react-icons/pi';
import CustomTippy from '../../../Common/CustomTippy';

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
        account: {
          name: user.name,
          email: user.email,
          avatar: {
            src: user.avatar,
          },
        },
      };
    },
    submit: handleSaveChanges,
    mode: 'onChange',
  });

  const { name, email, avatar } = useWatch({ control, name: 'account' }) || {};

  const onUpdate = async (password) => await handleUpdateProfile(name, email, password, avatar);

  async function handleSaveChanges() {
    if (dirtyFields.account.email) return setIsVerificationModalOpen(true);
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
            onChange={(avatar) => setValue('account.avatar', avatar, { shouldDirty: true })}
            control={control}
            disabled={isLoading || isSubmitting}
          />
        </div>
        <div>
          <div className='mb-3 flex  items-center gap-3'>
            <h3 className='font-bold text-text-secondary'>Name</h3>
            {errors?.account?.name && (
              <CustomTippy content={errors?.account?.name?.message}>
                <span>
                  <PiInfo className='text-red-500' size={20} />
                </span>
              </CustomTippy>
            )}
          </div>
          <Controller
            name='account.name'
            control={control}
            render={({ field }) => (
              <InputField
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
          <div className='mb-3 flex  items-center gap-3'>
            <h3 className='font-bold text-text-secondary'>Email</h3>
            {errors?.account?.email && (
              <CustomTippy content={errors?.account?.email?.message}>
                <span>
                  <PiInfo className='text-red-500' size={20} />
                </span>
              </CustomTippy>
            )}
          </div>
          <Controller
            name='account.email'
            control={control}
            render={({ field }) => (
              <InputField
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
        onClose={() => setIsVerificationModalOpen(false)}
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
