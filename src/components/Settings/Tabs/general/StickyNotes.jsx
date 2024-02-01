import { CiStickyNote } from 'react-icons/ci';
import Switch from '../../../Common/Switch';
import { Colors } from '../../../Common/Colors';
import { Controller, useWatch } from 'react-hook-form';

export function StickyNotes({ control, setValue }) {
  const defaultColor = useWatch({ control, name: 'stickyNotes.defaultColor' });

  return (
    <>
      <div className='flex items-center gap-3 text-text-tertiary'>
        <CiStickyNote size={22} />
        <h3 className='font-bold'>Sticky Notes</h3>
      </div>
      <div className='space-y-5 md:pl-5'>
        <div className='setting'>
          <h4>Auto Save</h4>
          <Controller
            name='stickyNotes.autoSave'
            control={control}
            render={({ field }) => <Switch checked={field.value} {...field} />}
          />{' '}
        </div>
        <div className='setting'>
          <div>
            <h4>Default Color</h4>
            <p>Initial color for all new sticky notes. You can modify this for each note later.</p>
          </div>
          <div className='flex flex-wrap  items-center justify-end gap-2'>
            <Colors
              selectedColor={defaultColor}
              onSelect={(color) =>
                setValue('stickyNotes.defaultColor', color, { shouldDirty: true })
              }
              customClass='circle'
            />
            <Controller
              name='stickyNotes.defaultColor'
              control={control}
              render={({ field }) => <input type='hidden' {...field} />}
            />
          </div>
        </div>
        <div className='setting'></div>
      </div>
    </>
  );
}
