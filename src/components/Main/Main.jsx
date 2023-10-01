import { useMemo } from 'react';
import { BigTitle } from './Title';
import { StickyWall } from './Sticky Wall/StickyWall';
import { DisplayedTasks } from './Tasks/DisplayedTasks';
import { Upcoming } from './Tasks/Upcoming';

export function Main({
  tasks,
  onAddTask,
  onOpen,
  onComplete,
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
    if (activeTab === 'today') return tasks.get('today').length;
    if (activeTab === 'upcoming')
      return (
        tasks.get('today').length +
        tasks.get('tomorrow').length +
        tasks.get('thisWeek').length +
        tasks.get('thisMonth').length +
        tasks.get('thisYear').length
      );
    if (activeTab === 'stickyWall') return stickyNotes.length;
    if (listId) return lists.find((list) => list.id === +activeTab)?.tasks.length;
    return 0;
  }, [activeTab, tasks, listId, stickyNotes, lists]);

  const condition = (task) => {
    if (listId) return +task.listId === +listId;
    return true;
  };

  return (
    <main className='flex flex-1 flex-col overflow-hidden rounded-xl bg-background-primary px-5 '>
      <BigTitle title={title} count={count} />
      {activeTab === 'today' || listId ? (
        <DisplayedTasks
          todayTasks={tasks.get('today')}
          onAdd={(title) => {
            onAddTask(title, 'today', listId);
          }}
          onOpen={onOpen}
          onComplete={onComplete}
          lists={lists}
          tags={tags}
          condition={condition}
          activeTab={activeTab}
        />
      ) : null}
      {activeTab === 'upcoming' && (
        <Upcoming
          tasks={tasks}
          onAdd={(title, period) => {
            onAddTask(title, period);
          }}
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
