import { PiCheckBold, PiCheckSquareThin } from 'react-icons/pi';
import { Tab } from './Tab';
import Switch from '../../Common/Switch';

export default function Theme() {
  const themes = ['light', 'dark', 'rose', 'emerald', 'amber', 'teal'];

  return (
    <Tab  saveButton={{
      
      onClick: () => {},
      
    }}>
      <div className='space-y-5'>
        <div className='setting block'>
          <h4>Themes</h4>
          <p>Choose a theme for your interface.</p>
          <div className='mt-4 max-h-[325px] pr-1 overflow-auto grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3'>
            {themes.map((theme) => (
              <ThemeExample key={theme} theme={theme} />
            ))}
          </div>
        </div>
        <div className='setting'>
          <div>
            <h4>Auto Dark Mode</h4>
            <p>Automatically switch between light and dark themes when your system does.</p>
          </div>
          <Switch />
        </div>
      </div>
    </Tab>
  );
}

function ThemeExample({ theme }) {
  return (
    <button
      className={`theme ${theme} grid h-20  cursor-pointer grid-cols-[60px_auto] gap-1 overflow-hidden rounded-lg border border-border bg-background-primary`}
      onClick={() => (document.documentElement.className = theme)}
    >
      <span className='h-full space-y-1 rounded-sm bg-background-secondary p-2'>
        <span className='block h-1.5 w-full rounded-lg bg-primary'></span>
        <span className='block h-1.5 w-full rounded-lg bg-background-tertiary'></span>
        <span className='block h-1.5 w-full rounded-lg bg-background-tertiary'></span>
        <span className='block h-1.5 w-full rounded-lg bg-background-tertiary'></span>
      </span>
      <span className='flex flex-col gap-2 p-2'>
        <span className='flex items-center justify-between'>
          <span className='text-xs font-bold capitalize text-primary'>{theme}</span>
          <PiCheckBold className='text-sm text-primary' />
        </span>
        <span>
          <span className='flex items-center gap-1'>
            <PiCheckSquareThin className='text-sm text-text-tertiary' />
            <span className='h-2 flex-1 rounded-lg bg-background-tertiary'></span>
          </span>
          <span className='flex items-center gap-1'>
            <PiCheckSquareThin className='text-sm text-text-tertiary' />
            <span className='h-2 flex-1 rounded-lg bg-background-tertiary'></span>
          </span>
        </span>
      </span>
    </button>
  );
}
