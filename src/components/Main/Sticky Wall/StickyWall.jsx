import { StickyNote } from './StickyNote';
import { StickyNoteEditor } from './Sticky Note Editor/StickyNoteEditor';
import { useStickyNotes } from '../../../hooks/useStickyNotes';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useEffect, useRef, useState } from 'react';
import StickyWallActions from './StickyWallActions/StickyWallActions';
import { ConfirmationModal } from '../../Common/ConfirmationModal';
import useDeleteMultiple from '../useDeleteMultiple';
import { usePagination } from '../usePagination';
import { useSearchParams } from 'react-router-dom';

export default function StickyWall() {
  const {
    stickyNotes,
    currentNote,
    setCurrentNote,
    isStickyNoteEditorOpen,
    setIsStickyNoteEditorOpen,
    handleAddStickyNote,
    handleDeleteAllNotes,
    selectedNotes,
    setSelectedNotes,
    handleDeleteMultipleNotes,
  } = useStickyNotes();
  const [view, setView] = useState('grid');
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [deletePermanently, setDeletePermanently] = useState(false);
  const whichDelete = useRef(null);
  const { Pagination, currentPage, rowsPerPage } = usePagination(stickyNotes.length);

  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get('sortBy') || 'updatedAt';
  const direction = searchParams.get('direction') || 'desc';

  const { isSelecting, setIsSelecting, setIsDeleteMultipleModalOpen, Modal } = useDeleteMultiple({
    selectedItems: selectedNotes,
    setSelectedItems: setSelectedNotes,
    itemType: 'Note',
    onConfirm: () => {
      setIsConfirmationModalOpen(true);
      whichDelete.current = 'selected';
    },
  });

  const [parent] = useAutoAnimate({
    duration: 600,
  });

  useEffect(() => {
    if (
      !['createdAt', 'updatedAt', 'title'].includes(sortBy) ||
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
  }, [sortBy, direction,setSearchParams]);

  function handleBack() {
    setIsStickyNoteEditorOpen(false);
    setCurrentNote(null);
  }

  if (isStickyNoteEditorOpen)
    return <StickyNoteEditor currentNote={currentNote} onBack={handleBack} />;

  return (
    <div className='flex h-full flex-col gap-3 overflow-hidden'>
      <StickyWallActions
        options={{
          view,
          setView,
          sortBy,
          setSortBy: (sortBy) => setSearchParams({ sortBy, direction }, { replace: true }),
          direction,
          setDirection: (direction) => setSearchParams({ sortBy, direction }, { replace: true }),
          setIsConfirmationModalOpen,
          setIsSelecting,
        }}
      />

      <div
        className={
          ' flex-1 overflow-auto rounded-lg border border-zinc-200 p-3 sm:p-5 ' +
          (view === 'list'
            ? 'space-y-3'
            : ' grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] gap-4 ')
        }
        ref={parent}
      >
        {stickyNotes.length > 0 &&
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
            .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
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

        {stickyNotes.length === 0 && (
          <div className='absolute flex h-full w-full flex-col items-center justify-center text-center'>
            <h3 className='mb-1 mt-5  text-xl font-semibold text-text-secondary sm:text-2xl'>
              You don&apos;t have any sticky notes yet
            </h3>
            <p className='text-sm font-medium text-text-tertiary'>
              Click the plus icon below to add a new sticky note
            </p>
          </div>
        )}
      </div>
      {!isSelecting && (
        <button
          className='fixed bottom-14 right-5 z-10 grid h-12 w-12 place-content-center rounded-full bg-primary p-2 shadow-lg transition-colors duration-300 hover:bg-primary-hover sm:right-8'
          onClick={() => {
            const note = {
              title: '',
              content: '<p></p>',
              bgColor: '#ff922b',
              textColor: '#fff',
            };
            handleAddStickyNote(note);
            setCurrentNote((prev) => ({ ...prev, ...note }));
            setIsStickyNoteEditorOpen(true);
          }}
        >
          <i className='fa-regular fa-plus text-xl text-white'></i>
        </button>
      )}
      {stickyNotes.length > 0 && Pagination}
      {isConfirmationModalOpen && (
        <ConfirmationModal
          sentence={`Are you sure you want to ${
            whichDelete.current === 'selected'
              ? `delete ${
                  selectedNotes.length > 1 ? `${selectedNotes.length} notes` : 'this note'
                } `
              : 'delete all notes?'
          } `}
          confirmText={whichDelete.current === 'selected' ? 'Delete' : 'Delete All'}
          onConfirm={() => {
            whichDelete.current === 'selected'
              ? handleDeleteMultipleNotes(deletePermanently)
              : handleDeleteAllNotes(deletePermanently);

            setIsConfirmationModalOpen(false);
            setIsDeleteMultipleModalOpen(false);
            setIsSelecting(false);
          }}
          onCancel={() => setIsConfirmationModalOpen(false)}
          element='Notes'
          checked={deletePermanently}
          setChecked={setDeletePermanently}
        />
      )}
      {Modal}
    </div>
  );
}
