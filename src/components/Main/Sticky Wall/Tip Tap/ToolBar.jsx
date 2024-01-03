import { toast } from 'sonner';
import CustomTippy from '../../../Common/CustomTippy';
import { AddLink } from './AddLink';
import { Highlighter } from './Highlighter';
import { TextColor } from './TextColor';
import { useEffect, useState } from 'react';
import { isTouchDevice } from '../../../../utils/helpers';
import { DropDown } from '../../../Common/DropDown';

export const ToolBar = ({ editor, isKeyboardOpen }) => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if ('virtualKeyboard' in navigator && isKeyboardOpen) {
      navigator.virtualKeyboard.overlaysContent = true;
      const handleKeyboard = (e) => setKeyboardHeight(e.target.boundingRect.height);
      navigator.virtualKeyboard.addEventListener('geometrychange', handleKeyboard);

      return () => navigator.virtualKeyboard.removeEventListener('geometrychange', handleKeyboard);
    }
  }, [isKeyboardOpen]);

  if (!editor) return null;
  return (
    <div
      className={
        ' w-full gap-3 border-t bg-background-primary pt-2 ' +
        (isTouchDevice() ? 'fixed left-0 z-[1000] px-3 pb-2 shadow-lg' : 'overflow-auto')
      }
      style={{
        bottom: `${isKeyboardOpen ? keyboardHeight : 0}px`,
      }}
    >
      <div className='no_scrollbar flex gap-3 overflow-auto'>
        <div className='flex items-center gap-2'>
          <CustomTippy content='Bold'>
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().chain().focus().toggleBold().run()}
              className={editor.isActive('bold') ? 'is-active' : 'not-active '}
            >
              <i className='fa-solid fa-bold'></i>
            </button>
          </CustomTippy>
          <CustomTippy content='Italic'>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
              className={editor.isActive('italic') ? 'is-active' : 'not-active'}
            >
              <i className='fa-solid fa-italic'></i>
            </button>
          </CustomTippy>
          <CustomTippy content='Strike'>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              disabled={!editor.can().chain().focus().toggleStrike().run()}
              className={editor.isActive('strike') ? 'is-active' : 'not-active'}
            >
              <i className='fa-solid fa-strikethrough'></i>
            </button>
          </CustomTippy>
          <CustomTippy content='Underline'>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              disabled={!editor.can().chain().focus().toggleUnderline().run()}
              className={editor.isActive('underline') ? 'is-active' : 'not-active'}
            >
              <i className='fa-solid fa-underline'></i>
            </button>
          </CustomTippy>
          <CustomTippy content='Code'>
            <button
              onClick={() => editor.chain().focus().toggleCode().run()}
              disabled={!editor.can().chain().focus().toggleCode().run()}
              className={editor.isActive('code') ? 'is-active' : 'not-active'}
            >
              <i className='fa-solid fa-code'></i>
            </button>
          </CustomTippy>
          <Highlighter editor={editor} />
          <TextColor editor={editor} />
          <CustomTippy content='Superscript'>
            <button
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
              disabled={!editor.can().chain().focus().toggleSuperscript().run()}
              className={editor.isActive('superscript') ? 'is-active' : 'not-active'}
            >
              <i className='fa-solid fa-superscript'></i>
            </button>
          </CustomTippy>
          <CustomTippy content='Subscript'>
            <button
              onClick={() => editor.chain().focus().toggleSubscript().run()}
              disabled={!editor.can().chain().focus().toggleSubscript().run()}
              className={editor.isActive('subscript') ? 'is-active' : 'not-active'}
            >
              <i className='fa-solid fa-subscript'></i>
            </button>
          </CustomTippy>
          <AddLink editor={editor} />
          <CustomTippy content='Unlink'>
            <button
              onClick={() => editor.chain().focus().unsetLink().run()}
              disabled={!editor.isActive('link')}
              className={editor.isActive('link') ? 'is-active' : 'not-active'}
            >
              <i className='fa-solid fa-link-slash'></i>
            </button>
          </CustomTippy>
        </div>
        <span className='w-[2px] bg-background-tertiary'></span>
        <div className='flex items-center gap-2'>
          <DropDown
            options={{
              className: 'w-fit',
            }}
            toggler={
              <CustomTippy content='Heading'>
                <i className='fa-solid fa-heading'></i>
              </CustomTippy>
            }
            togglerClassName={editor.isActive('heading') ? 'is-active' : 'not-active'}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <DropDown.Button
                key={i}
                size='small'
                isCurrent={editor.isActive('heading', { level: i + 1 })}
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleHeading({ level: i + 1 })
                    .run()
                }
              >
                <span>
                  <i className='fa-solid fa-heading'></i>
                  <span className='text-[10px] font-bold'>{i + 1}</span>
                </span>
              </DropDown.Button>
            ))}
          </DropDown>
          <CustomTippy content='Paragraph'>
            <button
              onClick={() => editor.chain().focus().setParagraph().run()}
              className={editor.isActive('paragraph') ? 'is-active' : 'not-active'}
            >
              <i className='fa-solid fa-paragraph'></i>
            </button>
          </CustomTippy>
          <CustomTippy content='Bullets'>
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive('bulletList') ? 'is-active' : 'not-active'}
            >
              <i className='fa-solid fa-list-ul'></i>
            </button>
          </CustomTippy>
          <CustomTippy content='Numbered'>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={editor.isActive('orderedList') ? 'is-active' : 'not-active'}
            >
              <i className='fa-solid fa-list-ol'></i>
            </button>
          </CustomTippy>
          <CustomTippy content='Task'>
            <button
              onClick={() => editor.chain().focus().toggleTaskList().run()}
              className={editor.isActive('taskList') ? 'is-active' : 'not-active'}
            >
              <i className='fa-regular fa-check-square'></i>
            </button>
          </CustomTippy>
          <CustomTippy content='Code Block'>
            <button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={editor.isActive('codeBlock') ? 'is-active' : 'not-active'}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 24 24'
                width='15px'
                height='15px'
              >
                <g>
                  <path fill='none' d='M0 0h24v24H0z'></path>
                  <path d='M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v14h16V5H4zm8 10h6v2h-6v-2zm-3.333-3L5.838 9.172l1.415-1.415L11.495 12l-4.242 4.243-1.415-1.415L8.667 12z'></path>
                </g>
              </svg>
            </button>
          </CustomTippy>
        </div>
        <span className='w-[2px] bg-background-tertiary'></span>

        <div className='flex items-center gap-2'>
          <CustomTippy content='Blockquote'>
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={editor.isActive('blockquote') ? 'is-active' : 'not-active'}
            >
              <i className='fa-solid fa-quote-right'></i>
            </button>
          </CustomTippy>
          <CustomTippy content='Horizontal Rule'>
            <button
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className='not-active'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 24 24'
                width='15px'
                height='15px'
              >
                <g>
                  <path fill='none' d='M0 0h24v24H0z'></path>
                  <path d='M2 11h2v2H2v-2zm4 0h12v2H6v-2zm14 0h2v2h-2v-2z'></path>
                </g>
              </svg>
            </button>
          </CustomTippy>
        </div>
        <span className='w-[2px] bg-background-tertiary'></span>

        <div className='flex items-center gap-2'>
          <CustomTippy content='Align Left'>
            <button
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : 'not-active'}
            >
              <i className='fa-solid fa-align-left'></i>
            </button>
          </CustomTippy>
          <CustomTippy content='Align Center'>
            <button
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : 'not-active'}
            >
              <i className='fa-solid fa-align-center'></i>
            </button>
          </CustomTippy>
          <CustomTippy content='Align Right'>
            <button
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : 'not-active'}
            >
              <i className='fa-solid fa-align-right'></i>
            </button>
          </CustomTippy>
        </div>
        <span className='w-[2px] bg-background-tertiary'></span>

        <div className='flex items-center gap-2 '>
          <CustomTippy content='Hard Break'>
            <button
              onClick={() => editor.chain().focus().setHardBreak().run()}
              className='not-active'
            >
              <svg xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 24 24'>
                <g>
                  <path fill='none' d='M0 0h24v24H0z'></path>
                  <path d='M15 18h1.5a2.5 2.5 0 1 0 0-5H3v-2h13.5a4.5 4.5 0 1 1 0 9H15v2l-4-3 4-3v2zM3 4h18v2H3V4zm6 14v2H3v-2h6z'></path>
                </g>
              </svg>
            </button>
          </CustomTippy>
          <CustomTippy content='Clear Content'>
            <button className='not-active' onClick={() => editor.commands.clearContent()}>
              <i className='fa-solid fa-text-slash'></i>
            </button>
          </CustomTippy>
        </div>
      </div>
    </div>
  );
};

export function ActionBar({ editor,onBack }) {
  const [isFullScreen, setIsFullScreen] = useState(document.fullscreenElement);

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
      <button className='not-active'>
        <i className='fa-solid fa-ellipsis-v'></i>
      </button>
    </div>
    </div>
  );
}
