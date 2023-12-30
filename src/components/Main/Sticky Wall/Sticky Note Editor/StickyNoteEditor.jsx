import { useCallback, useEffect, useMemo, useState } from 'react';
import TipTap from '../Tip Tap/TipTap';
import { BackgroundColorPicker } from './BackgroundColorPicker';
import { TextColorPicker } from './TextColorPicker';
import { StickyNoteHeader } from './StickyNoteHeader';
import { useStickyNotes } from '../../../../hooks/useStickyNotes';
import { DropDown } from '../../../Common/DropDown';
import { ConfirmationModal } from '../../../Common/ConfirmationModal';

export function StickyNoteEditor({ currentNote, onBack }) {
  const { stickyNotes, handleAddStickyNote, handleUpdateStickyNote, handleDeleteStickyNote } =
    useStickyNotes();

  const [title, setTitle] = useState(currentNote.title);
  const [content, setContent] = useState(currentNote.content);
  const [description, setDescription] = useState(currentNote.description);
  const [textColor, setTextColor] = useState(currentNote.textColor);
  const [bgColor, setBgColor] = useState(currentNote.bgColor);
  const [isChanged, setIsChanged] = useState(false);
  const [isHeaderOpen, setIsHeaderOpen] = useState(true);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [deletePermanently, setDeletePermanently] = useState(false);

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

  const handleAddNote = useCallback(() => {
    handleAddStickyNote({
      title: !title || title.trim() === '' ? 'Untitled' : title,
      content,
      description,
      bgColor,
      textColor,
    });
  }, [title, content, description, bgColor, textColor, handleAddStickyNote]);

  const handleUpdateNote = useCallback(() => {
    handleUpdateStickyNote(currentNote.$id, {
      title: title || 'Untitled',
      content,
      description,
      bgColor,
      textColor,
    });
  }, [title, content, description, bgColor, textColor, handleUpdateStickyNote, currentNote]);

  const handleSave = useCallback(() => {
    if (isChanged) return console.log('changed');
    if (!exists) return console.log('new');
    // if (!title && isElementEmpty(content) && !description) return;
    // isChanged && exists && handleUpdateNote();
    // exists || handleAddNote();
    // }, [title, content, description, isChanged, exists, handleUpdateNote, handleAddNote]);
  }, [isChanged, exists]);

  useEffect(() => {
  handleSave();
  }, [handleSave]);

  function handleDeleteNote(deletePermanently) {
    handleDeleteStickyNote(currentNote.$id, deletePermanently);
    onBack();
  }
  function isElementEmpty(htmlElement) {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = htmlElement;
    return !tempElement.textContent.trim();
  }

  return (
    <>
      <div className=' grid flex-[0.99] grid-rows-[40px_1fr]'>
        <div
          className='relative flex items-center justify-between rounded-t-lg px-4 '
          style={{
            backgroundColor: bgColor,
            color: textColor,
          }}
        >
          <button onClick={onBack}>
            <i className='fa-solid fa-chevron-left text-lg'></i>
          </button>

          <span className='text-xl font-semibold'>{title || 'Untitled'}</span>
          <div className='flex gap-5'>
            <DropDown
              toggler={<i className='fas fa-palette text-lg'></i>}
              options={{
                className: 'w-52',
              }}
              shouldCloseOnClick={false}
            >
              <div className='space-y-2  py-1'>
                <span className='text-sm text-text-tertiary'>Background Color</span>
                <BackgroundColorPicker onChange={(color) => setBgColor(color)} />
              </div>
              <div className='mt-1 space-y-2 border-t border-zinc-200 py-2'>
                <span className='text-sm text-text-tertiary'>Text Color</span>
                <TextColorPicker onChange={(color) => setTextColor(color)} />
              </div>
            </DropDown>

            <DropDown
              toggler={<i className='fas fa-ellipsis-v text-lg'></i>}
              options={{
                className: 'w-52',
              }}
            >
              <DropDown.Button
                onClick={() => setIsConfirmationModalOpen(true)}
                className='hover:bg-red-500 hover:text-white'
              >
                <i className='fa-solid fa-trash-can '></i>
                <span>Delete Note</span>
              </DropDown.Button>
            </DropDown>
          </div>
        </div>
        <div className='relative flex h-full flex-col overflow-hidden rounded-b-lg border-2 border-zinc-200 border-t-transparent'>
          <button
            className='absolute -top-1 left-1/2 -translate-x-1/2'
            onClick={() => setIsHeaderOpen(!isHeaderOpen)}
          >
            <i
              className={`fa-solid fa-chevron-down text-text-tertiary transition-transform duration-300 ${
                isHeaderOpen ? 'rotate-180' : ''
              }`}
            ></i>
          </button>
          <StickyNoteHeader
            isOpen={isHeaderOpen}
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
          />
          <TipTap
            onUpdateContent={setContent}
            content={content}
            creationDate={currentNote.$createdAt}
          />
        </div>
      </div>
      {isConfirmationModalOpen && (
        <ConfirmationModal
          sentence='Are you sure you want to delete this sticky note?'
          confirmText='Delete'
          onConfirm={() => {
            handleDeleteNote(deletePermanently);
            setIsConfirmationModalOpen(false);
          }}
          onCancel={() => setIsConfirmationModalOpen(false)}
          element='Sticky Note'
          checked={deletePermanently}
          setChecked={setDeletePermanently}
        />
      )}
    </>
  );
}
