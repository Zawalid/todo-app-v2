import Placeholder from '@tiptap/extension-placeholder';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Typography from '@tiptap/extension-typography';
import TextAlign from '@tiptap/extension-text-align';
import CharacterCount from '@tiptap/extension-character-count';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react';
import { ColorHighlighter } from './ColorHighlighter';
import StarterKit from '@tiptap/starter-kit';
import { ToolBar, UndoRedo } from './ToolBar';
import { Footer } from './Footer';
import { CustomBubbleMenu } from './CustomBubbleMenu';

import '../../../../styles/TipTap.scss';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import { isTouchDevice } from '../../../../utils/helpers';
import { useState } from 'react';

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
  Placeholder.configure({
    emptyEditorClass: 'is-editor-empty',
    placeholder: 'Start writing...',
  }),
  Highlight.configure({ multicolor: true }),
  Underline,
  Typography,
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  CharacterCount,
  Subscript,
  Superscript,
  Link.configure({
    validate: (href) => /^https?:\/\//.test(href),
    autolink: false,
  }),
  ColorHighlighter,
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
];

export default function TipTap({
  onUpdateContent,
  content,
  updateDate,
  isSaving,
  title,
  setTitle,
}) {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const editor = useEditor({
    extensions,
    content,
    editorProps: {
      attributes: {
        class: 'text-text-secondary focus:outline-none ',
      },
    },
    onUpdate: ({ editor }) => {
      onUpdateContent(editor.getHTML());
    },
    onFocus: () => isTouchDevice() && setIsKeyboardOpen(true),
    onBlur: () => isTouchDevice() && setIsKeyboardOpen(false),
  });

  const noteInfo = {
    date: new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(updateDate)),
    words: editor?.storage?.characterCount?.words(),
    characters: editor?.storage?.characterCount?.characters(),
    getStatus: () => {
      if (isTouchDevice()) return isSaving ? 'Saving...' : 'Saved';
      return isSaving ? (
        <i className='fa-solid fa-spinner animate-spin text-sm'></i>
      ) : (
        <i className='fa-solid fa-circle-check text-sm text-green-500'></i>
      );
    },
  };
  return (
    <div
      className={
        'grid h-full ' + (isTouchDevice() ? ' grid-rows-[40px_auto]' : ' grid-rows-[auto_1fr_40px]')
      }
    >
      {isTouchDevice() && (
        <div className='flex items-center justify-between'>
          <button
            className='not-active'
            onClick={() => {
              onBack();
            }}
          >
            <i className='fa-solid fa-chevron-left text-lg'></i>
          </button>
          <UndoRedo editor={editor} />
        </div>
      )}
      {isTouchDevice() || <ToolBar editor={editor} isKeyboardOpen={isKeyboardOpen} />}
      <div className='tiptap no_scrollbar grid grid-rows-[70px_auto] gap-5 overflow-auto border-t  border-zinc-200 p-3'>
        <div className='space-y-3'>
          <input
            type='text'
            placeholder='Note Title'
            className='w-full appearance-none border-none bg-transparent text-4xl font-bold text-[rgb(48,48,48)] outline-none sm:text-[40px]'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {isTouchDevice() && (
            <p className='flex items-center gap-2 text-xs text-text-tertiary'>
              <span>
                {updateDate &&
                  new Intl.DateTimeFormat('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  }).format(new Date(updateDate))}
              </span>
              <span className='h-3 w-[1px] bg-text-tertiary '></span>
              <span>{noteInfo.characters} characters</span>
              <span className='h-3 w-[1px] bg-text-tertiary '></span>
              <span>{noteInfo.getStatus()}</span>
            </p>
          )}
        </div>
        <EditorContent editor={editor} />
      </div>
      {isTouchDevice() && (
        <ToolBar
          editor={editor}
          isKeyboardOpen={isKeyboardOpen}
        />
      )}
      {isTouchDevice() || <Footer noteInfo={noteInfo} />}

      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{
            duration: 300,
            theme: 'bubbleMenu',
            interactive: true,
            arrow: false,
          }}
        >
          <CustomBubbleMenu editor={editor} />
        </BubbleMenu>
      )}
    </div>
  );
}
