import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { TABS } from './TabsList';
import CustomTippy from '../Common/CustomTippy';
import {
  useCompletedTasks,
  useTasks,
  useTodayTasks,
  useUpcomingTasks,
  useStickyNotes
} from '../../lib/react-query/queries';

const orderedTabs = ['inbox', 'today', 'upcoming', 'completed', 'stickyWall'];

export function Tabs() {
  const { tasks } = useTasks();
  const { todayTasks } = useTodayTasks();
  const { upcomingTasks } = useUpcomingTasks();
  const { completedTasks } = useCompletedTasks();
  const { stickyNotes } = useStickyNotes();
  const { showInSideBar, showCount } = useSelector((state) => state.settings.sidebar);

  const counts = {
    inbox: tasks?.length,
    completed: completedTasks?.length,
    today: todayTasks?.length,
    upcoming: upcomingTasks?.length,
    stickyWall: stickyNotes?.length,
  };

  return (
    <ul className='space-y-1 pb-5'>
      {orderedTabs
        .filter((t) => showInSideBar.includes(t))
        .map((t) => {
          const tab = TABS[t];
          return (
            <CustomTippy
              key={tab.name}
              content={
                <span className='flex items-center gap-2'>
                  Quick Access
                  <code className='shortcut '>
                    <kbd>Alt</kbd> + <kbd>{tab.name.at(0).toUpperCase()}</kbd>
                  </code>
                </span>
              }
              placement='right'
            >
              <li>
                <NavLink to={t.replace('W', '-w')} className='menu_element group'>
                  {tab.icon}
                  <span className='text-sm capitalize text-text-secondary'>
                    {tab.name.replace('W', ' W')}
                  </span>
                  {showCount && (
                    <div className='count'>
                      <span className='text-xs font-semibold text-text-secondary'>
                        {counts[tab.name]}
                      </span>
                    </div>
                  )}
                </NavLink>
              </li>
            </CustomTippy>
          );
        })}
    </ul>
  );
}
