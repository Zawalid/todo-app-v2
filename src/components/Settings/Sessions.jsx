import { Button } from './Button';

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
  return (
    <>
      <div>
        <h2 className='mb-3 text-2xl font-bold text-text-primary'>Your sessions</h2>
        <p className='text-sm text-text-tertiary'>
          This is a list of devices that have logged into your account.
        </p>
        <p className='text-sm text-text-tertiary'>Revoke any sessions that you do not recognize.</p>
      </div>
      <h3 className='mt-12 font-bold text-text-secondary'>Devices</h3>
      <div className='mt-3 space-y-5'>
        <Session />
        <Session />
        <Session />
      </div>
      <Button text='Sign out all devices' disabled={false} />
    </>
  );
}
function Session() {
  return (
    <div className='flex items-center justify-between gap-4 border-t pt-3'>
      <div className='grid h-12 w-12 place-content-center rounded-lg bg-background-tertiary'>
        <i className='fa-brands fa-chrome text-xl'></i>
      </div>
      <div className='flex-1'>
        <h4>Chrome on Macbook Pro</h4>
        <p className='text-sm text-text-tertiary'>196.75.103.59</p>
        <p className='text-sm text-text-tertiary'>Signed in Nov 17, 2023</p>
      </div>
      <button className='rounded-lg border px-3 py-2 text-sm font-medium text-text-primary shadow-sm transition-colors duration-300 hover:bg-background-tertiary'>
        Revoke
      </button>
    </div>
  );
}
