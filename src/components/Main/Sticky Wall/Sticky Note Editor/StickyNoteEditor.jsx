import { useEffect, useMemo, useState } from 'react';
import { BackgroundColorPicker } from './BackgroundColorPicker';
import { TextColorPicker } from './TextColorPicker';
import { StickyNoteContent } from './StickyNoteContent';
import { StickyNoteHeader } from './StickyNoteHeader';

export function StickyNoteEditor({ currentNote, stickyNotes, onBack, onAdd, onUpdate, onDelete }) {
  const [title, setTitle] = useState(currentNote.title);
  const [content, setContent] = useState(currentNote.content);
  const [description, setDescription] = useState(currentNote.description);
  const [textColor, setTextColor] = useState(currentNote.textColor);
  const [bgColor, setBgColor] = useState(currentNote.bgColor);
  const [isChanged, setIsChanged] = useState(false);

  const exists = useMemo(
    () => stickyNotes.find((note) => note.id === currentNote.id),
    [stickyNotes, currentNote],
  );

  useEffect(() => {
    currentNote.title !== title ||
    (currentNote.content !== content && !isElementEmpty(content)) ||
    currentNote.description !== description ||
    currentNote.textColor !== textColor ||
    currentNote.bgColor !== bgColor
      ? setIsChanged(true)
      : setIsChanged(false);
  }, [currentNote, title, content, description, textColor, bgColor]);

  function handleAddNote() {
    onAdd({
      id: Math.random(),
      title: title || 'Untitled',
      content,
      description,
      bgColor,
      textColor,
      creationDate: new Date().toLocaleDateString(),
    });
  }
  function handleUpdateNote() {
    onUpdate({
      id: currentNote.id,
      title: title || 'Untitled',
      content,
      description,
      bgColor,
      textColor,
      creationDate: currentNote.creationDate,
    });
  }
  function handleDeleteNote() {
    onDelete(currentNote.id);
  }
  function isElementEmpty(htmlElement) {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = htmlElement;
    return !tempElement.textContent.trim();
  }

  function handleSave() {
    if (!title && isElementEmpty(content) && !description) return;
    isChanged && exists && handleUpdateNote();
    !isChanged && exists && onBack();
    exists || handleAddNote();
  }
  function handleChangeTextColor(color) {
    setTextColor(color);
  }
  function handleChangeBgColor(color) {
    setBgColor(color);
  }
  return (
    <div className=' grid flex-[0.99] grid-rows-[40px_1fr]'>
      <div
        className='relative flex items-center justify-between overflow-hidden rounded-t-lg px-2'
        style={{
          backgroundColor: bgColor,
          color: textColor,
        }}
      >
        <TextColorPicker onChange={handleChangeTextColor} />
        <span className='font-semibold'>Sticky Note</span>
        <BackgroundColorPicker onChange={handleChangeBgColor} />
      </div>
      <div className='flex h-full flex-col overflow-hidden rounded-b-lg border-2 border-background-tertiary border-t-transparent'>
        <StickyNoteHeader
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          onBack={onBack}
          onSave={handleSave}
          onDelete={handleDeleteNote}
          isChanged={isChanged}
        />
        <StickyNoteContent
          content={content}
          setContent={setContent}
          creationDate={currentNote.creationDate}
        />
      </div>
    </div>
  );
}
