import { toast } from 'sonner';
import CustomTippy from '../../../../Common/CustomTippy';
import { useEffect, useState } from 'react';
import { MdOutlineFullscreen, MdOutlineFullscreenExit } from 'react-icons/md';
import { PiDotsThreeOutlineVerticalFill } from 'react-icons/pi';
import { HiOutlineChevronLeft } from 'react-icons/hi';
import { GrUndo, GrRedo } from 'react-icons/gr';
import { IconThemeToggler } from '../../../../Menu/DropDownProfile';

export function ActionBar({ editor, onBack, onOpenActions }) {
  const [isFullScreen, setIsFullScreen] = useState(document.fullscreenElement);

  useEffect(() => {
    window.addEventListener('visibilitychange', () => setIsFullScreen(document.fullscreenElement));
    return () =>
      window.removeEventListener('visibilitychange', () =>
        setIsFullScreen(document.fullscreenElement),
      );
  }, []);

  if (!editor) return null;
  return (
    <div className='flex items-center justify-between'>
      <button className='icon-button not-active' onClick={onBack}>
        <HiOutlineChevronLeft />{' '}
      </button>
      <div className='flex items-center gap-2 border-background-tertiary '>
        <CustomTippy content='Undo'>
          <button
            onClick={() => editor.chain().undo().run()}
            disabled={!editor.can().chain().undo().run()}
            className='icon-button not-active cursor-pointer'
          >
            <GrUndo />
          </button>
        </CustomTippy>
        <CustomTippy content='Redo'>
          <button
            onClick={() => editor.chain().redo().run()}
            disabled={!editor.can().chain().redo().run()}
            className='icon-button not-active cursor-pointer'
          >
            <GrRedo />
          </button>
        </CustomTippy>
        <CustomTippy content='Toggle Dark Mode'>
          <span>
            <IconThemeToggler />
          </span>
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
              <MdOutlineFullscreenExit size={20} />
            ) : (
              <MdOutlineFullscreen size={20} />
            )}
          </button>
        </CustomTippy>
        <button onClick={onOpenActions} className='icon-button not-active'>
          <PiDotsThreeOutlineVerticalFill />{' '}
        </button>
      </div>
    </div>
  );
}
