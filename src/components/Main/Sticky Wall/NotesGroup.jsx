import { StickyNote } from './StickyNote';
import { useStickyNotes } from '../../../hooks/useStickyNotes';
import { useEffect, useState } from 'react';
import { GiPin } from 'react-icons/gi';
import { RxCountdownTimer } from 'react-icons/rx';
import { IoChevronUp, IoChevronDown } from 'react-icons/io5';

export function NotesGroup({
  render,
  group,
  view,
  isSelecting,
  isCollapsed,
  parent,
  condition,
  groupBy,
}) {
  const [isGroupOpen, setIsGroupOpen] = useState(true);
  const { stickyNotes, selectedNotes, setSelectedNotes } = useStickyNotes();

  useEffect(() => {
    setIsGroupOpen(!isCollapsed);
  }, [isCollapsed]);

  const color =
    groupBy === 'color'
      ? window.getComputedStyle(document.documentElement).getPropertyValue(group)
      : null;

  if (!stickyNotes?.some(condition) || !group) return null;

  return (
    <>
      <button
        className='flex w-full items-center justify-between rounded-md bg-background-secondary px-3 py-1 text-start text-sm font-medium  text-text-secondary'
        onClick={() => setIsGroupOpen((prev) => !prev)}
      >
        <span className={`flex items-center gap-2 ${groupBy === 'color' ? 'uppercase' : ''}`}>
          {group === 'Recent' && <RxCountdownTimer />}
          {group === 'Pinned' && <GiPin />}
          {groupBy === 'color' && (
            <div className='h-5 w-5 rounded-[3px]' style={{ backgroundColor: color }}></div>
          )}
          {color || group}
        </span>
        {isGroupOpen ? <IoChevronUp /> : <IoChevronDown />}
      </button>
      <div
        className={`flex-1 gap-4 overflow-auto ${
          view === 'list' ? 'space-y-3 ' : ' grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))]'
        } ${isGroupOpen ? 'h-auto' : 'h-0'}`}
        ref={parent}
      >
        {render()
          .filter(condition)
          .map((stickyNote) => {
            const isSelected =
              selectedNotes.filter((note) => note.$id === stickyNote.$id).length > 0;
            return (
              <StickyNote
                key={stickyNote.$id}
                stickyNote={stickyNote}
                onSelect={() => {
                  setSelectedNotes((prev) => {
                    if (isSelected) return prev.filter((t) => t.$id !== stickyNote.$id);
                    else return [...prev, { $id: stickyNote.$id, title: stickyNote.title }];
                  });
                }}
                listView={view === 'list'}
                isSelecting={isSelecting}
                isSelected={isSelected}
              />
            );
          })}
      </div>
    </>
  );
}
