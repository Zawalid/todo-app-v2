import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { updateSettings } from '../../../app/settingsSlice';

import { PiCheckBold, PiCheckSquareThin } from 'react-icons/pi';
import { Tab } from './Tab';
import Switch from '../../Common/Switch';

const themes = ['light', 'dark', 'rose', 'emerald', 'amber', 'teal'];

export default function Theme() {
  const { theme } = useSelector((state) => state.settings);
  const dispatch = useDispatch();

  const {
    handleSubmit,
    reset,
    formState: { isDirty: isUpdated },
    control,
    setValue,
  } = useForm({ defaultValues: theme });

  const currentTheme = useWatch({ control, name: 'themeName' });

  return (
    <Tab
      saveButton={{
        onClick: () => {
          handleSubmit((data) => {
            dispatch(updateSettings({ category: 'theme', settings: data }));
            reset(data);
          })();
        },
        disabled: !isUpdated,
      }}
      cancelButton={{
        onClick: () => {
          document.documentElement.className = theme.themeName;
          reset(theme);
        },
        disabled: !isUpdated,
      }}
    >
      <div className='space-y-5'>
        <div className='setting block'>
          <h4>Themes</h4>
          <p>Choose a theme for your interface.</p>
          <div className='mt-4 grid max-h-[325px] grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3 overflow-auto pr-1'>
            {themes.map((theme) => (
              <ThemeExample
                key={theme}
                theme={theme}
                onSelect={() => setValue('themeName', theme, { shouldDirty: true })}
                isCurrent={currentTheme === theme}
              />
            ))}
          </div>
          <Controller
            name='themeName'
            control={control}
            render={({ field }) => <input type='hidden' {...field} />}
          />
        </div>
        <div className='setting'>
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
      <DevTool control={control} placement='top-left' />
    </Tab>
  );
}

function ThemeExample({ theme, onSelect, isCurrent }) {
  return (
    <button
      className={`theme ${theme} grid h-20  cursor-pointer grid-cols-[60px_auto] gap-1 overflow-hidden rounded-lg border border-border bg-background-primary`}
      onClick={() => {
        document.documentElement.className = theme;
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
