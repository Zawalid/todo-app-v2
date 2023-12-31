import { useMemo, useState } from 'react';
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

  const [title, setTitle] = useState(currentNote?.title);
  const [content, setContent] = useState(currentNote?.content);
  const [description, setDescription] = useState(currentNote?.description);
  const [textColor, setTextColor] = useState(currentNote?.textColor);
  const [bgColor, setBgColor] = useState(currentNote?.bgColor);
  const [isHeaderOpen, setIsHeaderOpen] = useState(true);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [deletePermanently, setDeletePermanently] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const exists = useMemo(
    () => stickyNotes.find((note) => note.$id === currentNote?.$id),
    [stickyNotes, currentNote],
  );

  function handleUpdateNote(field, value) {
    if (!exists) {
      handleAddStickyNote({
        title: !title || title.trim() === '' ? 'Untitled' : title,
        content,
        description,
        bgColor,
        textColor,
      });
      return;
    }
    if (currentNote[field] === value) return;
    handleUpdateStickyNote(
      currentNote?.$id,
      {
        [field]: value,
      },
      setIsSaving,
    );
  }
  function handleDeleteNote(deletePermanently, noToast) {
    handleDeleteStickyNote(currentNote?.$id, deletePermanently, noToast);
    onBack();
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
          <button
            onClick={() => {
              if (!title && isElementEmpty(content) && !description) handleDeleteNote(true, true);
              onBack();
            }}
          >
            <i className='fa-solid fa-chevron-left text-lg'></i>
          </button>

          <span className='text-xl font-semibold'>{title || 'Untitled'}</span>
          <div className='flex gap-5'>
            <DropDown
              toggler={<i className='fas fa-palette text-lg'></i>}
              options={{
                className: 'w-52',
                shouldCloseOnClick : false
              }}
            >
              <div className='space-y-2  py-1'>
                <DropDown.Title>Background Color</DropDown.Title>
                <BackgroundColorPicker
                  onChange={(color) => {
                    setBgColor(color);
                    handleUpdateNote('bgColor', color);
                  }}
                />
              </div>
              <div className='mt-1 space-y-2 border-t border-zinc-200 py-2'>
                <DropDown.Title>Text Color</DropDown.Title>
                <TextColorPicker
                  onChange={(color) => {
                    setTextColor(color);
                    handleUpdateNote('textColor', color);
                  }}
                />
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
                isDeleteButton={true}
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
            setTitle={(title) => {
              handleUpdateNote('title', title || 'Untitled');
              setTitle(title);
            }}
            description={description}
            setDescription={(description) => {
              handleUpdateNote('description', description);
              setDescription(description);
            }}
          />
          <TipTap
            onUpdateContent={(content) => {
              handleUpdateNote('content', content);
              setContent(content);
            }}
            content={content}
            creationDate={currentNote?.$createdAt}
            isSaving={isSaving}
          />
        </div>
      </div>
      {isConfirmationModalOpen && (
        <ConfirmationModal
          sentence='Are you sure you want to delete this note?'
          confirmText='Delete'
          onConfirm={() => {
            handleDeleteNote(deletePermanently);
            setIsConfirmationModalOpen(false);
          }}
          onCancel={() => setIsConfirmationModalOpen(false)}
          element='Note'
          checked={deletePermanently}
          setChecked={setDeletePermanently}
        />
      )}
    </>
  );
}

function isElementEmpty(htmlElement) {
  const tempElement = document.createElement('div');
  tempElement.innerHTML = htmlElement;
  return !tempElement.textContent.trim();
}
