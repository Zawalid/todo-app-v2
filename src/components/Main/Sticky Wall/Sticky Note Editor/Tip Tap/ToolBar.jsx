import CustomTippy from '../../../../Common/CustomTippy';
import { AddLink } from './editor/AddLink';
import { Highlighter } from './editor/Highlighter';
import { TextColor } from './editor/TextColor';
import { useEffect, useState } from 'react';
import { isTouchDevice } from '../../../../../utils/helpers';
import { DropDown } from '../../../../Common/DropDown';
import { useHref } from 'react-router';

export const ToolBar = ({ editor, isKeyboardOpen, readonly }) => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const activeTab = useHref()

  useEffect(() => {
    if ('virtualKeyboard' in navigator && isKeyboardOpen) {
      navigator.virtualKeyboard.overlaysContent = true;
      const handleKeyboard = (e) => {
        const { height } = e.target.boundingRect;
        setKeyboardHeight(height);
        document.querySelector('.tiptap').style.height = `calc(100% - ${height}px)`;
      };
      navigator.virtualKeyboard.addEventListener('geometrychange', handleKeyboard);

      return () => navigator.virtualKeyboard.removeEventListener('geometrychange', handleKeyboard);
    }
  }, [isKeyboardOpen]);

  if (!editor) return null;
  return (
    <div
      className={
        'toolbar w-full gap-3 border-t bg-background-primary border-border pt-2 ' +
        (isTouchDevice() && activeTab.startsWith('/app/sticky-wall/')
          ? 'fixed left-0 z-[1000] px-3 pb-2 shadow-lg'
          : 'overflow-auto')
      }
      style={{
        bottom: `${isKeyboardOpen ? keyboardHeight : 0}px`,
      }}
    >
      <div className='no_scrollbar flex 2xl:justify-center gap-3 overflow-auto'>
        <div className='flex items-center gap-2'>
          <CustomTippy content='Bold'>
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={readonly || !editor.can().chain().focus().toggleBold().run()}
              className={editor.isActive('bold') ? 'icon-button active' : 'icon-button not-active '}
            >
              <i className='fa-solid fa-bold'></i>
            </button>
          </CustomTippy>
          <CustomTippy content='Italic'>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={readonly || !editor.can().chain().focus().toggleItalic().run()}
              className={editor.isActive('italic') ? 'icon-button active' : 'icon-button not-active'}
            >
              <i className='fa-solid fa-italic'></i>
            </button>
          </CustomTippy>
          <CustomTippy content='Strike'>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              disabled={readonly || !editor.can().chain().focus().toggleStrike().run()}
              className={editor.isActive('strike') ? 'icon-button active' : 'icon-button not-active'}
            >
              <i className='fa-solid fa-strikethrough'></i>
            </button>
          </CustomTippy>
          <CustomTippy content='Underline'>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              disabled={readonly || !editor.can().chain().focus().toggleUnderline().run()}
              className={editor.isActive('underline') ? 'icon-button active' : 'icon-button not-active'}
            >
              <i className='fa-solid fa-underline'></i>
            </button>
          </CustomTippy>
          <CustomTippy content='Code'>
            <button
              onClick={() => editor.chain().focus().toggleCode().run()}
              disabled={readonly || !editor.can().chain().focus().toggleCode().run()}
              className={editor.isActive('code') ? 'icon-button active' : 'icon-button not-active'}
            >
              <i className='fa-solid fa-code'></i>
            </button>
          </CustomTippy>
          <Highlighter editor={editor} readonly={readonly} />
          <TextColor editor={editor} readonly={readonly} />
          <CustomTippy content='Superscript'>
            <button
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
              disabled={readonly || !editor.can().chain().focus().toggleSuperscript().run()}
              className={editor.isActive('superscript') ? 'icon-button active' : 'icon-button not-active'}
            >
              <i className='fa-solid fa-superscript'></i>
            </button>
          </CustomTippy>
          <CustomTippy content='Subscript'>
            <button
              onClick={() => editor.chain().focus().toggleSubscript().run()}
              disabled={readonly || !editor.can().chain().focus().toggleSubscript().run()}
              className={editor.isActive('subscript') ? 'icon-button active' : 'icon-button not-active'}
            >
              <i className='fa-solid fa-subscript'></i>
            </button>
          </CustomTippy>
          <AddLink editor={editor} readonly={readonly} />
          <CustomTippy content='Unlink'>
            <button
              onClick={() => editor.chain().focus().unsetLink().run()}
              disabled={readonly || !editor.isActive('link')}
              className={editor.isActive('link') ? 'icon-button active' : 'icon-button not-active'}
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
            togglerClassName={editor.isActive('heading') ? 'icon-button active' : 'icon-button not-active'}
            togglerDisabled={readonly}
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
              className={editor.isActive('paragraph') ? 'icon-button active' : 'icon-button not-active'}
              disabled={readonly}
            >
              <i className='fa-solid fa-paragraph'></i>
            </button>
          </CustomTippy>
          <CustomTippy content='Bullets'>
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive('bulletList') ? 'icon-button active' : 'icon-button not-active'}
              disabled={readonly}
            >
              <i className='fa-solid fa-list-ul'></i>
            </button>
          </CustomTippy>
          <CustomTippy content='Numbered'>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={editor.isActive('orderedList') ? 'icon-button active' : 'icon-button not-active'}
              disabled={readonly}
            >
              <i className='fa-solid fa-list-ol'></i>
            </button>
          </CustomTippy>
          <CustomTippy content='Task'>
            <button
              onClick={() => editor.chain().focus().toggleTaskList().run()}
              className={editor.isActive('taskList') ? 'icon-button active' : 'icon-button not-active'}
              disabled={readonly}
            >
              <i className='fa-regular fa-check-square'></i>
            </button>
          </CustomTippy>
          <CustomTippy content='Code Block'>
            <button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={editor.isActive('codeBlock') ? 'icon-button active' : 'icon-button not-active'}
              disabled={readonly}
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
              className={editor.isActive('blockquote') ? 'icon-button active' : 'icon-button not-active'}
              disabled={readonly}
            >
              <i className='fa-solid fa-quote-right'></i>
            </button>
          </CustomTippy>
          <CustomTippy content='Horizontal Rule'>
            <button
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className='icon-button not-active'
              disabled={readonly}
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
              className={editor.isActive({ textAlign: 'left' }) ? 'icon-button active' : 'icon-button not-active'}
              disabled={readonly}
            >
              <i className='fa-solid fa-align-left'></i>
            </button>
          </CustomTippy>
          <CustomTippy content='Align Center'>
            <button
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={editor.isActive({ textAlign: 'center' }) ? 'icon-button active' : 'icon-button not-active'}
              disabled={readonly}
            >
              <i className='fa-solid fa-align-center'></i>
            </button>
          </CustomTippy>
          <CustomTippy content='Align Right'>
            <button
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={editor.isActive({ textAlign: 'right' }) ? 'icon-button active' : 'icon-button not-active'}
              disabled={readonly}
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
              className='icon-button not-active'
              disabled={readonly}
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
            <button
              className='icon-button not-active'
              onClick={() => editor.commands.clearContent()}
              disabled={readonly}
            >
              <i className='fa-solid fa-text-slash'></i>
            </button>
          </CustomTippy>
        </div>
      </div>
    </div>
  );
};
