import { useMemo, useState } from 'react';
import TipTap from '../Tip Tap/TipTap';
import { BackgroundColorPicker } from './BackgroundColorPicker';
import { TextColorPicker } from './TextColorPicker';
import { useStickyNotes } from '../../../../hooks/useStickyNotes';
import { DropDown } from '../../../Common/DropDown';
import { ConfirmationModal } from '../../../Common/ConfirmationModal';

export function StickyNoteEditor({ currentNote }) {
  const { stickyNotes, handleAddStickyNote, handleUpdateStickyNote } =
    useStickyNotes();

  const [title, setTitle] = useState(currentNote?.title);
  const [content, setContent] = useState(currentNote?.content);
  const [textColor, setTextColor] = useState(currentNote?.textColor);
  const [bgColor, setBgColor] = useState(currentNote?.bgColor);
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


  return (
    <>
      <div className=' grid flex-1 overflow-auto bg-background-primary' id='editor'>
        {/* <div
          className='relative grid grid-cols-[100px_auto_100px] place-content-center  items-center  rounded-t-lg px-4 '
          style={{
            backgroundColor: bgColor,
            color: textColor,
          }}
        >
          <button
            className='place-self-start'
            onClick={() => {
              if (!title && isElementEmpty(content)) handleDeleteNote(true, true);
              onBack();
            }}
          >
            <i className='fa-solid fa-chevron-left text-lg'></i>
          </button>
          <div className='overflow-hidden'>
            <span className='truncate  text-xl font-semibold'>{title || 'Untitled'}</span>
          </div>
          <div className='flex gap-5 place-self-end'>
            <DropDown
              toggler={<i className='fas fa-palette text-lg'></i>}
              options={{
                className: 'w-52',
                shouldCloseOnClick: false,
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
        </div> */}
        <div className='relative flex h-full flex-col overflow-hidden rounded-lg border- border-zinc-200 '>
          <TipTap
            onUpdateContent={(content) => {
              handleUpdateNote('content', content);
              setContent(content);
            }}
            $id={currentNote?.$id}
            content={content}
            updateDate={currentNote?.$updatedAt}
            isSaving={isSaving}
            title={title}
            setTitle={(title) => {
              handleUpdateNote('title', title || 'Untitled');
              setTitle(title);
            }}
          />
        </div>
      </div>
      {/* {isConfirmationModalOpen && (
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
      )} */}
    </>
  );
}

