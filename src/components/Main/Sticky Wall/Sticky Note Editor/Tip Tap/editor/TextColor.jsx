import { useState } from 'react';
import { ColorPicker } from './ColorPicker';
import CustomTippy from '../../../../../Common/CustomTippy';

export function TextColor({ editor, readonly }) {
  const [color, setColor] = useState('#444');
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
          className='not-active'
        >
          <i className='fa-solid fa-paintbrush'></i>
        </button>
      </CustomTippy>
    </ColorPicker>
  );
}
