import { useState } from 'react';
import { ColorPicker } from './ColorPicker';
import CustomTippy from '../../../../../Common/CustomTippy';
import { FaPaintBrush } from 'react-icons/fa';

export function TextColor({ editor, readonly }) {
  const [color, setColor] = useState(
    document.documentElement.style.getPropertyValue('--editor-text-color'),
  );
  const disabled = readonly || !editor?.can().chain().focus().setColor(color).run();
  return (
    <ColorPicker
      editor={editor}
      cssProperty='--text-color'
      color={color}
      setColor={setColor}
      tiptapClass='textStyle'
      disabled={disabled}
    >
      <CustomTippy content='Text Color'>
        <button
          onClick={() => editor.chain().focus().setColor(color).run()}
          disabled={disabled}
          className='icon-button not-active'
        >
          <FaPaintBrush />
        </button>
      </CustomTippy>
    </ColorPicker>
  );
}
