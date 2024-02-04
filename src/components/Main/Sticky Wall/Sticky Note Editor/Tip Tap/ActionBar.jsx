import { toast } from 'sonner';
import CustomTippy from '../../../../Common/CustomTippy';
import { useEffect, useState } from 'react';

export function ActionBar({ editor, onBack, onOpenActions }) {
  const [isFullScreen, setIsFullScreen] = useState(document.fullscreenElement);

  useEffect(() => {
    window.addEventListener('visibilitychange', () => setIsFullScreen(document.fullscreenElement));
    return () => window.removeEventListener('visibilitychange', () => setIsFullScreen(document.fullscreenElement));
  }, []);

  if (!editor) return null;
  return (
    <div className='flex items-center justify-between'>
      <button
        className='icon-button not-active'
        onClick={() => {
          onBack();
        }}
      >
        <i className='fa-solid fa-chevron-left'></i>
      </button>
      <div className='flex items-center gap-2 border-background-tertiary '>
        <CustomTippy content='Undo'>
          <button
            onClick={() => editor.chain().undo().run()}
            disabled={!editor.can().chain().undo().run()}
            className='icon-button not-active cursor-pointer'
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
            className='icon-button not-active cursor-pointer'
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
            className='icon-button not-active cursor-pointer'
          >
            {isFullScreen ? (
              <i className='fa-solid fa-compress'></i>
            ) : (
              <i className='fa-solid fa-expand'></i>
            )}
          </button>
        </CustomTippy>
        <button onClick={onOpenActions} className='icon-button not-active'>
          <i className='fas fa-ellipsis-v text-lg'></i>
        </button>
      </div>
    </div>
  );
}
