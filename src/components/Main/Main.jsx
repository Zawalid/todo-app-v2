import { useMemo, useState } from 'react';
import { useHref } from 'react-router-dom';
import { Title } from './Title';
import { StickyWall } from './Sticky Wall/StickyWall';
import { DisplayedTasks } from './Tasks/DisplayedTasks';
import { Upcoming } from './Tasks/Upcoming';
import { checkIfToday } from '../../Utils';
import { SearchResults } from './Search/SearchResults';

export function Main({
  tasks,
  onAddTask,
  onOpen,
  onComplete,
  onClearAllTasks,
  todayTasks,
  tomorrowTasks,
  thisWeekTasks,
  upcomingTasksNumber,
  lists,
  tags,
  stickyNotes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  searchResults,
  currentSearchTab,
  setCurrentSearchTab,
}) {
  const [currentNote, setCurrentNote] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isStickyNoteOpened, setIsStickyNoteOpened] = useState(false);

  let activeTab = useHref();
  activeTab = activeTab.slice(1);

  const listId = lists.find((list) => list.title.split('   ').join('-') === activeTab)?.id;

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
      : activeTab;

  const count = useMemo(() => {
    if (activeTab === 'all') return tasks.length;
    if (activeTab === 'today') return todayTasks.length;
    if (activeTab === 'upcoming') return upcomingTasksNumber;
    if (activeTab === 'stickyWall') return stickyNotes.length;
    if (activeTab === 'search') return searchResults.length;
    if (listId) return lists.find((list) => list.id === listId)?.tasks.length;
    return 0;
  }, [
    activeTab,
    tasks,
    listId,
    stickyNotes,
    lists,
    todayTasks,
    upcomingTasksNumber,
    searchResults,
  ]);
  const condition = (task) => {
    if (listId) return +task.listId === +listId;
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
            onAddTask(title, dueDate, listId);
          }}
          onOpen={onOpen}
          onComplete={onComplete}
          tasks={tasks}
          onClearAllTasks={onClearAllTasks}
          lists={lists}
          tags={tags}
          condition={condition}
          activeTab={activeTab}
        />
      ) : null}
      {activeTab === 'upcoming' && (
        <Upcoming
          todayTasks={todayTasks}
          tomorrowTasks={tomorrowTasks}
          thisWeekTasks={thisWeekTasks}
          onAdd={(title, dueDate) => onAddTask(title, dueDate)}
          onOpen={onOpen}
          onComplete={onComplete}
          lists={lists}
          tags={tags}
        />
      )}
      {(activeTab === 'stickyWall' || isStickyNoteOpened) && (
        <StickyWall
          stickyNotes={stickyNotes}
          onAdd={onAddNote}
          onUpdate={onUpdateNote}
          onDelete={onDeleteNote}
          currentNote={currentNote}
          setCurrentNote={setCurrentNote}
          isEditorOpen={isEditorOpen}
          setIsEditorOpen={setIsEditorOpen}
          setIsStickyNoteOpened={setIsStickyNoteOpened}
        />
      )}
      {activeTab === 'search' && !isStickyNoteOpened && (
        <SearchResults
          searchResults={searchResults}
          onOpen={onOpen}
          onComplete={onComplete}
          lists={lists}
          tags={tags}
          currentSearchTab={currentSearchTab}
          setCurrentSearchTab={setCurrentSearchTab}
          setCurrentNote={setCurrentNote}
          setIsEditorOpen={setIsEditorOpen}
          setIsStickyNoteOpened={setIsStickyNoteOpened}
        />
      )}
    </main>
  );
}
