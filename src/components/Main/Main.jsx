import { useEffect, useMemo } from 'react';
import { useHref } from 'react-router-dom';
import { Title } from './Title';
import { StickyWall } from './Sticky Wall/StickyWall';
import { DisplayedTasks } from './Tasks/NameToBeDetermined/DisplayedTasks';
import { Upcoming } from './Tasks/Upcoming/Upcoming';
import { checkIfToday } from '../../utils/Moment';
import { SearchResults } from './Search/SearchResults';
import { useTasks } from '../../hooks/useTasks';
import { useSearch } from '../../hooks/useSearch';
import { useLists } from '../../hooks/useLists';
import { useStickyNotes } from '../../hooks/useStickyNotes';
import { Trash } from './Trash/Trash';
import { useTrash } from '../../hooks/useTrash';

export function Main() {
  const { tasks, handleAddTask, todayTasks, upcomingTasks, addNewTaskReference } = useTasks();
  const { lists } = useLists();
  const { stickyNotes, isStickyNoteOpened } = useStickyNotes();
  const { searchResults } = useSearch();
  const { trashLength } = useTrash();
  const activeTab = useHref().split('/app/')[1];

  useEffect(() => {
    addNewTaskReference.current?.focus();
  }, [activeTab, addNewTaskReference]);

  const listId = lists.find((list) => list.title === activeTab?.replace('%20', ' '))?.$id;

  const title =
    activeTab === undefined
      ? 'All Tasks'
      : activeTab === 'today'
      ? "Today's Tasks"
      : activeTab === 'upcoming'
      ? 'Upcoming Tasks'
      : activeTab === 'stickyWall'
      ? 'Sticky Wall'
      : activeTab === 'search'
      ? 'Search Results'
      : activeTab === 'trash'
      ? 'Trash'
      : activeTab?.replace(/%20/g, ' ');

  const count = useMemo(() => {
    if (activeTab === undefined) return tasks.length;
    if (activeTab === 'today') return todayTasks.length;
    if (activeTab === 'upcoming') return upcomingTasks.length;
    if (activeTab === 'stickyWall') return stickyNotes.length;
    if (activeTab === 'search') return searchResults.length;
    if (activeTab === 'trash') return trashLength;
    if (listId) return lists.find((list) => list.$id === listId)?.tasks.length;
    return 0;
  }, [
    activeTab,
    tasks,
    listId,
    stickyNotes,
    lists,
    todayTasks,
    upcomingTasks,
    searchResults,
    trashLength,
  ]);

  const condition = (task) => {
    if (listId) return task.listId === listId;
    if (activeTab === 'today') return checkIfToday(task.dueDate);
    if (activeTab === undefined) return true;
    return false;
  };

  return (
    <main className='flex flex-1 flex-col overflow-hidden rounded-xl bg-background-primary px-5 '>
      <Title title={title} count={count} />
      {!['upcoming', 'stickyWall', 'search', 'trash'].includes(activeTab) ? (
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
      {activeTab === 'trash' && !isStickyNoteOpened && <Trash />}
    </main>
  );
}
