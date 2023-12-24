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
  } = useStickyNotes();
  const [parent] = useAutoAnimate({
    duration: 500,
  });

  function handleBack() {
    setIsStickyNoteEditorOpen(false);
    setIsStickyNoteOpened(false);
  }

  return isStickyNoteEditorOpen ? (
    <StickyNoteEditor currentNote={currentNote} onBack={handleBack} />
  ) : (
    <div className='stickyWall grid h-full grid-cols-[repeat(auto-fill,minmax(270px,1fr))] place-content-start gap-6 overflow-auto rounded-lg border border-background-tertiary p-5'
    ref={parent}
    >
      {stickyNotes.map((stickyNote) => {
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
      })}
      <StickyNote
        key={Math.random()}
        stickyNote={{
          bgColor: '#EBEBEB',
          textColor: '#000',
        }}
        adder
        onClick={() => {
          setCurrentNote({
            title: '',
            content: '<p></p>',
            description: '',
            bgColor: '#ff922b',
            textColor: '#fff',
          });
          setIsStickyNoteEditorOpen(true);
        }}
      />
    </div>
  );
}
