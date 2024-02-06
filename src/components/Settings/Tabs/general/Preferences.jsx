import { PiSliders } from 'react-icons/pi';
import { IoChevronDownOutline } from "react-icons/io5";
import Switch from '../../../Common/Switch';
import { DropDown } from '../../../Common/DropDown';
import { Controller, useWatch } from 'react-hook-form';

export function Preferences({ control, setValue }) {
  const defaultHomeView = useWatch({ control, name: 'preferences.defaultHomeView' });

  return (
    <>
      <div className='flex items-center gap-3 text-text-tertiary'>
        <PiSliders size={22} /> <h3 className='font-bold'>Preferences</h3>
      </div>
      <div className='space-y-5 md:pl-5'>
        <div className='setting '>
          <div>
            <h4>Task Completion Sound</h4>
            <p className='mt-2 text-xs text-text-secondary'>
              Play a sound when a task is completed.
            </p>
          </div>
          <Controller
            name='preferences.taskCompletionSound'
            control={control}
            render={({ field }) => <Switch checked={field.value} {...field} />}
          />
        </div>
        <div className='setting not-done'>
          <div>
            <h4>Deletion Sound</h4>
            <p className='mt-2 text-xs text-text-secondary'>
              Play a sound when an element is deleted.
            </p>
          </div>

          <Controller
            name='preferences.deletionSound'
            control={control}
            render={({ field }) => <Switch checked={field.value} {...field} />}
          />
        </div>
        <div className='setting '>
          <div>
            <h4>Animation</h4>
            <p className='mt-2 text-xs text-text-secondary'>
              Enable or disable interface animations.
            </p>
          </div>

          <Controller
            name='preferences.animation'
            control={control}
            render={({ field }) => <Switch checked={field.value} {...field} />}
          />
        </div>
        <div className='setting '>
          <div>
            <h4>Default Home View</h4>
            <p className='mt-2 text-xs text-text-secondary'>
              Choose what to show when you open the app.
            </p>
          </div>
          <DropDown
            toggler={
              <DropDown.Toggler>
                <span className='capitalize'>{defaultHomeView}</span>
                <IoChevronDownOutline />
              </DropDown.Toggler>
            }
            options={{ className: 'w-48' }}
          >
            {['inbox', 'today', 'upcoming', 'completed','sticky wall'].map((tab) => (
              <DropDown.Button
                key={tab}
                isCurrent={tab === defaultHomeView}
                onClick={() => setValue('preferences.defaultHomeView', tab, { shouldDirty: true })}
              >
                <span className='capitalize'>{tab}</span>
              </DropDown.Button>
            ))}
          </DropDown>
          <Controller
            name='preferences.defaultHomeView'
            control={control}
            render={({ field }) => <input type='hidden' {...field} />}
          />
        </div>
      </div>
    </>
  );
}
