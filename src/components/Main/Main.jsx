import { useMemo } from 'react';
import { BigTitle } from './Title';
import { StickyWall } from './Sticky Wall/StickyWall';
import { DisplayedTasks } from './Tasks/DisplayedTasks';

export function Main({
  todayTasks,
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
    if (activeTab === 'today' || activeTab === 'upcoming') return todayTasks.length;
    if (activeTab === 'stickyWall') return stickyNotes.length;
    if (listId) return lists.find((list) => list.id === +activeTab)?.tasks.length;
    return 0;
  }, [activeTab, todayTasks, listId, stickyNotes, lists]);

  const condition = (task) => {
    if (listId) return +task.listId === +listId;
    return true;
  };

  return (
    <main className='flex flex-1 flex-col overflow-y-auto rounded-xl bg-background-primary px-5 '>
      <BigTitle title={title} count={count} />
      {activeTab === 'stickyWall' ? (
        <StickyWall
          stickyNotes={stickyNotes}
          onAdd={onAddNote}
          onUpdate={onUpdateNote}
          onDelete={onDeleteNote}
        />
      ) : (
        <DisplayedTasks
          todayTasks={todayTasks}
          onAdd={(title) => {
            onAddTask(title, listId);
          }}
          onOpen={onOpen}
          onComplete={onComplete}
          lists={lists}
          tags={tags}
          condition={condition}
          activeTab={activeTab}
        />
      )}
    </main>
  );
}
