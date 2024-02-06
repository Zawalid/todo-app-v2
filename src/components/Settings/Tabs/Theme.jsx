import { PiCheckBold, PiCheckSquareThin } from 'react-icons/pi';
import Switch from '../../Common/Switch';
import { Controller, useWatch } from 'react-hook-form';
import { useReactHookForm } from '../useReactHookForm';
import { Tab } from './Tab';

const themes = ['indigo', 'green', 'red', 'orange', 'purple', 'teal','crimson', 'maroon'];

export default function Theme() {
  const { control, isUpdated, setValue, onSubmit, onCancel } = useReactHookForm({
    settingCategory: 'theme',
  });
  const currentTheme = useWatch({ control, name: 'primaryTheme' });

  return (
    <Tab
      saveButton={{
        onClick: onSubmit,
        disabled: !isUpdated,
      }}
      cancelButton={{
        onClick: () =>
          onCancel((setting) => (document.documentElement.className = setting.primaryTheme)),
        disabled: !isUpdated,
      }}
      control={control}
    >
      <div className='space-y-5'>
        <div className='setting done block'>
          <h4>Themes</h4>
          <p>Choose a theme for your interface.</p>
          <div className='mt-4 grid max-h-[360px] grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3 overflow-auto pr-1'>
            {themes.map((theme) => (
              <ThemeExample
                key={theme}
                theme={theme}
                onSelect={() => setValue('primaryTheme', theme, { shouldDirty: true })}
                isCurrent={currentTheme === theme}
              />
            ))}
          </div>
          <Controller
            name='primaryTheme'
            control={control}
            render={({ field }) => <input type='hidden' {...field} />}
          />
        </div>
        <div className='setting '>
          <div>
            <h4>Auto Dark Mode</h4>
            <p>Automatically switch between light and dark themes when your system does.</p>
          </div>
          <Controller
            name='autoDarkMode'
            control={control}
            render={({ field }) => <Switch checked={field.value} {...field} />}
          />{' '}
        </div>
      </div>
    </Tab>
  );
}

function ThemeExample({ theme, onSelect, isCurrent }) {
  return (
    <button
      className={`theme ${theme} grid h-20 cursor-pointer grid-cols-[60px_auto] gap-1 overflow-hidden rounded-lg border border-border bg-background-primary transition-transform duration-300 hover:scale-95`}
      onClick={() => {
        document.documentElement.setAttribute('data-theme-primary', theme);
        onSelect();
      }}
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
          {isCurrent && <PiCheckBold className='text-sm text-primary' />}
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
