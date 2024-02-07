import { useEffect, useState } from 'react';
import { useUser } from '../../../hooks';
import { Tab } from './Tab';
import { useModal } from '../../../hooks/useModal';
import { Button } from '../../Common/Button';
import { useAutoAnimate } from '../../../hooks/useAutoAnimate';
import { useFormatDateAndTime } from '../../../hooks/useFormatDateAndTime';

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

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { handleGetSessions, handleDeleteSession, handleDeleteSessions } = useUser();
  const [parent] = useAutoAnimate({ duration: 300 });
  const { openModal: confirmRevoke } = useModal();

  useEffect(() => {
    async function fetchSessions() {
      const sessions = await handleGetSessions();
      setSessions(sessions || []);
      setIsLoading(false);
    }
    fetchSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function deleteSession(sessionId) {
    confirmRevoke({
      title: 'Revoke Session',
      message: 'Are you sure you want to revoke this session?',
      onConfirm: async () => {
        await handleDeleteSession(sessionId);
        setSessions((sessions) => sessions.filter((session) => session.$id !== sessionId));
      },
      showCheckbox: false,
      confirmText: 'Revoke',
    });
  }

  return (
    <Tab
      saveButton={{
        text: 'Revoke All',
        type: 'delete',
        onClick: async () => {
          confirmRevoke({
            title: 'Revoke All Sessions',
            message: 'Are you sure you want to revoke all sessions?',
            onConfirm: async () => {
              const sessionsIds = sessions
                .filter((session) => !session.current)
                .map((session) => session.$id);
              await handleDeleteSessions(sessionsIds);
              setSessions((prev) => prev.filter((session) => session.current));
            },
            showCheckbox: false,
            confirmText: 'Revoke All',
          });
        },
        disabled: sessions.length === 1 || isLoading,
        className: 'mr-0 px-3 text-sm',
      }}
    >
      <div>
        <p className='text-sm font-medium text-text-tertiary'>
          This is a list of devices that have logged into your account.
        </p>
        <p className='text-sm font-medium text-text-tertiary'>
          Revoke any sessions that you do not recognize.
        </p>
      </div>
      <h3 className='mt-7 pb-2 font-bold text-text-secondary'>This Device</h3>
      {isLoading ? (
        <Skeleton />
      ) : (
        <Session session={sessions.find((session) => session.current)} onDelete={deleteSession} />
      )}
      <h3 className='mt-7 font-bold text-text-secondary'>
        Active Sessions ({sessions.filter((session) => !session.current).length || '-'})
      </h3>
      <div className='mt-2 space-y-5 pb-3' ref={parent}>
        {isLoading ? (
          Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} />)
        ) : sessions.length === 1 ? ( // 1 is the current
          <NoSessions />
        ) : !sessions ? (
          <Error />
        ) : (
          sessions
            .filter((session) => !session.current)
            .map((session) => (
              <Session key={session.$id} session={session} onDelete={deleteSession} />
            ))
        )}
      </div>
    </Tab>
  );
}

function Session({ session, onDelete }) {
  const format = useFormatDateAndTime();

  if (!session) return null;
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
    <div className='flex items-center justify-between gap-4 border-t border-border pt-3'>
      <div className='grid h-12 w-12 place-content-center rounded-lg bg-background-tertiary p-1'>
        <img src={browserImage?.image} alt={browserName} />
      </div>
      <div className='flex-1 space-y-1'>
        <h4 className='text-sm font-semibold text-text-secondary sm:text-base'>
          {browserName || 'Unknown Browser'} on{' '}
          {deviceName[0].toUpperCase() + deviceName.slice(1) || 'Unknown Device'}
        </h4>
        <p className='text-xs font-medium text-text-tertiary sm:text-sm'>
          {ip || 'Unknown IP'} - {countryName || 'Unknown Location'}
        </p>
        <p className='text-xs font-medium text-text-tertiary sm:text-sm'>
          Signed in {format(new Date(signedInAt))}
        </p>
      </div>
      {current || (
        <Button
          type='outline-delete'
          size={window.matchMedia('(max-width : 640px)').matches ? 'small' : 'default'}
          onClick={() => onDelete($id)}
        >
          Revoke
        </Button>
      )}
    </div>
  );
}

function NoSessions() {
  return (
    <div className=' grid h-40 place-content-center'>
      <p className='text-sm text-text-tertiary'>No active sessions</p>
    </div>
  );
}

function Error() {
  return (
    <div className=' grid h-40 place-content-center'>
      <p className='text-sm text-text-tertiary'>Something went wrong. Please try again later.</p>
    </div>
  );
}

function Skeleton() {
  return (
    <div className='flex animate-pulse items-center justify-between gap-4 border-t border-border pt-3'>
      <div className='grid h-12 w-12  place-content-center rounded-lg bg-background-tertiary p-1'>
        <img src='' alt='' />
      </div>
      <div className='flex-1 space-y-1'>
        <div className='h-4  rounded-sm bg-background-tertiary'></div>
        <div className='h-3  rounded-sm bg-background-tertiary'></div>
        <div className='h-3  rounded-sm bg-background-tertiary'></div>
      </div>
      <div className='h-9 w-[75px]  rounded-lg bg-background-tertiary text-sm font-medium text-text-primary'></div>
    </div>
  );
}
