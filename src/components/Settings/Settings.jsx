import { useEffect, useState } from 'react';
import { Content } from './Content';
import { Panel } from './Panel';
import Modal from '../Common/Modal';
import { PiArrowRight, PiX } from 'react-icons/pi';
import { useUser } from '../../hooks';
import { useSelector } from 'react-redux';

export default function Settings({ isOpen, onClose }) {
  const [currentTab, setCurrentTab] = useState('account');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [key, setKey] = useState();
  const { handleSendVerificationEmail } = useUser();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    setCurrentTab('account');
    setKey(Math.random());
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className='relative h-full w-full overflow-hidden sm:flex-row md:h-[90%] md:w-5/6 md:border lg:w-3/4'
    >
      <div className='absolute left-0 top-0 flex w-full justify-between border-b border-border bg-background-primary px-5 py-2 sm:left-[200px] sm:w-[calc(100%-200px)]'>
        <h3 className='text-lg font-bold capitalize text-text-primary sm:text-xl'>{currentTab}</h3>
        <div className='flex gap-2'>
          <button
            className='icon-button not-active small  sm:hidden'
            onClick={() => setIsPanelOpen(!isPanelOpen)}
          >
            <PiArrowRight className={isPanelOpen ? 'rotate-180' : ''} />
          </button>
          <button
            className='icon-button  not-active small text-text-tertiary'
            onClick={onClose}
          >
            <PiX />
          </button>
        </div>
      </div>
      <Panel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />
      <Content currentTab={currentTab} key={key} />

      {!user?.emailVerification && (
        <div
          className='absolute left-0 top-0 flex w-full items-center justify-between bg-red-500 px-5 py-2 sm:left-[200px] sm:w-[calc(100%-200px)] md:py-3
        '
        >
          <p className='text-sm text-white'>
            Your account is not verified. Please check your email and verify your account.
          </p>
          <button
            className='text-sm text-white underline underline-offset-2 hover:text-gray-200'
            onClick={handleSendVerificationEmail}
          >
            Resend
          </button>
        </div>
      )}
    </Modal>
  );
}
