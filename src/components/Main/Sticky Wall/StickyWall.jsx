import { useState } from 'react';
import { StickyNote } from './StickyNote';
import { StickyNoteEditor } from './Sticky Note Editor/StickyNoteEditor';

export function StickyWall({ stickyNotes, onAdd, onUpdate, onDelete }) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);

  function handleBack() {
    setIsEditorOpen(false);
  }

  return isEditorOpen ? (
    <StickyNoteEditor
      currentNote={currentNote}
      stickyNotes={stickyNotes}
      onBack={handleBack}
      onAdd={(note) => {
        onAdd(note);
        handleBack();
      }}
      onUpdate={(note) => {
        onUpdate(note);
        handleBack();
      }}
      onDelete={(id) => {
        onDelete(id);
        handleBack();
      }}
    />
  ) : (
    <div className='stickyWall grid h-full grid-cols-[repeat(auto-fill,minmax(270px,1fr))] place-content-start gap-6 overflow-auto rounded-lg border border-background-tertiary p-5'>
      {stickyNotes.map((stickyNote) => {
        return (
          <StickyNote
            key={stickyNote.id}
            title={stickyNote.title}
            description={stickyNote.description}
            bgColor={stickyNote.bgColor}
            textColor={stickyNote.textColor}
            creationDate={stickyNote.creationDate}
            onClick={() => {
              setCurrentNote({
                id: stickyNote.id,
                title: stickyNote.title,
                content: stickyNote.content || '<p></p>',
                description: stickyNote.description,
                bgColor: stickyNote.bgColor,
                textColor: stickyNote.textColor,
                creationDate: stickyNote.creationDate,
              });
              setIsEditorOpen(true);
            }}
          />
        );
      })}
      <StickyNote
        key={Math.random()}
        bgColor='#EBEBEB'
        adder
        onClick={() => {
          setCurrentNote({
            id: Math.random(),
            title: '',
            content: '<p></p>',
            description: '',
            bgColor: '#ff922b',
            textColor: '#fff',
            creationDate: new Date().toLocaleDateString(),
          });
          setIsEditorOpen(true);
        }}
      />
    </div>
  );
}
