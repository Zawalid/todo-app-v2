import { useEffect, useMemo, useState } from 'react';
import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react';
import { ToolBar } from './ToolBar';
import { ActionBar } from './ActionBar';
import { CustomBubbleMenu } from './CustomBubbleMenu';
import { isTouchDevice } from '../../../../../utils/helpers';
import '../../../../../styles/TipTap.scss';
import { extensions } from './extensions';
import { useStickyNotes } from '../../../../../hooks';
import { BackgroundColorPicker } from '../BackgroundColorPicker';
import { TextColorPicker } from '../TextColorPicker';
import Switch from '../../../../Common/Switch';

export default function TipTap() {
  const {
    currentNote,
    stickyNotes,
    handleAddStickyNote,
    handleUpdateStickyNote,
    handleDeleteStickyNote,
    handleBack,
  } = useStickyNotes();
  const { $id, content, $updatedAt, bgColor, textColor } = currentNote || {};
  const [title, setTitle] = useState(currentNote?.title);
  const [isSaving, setIsSaving] = useState(false);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(true);
  const [readonly, setReadonly] = useState(currentNote?.readonly || false);
  const exists = useMemo(() => stickyNotes.find((note) => note.$id === $id), [stickyNotes, $id]);

  function handleUpdateNote(field, value) {
    if (!exists) {
      handleAddStickyNote({
        title: !title || title.trim() === '' ? 'Untitled' : title,
        content,
        bgColor,
        textColor,
        readonly,
      });
      return;
    }
    if (currentNote[field] === value) return;
    handleUpdateStickyNote(
      $id,
      {
        [field]: value,
      },
      setIsSaving,
    );
  }

  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const editor = useEditor({
    extensions: extensions,
    content,
    editorProps: {
      attributes: {
        class: 'text-text-secondary focus:outline-none ',
      },
    },
    onUpdate: ({ editor }) => handleUpdateNote('content', editor.getHTML()),
    onFocus: () => isTouchDevice() && setIsKeyboardOpen(true),
    onBlur: () => isTouchDevice() && setIsKeyboardOpen(false),
  });

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!readonly);
    handleUpdateNote('readonly', readonly);
  }, [editor, readonly]);

  return (
    <div
      className={
        'grid h-full ' +
        (isTouchDevice() ? ' grid-rows-[40px_auto]' : ' grid-rows-[40px_auto_42px]')
      }
    >
      <ActionBar
        editor={editor}
        handlers={{
          onChangeBg: (color) => handleUpdateNote('bgColor', color),
          onChangeText: (color) => handleUpdateNote('textColor', color),
          onDelete: (deletePermanently) =>
            $id && handleDeleteStickyNote(currentNote.$id, deletePermanently),
          onBack: () => handleBack(currentNote.$id, title, content),
          onOpenProperties: () => setIsPropertiesOpen(true),
        }}
        colors={{
          bgColor,
          textColor,
        }}
      />
      <Properties
        currentNote={currentNote}
        isOpen={isPropertiesOpen}
        setIsOpen={setIsPropertiesOpen}
        readonly={readonly}
        setReadonly={setReadonly}
      >
        <div className='flex flex-col gap-1'>
          <span className='text-sm  text-text-tertiary'>Background Color</span>
          <BackgroundColorPicker
            onChange={(color) => handleUpdateNote('bgColor', color)}
            bgColor={bgColor}
          />
        </div>
        <div className='flex flex-col gap-1'>
          <span className='text-sm  text-text-tertiary'>Text Color</span>
          <TextColorPicker
            onChange={(color) => handleUpdateNote('textColor', color)}
            textColor={textColor}
          />
        </div>
      </Properties>
      <div className='tiptap no_scrollbar grid grid-rows-[90px_auto] gap-3 overflow-auto p-3'>
        <NoteInfo
          editor={editor}
          updateDate={$updatedAt}
          isSaving={isSaving}
          title={title}
          setTitle={(title) => {
            setTitle(title);
            handleUpdateNote('title', title);
          }}
        />
        <EditorContent editor={editor} />
      </div>
      {<ToolBar editor={editor} isKeyboardOpen={isKeyboardOpen} readonly={readonly} />}

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

function NoteInfo({ editor, updateDate, isSaving, title, setTitle }) {
  if (!editor || !updateDate) return null;
  return (
    <div className='space-y-3'>
      <input
        type='text'
        placeholder='Note Title'
        className='w-full appearance-none border-none bg-transparent text-4xl font-bold text-[rgb(48,48,48)] outline-none sm:text-[40px]'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <p className='flex flex-wrap items-center gap-2 text-xs text-text-tertiary'>
        <span>
          {new Intl.DateTimeFormat('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
          }).format(new Date(updateDate))}
        </span>
        <span className='h-3 w-[1px] bg-text-tertiary '></span>
        <span>{editor.storage?.characterCount?.characters()} characters</span>
        <span className='h-3 w-[1px] bg-text-tertiary '></span>
        <span>{editor.storage?.characterCount?.words()} words</span>
        <span className='h-3 w-[1px] bg-text-tertiary '></span>
        <span>{isSaving ? 'Saving...' : 'Saved'}</span>
      </p>
    </div>
  );
}

function Properties({ children, currentNote, isOpen, setIsOpen, readonly, setReadonly }) {
  return (
    <div
      className={
        'fixed top-0 z-[10001]  h-full w-[300px] rounded-lg border bg-background-primary p-3 shadow-md transition-[right]  ' +
        (isOpen ? 'right-0 duration-700' : '-right-full duration-1000 ')
      }
    >
      <div className='flex items-center justify-between pb-2'>
        <h3 className='m-0  text-lg font-semibold text-text-secondary sm:text-xl'>Properties</h3>
        <button className='not-active small' onClick={() => setIsOpen(false)}>
          <i className='fa-solid fa-times text-lg'></i>
        </button>
      </div>
      <hr className='border border-zinc-200' />
      <div className='mt-5 flex flex-col gap-3'>
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <label className='grid grid-cols-[15px_auto] items-center gap-2 text-sm font-medium  text-text-tertiary'>
              <i className='fa-solid fa-thumbtack'></i> <span>Pin</span>
            </label>
            <Switch />
          </div>
          <div className='flex items-center justify-between'>
            <label className='grid grid-cols-[15px_auto] items-center gap-2 text-sm font-medium  text-text-tertiary'>
              <svg
                viewBox='0 0 24 24'
                width='17px'
                height='17px'
                className='text-text-tertiary'
                fill='currentColor'
              >
                <path
                  className='text-text-tertiary'
                  d='M16.1,9L17,9.9L7.9,19H7V18.1L16.1,9M19.7,3C19.5,3 19.2,3.1 19,3.3L17.2,5.1L20.9,8.9L22.7,7C23.1,6.6 23.1,6 22.7,5.6L20.4,3.3C20.2,3.1 19.9,3 19.7,3M16.1,6.2L5,17.2V21H8.8L19.8,9.9L16.1,6.2M8,5V4.5C8,3.1 6.9,2 5.5,2C4.1,2 3,3.1 3,4.5V5C2.4,5 2,5.4 2,6V10C2,10.6 2.4,11 3,11H8C8.6,11 9,10.6 9,10V6C9,5.4 8.6,5 8,5M7,5H4V4.5C4,3.7 4.7,3 5.5,3C6.3,3 7,3.7 7,4.5V5Z'
                ></path>
              </svg>
              <span>Read only</span>
            </label>
            <Switch checked={readonly} onChange={() => setReadonly(!readonly)} />
          </div>
        </div>
        <hr className='border border-zinc-200' />
        {children}
        <hr className='border border-zinc-200' />

        <div>
          <p className='mb-1 text-xs font-medium text-text-tertiary '>
            Created at :{' '}
            {new Intl.DateTimeFormat('en-US', {
              dateStyle: 'medium',
              timeStyle: 'short',
            }).format(new Date(currentNote?.$createdAt || new Date.now()))}
          </p>
          <p className='text-xs font-medium text-text-tertiary '>
            Last modified at :{' '}
            {new Intl.DateTimeFormat('en-US', {
              dateStyle: 'medium',
              timeStyle: 'short',
            }).format(new Date(currentNote?.$updatedAt || new Date.now()))}
          </p>
        </div>
      </div>
    </div>
  );
}
