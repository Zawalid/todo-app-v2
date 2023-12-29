import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useUser } from '../../hooks';
import { Button } from '../Common/Button';
import { UploadImage } from './UploadImage';
import { UserVerificationModal } from './UserVerificationModal';
import { InputField } from '../Common/InputField';

export function EditProfile() {
  const { user, handleUpdateProfile } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState({
    src: '',
    file: null,
    type: '',
  });
  const [isUpdated, setIsUpdated] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setAvatar((avatar) => {
      return { ...avatar, src: user?.avatar || '' };
    });
  }, [user]);

  useEffect(() => {
    if (!name || !email) setIsUpdated(false);
  }, [name, email]);

  function handleSaveChanges() {
    if (name.length < 3) return toast.error('Name must be at least 3 characters long');
    if (!checkIsEmailValid(email)) return toast.error('Please enter a valid email');
    setIsVerificationModalOpen(true);
  }

  return (
    <>
      <div className='mt-8 space-y-5'>
        <div>
          <h3 className='mb-3 font-bold text-text-secondary'>Avatar</h3>
          <UploadImage
            avatar={avatar.src}
            onChange={(avatar) => {
              setAvatar(avatar);
              setIsUpdated(user?.avatar !== avatar.src);
            }}
          />
        </div>
        <div>
          <h3 className='mb-3 font-bold text-text-secondary'>Name</h3>
           <InputField
          type='text'
          placeholder='Name'
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setIsUpdated(user?.name.trim() !== e.target.value.trim());
          }}
        />
        </div>
        <div>
          <h3 className='mb-3 font-bold text-text-secondary'>Email</h3>
           <InputField
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setIsUpdated(user?.email.trim() !== e.target.value.trim());
          }}
        />
        </div>
      </div>
      <Button text='Save Changes' disabled={!isUpdated} onClick={handleSaveChanges} className='mr-0 px-3'/>
      {isVerificationModalOpen && (
        <UserVerificationModal
          onClose={() => setIsVerificationModalOpen(false)}
          onConfirm={async (password) => {
            setIsVerificationModalOpen(false);
            setIsUpdated(false);
            const toastId = toast.loading('Updating profile...');
            await handleUpdateProfile(name, email, password, avatar, toastId);
          }}
        />
      )}
    </>
  );
}

function checkIsEmailValid(email) {
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return emailRegex.test(email);
}
