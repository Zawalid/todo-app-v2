import { useState } from 'react';
import { ColorPicker } from './ColorPicker';
import CustomTippy from '../../../../../Common/CustomTippy';
import { FaHighlighter } from 'react-icons/fa';

export function Highlighter({ editor, readonly }) {
  const [color, setColor] = useState('#ffda77');
  const disabled = readonly || !editor?.can().chain().focus().toggleHighlight({ color }).run();
  return (
    <ColorPicker
      editor={editor}
      cssProperty='--highlight-color'
      color={color}
      setColor={setColor}
      tiptapClass='highlighter'
      disabled={disabled}
    >
      <CustomTippy content='Highlight'>
        <button
          onClick={() => editor.chain().focus().toggleHighlight({ color }).run()}
          disabled={disabled}
          className={editor.isActive('highlight') ? 'icon-button active' : 'icon-button not-active'}
        >
         <FaHighlighter />
        </button>
      </CustomTippy>
    </ColorPicker>
  );
}
