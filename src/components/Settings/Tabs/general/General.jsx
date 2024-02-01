import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';

import { Tab } from '../Tab';
import { StickyNotes } from './StickyNotes';
import { Tasks } from './Tasks';
import { Preferences } from './Preferences';
import { DateAndTime } from './DateAndTime';
import { updateSettings } from '../../../../app/settingsSlice';

export default function General() {
  const { general } = useSelector((state) => state.settings);
  const dispatch = useDispatch();
  const {
    handleSubmit,
    reset,
    formState: { isDirty: isUpdated },
    control,
    setValue,
  } = useForm({ defaultValues: general, mode: 'onChange' });

  return (
    <Tab
      saveButton={{
        onClick: () => {
          handleSubmit((data) => {
            dispatch(updateSettings({ category: 'general', settings: data }));
            reset(data);
          })();
        },
        disabled: !isUpdated,
      }}
      cancelButton={{
        onClick: () => reset(general),
        disabled: !isUpdated,
      }}
    >
      <div className='space-y-5 '>
        <Preferences control={control} setValue={setValue} />
        <hr className='border-border' />
        <DateAndTime control={control} setValue={setValue} />
        <hr className='border-border' />
        <Tasks control={control} setValue={setValue} />
        <hr className='border-border' />
        <StickyNotes control={control} setValue={setValue} />
      </div>
      <DevTool control={control} placement='top-left' />
    </Tab>
  );
}
