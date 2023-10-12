import { useMemo } from 'react';
import { Title } from './Title';
import { StickyWall } from './Sticky Wall/StickyWall';
import { DisplayedTasks } from './Tasks/DisplayedTasks';
import { Upcoming } from './Tasks/Upcoming';
import { checkIfToday } from '../../Utils';

export function Main({
  tasks,
  onAddTask,
  onOpen,
  onComplete,
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
  activeTab,
}) {
  const listId = useMemo(() => {
    const id = Number.isFinite(+activeTab) && +activeTab;
    return id;
  }, [activeTab]);
  const listName = useMemo(() => {
    return listId && lists.find((list) => list.id === listId)?.title;
  }, [lists, listId]);

  const title =
    activeTab === 'today'
      ? "Today's Tasks"
      : activeTab === 'upcoming'
      ? 'Upcoming Tasks'
      : listName
      ? listName
      : 'Sticky Wall';

  const count = useMemo(() => {
    if (activeTab === 'today') return todayTasks.length;
    if (activeTab === 'upcoming') return upcomingTasksNumber;
    if (activeTab === 'stickyWall') return stickyNotes.length;
    if (listId) return lists.find((list) => list.id === +activeTab)?.tasks.length;
    return 0;
  }, [activeTab, listId, stickyNotes, lists, todayTasks, upcomingTasksNumber]);

  const condition = (task) => {
    if (listId) return +task.listId === +listId;
    return checkIfToday(task.dueDate);
  };

  return (
    <main className='flex flex-1 flex-col overflow-hidden rounded-xl bg-background-primary px-5 '>
      <Title title={title} count={count} />
      {activeTab === 'today' || listId ? (
        <DisplayedTasks
          onAdd={(title) => {
            const dueDate = activeTab === 'today' && new Date().toISOString().split('T')[0];
            onAddTask(title, dueDate, listId);
          }}
          onOpen={onOpen}
          onComplete={onComplete}
          tasks={tasks}
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
          onOpen={onOpen}
          onComplete={onComplete}
          lists={lists}
          tags={tags}
        />
      )}
      {activeTab === 'stickyWall' && (
        <StickyWall
          stickyNotes={stickyNotes}
          onAdd={onAddNote}
          onUpdate={onUpdateNote}
          onDelete={onDeleteNote}
        />
      )}
    </main>
  );
}
