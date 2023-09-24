export function CustomBubbleMenu({ editor }) {
  const highlightColor = document.documentElement.style.getPropertyValue('--highlight-color');
  const textColor = document.documentElement.style.getPropertyValue('--text-color');
  return (
    <div className='flex items-center gap-2 '>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : 'not-active '}
      >
        <i className='fa-solid fa-bold'></i>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : 'not-active'}
      >
        <i className='fa-solid fa-italic'></i>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'is-active' : 'not-active'}
      >
        <i className='fa-solid fa-strikethrough'></i>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        className={editor.isActive('underline') ? 'is-active' : 'not-active'}
      >
        <i className='fa-solid fa-underline'></i>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={editor.isActive('code') ? 'is-active' : 'not-active'}
      >
        <i className='fa-solid fa-code'></i>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHighlight({ color: highlightColor }).run()}
        disabled={!editor.can().chain().focus().toggleHighlight().run()}
        className={editor.isActive('highlight') ? 'is-active' : 'not-active'}
      >
        <i className='fa-solid fa-highlighter'></i>
      </button>
      <button
        onClick={() => editor.chain().focus().setColor(textColor).run()}
        disabled={!editor.can().chain().focus().setColor(textColor).run()}
        className='not-active'
      >
        <i className='fa-solid fa-paintbrush'></i>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        disabled={!editor.can().chain().focus().toggleSuperscript().run()}
        className={editor.isActive('superscript') ? 'is-active' : 'not-active'}
      >
        <i className='fa-solid fa-superscript'></i>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        disabled={!editor.can().chain().focus().toggleSubscript().run()}
        className={editor.isActive('subscript') ? 'is-active' : 'not-active'}
      >
        <i className='fa-solid fa-subscript'></i>
      </button>
    </div>
  );
}
