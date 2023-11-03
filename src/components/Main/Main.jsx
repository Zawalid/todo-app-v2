import { useEffect, useMemo } from 'react';
import { useHref, useNavigate } from 'react-router-dom';
import { Title } from './Title';
import { StickyWall } from './Sticky Wall/StickyWall';
import { DisplayedTasks } from './Tasks/DisplayedTasks';
import { Upcoming } from './Tasks/Upcoming';
import { checkIfToday } from '../../utils/Moment';
import { SearchResults } from './Search/SearchResults';
import { useTasks } from '../../hooks/useTasks';
import { useSearch } from '../../hooks/useSearch';
import { useLists } from '../../hooks/useLists';
import { useStickyNotes } from '../../hooks/useStickyNotes';

export function Main() {
  const {
    tasks,
    handleAddTask,
    todayTasks,
    upcomingTasks,
    addNewTaskReference,
  } = useTasks();

  const { lists } = useLists();
  const { stickyNotes, isStickyNoteOpened } = useStickyNotes();
  const { searchResults } = useSearch();
  const activeTab = useHref().split('/')[1];
  const navigate = useNavigate();

  useEffect(() => {
    activeTab === '' && navigate('/all');
  }, [activeTab, navigate]);

  useEffect(() => {
    addNewTaskReference.current?.focus();
  }, [activeTab, addNewTaskReference]);

  const listId = lists.find((list) => list.title === activeTab.replace('%20', ' '))?.$id;

  const title =
    activeTab === 'all'
      ? 'All Tasks'
      : activeTab === 'today'
      ? "Today's Tasks"
      : activeTab === 'upcoming'
      ? 'Upcoming Tasks'
      : activeTab === 'stickyWall'
      ? 'Sticky Wall'
      : activeTab === 'search'
      ? 'Search Results'
      : activeTab.replace(/%20/g, ' ');

  const count = useMemo(() => {
    if (activeTab === 'all') return tasks.length;
    if (activeTab === 'today') return todayTasks.length;
    if (activeTab === 'upcoming') return upcomingTasks.length;
    if (activeTab === 'stickyWall') return stickyNotes.length;
    if (activeTab === 'search') return searchResults.length;
    if (listId) return lists.find((list) => list.$id === listId)?.tasks.length;
    return 0;
  }, [activeTab, tasks, listId, stickyNotes, lists, todayTasks, upcomingTasks, searchResults]);

  const condition = (task) => {
    if (listId) return task.listId === listId;
    if (activeTab === 'today') return checkIfToday(task.dueDate);
    if (activeTab === 'all') return true;
    return false;
  };

  return (
    <main className='flex flex-1 flex-col overflow-hidden rounded-xl bg-background-primary px-5 '>
      <Title title={title} count={count} />
      {!['upcoming', 'stickyWall', 'search'].includes(activeTab) ? (
        <DisplayedTasks
          onAdd={(title) => {
            const dueDate = activeTab === 'today' && new Date().toISOString().split('T')[0];
            const newTask = {
              title,
              note: '',
              dueDate: dueDate || '',
              listId: listId || 'none',
              subtasks: [],
              isCompleted: false,
              tagsIds: [],
              priority: 0,
              index: tasks.length,
            };
            handleAddTask(newTask, listId);
          }}
          condition={condition}
          activeTab={activeTab}
        />
      ) : null}
      {activeTab === 'upcoming' && <Upcoming />}
      {(activeTab === 'stickyWall' || isStickyNoteOpened) && <StickyWall />}
      {activeTab === 'search' && !isStickyNoteOpened && <SearchResults />}
    </main>
  );
}
