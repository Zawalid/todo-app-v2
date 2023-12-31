import { StickyNote } from './StickyNote';
import { StickyNoteEditor } from './Sticky Note Editor/StickyNoteEditor';
import { useStickyNotes } from '../../../hooks/useStickyNotes';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useState } from 'react';
import StickyWallActions from './StickyWallActions/StickyWallActions';
import { ConfirmationModal } from '../../Common/ConfirmationModal';

export default function StickyWall() {
  const {
    stickyNotes,
    currentNote,
    setCurrentNote,
    setIsStickyNoteOpened,
    isStickyNoteEditorOpen,
    setIsStickyNoteEditorOpen,
    handleAddStickyNote,
    handleDeleteAllNotes,
  } = useStickyNotes();
  const [view, setView] = useState('grid');
  const [sortBy, setSortBy] = useState('$updatedAt');
  const [direction, setDirection] = useState('desc');
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [deletePermanently, setDeletePermanently] = useState(false);

  const [parent] = useAutoAnimate({
    duration: 500,
  });

  function handleBack() {
    setIsStickyNoteEditorOpen(false);
    setIsStickyNoteOpened(false);
    setCurrentNote(null);
  }

  return isStickyNoteEditorOpen ? (
    <StickyNoteEditor currentNote={currentNote} onBack={handleBack} />
  ) : (
    <div className='flex h-full flex-col gap-3 overflow-auto'>
      <StickyWallActions
        options={{
          view,
          setView,
          sortBy,
          setSortBy,
          direction,
          setDirection,
          setIsConfirmationModalOpen,
        }}
      />

      <div
        className={
          'stickyWall grid flex-1 place-content-start  gap-x-6 gap-y-3 overflow-auto rounded-lg border border-zinc-200 p-3 sm:p-5' +
          (view === 'list' ? '' : ' grid-cols-[repeat(auto-fill,minmax(270px,1fr))] ')
        }
        ref={parent}
      >
        {stickyNotes.length > 0 ? (
          stickyNotes
            .toSorted((a, b) => {
              if (sortBy === '$updatedAt') {
                return direction === 'asc'
                  ? new Date(a.$updatedAt) - new Date(b.$updatedAt)
                  : new Date(b.$updatedAt) - new Date(a.$updatedAt);
              }
              if (sortBy === '$createdAt') {
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
            .map((stickyNote) => {
              return (
                <StickyNote
                  key={stickyNote.$id}
                  stickyNote={stickyNote}
                  onClick={() => {
                    setCurrentNote(stickyNote);
                    setIsStickyNoteEditorOpen(true);
                  }}
                  listView={view === 'list'}
                />
              );
            })
        ) : (
          <div className='absolute flex h-full w-full flex-col items-center justify-center text-center'>
            <h3 className='mb-1 mt-5  text-xl font-semibold text-text-secondary'>
              You don&apos;t have any sticky notes yet
            </h3>
            <p className=' text-sm font-medium text-text-tertiary'>
              Click the plus icon below to add a new sticky note
            </p>
          </div>
        )}
        {
          <button
            className='fixed bottom-5 right-5 z-10 grid h-12 w-12 place-content-center rounded-full bg-primary p-2 transition-colors duration-300 hover:bg-primary-hover sm:right-8'
            onClick={() => {
              const note = {
                title: '',
                content: '<p></p>',
                description: '',
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
        }
      </div>
      {isConfirmationModalOpen && (
        <ConfirmationModal
          sentence='Are you sure you want to delete all notes'
          confirmText='Delete All'
          onConfirm={() => {
            handleDeleteAllNotes(deletePermanently);
            setIsConfirmationModalOpen(false);
          }}
          onCancel={() => setIsConfirmationModalOpen(false)}
          element='Notes'
          checked={deletePermanently}
          setChecked={setDeletePermanently}
        />
      )}
    </div>
  );
}
