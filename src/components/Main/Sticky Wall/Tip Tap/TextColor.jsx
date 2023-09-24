import { useState } from 'react';
import { ColorPicker } from './ColorPicker';
import CustomTippy from '../../CustomTippy';

export function TextColor({ editor }) {
  const [color, setColor] = useState('#444');
  return (
    <ColorPicker
      editor={editor}
      cssProperty='--text-color'
      color={color}
      setColor={setColor}
      tiptapClass='textStyle'
    >
      <CustomTippy content='Text Color'>
        <button
          onClick={() => editor.chain().focus().setColor(color).run()}
          disabled={!editor.can().chain().focus().setColor(color).run()}
          className='not-active'
        >
          <i className='fa-solid fa-paintbrush'></i>
        </button>
      </CustomTippy>
    </ColorPicker>
  );
}
