import { Link, NavLink, useHref } from 'react-router-dom';
import { useTasks } from '../../hooks/useTasks';
import { useStickyNotes } from '../../hooks/useStickyNotes';

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
            <i className='fas fa-angles-right text-text-tertiary'></i>
            <span className='text-sm text-text-secondary transition-[font-weight] duration-100 group-hover:font-bold'>
              All Tasks
            </span>
            <div className='count grid place-content-center rounded-sm bg-background-tertiary py-[1px] transition-colors  duration-300 group-hover:bg-background-primary'>
              <span className='text-xs font-semibold text-text-secondary'>{tasks?.length}</span>
            </div>
          </Link>
        </li>
        <li>
          <NavLink to='upcoming' className='menu_element group'>
            <i className='fas fa-angles-right text-text-tertiary'></i>
            <span className='text-sm text-text-secondary transition-[font-weight] duration-100 group-hover:font-bold'>
              Upcoming
            </span>
            <div className='count grid place-content-center rounded-sm bg-background-tertiary py-[1px] transition-colors  duration-300 group-hover:bg-background-primary'>
              <span className='text-xs font-semibold text-text-secondary'>
                {upcomingTasks?.length}
              </span>
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink to='today' className='menu_element  group'>
            <i className='fas fa-list-check text-text-tertiary'></i>
            <span className='text-sm text-text-secondary transition-[font-weight] duration-100 group-hover:font-bold'>
              Today
            </span>
            <div className='count grid place-content-center rounded-sm bg-background-tertiary py-[1px] transition-colors  duration-300 group-hover:bg-background-primary'>
              <span className='text-xs font-semibold text-text-secondary'>{todayTasks?.length}</span>
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink to='stickyWall' className='menu_element group'>
            <i className='fas fa-note-sticky text-text-tertiary'></i>
            <span className='text-sm text-text-secondary transition-[font-weight] duration-100 group-hover:font-bold'>
              Sticky Wall
            </span>
            <div className='count grid place-content-center rounded-sm bg-background-tertiary py-[1px] transition-colors  duration-300 group-hover:bg-background-primary'>
              <span className='text-xs font-semibold text-text-secondary'>
                {stickyNotes?.length}
              </span>
            </div>
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
