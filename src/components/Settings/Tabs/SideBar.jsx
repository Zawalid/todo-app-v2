import { IoTodayOutline, IoListOutline, IoCalendarOutline } from 'react-icons/io5';
import { FaRegNoteSticky } from 'react-icons/fa6';
import { Tab } from './Tab';
import { CheckBox } from '../../Common/CheckBox';
import Switch from '../../Common/Switch';

export default function SideBar() {
  return (
    <Tab
      button={{
        
        onClick: () => {},
        
      }}
    >
      <div className='space-y-5'>
        <div>
          <div>
            <h4 className='font-bold text-text-primary'>Show in sidebar</h4>
            <p className='mt-2 text-xs text-text-secondary'>Choose what to show in the sidebar.</p>
          </div>
          <div className='mt-5 space-y-3'>
            <div className='flex items-center gap-3 text-text-secondary'>
              <CheckBox />
              <div className='grid grid-cols-[25px_auto] items-center'>
                <IoListOutline size={20} />
                <span>All </span>
              </div>
            </div>
            <div className='flex items-center gap-3 text-text-secondary'>
              <CheckBox />
              <div className='grid grid-cols-[25px_auto] items-center'>
                <IoTodayOutline />
                <span>Today </span>
              </div>
            </div>
            <div className='flex items-center gap-3 text-text-secondary'>
              <CheckBox />
              <div className='grid grid-cols-[25px_auto] items-center'>
                <IoCalendarOutline />
                <span>Upcoming </span>
              </div>
            </div>
            <div className='flex items-center gap-3 text-text-secondary'>
              <CheckBox />
              <div className='grid grid-cols-[25px_auto] items-center'>
                <FaRegNoteSticky />
                <span>Sticky Wall</span>
              </div>
            </div>
          </div>
        </div>
        <div className='setting'>
          <div>
            <h4>Show count</h4>
            <p>Show the number of tasks in each list.</p>
          </div>
          <Switch />
        </div>
        <div>
          <span className='text-sm font-medium text-text-tertiary'>Example</span>
          <ul className='mt-2 w-[250px] rounded-lg bg-background-secondary p-3'>
            <li className='grid cursor-pointer grid-cols-[30px_auto_35px] items-center rounded-lg  bg-background-tertiary p-2 '>
              <IoListOutline className='text-text-tertiary' size={20} />
              <span className='text-sm text-text-secondary  group-hover:font-bold'>All Tasks</span>
              <div className='grid place-content-center rounded-sm bg-background-primary  py-[1px]'>
                <span className='text-xs font-semibold text-text-secondary'>5</span>
              </div>
            </li>
            <li className='grid cursor-pointer grid-cols-[30px_auto_35px]  items-center p-2 '>
              <IoCalendarOutline className='text-text-tertiary' />
              <span className='text-sm text-text-secondary  group-hover:font-bold'>Upcoming</span>
              <div className='grid place-content-center rounded-sm bg-background-tertiary py-[1px]  group-hover:bg-background-primary'>
                <span className='text-xs font-semibold text-text-secondary'>2 </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Tab>
  );
}
