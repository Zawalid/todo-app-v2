import { StickyNote } from './StickyNote';
import { StickyNoteEditor } from './Sticky Note Editor/StickyNoteEditor';
import { useStickyNotes } from '../../../hooks/useStickyNotes';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useEffect, useState } from 'react';
import StickyWallActions from './StickyWallActions/StickyWallActions';
import useDeleteMultiple from '../useDeleteMultiple';
import { usePagination } from '../usePagination';
import { useSearchParams } from 'react-router-dom';
import { isTouchDevice } from '../../../utils/helpers';
import { useModal } from '../../Common/ConfirmationModal';

export default function StickyWall() {
  const {
    stickyNotes,
    setCurrentNote,
    isStickyNoteEditorOpen,
    setIsStickyNoteEditorOpen,
    handleAddStickyNote,
    handleDeleteAllNotes,
    selectedNotes,
    setSelectedNotes,
    handleDeleteMultipleNotes,
  } = useStickyNotes();
  const [view, setView] = useState(isTouchDevice() ? 'list' : 'grid');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { Pagination, currentPage, rowsPerPage } = usePagination(stickyNotes.length);
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get('sortBy') || 'updatedAt';
  const direction = searchParams.get('direction') || 'desc';
  const groupBy = searchParams.get('groupBy') || 'default';
  const { confirmDelete } = useModal();

  const { isSelecting, setIsSelecting, Modal } = useDeleteMultiple({
    selectedItems: selectedNotes,
    setSelectedItems: setSelectedNotes,
    itemType: 'Note',
    onConfirm: () => {
      confirmDelete({
        message: `Are you sure you want to delete ${
          selectedNotes.length > 1 ? `${selectedNotes.length} sticky notes` : 'this sticky note'
        }
?`,
        title: `Delete Sticky Note${selectedNotes.length > 1 ? 's' : ''} `,

        onConfirm: (deletePermanently) => {
          handleDeleteMultipleNotes(deletePermanently);
          setIsSelecting(false);
        },
      });
    },
  });

  const [parent] = useAutoAnimate({
    duration: 600,
  });

  const setParam = (param) => {
    const params = { sortBy, direction, groupBy };
    setSearchParams(
      {
        ...params,
        ...param,
      },
      { replace: true },
    );
  };

  const render = () =>
    stickyNotes
      .toSorted((a, b) => {
        if (sortBy === 'updatedAt') {
          return direction === 'asc'
            ? new Date(a.$updatedAt) - new Date(b.$updatedAt)
            : new Date(b.$updatedAt) - new Date(a.$updatedAt);
        }
        if (sortBy === 'createdAt') {
          return direction === 'asc'
            ? new Date(a.$createdAt) - new Date(b.$createdAt)
            : new Date(b.$createdAt) - new Date(a.$createdAt);
        }
        if (sortBy === 'title') {
          return direction === 'asc'
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        }
      })
      .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  useEffect(() => {
    if (
      !['createdAt', 'updatedAt', 'title'].includes(sortBy) ||
      !['asc', 'desc'].includes(direction) ||
      (sortBy === 'updatedAt' && direction === 'desc')
    )
      setSearchParams(
        (prev) => {
          prev.delete('sortBy');
          prev.delete('direction');
          return prev;
        },
        { replace: true },
      );
  }, [sortBy, direction, setSearchParams]);

  useEffect(() => {
    if (!['year', 'month', 'day', 'a-z', 'color'].includes(groupBy))
      setSearchParams(
        (prev) => {
          prev.delete('groupBy');
          return prev;
        },
        { replace: true },
      );
  }, [groupBy, setSearchParams]);

  if (isStickyNoteEditorOpen) return <StickyNoteEditor />;

  if (stickyNotes.length === 0)
    return (
      <div className='absolute flex h-full w-full flex-col items-center justify-center text-center'>
        <h3 className='mb-1 mt-5  text-xl font-semibold text-text-secondary sm:text-2xl'>
          You don&apos;t have any sticky notes yet
        </h3>
        <p className='text-sm font-medium text-text-tertiary'>
          Click the plus icon below to add a new sticky note
        </p>
        <AddNote
          isSelecting={isSelecting}
          handleAddStickyNote={handleAddStickyNote}
          setCurrentNote={setCurrentNote}
          setIsStickyNoteEditorOpen={setIsStickyNoteEditorOpen}
        />
      </div>
    );
  return (
    <div className='flex h-full flex-col gap-3 overflow-hidden'>
      <StickyWallActions
        {...{
          view,
          setView,
          sortBy,
          setSortBy: (sortBy) => setParam({ sortBy }),
          direction,
          setDirection: (direction) => setParam({ direction }),
          groupBy,
          setGroupBy: (groupBy) => setParam({ groupBy }),
          isCollapsed,
          setIsCollapsed,
          // Selection
          isSelecting,
          setIsSelecting,
          selectAll() {
            setSelectedNotes(stickyNotes.map((n) => ({ $id: n.$id, title: n.title })));
          },
          unSelectAll() {
            setSelectedNotes([]);
          },
          allSelected: selectedNotes.length === stickyNotes.length,
          // Delete
          deleteAll() {
            confirmDelete({
              message: 'Are you sure you want to delete all sticky notes?',
              title: 'Delete All Sticky Notes',
              confirmText: 'Delete All',
              onConfirm: (deletePermanently) => {
                handleDeleteAllNotes(deletePermanently);
                setIsSelecting(false);
              },
            });
          },
        }}
      />

      <div
        className='flex-1 space-y-3 overflow-auto rounded-lg border border-border p-3   pr-3 sm:p-5'
        ref={parent}
      >
        {groupBy === 'default'
          ? [
              {
                group: 'Pinned',
                condition: (note) => note.pinned,
              },
              {
                group: 'Recent',
                condition: (note) => !note.pinned,
              },
            ].map(({ group, condition }) => (
              <NotesGroup
                key={group}
                render={render}
                group={group}
                view={view}
                isSelecting={isSelecting}
                isCollapsed={isCollapsed}
                parent={parent}
                condition={condition}
              />
            ))
          : [...new Set(stickyNotes.map((n) => groups[groupBy].getSet(n)))]
              .toSorted((a, b) => groupBy === 'a-z' && a.localeCompare(b))
              .map((t) => (
                <NotesGroup
                  key={t}
                  render={render}
                  group={
                    groupBy === 'color'
                      ? window.getComputedStyle(document.documentElement).getPropertyValue(t)
                      : t
                  }
                  view={view}
                  isSelecting={isSelecting}
                  isCollapsed={isCollapsed}
                  parent={parent}
                  condition={(note) => groups[groupBy].condition(note, t)}
                  groupBy={groupBy}
                />
              ))}
      </div>

      {Pagination}

      <AddNote
        isSelecting={isSelecting}
        handleAddStickyNote={handleAddStickyNote}
        setCurrentNote={setCurrentNote}
        setIsStickyNoteEditorOpen={setIsStickyNoteEditorOpen}
      />

      {Modal}
    </div>
  );
}

function NotesGroup({ render, group, view, isSelecting, isCollapsed, parent, condition, groupBy }) {
  const [isGroupOpen, setIsGroupOpen] = useState(true);
  const {
    stickyNotes,
    setCurrentNote,
    setIsStickyNoteEditorOpen,
    selectedNotes,
    setSelectedNotes,
  } = useStickyNotes();

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
        className={
          'flex-1 overflow-auto ' +
          (view === 'list'
            ? 'space-y-3 '
            : ' grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] gap-4 ') +
          (isGroupOpen ? 'h-auto' : 'h-0')
        }
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
                onClick={() => {
                  if (isSelecting) {
                    setSelectedNotes((prev) => {
                      if (isSelected) return prev.filter((t) => t.$id !== stickyNote.$id);
                      else return [...prev, { $id: stickyNote.$id, title: stickyNote.title }];
                    });
                  } else {
                    setCurrentNote(stickyNote);
                    setIsStickyNoteEditorOpen(true);
                  }
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

function AddNote({ isSelecting, handleAddStickyNote, setCurrentNote, setIsStickyNoteEditorOpen }) {
  if (!isSelecting)
    return (
      <button
        className='fixed bottom-14 right-5 z-10 grid h-12 w-12 place-content-center rounded-full bg-primary p-2 shadow-lg  hover:bg-primary-hover sm:right-8'
        onClick={() => {
          const note = {
            title: '',
            content: '<p></p>',
            bgColor: '--custom-1',
            textColor: '#fff',
            readonly: false,
            pinned: false,
            fontFamily: `'Lexend Deca', sans-serif`,
          };
          handleAddStickyNote(note);
          setCurrentNote((prev) => ({ ...prev, ...note }));
          setIsStickyNoteEditorOpen(true);
        }}
      >
        <i className='fa-regular fa-plus text-xl text-white'></i>
      </button>
    );
}

const groups = {
  year: {
    condition: (note, group) => new Date(note.$createdAt).getFullYear() === group,
    getSet: (note) => new Date(note.$createdAt).getFullYear(),
  },
  month: {
    condition: (note, group) =>
      new Date(note.$createdAt).getMonth() === new Date(group).getMonth() &&
      new Date(note.$createdAt).getFullYear() === new Date(group).getFullYear(),
    getSet: (note) =>
      new Date(note.$createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }),
  },
  day: {
    condition: (note, group) =>
      new Date(note.$createdAt).getDate() === new Date(group).getDate() &&
      new Date(note.$createdAt).getMonth() === new Date(group).getMonth() &&
      new Date(note.$createdAt).getFullYear() === new Date(group).getFullYear(),
    getSet: (note) =>
      new Date(note.$createdAt).toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
  },
  'a-z': {
    condition: (note, group) => note.title[0]?.trim().toUpperCase() === group,
    getSet: (note) => note.title[0]?.trim().toUpperCase(),
  },
  color: {
    condition: (note, group) => note.bgColor === group,
    getSet: (note) => note.bgColor,
  },
};
