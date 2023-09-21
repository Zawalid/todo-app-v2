import { useState } from 'react';
import { StickyNote } from './StickyNote';
import { StickyNoteEditor } from './StickyNoteEditor';

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
    <div className='grid h-full grid-cols-[repeat(auto-fill,minmax(270px,1fr))] place-content-start gap-6 rounded-lg border border-background-tertiary p-5'>
      {stickyNotes.map((stickyNote) => {
        return (
          <StickyNote
            key={stickyNote.id}
            title={stickyNote.title}
            content={stickyNote.content}
            bgColor={stickyNote.bgColor}
            textColor={stickyNote.textColor}
            characters={stickyNote.characters}
            creationDate={stickyNote.creationDate}
            onClick={() => {
              setCurrentNote({
                id: stickyNote.id,
                title: stickyNote.title,
                content: stickyNote.content,
                bgColor: stickyNote.bgColor,
                textColor: stickyNote.textColor,
                characters: stickyNote.characters,
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
            content: '',
            bgColor: '#ff922b',
            textColor: '#fff',
            characters: 0,
            creationDate: new Date().toLocaleDateString(),
          });
          setIsEditorOpen(true);
        }}
      />
    </div>
  );
}

