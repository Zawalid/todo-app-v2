import { PiCalendar } from 'react-icons/pi';
import { DropDown } from '../../../Common/DropDown';
import { format } from 'date-fns';

export function DateAndTime() {
  return (
    <>
      <div className='flex items-center gap-3 text-text-tertiary'>
        <PiCalendar size={22} /> <h3 className='font-bold'>Date & Time</h3>
      </div>
      <div className='space-y-5 md:pl-5'>
        <DateFormat />
        <TimeFormat />

        <div className='setting'>
          <div>
            <h4>Week starts on</h4>
            <p>First day of the week.</p>
          </div>
          <DropDown
            toggler={
              <DropDown.Toggler>
                <span>Monday</span>
                <i className='fa-solid fa-chevron-down text-xs'></i>
              </DropDown.Toggler>
            }
            options={{ className: 'w-48', shouldCloseOnClick: false }}
          >
            <DropDown.Button isCurrent>
              <span>Monday</span>
            </DropDown.Button>
            <DropDown.Button>
              <span>Sunday</span>
            </DropDown.Button>
          </DropDown>
        </div>

        <div className='setting'>
          <div>
            <h4>Weekly Due Date</h4>
            <p>Tasks added in {'This Week'} will have their due date set to the selected day.</p>
          </div>
          <DropDown
            toggler={
              <DropDown.Toggler>
                <span>Sunday</span>
                <i className='fa-solid fa-chevron-down text-xs'></i>
              </DropDown.Toggler>
            }
            options={{ className: 'w-48', shouldCloseOnClick: false }}
          >
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
              (day) => (
                <DropDown.Button key={day} isCurrent={day === 'Sunday'}>
                  <span>{day}</span>
                </DropDown.Button>
              ),
            )}
          </DropDown>
        </div>
      </div>
    </>
  );
}

function DateFormat() {
  const dateFormats = ['MM/dd/yyyy', 'dd/MM/yyyy', 'yyyy/MM/dd', 'MMM dd, yyyy', 'dd MMM yyyy'];
  const sampleDate = new Date();

  return (
    <div className='setting'>
      <h4>Date Format</h4>

      <DropDown
        toggler={
          <DropDown.Toggler>
            <span>{format(sampleDate, 'MM/dd/yyyy')}</span>
            <i className='fa-solid fa-chevron-down text-xs'></i>
          </DropDown.Toggler>
        }
        options={{ className: 'w-48', shouldCloseOnClick: false }}
      >
        {dateFormats.map((formatString) => {
          const formattedDate = format(sampleDate, formatString);
          return (
            <DropDown.Button key={formatString} isCurrent={formatString === 'MM/dd/yyyy'}>
              <span>{formattedDate}</span>
            </DropDown.Button>
          );
        })}
      </DropDown>
    </div>
  );
}

function TimeFormat() {
  const timeFormats = ['HH:mm', 'hh:mm a'];
  const sampleDate = new Date();

  return (
    <div className='setting'>
      <h4>Time Format</h4>

      <DropDown
        toggler={
          <DropDown.Toggler>
            <span>{format(sampleDate, 'HH:mm')}</span>
            <i className='fa-solid fa-chevron-down text-xs'></i>
          </DropDown.Toggler>
        }
        options={{ className: 'w-48', shouldCloseOnClick: false }}
      >
        {timeFormats.map((formatString) => {
          const formattedTime = format(sampleDate, formatString);
          return (
            <DropDown.Button key={formatString} isCurrent={formatString === 'HH:mm'}>
              <span>{formattedTime}</span>
            </DropDown.Button>
          );
        })}
      </DropDown>
    </div>
  );
}
