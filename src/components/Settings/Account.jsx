import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useUser } from '../../hooks';
import { Button } from '../Common/Button';
import { UploadImage } from './UploadImage';
import { UserVerificationModal } from './UserVerificationModal';
import { InputField } from '../Common/InputField';
import { checkIsEmailValid } from '../../utils/helpers';

export function Account() {
  const { user, handleUpdateProfile } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState({
    src: '',
    file: null,
    type: '',
  });
  const [isUpdated, setIsUpdated] = useState({ name: false, email: false, avatar: false });
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setAvatar((avatar) => {
      return { ...avatar, src: user?.avatar || '' };
    });
  }, [user]);

  useEffect(() => {
    if (!name || !email)
      setIsUpdated((prev) => {
        return {
          ...prev,
          name: false,
          email: false,
        };
      });
  }, [name, email]);

  const onUpdate = async (password) => {
    setIsUpdated({
      name: false,
      email: false,
      avatar: false,
    });
    await handleUpdateProfile(name, email, password, avatar);
  };

  function handleSaveChanges() {
    if (name.length < 3) return toast.error('Name must be at least 3 characters long');
    if (!checkIsEmailValid(email)) return toast.error('Please enter a valid email');
    // This will open the verification modal if the user is updating their email
    if (isUpdated.email) return setIsVerificationModalOpen(true);
    onUpdate('');
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
              setIsUpdated((prev) => {
                return { ...prev, avatar: user?.avatar !== avatar.src };
              });
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
              setIsUpdated((prev) => {
                return { ...prev, name: user?.name.trim() !== e.target.value.trim() };
              });
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
              setIsUpdated((prev) => {
                return { ...prev, email: user?.email.trim() !== e.target.value.trim() };
              });
            }}
          />
        </div>
      </div>
      <Button
        text='Save Changes'
        disabled={
          Object.values(isUpdated).every((value) => !value) || (!avatar.file && !avatar.src)
        }
        onClick={handleSaveChanges}
        className='mr-0 px-3'
      />
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
    </>
  );
}
