import { Tab } from './Tab';
import { CheckBox } from '../../Common/CheckBox';
import Switch from '../../Common/Switch';
import { useReactHookForm } from '../useReactHookForm';
import { Controller, useWatch } from 'react-hook-form';
import { TABS } from '../../Menu/TabsList';

export default function SideBar() {
  const { control, isUpdated, setValue, onSubmit, onCancel } = useReactHookForm({
    settingCategory: 'sidebar',
  });

  return (
    <Tab
      saveButton={{
        onClick: onSubmit,
        disabled: !isUpdated,
      }}
      cancelButton={{
        onClick: onCancel,
        disabled: !isUpdated,
      }}
      control={control}
    >
      <div className='space-y-5'>
        <div>
          <div>
            <h4 className='font-bold text-text-primary'>Show in sidebar</h4>
            <p className='mt-2 text-xs text-text-secondary'>Choose what to show in the sidebar.</p>
          </div>
          <ShowInSideBar control={control} setValue={setValue} />
          <Controller
            control={control}
            name='showInSideBar'
            render={({ field }) => <input {...field} type='hidden' />}
          />
        </div>
        <div className='setting'>
          <div>
            <h4>Show count</h4>
            <p>Show the number of tasks in each list.</p>
          </div>
          <Controller
            control={control}
            name='showCount'
            render={({ field }) => <Switch {...field} checked={field.value} />}
          />
        </div>
        <Example control={control} />
      </div>
    </Tab>
  );
}

function ShowInSideBar({ control, setValue }) {
  const displayedTabs = useWatch({ control, name: 'showInSideBar' }) || [];

  const setSetting = (value) => setValue('showInSideBar', value, { shouldDirty: true });

  const setShowInSidebar = (tab) => {
    if (displayedTabs.includes(tab)) {
      return setSetting(displayedTabs.filter((t) => t !== tab).sort());
    }
    setSetting([...displayedTabs, tab].sort());
  };

  return (
    <div className='mt-5 space-y-3'>
      {Object.values(TABS).map((tab) => (
        <div key={tab.name} className='flex items-center gap-3 text-text-secondary'>
          <CheckBox
            checked={displayedTabs.includes(tab.name)}
            onChange={() => setShowInSidebar(tab.name)}
          />
          <div className='grid grid-cols-[25px_auto] items-center'>
            {tab.icon}
            <span className='capitalize'>{tab.name.replace('W', ' W')}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function Example({ control }) {
  const showCount = useWatch({ control, name: 'showCount' });

  return (
    <div>
      <span className='text-sm font-medium text-text-tertiary'>Example</span>
      <ul className='mt-2 w-[250px] rounded-lg bg-background-secondary p-3'>
        {[TABS.inbox, TABS.today].map((tab) => (
          <li
            key={tab.name}
            className='group grid grid-cols-[30px_auto_35px] items-center rounded-lg p-2 text-text-secondary first:bg-background-tertiary'
          >
            {tab.icon}
            <span className='capitalize'>{tab.name}</span>
            <div
              className={`grid place-content-center rounded-sm bg-background-tertiary py-[1px] group-first:bg-background-primary  group-hover:bg-background-primary ${
                showCount ? 'scale-100' : 'scale-0'
              }`}
            >
              <span className='text-xs font-semibold text-text-secondary'>
                {tab.name === 'inbox' ? 5 : 3}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
