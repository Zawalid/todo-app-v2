import { useEffect, useMemo } from 'react';
import { useHref } from 'react-router-dom';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import TasksList from './Tasks/TasksList';
import Upcoming from './Tasks/Upcoming';
import StickyWall from './Sticky Wall/StickyWall';
import SearchResults from './Search/SearchResults';
import Trash from './Trash/Trash';
import { Title } from './Title';
import { checkIfToday } from '../../utils/Moment';
import { useTasks, useSearch, useLists, useStickyNotes, useTrash } from '../../hooks';
import { TasksSkeleton, UpcomingSkeleton, StickyWallSkeleton, TrashSkeleton } from '../Skeletons';
import { SpinnerLoader } from '../Common/SpinnerLoader';

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
  const { tasks, isTasksLoading, todayTasks, upcomingTasks } = useTasks();
  const { lists } = useLists();
  const { stickyNotes, isStickyNoteOpened, isNotesLoading } = useStickyNotes();
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

  const isLoading = activeTab === 'sticky-wall' ? isNotesLoading : isTasksLoading;


  return (
    <main
      className='relative flex flex-1 flex-col overflow-hidden rounded-xl bg-background-primary pl-2'
      ref={parent}
    >
      {/* <Title title={title} count={count} /> */}
      {isLoading ? (
        tabs[activeTab]?.skeleton || <TasksSkeleton number={6} />
      ) : (
        <>
          {!['upcoming', 'sticky-wall', 'search', 'trash'].includes(activeTab) && (
            <TasksList
              dueDate={activeTab === 'today' && new Date().toISOString().split('T')[0]}
              listId={listId}
              condition={condition}
              activeTab={activeTab}
            />
          )}
          {activeTab === 'upcoming' && <Upcoming />}
          {(activeTab === 'sticky-wall' || isStickyNoteOpened) && <StickyWall />}
          {activeTab === 'search' && !isStickyNoteOpened && <SearchResults />}
          {activeTab === 'trash' && !isStickyNoteOpened && <Trash />}
        </>
      )}
    </main>
  );
}
