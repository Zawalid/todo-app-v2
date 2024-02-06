import { NavLink } from 'react-router-dom';
import { useTasks, useStickyNotes } from '../../hooks';
import { useSelector } from 'react-redux';
import { TABS } from './TabsList';
import CustomTippy from '../Common/CustomTippy';

const orderedTabs = ['inbox', 'today', 'upcoming', 'completed', 'stickyWall'];

export function Tabs() {
  const { todayTasks, tasks, upcomingTasks } = useTasks();
  const { stickyNotes } = useStickyNotes();
  const completedTasks = tasks.filter((task) => task.isCompleted);

  const { showInSideBar, showCount } = useSelector((state) => state.settings.sidebar);

  const counts = {
    inbox: tasks.length,
    completed: completedTasks.length,
    stickyWall: stickyNotes.length,
    today: todayTasks.length,
    upcoming: upcomingTasks.length,
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
                    <kbd>Alt</kbd> + <kbd>{tab.name.at(0)}</kbd>
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
