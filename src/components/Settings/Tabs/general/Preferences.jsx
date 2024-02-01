import { PiSliders } from 'react-icons/pi';
import Switch from '../../../Common/Switch';
import { DropDown } from '../../../Common/DropDown';

export function Preferences() {
  return (
    <>
      <div className='flex items-center gap-3 text-text-tertiary'>
        <PiSliders size={22} /> <h3 className='font-bold'>Preferences</h3>
      </div>
      <div className='space-y-5 md:pl-5'>
        <div className='setting'>
          <div>
            <h4>Task Completion Sound</h4>
            <p className='mt-2 text-xs text-text-secondary'>
              Play a sound when a task is completed.
            </p>
          </div>
          <Switch />
        </div>
        <div className='setting'>
          <div>
            <h4>Deletion Sound</h4>
            <p className='mt-2 text-xs text-text-secondary'>
              Play a sound when an element is deleted.
            </p>
          </div>
          <Switch />
        </div>
        <div className='setting'>
          <div>
            <h4>Animation</h4>
            <p className='mt-2 text-xs text-text-secondary'>
              Enable or disable interface animations.
            </p>
          </div>
          <Switch />
        </div>
        <div className='setting'>
          <div>
            <h4>Default Home View</h4>
            <p className='mt-2 text-xs text-text-secondary'>
              Choose what to show when you open the app.
            </p>
          </div>
          <DropDown
            toggler={
              <DropDown.Toggler>
                <span>All</span>
                <i className='fa-solid fa-chevron-down text-xs'></i>
              </DropDown.Toggler>
            }
            options={{ className: 'w-48', shouldCloseOnClick: false }}
          >
            {['All', 'Today', 'Upcoming', 'Sticky Wall'].map((tab) => (
              <DropDown.Button key={tab} isCurrent={tab === 'All'}>
                <span>{tab}</span>
              </DropDown.Button>
            ))}
          </DropDown>
        </div>
      </div>
    </>
  );
}
