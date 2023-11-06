import { useEffect, useMemo, useState } from 'react';
import TipTap from '../Tip Tap/TipTap';
import { BackgroundColorPicker } from './BackgroundColorPicker';
import { TextColorPicker } from './TextColorPicker';
import { StickyNoteHeader } from './StickyNoteHeader';
import { useStickyNotes } from '../../../../hooks/useStickyNotes';

export function StickyNoteEditor({ currentNote, onBack }) {
  const { stickyNotes, handleAddStickyNote, handleUpdateStickyNote, handleDeleteStickyNote } =
    useStickyNotes();

  const [title, setTitle] = useState(currentNote.title);
  const [content, setContent] = useState(currentNote.content);
  const [description, setDescription] = useState(currentNote.description);
  const [textColor, setTextColor] = useState(currentNote.textColor);
  const [bgColor, setBgColor] = useState(currentNote.bgColor);
  const [isChanged, setIsChanged] = useState(false);

  const exists = useMemo(
    () => stickyNotes.find((note) => note.$id === currentNote.$id),
    [stickyNotes, currentNote],
  );

  useEffect(() => {
    currentNote.title !== title ||
    (currentNote.content !== content && exists) ||
    (currentNote.content !== content && !exists && !isElementEmpty(content)) ||
    currentNote.description !== description ||
    currentNote.textColor !== textColor ||
    currentNote.bgColor !== bgColor
      ? setIsChanged(true)
      : setIsChanged(false);
  }, [currentNote, title, content, description, exists, textColor, bgColor]);

  function handleAddNote() {
    handleAddStickyNote({
      title: !title || title.trim() === '' ? 'Untitled' : title,
      content,
      description,
      bgColor,
      textColor,
    });
    onBack();
  }
  function handleUpdateNote() {
    handleUpdateStickyNote(currentNote.$id, {
      title: title || 'Untitled',
      content,
      description,
      bgColor,
      textColor,
    });
    onBack();
  }
  function handleDeleteNote(deletePermanently) {
    handleDeleteStickyNote(currentNote.$id,deletePermanently);
    onBack();
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
        <TipTap
          onUpdateContent={setContent}
          content={content}
          creationDate={currentNote.$createdAt}
        />
      </div>
    </div>
  );
}
