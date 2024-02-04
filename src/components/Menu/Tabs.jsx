import { NavLink, useHref } from 'react-router-dom';
import { useTasks, useStickyNotes } from '../../hooks';
import { useSelector } from 'react-redux';
import { TABS } from './TabsList';



export function Tabs() {
  const { todayTasks, tasks, upcomingTasks } = useTasks();
  const { stickyNotes } = useStickyNotes();
  const completedTasks = tasks.filter((task) => task.isCompleted);

  const { defaultHomeView } = useSelector((state) => state.settings.general.preferences);
  const { showInSideBar, showCount } = useSelector((state) => state.settings.sidebar);
  // To check whether the current tab is the home in order to add manually the active class
  const noActiveTab = ['', '/'].includes(useHref().split('/app')[1]);

  const counts = {
    inbox: tasks.length,
    completed: completedTasks.length,
    stickyWall: stickyNotes.length,
    today: todayTasks.length,
    upcoming: upcomingTasks.length,
  };

  return (
    <ul className='space-y-1 pb-5'>
      {showInSideBar
        .filter((t) => t !== 'lists' && t !== 'tags')
        .map((t) => {
          const tab = TABS[t]
          return (
            <li key={tab.name}>
              <NavLink
                to={t.replace('W', '-w')}
                className={`menu_element group ${
                  defaultHomeView === tab.name && noActiveTab ? 'active' : ''
                }`}
              >
                {tab.icon}
                <span className='text-sm text-text-secondary capitalize'>{tab.name.replace('W',' W')}</span>
                {showCount && (
                  <div className='count'>
                    <span className='text-xs font-semibold text-text-secondary'>{
                      counts[tab.name]
                    }</span>
                  </div>
                )}
              </NavLink>
            </li>
          );
        })}
    </ul>
  );
}
