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
import { ColorHighlighter } from './ColorHighlighter';
import StarterKit from '@tiptap/starter-kit';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';

export const extensions = [
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

