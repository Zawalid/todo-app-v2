import { StickyNote } from './StickyNote';
import { useStickyNotes } from '../../../hooks/useStickyNotes';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function NotesGroup({ render, group, view, isSelecting, isCollapsed, parent, condition, groupBy }) {
  const [isGroupOpen, setIsGroupOpen] = useState(true);
  const { stickyNotes, selectedNotes, setSelectedNotes } = useStickyNotes();
  const navigate = useNavigate();

  useEffect(() => {
    setIsGroupOpen(!isCollapsed);
  }, [isCollapsed]);

  if (!stickyNotes.some(condition) || !group) return null;

  return (
    <>
      <button
        className='flex w-full items-center justify-between rounded-md bg-background-secondary px-3 py-1 text-start text-sm font-medium  text-text-secondary'
        onClick={() => setIsGroupOpen((prev) => !prev)}
      >
        <span className={`flex items-center gap-2 ${groupBy === 'color' ? 'uppercase' : ''}`}>
          {group === 'Recent' && <i className='fa-solid fa-clock-rotate-left mr-2'></i>}
          {group === 'Pinned' && <i className='fa-solid fa-thumbtack mr-2'></i>}
          {groupBy === 'color' && (
            <div className='h-5 w-5 rounded-[3px]' style={{ backgroundColor: group }}></div>
          )}
          {group}
        </span>
        {isGroupOpen ? (
          <i className='fa-solid fa-chevron-up ml-1 text-xs'></i>
        ) : (
          <i className='fa-solid fa-chevron-down ml-1 text-xs'></i>
        )}
      </button>
      <div
        className={'flex-1 overflow-auto ' +
          (view === 'list'
            ? 'space-y-3 '
            : ' grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] gap-4 ') +
          (isGroupOpen ? 'h-auto' : 'h-0')}
        ref={parent}
      >
        {render()
          .filter(condition)
          .map((stickyNote) => {
            const isSelected = selectedNotes.filter((note) => note.$id === stickyNote.$id).length > 0;
            return (
              <StickyNote
                key={stickyNote.$id}
                stickyNote={stickyNote}
                onClick={() => {
                  isSelecting
                    ? setSelectedNotes((prev) => {
                      if (isSelected) return prev.filter((t) => t.$id !== stickyNote.$id);
                      else return [...prev, { $id: stickyNote.$id, title: stickyNote.title }];
                    })
                    : navigate(`/app/sticky-wall/${stickyNote.$id}`);
                }}
                listView={view === 'list'}
                isSelecting={isSelecting}
                isSelected={isSelected} />
            );
          })}
      </div>
    </>
  );
}
