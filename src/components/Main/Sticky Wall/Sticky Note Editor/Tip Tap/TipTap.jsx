import { useEffect, useState } from 'react';
import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react';
import { extensions } from './editor/extensions';
import TurndownService from 'turndown';
import { jsPDF } from 'jspdf';

import { DEFAULT_FONT_FAMILY } from '../../../../../utils/constants';
import { ToolBar } from './ToolBar';
import { ActionBar } from './ActionBar';
import { CustomBubbleMenu } from './editor/CustomBubbleMenu';
import { copyToClipBoard, exportDownload, isElementEmpty, isTouchDevice } from '../../../../../utils/helpers';
import { useStickyNotes } from '../../../../../hooks';
import { BackgroundColorPicker } from '../BackgroundColorPicker';
import { TextColorPicker } from '../TextColorPicker';

import '../../../../../styles/TipTap.scss';
import { Actions } from './Actions';
import { useFormatDateAndTime } from '../../../../../hooks/useFormatDateAndTime';

export default function TipTap() {
  const {
    currentNote,
    handleAddStickyNote,
    handleUpdateStickyNote,
    handleDeleteStickyNote,
    handleBack,
  } = useStickyNotes();
  const { $id, content, $updatedAt } = currentNote || {};

  const [title, setTitle] = useState(currentNote?.title);
  const [bgColor, setBgColor] = useState(currentNote?.bgColor || '#ff922b');
  const [textColor, setTextColor] = useState(currentNote?.textColor || '#fff');
  const [fontFamily, setFontFamily] = useState(currentNote?.fontFamily || DEFAULT_FONT_FAMILY);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [readonly, setReadonly] = useState(currentNote?.readonly || false);
  const [pinned, setPinned] = useState(currentNote?.pinned || false);
  const [isSaving, setIsSaving] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const onUpdate = (field, value) =>
    currentNote?.[field] !== value && handleUpdateStickyNote($id, { [field]: value }, setIsSaving);

  const onBack = () => handleBack(currentNote.$id, title, content);

  const editor = useEditor({
    extensions: extensions,
    content,
    editorProps: {
      attributes: {
        class: `focus:outline-none p-2 text-text-primary ${isTouchDevice() ? 'pb-10' : ''}`,
      },
    },
    onUpdate: ({ editor }) => onUpdate('content', editor.getHTML()),
    onFocus: () => isTouchDevice() && setIsKeyboardOpen(true),
    onBlur: () => isTouchDevice() && setIsKeyboardOpen(false),
  });

  const actionsProps = {
    currentNote,
    isOpen: isActionsOpen,
    readonly,
    pinned,
    fontFamily: fontFamily || DEFAULT_FONT_FAMILY,
    disabled : !title && isElementEmpty(content),
    handlers: {
      onClose: () => setIsActionsOpen(false),
      onCopy: () =>
        copyToClipBoard(`
        Note Title: ${title}
        ------------------

        Note Content:
        ${editor?.getText()}
        `),
      onDelete(deletePermanently) {
        $id && handleDeleteStickyNote($id, deletePermanently);
      },
      onBack,
      onReadOnly: () => setReadonly(!readonly),
      onPin() {
        setPinned(!pinned);
        onUpdate('pinned', !pinned);
      },
      onDuplicate() {
        const note = {
          title: title + ' (copy)',
          content,
          bgColor,
          textColor,
          fontFamily,
          pinned,
          readonly,
        };
        handleAddStickyNote(note, true);
      },
      onExport: (format) => exportAs(format, editor, title),
      onChangeFontFamily(fontFamily) {
        setFontFamily(fontFamily);
        document.querySelector('.tiptap').style.fontFamily = fontFamily;
        onUpdate('fontFamily', fontFamily);
      },
    },
  };

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!readonly);
    onUpdate('readonly', readonly);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, readonly]);

  useEffect(() => {
    if (!document.querySelector('.tiptap')) return;
    document.querySelector('.tiptap').style.fontFamily = fontFamily || DEFAULT_FONT_FAMILY;
  }, [fontFamily]);

  useEffect(() => {
    document.title = `I Do | ${title || 'Untitled'}`;
  }, [title]);

  return (
    <>
      <ActionBar editor={editor} onBack={onBack} onOpenActions={() => setIsActionsOpen(true)} />
      <div className='tiptap grid grid-rows-[90px_auto] gap-1 overflow-auto'>
        <NoteInfo
          editor={editor}
          updateDate={$updatedAt}
          isSaving={isSaving}
          title={title}
          setTitle={(title) => {
            setTitle(title);
            onUpdate('title', title);
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

      <Actions {...actionsProps}>
        <div className='space-y-2'>
          <span className='text-sm  font-medium text-text-secondary'>Background Color</span>
          <BackgroundColorPicker
            onChange={(color) => {
              setBgColor(color);
              onUpdate('bgColor', color);
            }}
            bgColor={bgColor}
          />
        </div>
        <div className='space-y-2'>
          <span className='text-sm  font-medium text-text-secondary'>Text Color</span>
          <TextColorPicker
            onChange={(color) => {
              setTextColor(color);
              onUpdate('textColor', color);
            }}
            textColor={textColor}
          />
        </div>
      </Actions>
    </>
  );
}

function NoteInfo({ editor, updateDate, isSaving, title, setTitle }) {
  const format = useFormatDateAndTime()

  if (!editor) return null;
  return (
    <div className='space-y-3'>
      <input
        type='text'
        placeholder='Note Title'
        className='w-full appearance-none border-none bg-transparent text-4xl font-bold text-text-primary outline-none placeholder:text-[#e1e1e0] dark:placeholder:text-[#373737] sm:text-[40px]'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <p id='info' className='flex flex-wrap items-center gap-2 text-xs text-text-tertiary'>
        <span>
          {format(new Date(updateDate || Date.now()))}
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


// Export
const turndownService = new TurndownService();

const exportAs = (format, editor, title) => {
  const formats = {
    text: {
      filename: `${title}.txt`,
      content: editor.getText(),
      type: 'text/plain',
    },
    html: {
      filename: `${title}.html`,
      content: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body>
  <h1>${title}</h1>
  ${editor.getHTML()}
</body>
</html>
      `,
      type: 'text/html',
    },
    markdown: {
      filename: `${title}.md`,
      content: turndownService.turndown(
        `<h1>${title}</h1>
         ---
        ${editor.getHTML()}`,
      ),
      type: 'text/markdown',
    },
  };

  if (format === 'pdf') return exportAsPDF(title);

  const { filename, content, type } = formats[format];

  const blob = new Blob([content], { type });

  exportDownload(blob, filename);
};

const exportAsPDF = (title) => {
  const content = document.querySelector('.tiptap');
  content.querySelector('#info').classList.add('hidden');
  const doc = new jsPDF();
  doc.html(content, {
    callback: function (doc) {
      doc.save(`${title}.pdf`);
      content.querySelector('#info').classList.remove('hidden');
    },
    x: 15,
    y: 15,
    width: 170,
    windowWidth: 650,
  });
};
