import { StickyNotes } from './StickyNotes';
import { Tasks } from './Tasks';
import { Preferences } from './Preferences';
import { DateAndTime } from './DateAndTime';
import { useReactHookForm } from '../../useReactHookForm';
import { Tab } from '../Tab';

export default function General() {
  const { control, isUpdated, setValue, onSubmit, onCancel } = useReactHookForm('general');

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
      <div className='space-y-5 '>
        <Preferences control={control} setValue={setValue} />
        <hr className='border-border' />
        <DateAndTime control={control} setValue={setValue} />
        <hr className='border-border' />
        <Tasks control={control} setValue={setValue} />
        <hr className='border-border' />
        <StickyNotes control={control} setValue={setValue} />
      </div>
    </Tab>
  );
}
