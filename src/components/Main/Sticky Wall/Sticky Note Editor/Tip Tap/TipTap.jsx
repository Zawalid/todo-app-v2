import { useEffect, useMemo, useState } from 'react';
import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react';
import { extensions } from './extensions';
import TurndownService from 'turndown';
import { jsPDF } from 'jspdf';

import { ToolBar } from './ToolBar';
import { ActionBar } from './ActionBar';
import { CustomBubbleMenu } from './CustomBubbleMenu';
import { isTouchDevice } from '../../../../../utils/helpers';
import { useStickyNotes } from '../../../../../hooks';
import { BackgroundColorPicker } from '../BackgroundColorPicker';
import { TextColorPicker } from '../TextColorPicker';
import Switch from '../../../../Common/Switch';
import { toast } from 'sonner';
import { ConfirmationModal } from '../../../../Common/ConfirmationModal';

import '../../../../../styles/TipTap.scss';
import { DropDown } from '../../../../Common/DropDown';

const turndownService = new TurndownService();
const DEFAULT_FONT_FAMILY = `'Lexend Deca', sans-serif`;

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

  if (format === 'pdf') return exportAsPDF(editor.getHTML(), title);

  const { filename, content, type } = formats[format];

  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
const exportAsPDF = (html, title) => {
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

export default function TipTap() {
  const {
    currentNote,
    stickyNotes,
    handleAddStickyNote,
    handleUpdateStickyNote,
    handleDeleteStickyNote,
    handleBack,
  } = useStickyNotes();
  const { $id, content, $updatedAt, bgColor, textColor, fontFamily } = currentNote || {};

  const [title, setTitle] = useState(currentNote?.title);
  const [isSaving, setIsSaving] = useState(false);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [readonly, setReadonly] = useState(currentNote?.readonly || false);
  const [pinned, setPinned] = useState(currentNote?.pinned || false);
  const exists = useMemo(() => stickyNotes.find((note) => note.$id === $id), [stickyNotes, $id]);

  function handleUpdateNote(field, value) {
    if (!exists) {
      handleAddStickyNote({
        title: !title || title.trim() === '' ? 'Untitled' : title,
        content,
        bgColor,
        textColor,
        readonly,
        pinned,
        fontFamily: fontFamily || DEFAULT_FONT_FAMILY,
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
  const onBack = () => handleBack(currentNote.$id, title, content);

  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const editor = useEditor({
    extensions: extensions,
    content,
    editorProps: {
      attributes: {
        class: 'text-text-secondary focus:outline-none pb-10',
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
          onDelete: () => {
            $id && handleDeleteStickyNote(currentNote.$id, true);
          },
          onBack,
          onReadOnly: () => setReadonly(!readonly),
          onPin: () => {
            setPinned(!pinned);
            handleUpdateNote('pinned', !pinned);
          },
          onExport: (format) => exportAs(format, editor, title),
          onChangeFontFamily: (fontFamily) => {
            document.querySelector('.tiptap').style.fontFamily = fontFamily;
            handleUpdateNote('fontFamily', fontFamily);
          },
        }}
      >
        <div className='space-y-2'>
          <span className='text-sm  font-medium text-text-secondary'>Background Color</span>
          <BackgroundColorPicker
            onChange={(color) => handleUpdateNote('bgColor', color)}
            bgColor={bgColor}
          />
        </div>
        <div className='space-y-2'>
          <span className='text-sm  font-medium text-text-secondary'>Text Color</span>
          <TextColorPicker
            onChange={(color) => handleUpdateNote('textColor', color)}
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
        className='w-full appearance-none border-none bg-transparent text-4xl font-bold text-[rgb(48,48,48)] outline-none sm:text-[40px]'
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

function Actions({
  children,
  currentNote,
  isOpen,
  readonly,
  pinned,
  fontFamily,
  handlers: { onClose, onCopy, onDelete, onBack, onReadOnly, onPin, onExport, onChangeFontFamily },
}) {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [deletePermanently, setDeletePermanently] = useState(false);
  return (
    <div
      className={
        'fixed top-0 z-[10001] flex h-full w-full flex-col border bg-background-primary p-3 shadow-md transition-[right] sm:w-[300px]  ' +
        (isOpen ? 'right-0 duration-700' : '-right-full duration-[.9s] ')
      }
    >
      <div className='flex items-center justify-between pb-2'>
        <h3 className='m-0  text-lg font-semibold text-text-primary sm:text-xl'>Actions</h3>
        <button
          className='text-xs font-medium text-primary transition-colors duration-300 hover:text-primary-hover'
          onClick={onClose}
        >
          Done{' '}
        </button>
      </div>
      <hr className='border border-zinc-200' />
      <div className='mt-2 flex flex-1 flex-col gap-2 overflow-auto'>
        <div className='space-y-3'>
          <FontFamilies fontFamily={fontFamily} onChangeFontFamily={onChangeFontFamily} />
          {children}
        </div>
        <hr className='border border-zinc-200' />

        <div>
          <div className='flex items-center justify-between rounded-md px-3 py-2 transition-colors duration-300 hover:bg-background-secondary '>
            <label
              className=' grid grid-cols-[15px_auto] items-center gap-2 text-sm font-medium  text-text-secondary'
              htmlFor='pin'
            >
              <i className='fa-solid fa-thumbtack'></i> <span>Pin</span>
            </label>
            <Switch id='pin' checked={pinned} onChange={onPin} />
          </div>
          <div className='flex items-center justify-between rounded-md px-3 py-2 transition-colors duration-300 hover:bg-background-secondary '>
            <label
              className=' grid grid-cols-[15px_auto] items-center gap-2 text-sm font-medium  text-text-secondary'
              htmlFor='readonly'
            >
              <svg
                viewBox='0 0 24 24'
                width='17px'
                height='17px'
                className='text-text-secondary'
                fill='currentColor'
              >
                <path
                  className='text-text-secondary'
                  d='M16.1,9L17,9.9L7.9,19H7V18.1L16.1,9M19.7,3C19.5,3 19.2,3.1 19,3.3L17.2,5.1L20.9,8.9L22.7,7C23.1,6.6 23.1,6 22.7,5.6L20.4,3.3C20.2,3.1 19.9,3 19.7,3M16.1,6.2L5,17.2V21H8.8L19.8,9.9L16.1,6.2M8,5V4.5C8,3.1 6.9,2 5.5,2C4.1,2 3,3.1 3,4.5V5C2.4,5 2,5.4 2,6V10C2,10.6 2.4,11 3,11H8C8.6,11 9,10.6 9,10V6C9,5.4 8.6,5 8,5M7,5H4V4.5C4,3.7 4.7,3 5.5,3C6.3,3 7,3.7 7,4.5V5Z'
                ></path>
              </svg>
              <span>Read only</span>
            </label>
            <Switch id='readonly' checked={readonly} onChange={onReadOnly} />
          </div>
        </div>
        <hr className='border border-zinc-200' />
        <div className='gap- flex flex-col'>
          <button
            className='grid grid-cols-[15px_auto] items-center gap-2 rounded-md px-3  py-2 text-sm font-medium text-text-secondary transition-colors duration-300 hover:bg-background-secondary hover:text-text-primary'
            onClick={onCopy}
          >
            <i className='fa-solid fa-clone'></i>
            <span className='text-start'>Copy Note</span>
          </button>

          <DropDown
            toggler={
              <>
                <i className='fa-solid fa-file-export'></i>
                <span className='text-start'>Export As</span>
              </>
            }
            togglerClassName='grid grid-cols-[15px_auto] items-center gap-2 text-sm font-medium  text-text-secondary transition-colors duration-300 hover:text-text-primary hover:bg-background-secondary py-2 px-3 rounded-md'
            options={{
              className: 'w-[260px]',
              placement: 'bottom-start',
            }}
          >
            <DropDown.Button className='text-center' onClick={() => onExport('pdf')}>
              <i className='fa-solid fa-file-pdf w-4'></i>
              <span>PDF</span>
            </DropDown.Button>
            <DropDown.Button className='text-center' onClick={() => onExport('text')}>
              <i className='fa-solid fa-file-lines w-4'></i>
              <span>Text</span>
            </DropDown.Button>
            <DropDown.Button className='text-center' onClick={() => onExport('html')}>
              <i className='fa-brands fa-html5 w-4'></i>
              <span>HTML</span>
            </DropDown.Button>
            <DropDown.Button className='text-center' onClick={() => onExport('markdown')}>
              <i className='fa-brands fa-markdown w-4'></i>
              <span>Markdown</span>
            </DropDown.Button>
          </DropDown>
          <button
            className='grid grid-cols-[15px_auto] items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-red-500 transition-colors duration-300 hover:bg-background-secondary hover:text-text-error'
            onClick={() => setIsConfirmationModalOpen(true)}
          >
            <i className='fa-solid fa-trash-can'></i>
            <span className='text-start'>Delete Note</span>
          </button>
        </div>

        <div className='mt-auto'>
          <hr className='mb-2 border border-zinc-200' />
          <p className='mb-1 text-xs font-medium text-text-secondary '>
            Created :{' '}
            {new Intl.DateTimeFormat('en-US', {
              dateStyle: 'medium',
              timeStyle: 'short',
            }).format(new Date(currentNote?.$createdAt || Date.now()))}
          </p>
          <p className='text-xs font-medium text-text-secondary '>
            Last modified :{' '}
            {new Intl.DateTimeFormat('en-US', {
              dateStyle: 'medium',
              timeStyle: 'short',
            }).format(new Date(currentNote?.$updatedAt || Date.now()))}
          </p>
        </div>
      </div>
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
    </div>
  );
}

function FontFamilies({ fontFamily, onChangeFontFamily }) {
  const families = [
    {
      name: DEFAULT_FONT_FAMILY,
      label: 'Default',
    },
    {
      name: 'serif',
      label: 'Serif',
    },
    {
      name: 'monospace',
      label: 'Mono',
    },
    {
      name: 'cursive',
      label: 'Cursive',
    },
  ];
  return (
    <div className='space-y-2'>
      <span className='text-sm  font-medium text-text-secondary'>Font Family</span>
      <div className='flex gap-3'>
        {families.map(({ name, label }) => (
          <div className='text-center ' key={name} onClick={() => onChangeFontFamily(name)}>
            <button
              className={
                'h-16 w-16 rounded-md border p-3 text-lg font-medium transition-colors duration-300 hover:border-primary hover:text-primary sm:h-14 sm:w-14 ' +
                (fontFamily === name
                  ? 'border-primary text-primary'
                  : 'border-zinc-200 text-text-secondary')
              }
              style={{ fontFamily: name }}
            >
              Ag
            </button>
            <span className='text-xs  text-text-tertiary'>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
