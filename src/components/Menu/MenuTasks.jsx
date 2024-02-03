import { Link, NavLink, useHref } from 'react-router-dom';
import { IoTodayOutline, IoListOutline, IoCalendarOutline } from 'react-icons/io5';
import { FaRegNoteSticky } from 'react-icons/fa6';
import { useTasks, useStickyNotes } from '../../hooks';

export function MenuTasks() {
  const { todayTasks, tasks, upcomingTasks } = useTasks();
  const { stickyNotes } = useStickyNotes();
  const currentTab = useHref().split('/app/')[1];
  return (
    <div className='pb-5'>
      <h4 className='mb-4 mt-5  font-medium text-text-secondary'>Tasks</h4>
      <ul className='space-y-1'>
        <li>
          <Link to='' className={'menu_element group ' + (!currentTab ? 'active' : '')}>
            <IoListOutline className='text-text-tertiary' size={20} />
            <span className='text-sm text-text-secondary  '>All Tasks</span>
            <div className='count'>
              <span className='text-xs font-semibold text-text-secondary'>{tasks.length}</span>
            </div>
          </Link>
        </li>
        <li>
          <NavLink to='upcoming' className='menu_element group'>
            <IoCalendarOutline className='text-text-tertiary' />
            <span className='text-sm text-text-secondary  '>Upcoming</span>
            <div className='count'>
              <span className='text-xs font-semibold text-text-secondary'>
                {upcomingTasks.length}
              </span>
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink to='today' className='menu_element  group'>
            <IoTodayOutline className='text-text-tertiary' />
            <span className='text-sm text-text-secondary  '>Today</span>
            <div className='count'>
              <span className='text-xs font-semibold text-text-secondary'>{todayTasks.length}</span>
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink to='sticky-wall' className='menu_element group'>
            <FaRegNoteSticky className='text-text-tertiary' />
            <span className='text-sm text-text-secondary  '>Sticky Wall</span>
            <div className='count'>
              <span className='text-xs font-semibold text-text-secondary'>
                {stickyNotes.length}
              </span>
            </div>
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
