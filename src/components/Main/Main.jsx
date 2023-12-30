import { Suspense, lazy, useEffect, useMemo } from 'react';
import { useHref } from 'react-router-dom';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Title } from './Title';
import { checkIfToday } from '../../utils/Moment';
import { useTasks, useSearch, useLists, useStickyNotes, useTrash } from '../../hooks';
import { TasksSkeleton, UpcomingSkeleton, StickyWallSkeleton, TrashSkeleton } from '../Skeletons';
import { SpinnerLoader } from '../Common/SpinnerLoader';

const DisplayedTasks = lazy(() => import('./Tasks/NameToBeDetermined/DisplayedTasks'));
const Upcoming = lazy(() => import('./Tasks/Upcoming/Upcoming'));
const StickyWall = lazy(() => import('./Sticky Wall/StickyWall'));
const SearchResults = lazy(() => import('./Search/SearchResults'));
const Trash = lazy(() => import('./Trash/Trash'));

const tabs = {
  today: {
    title: "Today's Tasks",
    skeleton: <TasksSkeleton number={6} />,
  },
  upcoming: {
    title: 'Upcoming Tasks',
    skeleton: <UpcomingSkeleton />,
  },
  'sticky-wall': {
    title: 'Sticky Wall',
    skeleton: <StickyWallSkeleton />,
  },
  search: {
    title: 'Search Results',
    skeleton: <SpinnerLoader size='large' />,
  },
  trash: {
    title: 'Trash',
    skeleton: <TrashSkeleton />,
  },
};

export function Main() {
  const { tasks, isTasksLoading, handleAddTask, todayTasks, upcomingTasks } = useTasks();
  const { lists } = useLists();
  const { stickyNotes, isStickyNoteOpened } = useStickyNotes();
  const { searchResults } = useSearch();
  const { trashLength } = useTrash();
  const activeTab = useHref().split('/app/')[1];
  const [parent] = useAutoAnimate({
    duration: 300,
  });

  const listId = lists?.find((list) => list.title === activeTab?.replace('%20', ' '))?.$id;

  const title = !activeTab ? 'All Tasks' : tabs[activeTab]?.title || activeTab.replace('%20', ' ');

  useEffect(() => {
    document.title = `I Do | ${title}`;
  }, [title]);

  const count = useMemo(() => {
    if (!activeTab) return tasks.length;
    if (activeTab === 'today') return todayTasks.length;
    if (activeTab === 'upcoming') return upcomingTasks.length;
    if (activeTab === 'sticky-wall') return stickyNotes.length;
    if (activeTab === 'search') return searchResults.length;
    if (activeTab === 'trash') return trashLength;
    if (listId) return tasks.filter((task) => task.listId === listId).length;
    return 0;
  }, [
    activeTab,
    tasks,
    listId,
    stickyNotes,
    todayTasks,
    upcomingTasks,
    searchResults,
    trashLength,
  ]);
  const condition = (task) => {
    if (listId) return task.listId === listId;
    if (activeTab === 'today') return checkIfToday(task.dueDate);
    if (!activeTab) return true;
    return false;
  };

  return (
    <main
      className='relative flex flex-1 flex-col overflow-hidden rounded-xl bg-background-primary pl-2'
      ref={parent}
    >
      <Title title={title} count={count} />
      {isTasksLoading ? (
        tabs[activeTab]?.skeleton ? (
          tabs[activeTab]?.skeleton
        ) : (
          <TasksSkeleton number={6} />
        )
      ) : (
        <Suspense
          fallback={
            tabs[activeTab]?.skeleton ? tabs[activeTab]?.skeleton : <TasksSkeleton number={6} />
          }
        >
          {!['upcoming', 'sticky-wall', 'search', 'trash'].includes(activeTab) ? (
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
                handleAddTask(newTask);
              }}
              condition={condition}
              activeTab={activeTab}
            />
          ) : null}
          {activeTab === 'upcoming' && <Upcoming />}
          {(activeTab === 'sticky-wall' || isStickyNoteOpened) && <StickyWall />}
          {activeTab === 'search' && !isStickyNoteOpened && <SearchResults />}
          {activeTab === 'trash' && !isStickyNoteOpened && <Trash />}{' '}
        </Suspense>
      )}
    </main>
  );
}
