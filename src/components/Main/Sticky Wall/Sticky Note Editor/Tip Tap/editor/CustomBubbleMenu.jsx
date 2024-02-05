import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaUnderline,
  FaCode,
  FaSuperscript,
  FaSubscript,
FaPaintBrush,
FaHighlighter
} from 'react-icons/fa';

export function CustomBubbleMenu({ editor }) {
  const highlightColor = document.documentElement.style.getPropertyValue('--highlight-color');
  const textColor = document.documentElement.style.getPropertyValue('--text-color');
  return (
    <div className='flex items-center gap-2 '>
      <button
        onClick={() => editor.chain().toggleBold().run()}
        disabled={!editor.can().chain().toggleBold().run()}
        className={editor.isActive('bold') ? 'icon-button active' : 'icon-button not-active '}
      >
        <FaBold />
      </button>
      <button
        onClick={() => editor.chain().toggleItalic().run()}
        disabled={!editor.can().chain().toggleItalic().run()}
        className={editor.isActive('italic') ? 'icon-button active' : 'icon-button not-active'}
      >
        <FaItalic />
      </button>
      <button
        onClick={() => editor.chain().toggleStrike().run()}
        disabled={!editor.can().chain().toggleStrike().run()}
        className={editor.isActive('strike') ? 'icon-button active' : 'icon-button not-active'}
      >
        <FaStrikethrough />
      </button>
      <button
        onClick={() => editor.chain().toggleUnderline().run()}
        disabled={!editor.can().chain().toggleUnderline().run()}
        className={editor.isActive('underline') ? 'icon-button active' : 'icon-button not-active'}
      >
        <FaUnderline />
      </button>
      <button
        onClick={() => editor.chain().toggleCode().run()}
        disabled={!editor.can().chain().toggleCode().run()}
        className={editor.isActive('code') ? 'icon-button active' : 'icon-button not-active'}
      >
        <FaCode />
      </button>
      <button
        onClick={() => editor.chain().toggleHighlight({ color: highlightColor }).run()}
        disabled={!editor.can().chain().toggleHighlight().run()}
        className={editor.isActive('highlight') ? 'icon-button active' : 'icon-button not-active'}
      >
        <FaHighlighter />
      </button>
      <button
        onClick={() => editor.chain().setColor(textColor).run()}
        disabled={!editor.can().chain().setColor(textColor).run()}
        className='icon-button not-active'
      >
        <FaPaintBrush />
      </button>
      <button
        onClick={() => editor.chain().toggleSuperscript().run()}
        disabled={!editor.can().chain().toggleSuperscript().run()}
        className={editor.isActive('superscript') ? 'icon-button active' : 'icon-button not-active'}
      >
        <FaSuperscript />
      </button>
      <button
        onClick={() => editor.chain().toggleSubscript().run()}
        disabled={!editor.can().chain().toggleSubscript().run()}
        className={editor.isActive('subscript') ? 'icon-button active' : 'icon-button not-active'}
      >
        <FaSubscript />
      </button>
    </div>
  );
}
