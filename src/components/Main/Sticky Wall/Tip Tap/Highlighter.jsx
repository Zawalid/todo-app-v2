import { useState } from 'react';
import { ColorPicker } from './ColorPicker';
import CustomTippy from '../../CustomTippy';

export function Highlighter({ editor }) {
  const [color, setColor] = useState('#ffda77');
  return (
    <ColorPicker
      editor={editor}
      cssProperty='--highlight-color'
      color={color}
      setColor={setColor}
      tiptapClass='highlighter'
    >
      <CustomTippy content='Highlight'>
        <button
          onClick={() => editor.chain().focus().toggleHighlight({ color }).run()}
          disabled={!editor.can().chain().focus().toggleHighlight({ color }).run()}
          className={editor.isActive('highlight') ? 'is-active' : 'not-active'}
        >
          <i className='fa-solid fa-highlighter'></i>
        </button>
      </CustomTippy>
    </ColorPicker>
  );
}
