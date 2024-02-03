import { NavLink, useHref } from 'react-router-dom';
import { IoTodayOutline, IoListOutline, IoCalendarOutline } from 'react-icons/io5';
import { FaRegNoteSticky } from 'react-icons/fa6';
import { useTasks, useStickyNotes } from '../../hooks';
import { useSelector } from 'react-redux';

export function Tabs() {
  const { todayTasks, tasks, upcomingTasks } = useTasks();
  const { stickyNotes } = useStickyNotes();
  const { defaultHomeView } = useSelector((state) => state.settings.general.preferences);
  // To check whether the current tab is the home in order to add manually the active class
  const noActiveTab = ['', '/'].includes(useHref().split('/app')[1]);
  const { showInSideBar, showCount } = useSelector((state) => state.settings.sidebar);

  const tabs = {
    all: {
      name: 'All',
      icon: <IoListOutline className='text-text-tertiary' size={20} />,
      count: tasks.length,
    },
    upcoming: {
      name: 'Upcoming',
      icon: <IoCalendarOutline className='text-text-tertiary' />,
      count: upcomingTasks.length,
    },
    today: {
      name: 'Today',
      icon: <IoTodayOutline className='text-text-tertiary' />,
      count: todayTasks.length,
    },
    stickyWall: {
      name: 'Sticky Wall',
      icon: <FaRegNoteSticky className='text-text-tertiary' />,
      count: stickyNotes.length,
    },
  };

  return (
    <ul className='space-y-1 pb-5'>
      {showInSideBar.map((t) => {
        const tab = tabs[t];
        console.log(tab,t)
        return (
          <li key={tab.name}>
            <NavLink
              to={t === 'stickyWall' ? 'sticky-wall' : t}
              className={`menu_element group ${
                defaultHomeView === tab.name && noActiveTab ? 'active' : ''
              }`}
            >
              {tab.icon}
              <span className='text-sm text-text-secondary  '>{tab.name}</span>
              {showCount && (
                <div className='count'>
                  <span className='text-xs font-semibold text-text-secondary'>{tab.count}</span>
                </div>
              )}
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
}
