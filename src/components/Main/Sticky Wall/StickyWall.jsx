import { StickyNote } from './StickyNote';
import { StickyNoteEditor } from './Sticky Note Editor/StickyNoteEditor';
import { useStickyNotes } from '../../../hooks/useStickyNotes';
import { useAutoAnimate } from '@formkit/auto-animate/react';

export default function StickyWall() {
  const {
    stickyNotes,
    currentNote,
    setCurrentNote,
    setIsStickyNoteOpened,
    isStickyNoteEditorOpen,
    setIsStickyNoteEditorOpen,
    handleAddStickyNote,
  } = useStickyNotes();
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
    <div
      className='stickyWall grid h-full grid-cols-[repeat(auto-fill,minmax(270px,1fr))] place-content-start gap-6 overflow-auto rounded-lg border border-zinc-200 p-3 sm:p-5'
      ref={parent}
    >
      {
      stickyNotes.length > 0 ?
      stickyNotes.map((stickyNote) => {
        return (
          <StickyNote
            key={stickyNote.$id}
            stickyNote={stickyNote}
            onClick={() => {
              setCurrentNote(stickyNote);
              setIsStickyNoteEditorOpen(true);
            }}
          />
        );
      }) : 
      <div className='absolute flex h-full w-full flex-col items-center justify-center text-center'>
      <h3 className='mb-1 mt-5  text-xl font-semibold text-text-secondary'>
        You don&apos;t have any sticky notes yet
      </h3>
      <p className=' text-sm font-medium text-text-tertiary'>
        Click the plus icon below to add a new sticky note
      </p>
    </div>
    
    }
      {
        <button
          className='fixed bottom-5 right-5 sm:right-8 z-10 grid h-12 w-12 place-content-center rounded-full bg-primary p-2 transition-colors duration-300 hover:bg-primary-hover'
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
  );
}
