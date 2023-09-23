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
import StarterKit from '@tiptap/starter-kit';
import { MenuBar } from './MenuBar';
import { Footer } from './Footer';
import { CustomBubbleMenu } from './CustomBubbleMenu';

import '../../../../styles/TipTap.scss';

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
  Placeholder.configure({
    emptyEditorClass: 'is-editor-empty',
    placeholder: 'Start typing …',
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
  }),
];

export default function TipTap({ onUpdateContent, content, creationDate }) {
  const editor = useEditor({
    extensions,
    content,
    editorProps: {
      attributes: {
        class:
          'h-full p-3 text-text-secondary focus:outline-none border-t border-background-tertiary overflow-auto',
      },
    },
    onUpdate: ({ editor }) => {
      onUpdateContent(editor.getHTML());
    },
  });

  return (
    <div className='tiptap  grid h-full grid-rows-[auto_1fr_60px]'>
      <MenuBar editor={editor} />
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
      <EditorContent editor={editor} />
      <Footer editor={editor} creationDate={creationDate} />
    </div>
  );
}
