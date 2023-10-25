import { NavLink } from 'react-router-dom';

export function MenuTasks({
  allTasksNumber,
  todayTasksNumber,
  upcomingTasksNumber,
  stickyNotesNumber,
}) {
  return (
    <div className='pb-5'>
      <h4 className='mb-4 mt-5  font-medium text-text-secondary'>Tasks</h4>
      {/* <ul className='space-y-1'>
        <li className='menu_element  group' data-tab='all'>
          <i className='fas fa-angles-right text-text-tertiary'></i>
          <span className='text-sm text-text-secondary transition-[font-weight] duration-100 group-hover:font-bold'>
            All Tasks
          </span>
          <div className='grid place-content-center rounded-sm bg-background-tertiary py-[1px] transition-colors duration-300  group-hover:bg-background-primary'>
            <span className='text-xs font-semibold text-text-secondary'>{allTasksNumber}</span>
          </div>
        </li>
        <li className='menu_element group' data-tab='upcoming'>
          <i className='fas fa-angles-right text-text-tertiary'></i>
          <span className='text-sm text-text-secondary transition-[font-weight] duration-100 group-hover:font-bold'>
            Upcoming
          </span>
          <div className='grid place-content-center rounded-sm bg-background-tertiary py-[1px] transition-colors duration-300  group-hover:bg-background-primary'>
            <span className='text-xs font-semibold text-text-secondary'>{upcomingTasksNumber}</span>
          </div>
        </li>
        <li className='menu_element  group' data-tab='today'>
          <i className='fas fa-list-check text-text-tertiary'></i>
          <span className='text-sm text-text-secondary transition-[font-weight] duration-100 group-hover:font-bold'>
            Today
          </span>
          <div className='grid place-content-center rounded-sm bg-background-tertiary py-[1px] transition-colors duration-300  group-hover:bg-background-primary'>
            <span className='text-xs font-semibold text-text-secondary'>{todayTasksNumber}</span>
          </div>
        </li>
        <li className='menu_element group' data-tab='stickyWall'>
          <i className='fas fa-note-sticky text-text-tertiary'></i>
          <span className='text-sm text-text-secondary transition-[font-weight] duration-100 group-hover:font-bold'>
            Sticky Wall
          </span>
          <div className='grid place-content-center rounded-sm bg-background-tertiary py-[1px] transition-colors duration-300  group-hover:bg-background-primary'>
            <span className='text-xs font-semibold text-text-secondary'>{stickyNotesNumber}</span>
          </div>
        </li>
      </ul> */}
      <ul className='space-y-1'>
        <li>
          <NavLink to='/all' className='menu_element  group'>
            <i className='fas fa-angles-right text-text-tertiary'></i>
            <span className='text-sm text-text-secondary transition-[font-weight] duration-100 group-hover:font-bold'>
              All Tasks
            </span>
            <div className='count grid place-content-center rounded-sm bg-background-tertiary py-[1px] transition-colors  duration-300 group-hover:bg-background-primary'>
              <span className='text-xs font-semibold text-text-secondary'>{allTasksNumber}</span>
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink to='/upcoming' className='menu_element group'>
            <i className='fas fa-angles-right text-text-tertiary'></i>
            <span className='text-sm text-text-secondary transition-[font-weight] duration-100 group-hover:font-bold'>
              Upcoming
            </span>
            <div className='count grid place-content-center rounded-sm bg-background-tertiary py-[1px] transition-colors  duration-300 group-hover:bg-background-primary'>
              <span className='text-xs font-semibold text-text-secondary'>
                {upcomingTasksNumber}
              </span>
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink to='/today' className='menu_element  group'>
            <i className='fas fa-list-check text-text-tertiary'></i>
            <span className='text-sm text-text-secondary transition-[font-weight] duration-100 group-hover:font-bold'>
              Today
            </span>
            <div className='count grid place-content-center rounded-sm bg-background-tertiary py-[1px] transition-colors  duration-300 group-hover:bg-background-primary'>
              <span className='text-xs font-semibold text-text-secondary'>{todayTasksNumber}</span>
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink to='/stickyWall' className='menu_element group'>
            <i className='fas fa-note-sticky text-text-tertiary'></i>
            <span className='text-sm text-text-secondary transition-[font-weight] duration-100 group-hover:font-bold'>
              Sticky Wall
            </span>
            <div className='count grid place-content-center rounded-sm bg-background-tertiary py-[1px] transition-colors  duration-300 group-hover:bg-background-primary'>
              <span className='text-xs font-semibold text-text-secondary'>{stickyNotesNumber}</span>
            </div>
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
