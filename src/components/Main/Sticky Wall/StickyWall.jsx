import { useStickyNotes } from '../../../hooks/useStickyNotes';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useEffect, useState } from 'react';
import StickyWallActions from './StickyWallActions/StickyWallActions';
import useDeleteMultiple from '../useDeleteMultiple';
import { usePagination } from '../usePagination';
import { NavLink, useSearchParams } from 'react-router-dom';
import { isTouchDevice } from '../../../utils/helpers';
import { useModal } from '../../../hooks/useModal';
import { Title } from '../Title';
import { StickyWallSkeleton } from '../../Skeletons';
import { NotesGroup } from './NotesGroup';
import { PiPlusBold } from 'react-icons/pi';
import CustomTippy from '../../Common/CustomTippy';

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
    condition: (note, group) => {
      const firstLetter = note.title[0]?.trim().toUpperCase() || 'U';
      return firstLetter === group;
    },
    getSet: (note) => note.title[0]?.trim().toUpperCase(),
  },
  color: {
    condition: (note, group) => note.bgColor === group,
    getSet: (note) => note.bgColor,
  },
};

export default function StickyWall() {
  const {
    stickyNotes,
    handleDeleteAllNotes,
    selectedNotes,
    setSelectedNotes,
    handleDeleteMultipleNotes,
    isNotesLoading,
  } = useStickyNotes();
  const [view, setView] = useState(isTouchDevice() ? 'list' : 'grid');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { Pagination, currentPage, rowsPerPage } = usePagination(stickyNotes.length);
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get('sortBy') || 'updatedAt';
  const direction = searchParams.get('direction') || 'desc';
  const groupBy = searchParams.get('groupBy') || 'default';
  const { openModal: confirmDelete } = useModal();

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
    document.title = `I Do | Sticky Wall`;
  }, []);

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

  const actionsProps = {
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
  };

  return (
    <>
      <Title title='Sticky Wall' count={stickyNotes.length} />
      {isNotesLoading ? (
        <StickyWallSkeleton />
      ) : stickyNotes.length === 0 ? (
        <div className='absolute flex h-full w-full flex-col items-center justify-center text-center'>
          <h3 className='mb-1 mt-5  text-xl font-semibold text-text-secondary sm:text-2xl'>
            You don&apos;t have any sticky notes yet
          </h3>
          <p className='text-sm font-medium text-text-tertiary'>
            Click the plus icon below to add a new sticky note
          </p>
        </div>
      ) : (
        <div className='flex h-full flex-col gap-3 overflow-hidden'>
          <StickyWallActions {...actionsProps} />
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
                      group={t}
                      view={view}
                      isSelecting={isSelecting}
                      isCollapsed={isCollapsed}
                      parent={parent}
                      condition={(note) => groups[groupBy].condition(note, t)}
                      groupBy={groupBy}
                    />
                  ))}
          </div>
        </div>
      )}
      {!isNotesLoading && stickyNotes.length !== 0 && (
        <>
          <AddNote isSelecting={isSelecting} />
          {Pagination}
          {Modal}
        </>
      )}
    </>
  );
}

function AddNote({ isSelecting }) {
  if (isSelecting) return null;

  return (
    <CustomTippy
      content={
        <span className='flex items-center gap-2'>
          New Note
          <code className='shortcut bg-background-tertiary'>
            <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>N</kbd>
          </code>
        </span>
      }
    >
      <NavLink to='new'>
        <button className='fixed bottom-20 right-5 grid h-12 w-12 place-content-center rounded-full bg-primary p-2 shadow-lg transition-colors duration-200  hover:bg-primary-hover sm:right-8'>
          <PiPlusBold color='white' size={20} />
        </button>
      </NavLink>
    </CustomTippy>
  );
}
