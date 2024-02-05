import CustomTippy from '../../../../Common/CustomTippy';
import { AddLink } from './editor/AddLink';
import { Highlighter } from './editor/Highlighter';
import { TextColor } from './editor/TextColor';
import { useEffect, useState } from 'react';
import { isTouchDevice } from '../../../../../utils/helpers';
import { DropDown } from '../../../../Common/DropDown';
import { useHref } from 'react-router';

import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaUnderline,
  FaCode,
  FaSuperscript,
  FaSubscript,
  FaHeading,
  FaParagraph,
  FaListUl,
  FaListOl,
  FaCheckSquare,
  FaQuoteRight,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
} from 'react-icons/fa';
import { FaTextSlash, FaLinkSlash } from 'react-icons/fa6';
import { BsFillTerminalFill } from 'react-icons/bs';
import { GoHorizontalRule } from 'react-icons/go';
import { PiKeyReturn } from 'react-icons/pi';

export const ToolBar = ({ editor, isKeyboardOpen, readonly }) => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const activeTab = useHref();

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
        'toolbar w-full gap-3 border-t border-border bg-background-primary pt-2 transition-[inset] duration-300 ' +
        (isTouchDevice() && activeTab.startsWith('/app/sticky-wall/')
          ? 'fixed left-0 px-3 pb-2 shadow-lg'
          : 'overflow-auto')
      }
      style={{
        bottom: `${isKeyboardOpen ? keyboardHeight : 0}px`,
      }}
    >
      <div className='no_scrollbar flex gap-3 overflow-auto 2xl:justify-center'>
        <div className='flex items-center gap-2'>
          <CustomTippy content='Bold'>
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={readonly || !editor.can().chain().focus().toggleBold().run()}
              className={editor.isActive('bold') ? 'icon-button active' : 'icon-button not-active '}
            >
              <FaBold />{' '}
            </button>
          </CustomTippy>
          <CustomTippy content='Italic'>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={readonly || !editor.can().chain().focus().toggleItalic().run()}
              className={
                editor.isActive('italic') ? 'icon-button active' : 'icon-button not-active'
              }
            >
              <FaItalic />
            </button>
          </CustomTippy>
          <CustomTippy content='Strike'>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              disabled={readonly || !editor.can().chain().focus().toggleStrike().run()}
              className={
                editor.isActive('strike') ? 'icon-button active' : 'icon-button not-active'
              }
            >
              <FaStrikethrough />
            </button>
          </CustomTippy>
          <CustomTippy content='Underline'>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              disabled={readonly || !editor.can().chain().focus().toggleUnderline().run()}
              className={
                editor.isActive('underline') ? 'icon-button active' : 'icon-button not-active'
              }
            >
              <FaUnderline />
            </button>
          </CustomTippy>
          <CustomTippy content='Code'>
            <button
              onClick={() => editor.chain().focus().toggleCode().run()}
              disabled={readonly || !editor.can().chain().focus().toggleCode().run()}
              className={editor.isActive('code') ? 'icon-button active' : 'icon-button not-active'}
            >
              <FaCode />
            </button>
          </CustomTippy>
          <Highlighter editor={editor} readonly={readonly} />
          <TextColor editor={editor} readonly={readonly} />
          <CustomTippy content='Superscript'>
            <button
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
              disabled={readonly || !editor.can().chain().focus().toggleSuperscript().run()}
              className={
                editor.isActive('superscript') ? 'icon-button active' : 'icon-button not-active'
              }
            >
              <FaSuperscript />
            </button>
          </CustomTippy>
          <CustomTippy content='Subscript'>
            <button
              onClick={() => editor.chain().focus().toggleSubscript().run()}
              disabled={readonly || !editor.can().chain().focus().toggleSubscript().run()}
              className={
                editor.isActive('subscript') ? 'icon-button active' : 'icon-button not-active'
              }
            >
              <FaSubscript />
            </button>
          </CustomTippy>
          <AddLink editor={editor} readonly={readonly} />
          <CustomTippy content='Unlink'>
            <button
              onClick={() => editor.chain().focus().unsetLink().run()}
              disabled={readonly || !editor.isActive('link')}
              className={editor.isActive('link') ? 'icon-button active' : 'icon-button not-active'}
            >
              <FaLinkSlash />
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
                <span>
                  <FaHeading />
                </span>
              </CustomTippy>
            }
            togglerClassName={
              editor.isActive('heading') ? 'icon-button active' : 'icon-button not-active'
            }
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
                <span className='flex items-'>
                  <FaHeading size={14}/>
                  <span className='text-[10px] font-bold'>{i + 1}</span>
                </span>
              </DropDown.Button>
            ))}
          </DropDown>
          <CustomTippy content='Paragraph'>
            <button
              onClick={() => editor.chain().focus().setParagraph().run()}
              className={
                editor.isActive('paragraph') ? 'icon-button active' : 'icon-button not-active'
              }
              disabled={readonly}
            >
              <FaParagraph />
            </button>
          </CustomTippy>
          <CustomTippy content='Bullets'>
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={
                editor.isActive('bulletList') ? 'icon-button active' : 'icon-button not-active'
              }
              disabled={readonly}
            >
              <FaListUl />
            </button>
          </CustomTippy>
          <CustomTippy content='Numbered'>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={
                editor.isActive('orderedList') ? 'icon-button active' : 'icon-button not-active'
              }
              disabled={readonly}
            >
              <FaListOl />
            </button>
          </CustomTippy>
          <CustomTippy content='Task'>
            <button
              onClick={() => editor.chain().focus().toggleTaskList().run()}
              className={
                editor.isActive('taskList') ? 'icon-button active' : 'icon-button not-active'
              }
              disabled={readonly}
            >
              <FaCheckSquare />
            </button>
          </CustomTippy>
          <CustomTippy content='Code Block'>
            <button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={
                editor.isActive('codeBlock') ? 'icon-button active' : 'icon-button not-active'
              }
              disabled={readonly}
            >
              <BsFillTerminalFill />
            </button>
          </CustomTippy>
        </div>
        <span className='w-[2px] bg-background-tertiary'></span>

        <div className='flex items-center gap-2'>
          <CustomTippy content='Blockquote'>
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={
                editor.isActive('blockquote') ? 'icon-button active' : 'icon-button not-active'
              }
              disabled={readonly}
            >
              <FaQuoteRight />
            </button>
          </CustomTippy>
          <CustomTippy content='Horizontal Rule'>
            <button
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className='icon-button not-active'
              disabled={readonly}
            >
              <GoHorizontalRule />
            </button>
          </CustomTippy>
        </div>
        <span className='w-[2px] bg-background-tertiary'></span>

        <div className='flex items-center gap-2'>
          <CustomTippy content='Align Left'>
            <button
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={
                editor.isActive({ textAlign: 'left' })
                  ? 'icon-button active'
                  : 'icon-button not-active'
              }
              disabled={readonly}
            >
              <FaAlignLeft />
            </button>
          </CustomTippy>
          <CustomTippy content='Align Center'>
            <button
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={
                editor.isActive({ textAlign: 'center' })
                  ? 'icon-button active'
                  : 'icon-button not-active'
              }
              disabled={readonly}
            >
              <FaAlignCenter />
            </button>
          </CustomTippy>
          <CustomTippy content='Align Right'>
            <button
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={
                editor.isActive({ textAlign: 'right' })
                  ? 'icon-button active'
                  : 'icon-button not-active'
              }
              disabled={readonly}
            >
              <FaAlignRight />
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
              <PiKeyReturn />
            </button>
          </CustomTippy>
          <CustomTippy content='Clear Content'>
            <button
              className='icon-button not-active'
              onClick={() => editor.commands.clearContent()}
              disabled={readonly}
            >
              <FaTextSlash />
            </button>
          </CustomTippy>
        </div>
      </div>
    </div>
  );
};
