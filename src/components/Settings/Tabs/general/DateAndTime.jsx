import { PiCalendar } from 'react-icons/pi';
import { IoChevronDownOutline } from 'react-icons/io5';
import { DropDown } from '../../../Common/DropDown';
import { format } from 'date-fns';
import { Controller, useWatch } from 'react-hook-form';

export function DateAndTime({ control, setValue }) {
  const weekStartsOn = useWatch({ control, name: 'dateAndTime.weekStartsOn' });

  return (
    <>
      <div className='flex items-center gap-3 text-text-tertiary'>
        <PiCalendar size={22} /> <h3 className='font-bold'>Date & Time</h3>
      </div>
      <div className='space-y-5 md:pl-5'>
        <DateFormat control={control} setValue={setValue} />
        <TimeFormat control={control} setValue={setValue} />

        <div className='setting done'>
          <div>
            <h4>Week starts on</h4>
            <p>First day of the week.</p>
          </div>
          <DropDown
            toggler={
              <DropDown.Toggler>
                <span>{weekStartsOn === 0 ? 'Sunday' : 'Monday'}</span>
                <IoChevronDownOutline />
              </DropDown.Toggler>
            }
            options={{ className: 'w-48' }}
          >
            {[
              { day: 'Sunday', value: 0 },
              { day: 'Monday', value: 1 },
            ].map(({ day, value }) => (
              <DropDown.Button
                key={day}
                isCurrent={value === weekStartsOn}
                onClick={() => setValue('dateAndTime.weekStartsOn', value, { shouldDirty: true })}
              >
                <span>{day}</span>
              </DropDown.Button>
            ))}
          </DropDown>

          <Controller
            control={control}
            name='dateAndTime.weekStartsOn'
            render={({ field }) => <input {...field} type='hidden' />}
          />
        </div>
      </div>
    </>
  );
}

function DateFormat({ control, setValue }) {
  const dateFormat = useWatch({ control, name: 'dateAndTime.dateFormat' });
  const dateFormats = ['MM/dd/yyyy', 'dd/MM/yyyy', 'yyyy/MM/dd', 'MMM dd, yyyy', 'dd MMM yyyy'];
  const sampleDate = new Date();

  return (
    <div className='setting done'>
      <h4>Date Format</h4>

      <DropDown
        toggler={
          <DropDown.Toggler>
            <span>{format(sampleDate, dateFormat)}</span>
            <IoChevronDownOutline />
          </DropDown.Toggler>
        }
        options={{ className: 'w-48' }}
      >
        {dateFormats.map((formatString) => {
          const formattedDate = format(sampleDate, formatString);
          return (
            <DropDown.Button
              key={formatString}
              isCurrent={formatString === dateFormat}
              onClick={() =>
                setValue('dateAndTime.dateFormat', formatString, { shouldDirty: true })
              }
            >
              <span>{formattedDate}</span>
            </DropDown.Button>
          );
        })}
      </DropDown>

      <Controller
        control={control}
        name='dateAndTime.dateFormat'
        render={({ field }) => <input {...field} type='hidden' />}
      />
    </div>
  );
}

function TimeFormat({ control, setValue }) {
  const timeFormat = useWatch({ control, name: 'dateAndTime.timeFormat' });
  const timeFormats = ['HH:mm', 'hh:mm a'];
  const sampleDate = new Date();

  return (
    <div className='setting done'>
      <h4>Time Format</h4>

      <DropDown
        toggler={
          <DropDown.Toggler>
            <span>{format(sampleDate, timeFormat)}</span>
            <IoChevronDownOutline />
          </DropDown.Toggler>
        }
        options={{ className: 'w-48' }}
      >
        {timeFormats.map((formatString) => {
          const formattedTime = format(sampleDate, formatString);
          return (
            <DropDown.Button
              key={formatString}
              isCurrent={formatString === timeFormat}
              onClick={() =>
                setValue('dateAndTime.timeFormat', formatString, { shouldDirty: true })
              }
            >
              <span>{formattedTime}</span>
            </DropDown.Button>
          );
        })}
      </DropDown>

      <Controller
        control={control}
        name='dateAndTime.timeFormat'
        render={({ field }) => <input {...field} type='hidden' />}
      />
    </div>
  );
}
