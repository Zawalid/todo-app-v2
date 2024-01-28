import { useEffect, useState } from 'react';
import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react';
import { extensions } from './editor/extensions';
import { DEFAULT_FONT_FAMILY } from '../../../../../utils/constants';
import { ToolBar } from './ToolBar';
import { ActionBar } from './ActionBar';
import { CustomBubbleMenu } from './editor/CustomBubbleMenu';
import { exportAs, isTouchDevice } from '../../../../../utils/helpers';
import { useStickyNotes } from '../../../../../hooks';
import { BackgroundColorPicker } from '../BackgroundColorPicker';
import { TextColorPicker } from '../TextColorPicker';
import { toast } from 'sonner';

import '../../../../../styles/TipTap.scss';
import { Actions } from './Actions';

export default function TipTap() {
  const { currentNote, handleUpdateStickyNote, handleDeleteStickyNote, handleBack } =
    useStickyNotes();
  const { $id, content, $updatedAt } = currentNote || {};

  const [title, setTitle] = useState(currentNote?.title);
  const [bgColor, setBgColor] = useState(currentNote?.bgColor || '#ff922b');
  const [textColor, setTextColor] = useState(currentNote?.textColor || '#fff');
  const [fontFamily, setFontFamily] = useState(currentNote?.fontFamily || DEFAULT_FONT_FAMILY);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [readonly, setReadonly] = useState(currentNote?.readonly || false);
  const [pinned, setPinned] = useState(currentNote?.pinned || false);
  const [isSaving, setIsSaving] = useState(false);

  function handleUpdateNote(field, value) {
    if (currentNote[field] === value) return;
    handleUpdateStickyNote(
      $id,
      {
        [field]: value,
      },
      setIsSaving,
    );
  }
  const onBack = () => {
    if (!title) handleUpdateNote('title', 'Untitled');
    handleBack(currentNote.$id, title, content);
    ToggleEditorDarkMode(false);
  };

  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const editor = useEditor({
    extensions: extensions,
    content,
    editorProps: {
      attributes: {
        class: 'focus:outline-none pb-10',
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, readonly]);

  useEffect(() => {
    if (!document.querySelector('.tiptap')) return;
    document.querySelector('.tiptap').style.fontFamily = fontFamily || DEFAULT_FONT_FAMILY;
  }, [fontFamily]);

  return (
    <div
      className={
        'grid h-full ' +
        (isTouchDevice() ? ' grid-rows-[40px_auto]' : ' grid-rows-[40px_auto_42px]')
      }
    >
      <ActionBar editor={editor} onBack={onBack} onOpenActions={() => setIsActionsOpen(true)} />
      <Actions
        currentNote={currentNote}
        isOpen={isActionsOpen}
        readonly={readonly}
        pinned={pinned}
        fontFamily={fontFamily || DEFAULT_FONT_FAMILY}
        handlers={{
          onClose: () => setIsActionsOpen(false),
          onCopy: () => {
            navigator.clipboard.writeText(`
          ${title}
          ---------------

          ${editor?.getText()}
          `);

            toast.success('Copied to clipboard');
          },
          onDelete: (deletePermanently) => {
            $id && handleDeleteStickyNote($id, deletePermanently);
          },
          onBack,
          onReadOnly: () => setReadonly(!readonly),
          onPin: () => {
            setPinned(!pinned);
            handleUpdateNote('pinned', !pinned);
          },
          onExport: (format) => exportAs(format, editor, title),
          onChangeFontFamily: (fontFamily) => {
            setFontFamily(fontFamily);
            document.querySelector('.tiptap').style.fontFamily = fontFamily;
            handleUpdateNote('fontFamily', fontFamily);
          },
          onToggleDarkMode: (e) => ToggleEditorDarkMode(e.target.checked),
        }}
      >
        <div className='space-y-2'>
          <span className='text-sm  font-medium text-text-secondary'>Background Color</span>
          <BackgroundColorPicker
            onChange={(color) => {
              setBgColor(color);
              handleUpdateNote('bgColor', color);
            }}
            bgColor={bgColor}
          />
        </div>
        <div className='space-y-2'>
          <span className='text-sm  font-medium text-text-secondary'>Text Color</span>
          <TextColorPicker
            onChange={(color) => {
              setTextColor(color);
              handleUpdateNote('textColor', color);
            }}
            textColor={textColor}
          />
        </div>
      </Actions>
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
  if (!editor) return null;
  return (
    <div className='space-y-3'>
      <input
        type='text'
        placeholder='Note Title'
        className='w-full appearance-none border-none bg-transparent text-4xl font-bold text-text-primary placeholder:text-text-secondary outline-none sm:text-[40px]'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <p id='info' className='flex flex-wrap items-center gap-2 text-xs text-text-tertiary'>
        <span>
          {new Intl.DateTimeFormat('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
          }).format(new Date(updateDate || Date.now()))}
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

function ToggleEditorDarkMode(isDark) {
  document.documentElement.style.setProperty('--editor-theme-color', isDark ? '#191919' : '#fff');
  document.documentElement.style.setProperty('--editor-text-color', isDark ? '#cacaca' : '#444');
  document.querySelector('#root').classList[isDark ? 'add' : 'remove']('dark-editor');
}
