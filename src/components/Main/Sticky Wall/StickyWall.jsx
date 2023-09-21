import { useEffect, useState } from 'react';
import { StickyNote } from './StickyNote';

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
      onDelete={() => {
        onDelete(currentNote?.id);
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
            bgColor: '#ff6b6b',
            textColor: '',
            characters: 0,
            creationDate: new Date().toLocaleDateString(),
          });
          setIsEditorOpen(true);
        }}
      />
    </div>
  );
}
function StickyNoteEditor({ currentNote, stickyNotes, onBack, onAdd, onUpdate, onDelete }) {
  const [noteTitle, setNoteTitle] = useState(currentNote.title);
  const [noteContent, setNoteContent] = useState(currentNote.content);
  const [noteCharacters, setNoteCharacters] = useState(currentNote.characters);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    currentNote.title !== noteTitle || currentNote.content !== noteContent
      ? setIsChanged(true)
      : setIsChanged(false);
  }, [currentNote, noteTitle, noteContent]);

  function calculateCharacters(text) {
    text && setNoteCharacters(text.length);
  }
  function handleAddNote() {
    onAdd({
      id: Math.random(),
      title: noteTitle,
      content: noteContent,
      bgColor: currentNote.bgColor,
      textColor: currentNote.textColor,
      characters: noteCharacters,
      creationDate: new Date().toLocaleDateString(),
    });
  }
  function handleUpdateNote() {
    onUpdate({
      id: currentNote.id,
      title: noteTitle,
      content: noteContent,
      bgColor: currentNote.bgColor,
      textColor: currentNote.textColor,
      characters: noteCharacters,
      creationDate: currentNote.creationDate,
    });
  }
  function handleSave() {
    const exists = stickyNotes.find((note) => note.id === currentNote.id);
    isChanged && exists && handleUpdateNote();
    !isChanged && exists && onBack();
    !exists && handleAddNote();
  }
  return (
    <div className=' grid flex-[0.99] grid-rows-[40px_1fr]'>
      <div
        className='rounded-t-lg'
        style={{
          backgroundColor: currentNote.bgColor,
        }}
      ></div>
      <div className='flex h-full flex-col rounded-b-lg border border-background-tertiary border-t-transparent'>
        <StickyNoteTitle
          noteTitle={noteTitle}
          setNoteTitle={setNoteTitle}
          characters={noteCharacters}
          creationDate={currentNote.creationDate}
          onBack={onBack}
          onSave={handleSave}
          isChanged={isChanged}
        />
        <StickyNoteContent
          noteContent={noteContent}
          setNoteContent={setNoteContent}
          onType={calculateCharacters}
        />
      </div>
    </div>
  );
}
function StickyNoteTitle({
  noteTitle,
  setNoteTitle,
  characters,
  creationDate,
  onBack,
  onSave,
  isChanged,
}) {
  return (
    <div className='flex items-center justify-between border-b border-background-tertiary  p-5'>
      <div>
        <input
          type='text'
          className='w-full bg-transparent text-xl font-bold text-text-secondary placeholder:text-text-tertiary focus:outline-none'
          placeholder='Title'
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
        />
        <div className='mt-3 flex items-center gap-2 text-xs font-medium text-text-tertiary'>
          <span className='border-r border-text-tertiary pr-2'>
            <i className='fas fa-calendar mr-2 text-text-tertiary '></i>
            Created at {creationDate}
          </span>
          <span>{characters} Characters</span>
        </div>
      </div>
      <div className='flex items-center gap-2'>
        <button
          className='h-10 w-10 cursor-pointer rounded-full bg-background-tertiary text-text-tertiary hover:bg-background-secondary'
          onClick={onBack}
        >
          <i className='fa-solid fa-chevron-left'></i>
        </button>
        <button
          className={
            'h-10 w-10 cursor-pointer rounded-full transition-colors duration-500  ' +
            (isChanged
              ? 'cursor-pointer hover:bg-indigo-400 bg-indigo-500 text-background-secondary '
              : 'cursor-not-allowed bg-background-tertiary text-text-tertiary hover:bg-background-secondary')
          }
          onClick={onSave}
        >
          <i className='fa-solid fa-floppy-disk'></i>
        </button>
        <button className='h-10 w-10 cursor-pointer rounded-full bg-background-tertiary text-text-tertiary hover:bg-background-secondary '>
          <i className='fa-solid fa-ellipsis-vertical'></i>
        </button>
      </div>
    </div>
  );
}
function StickyNoteContent({ noteContent, setNoteContent, onType }) {
  useEffect(() => {
    onType(noteContent);
  }, [noteContent, onType]);
  return (
    <div className='flex-1'>
      <textarea
        className='h-full w-full  resize-none  bg-transparent p-5 focus:outline-none'
        placeholder='Start typing...'
        value={noteContent}
        onChange={(e) => setNoteContent(e.target.value)}
      ></textarea>
    </div>
  );
}
