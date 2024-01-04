import { toast } from 'sonner';
import CustomTippy from '../../../../Common/CustomTippy';
import { useState } from 'react';
import { DropDown } from '../../../../Common/DropDown';
import { BackgroundColorPicker } from '../BackgroundColorPicker';
import { TextColorPicker } from '../TextColorPicker';
import { ConfirmationModal } from '../../../../Common/ConfirmationModal';

export function ActionBar({
  editor,
  handlers: { onBack, onChangeBg, onChangeText, onDelete, onOpenProperties },
  colors: { bgColor, textColor },
}) {
  const [isFullScreen, setIsFullScreen] = useState(document.fullscreenElement);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [deletePermanently, setDeletePermanently] = useState(false);

  if (!editor) return null;
  return (
    <div className='flex items-center justify-between'>
      <button
        className='not-active'
        onClick={() => {
          onBack();
        }}
      >
        <i className='fa-solid fa-chevron-left text-lg'></i>
      </button>
      <div className='flex items-center gap-2 border-background-tertiary '>
        <CustomTippy content='Undo'>
          <button
            onClick={() => editor.chain().undo().run()}
            disabled={!editor.can().chain().undo().run()}
            className='not-active cursor-pointer'
          >
            <svg
              stroke='currentColor'
              fill='currentColor'
              strokeWidth='0'
              viewBox='0 0 24 24'
              height='20px'
              width='20px'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M7.18,4,8.6,5.44,6.06,8h9.71a6,6,0,0,1,0,12h-2V18h2a4,4,0,0,0,0-8H6.06L8.6,12.51,7.18,13.92,2.23,9Z'></path>
            </svg>
          </button>
        </CustomTippy>
        <CustomTippy content='Redo'>
          <button
            onClick={() => editor.chain().redo().run()}
            disabled={!editor.can().chain().redo().run()}
            className='not-active cursor-pointer'
          >
            <svg
              stroke='currentColor'
              fill='currentColor'
              strokeWidth='0'
              viewBox='0 0 24 24'
              height='20px'
              width='20px'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M16.82,4,15.4,5.44,17.94,8H8.23a6,6,0,0,0,0,12h2V18h-2a4,4,0,0,1,0-8h9.71L15.4,12.51l1.41,1.41L21.77,9Z'></path>
            </svg>
          </button>
        </CustomTippy>
        <CustomTippy content={isFullScreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}>
          <button
            onClick={() => {
              isFullScreen
                ? (document.exitFullscreen(), setIsFullScreen(false))
                : (document.documentElement.requestFullscreen(), setIsFullScreen(true));

              document.fullscreenerror &&
                toast.error('Your browser does not support fullscreen mode');
            }}
            className='not-active cursor-pointer'
          >
            {isFullScreen ? (
              <i className='fa-solid fa-compress'></i>
            ) : (
              <i className='fa-solid fa-expand'></i>
            )}
          </button>
        </CustomTippy>
        {/* <DropDown
          toggler={<i className='fas fa-ellipsis-v text-lg'></i>}
          togglerClassName='not-active'
          options={{
            className: 'w-52 cursor-auto',
          }}
        >
          <div className='space-y-2 pb-1 text-start'>
            <DropDown.Title>Background Color</DropDown.Title>
            <BackgroundColorPicker onChange={(color) => onChangeBg(color)} bgColor={bgColor} />
          </div>
          <DropDown.Divider />
          <div className=' space-y-2 py-1  text-start'>
            <DropDown.Title>Text Color</DropDown.Title>
            <TextColorPicker onChange={(color) => onChangeText(color)} textColor={textColor} />
          </div>
          <DropDown.Divider />
          <DropDown.Button onClick={() => setIsConfirmationModalOpen(true)} isDeleteButton={true}>
            <i className='fa-solid fa-trash-can '></i>
            <span>Delete Note</span>
          </DropDown.Button>
        </DropDown> */}
        <button onClick={onOpenProperties} className='not-active'>
          <i className='fas fa-ellipsis-v text-lg'></i>
        </button>
      </div>
      {
        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          sentence='Are you sure you want to delete this note?'
          confirmText='Delete'
          onConfirm={() => {
            onDelete(deletePermanently);
            setIsConfirmationModalOpen(false);
            onBack();
          }}
          onCancel={() => setIsConfirmationModalOpen(false)}
          element='Note'
          checked={deletePermanently}
          setChecked={setDeletePermanently}
        />
      }
    </div>
  );
}
