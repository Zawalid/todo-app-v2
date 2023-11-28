import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SpinnerLoader } from '../Common/SpinnerLoader';
import { useUser } from '../../hooks';
import { Button } from '../Common/Button';

const BROWSERS_IMAGES = [
  {
    name: 'Chrome',
    image: 'https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.0.0/chrome/chrome.png',
  },
  {
    name: 'Firefox',
    image: 'https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.0.0/firefox/firefox.png',
  },
  {
    name: 'Yandex',
    image: 'https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.0.0/yandex/yandex.png',
  },
  {
    name: 'Safari',
    image: 'https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.0.0/safari/safari.png',
  },
  {
    name: 'Brave',
    image: 'https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.0.0/brave/brave.png',
  },
  {
    name: 'Edge',
    image: 'https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.0.0/edge/edge.png',
  },
  {
    name: 'Opera',
    image: 'https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.0.0/opera/opera.png',
  },
];

export function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { handleGetSessions, handleDeleteSession, handleDeleteSessions } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSessions() {
      const sessions = await handleGetSessions();
      setSessions(sessions);
      setIsLoading(false);
    }
    fetchSessions();
  }, []);

  async function deleteSession(sessionId) {
    await handleDeleteSession(sessionId);
    setSessions((sessions) => sessions.filter((session) => session.$id !== sessionId));
  }

  return (
    <>
      <div>
        <h2 className='mb-3 text-2xl font-bold text-text-primary'>Your sessions</h2>
        <p className='text-sm text-text-tertiary'>
          This is a list of devices that have logged into your account.
        </p>
        <p className='text-sm text-text-tertiary'>Revoke any sessions that you do not recognize.</p>
      </div>
      <h3 className='mt-12 font-bold text-text-secondary'>Devices ({sessions?.length || '-'})</h3>
      <div className='relative mt-3 h-[200px] space-y-5 overflow-auto pr-3'>
        {isLoading ? (
          <SpinnerLoader />
        ) : sessions?.length === 0 ? (
          <div className=' grid h-full place-content-center'>
            <p className='text-sm text-text-tertiary'>No active sessions</p>
          </div>
        ) : !sessions ? (
          <div className=' grid h-full place-content-center'>
            <p className='text-sm text-text-tertiary'>
              Something went wrong. Please try again later.
            </p>
          </div>
        ) : (
          sessions?.map((session) => (
            <Session key={session.$id} session={session} onDelete={deleteSession} />
          ))
        )}
      </div>
      <Button
        text='Sign out all devices'
        disabled={false}
        onClick={async () => {
          await handleDeleteSessions();
          navigate('/sign-in');
        }}
      />
    </>
  );
}
function Session({ session, onDelete }) {
  const {
    clientName: browserName,
    ip,
    deviceName,
    countryName,
    $createdAt: signedInAt,
    $id,
    current,
  } = session;

  const browserImage = BROWSERS_IMAGES.find((browser) =>
    browserName.toLowerCase().includes(browser.name.toLowerCase()),
  );

  return (
    <div className='flex items-center justify-between gap-4 border-t pt-3'>
      <div className='grid h-12 w-12 place-content-center rounded-lg bg-background-tertiary p-1'>
        <img src={browserImage?.image} alt={browserName} />
      </div>
      <div className='flex-1 space-y-1'>
        <h4>
          {browserName || 'Unknown Browser'} on{' '}
          {deviceName[0].toUpperCase() + deviceName.slice(1) || 'Unknown Device'}
        </h4>
        <p className='text-sm text-text-tertiary'>
          {ip || 'Unknown IP'} - {countryName || 'Unknown Location'}
        </p>
        <p className='text-sm text-text-tertiary'>
          Signed in{' '}
          {new Intl.DateTimeFormat('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
          }).format(new Date(signedInAt))}
        </p>
        {current && (
          <p className='text-sm text-text-tertiary'>
            <i className='fa-solid fa-circle-check text-blue-400'></i> Current Session
          </p>
        )}
      </div>
      <button
        className='rounded-lg border px-3 py-2 text-sm font-medium text-text-primary shadow-sm transition-colors duration-300 hover:bg-indigo-600 hover:text-white'
        onClick={() => onDelete(current ? 'current' : $id)}
      >
        Revoke
      </button>
    </div>
  );
}
