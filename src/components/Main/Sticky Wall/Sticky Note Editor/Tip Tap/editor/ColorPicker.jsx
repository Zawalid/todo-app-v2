import { useEffect } from 'react';
import CustomTippy from '../../../../../Common/CustomTippy';
import { PiPlusBold } from 'react-icons/pi';

function Colors({ onClick }) {
  const colors = [
    '#cacaca',
    '#c8ff2d',
    '#fadb14',
    '#faad14',
    '#ffda77',
    '#fa8c16',
    '#ffc77f',
    '#fa541c',
    '#f5222d',
    '#ff6b6b',
    '#64c37e',
    '#9775fa',
    '#da77f2',
    '#444444',
    '#000000',
  ];

  return (
    <div className='flex flex-wrap gap-1'>
      {colors.map((color, index) => (
        <button
          key={index}
          className='h-7 w-7 rounded-full shadow-md'
          style={{ backgroundColor: color }}
          onClick={() => {
            onClick(color);
          }}
        />
      ))}
    </div>
  );
}

export function ColorPicker({
  editor,
  children,
  cssProperty,
  color,
  setColor,
  tiptapClass,
  disabled,
}) {
  function handleColorChange(e) {
    const chosenColor = e.target.value;
    setColor(chosenColor);
    tiptapClass === 'textStyle' && editor.chain().focus().setColor(chosenColor).run();
  }
  useEffect(() => {
    document.documentElement.style.setProperty(cssProperty, color);
  }, [color, cssProperty]);

  return (
    <div className='flex gap-1 rounded-md'>
      {children}
      <CustomTippy
        content={
          <>
            <Colors
              onClick={(color) => {
                setColor(color);
                tiptapClass === 'textStyle' && editor.chain().focus().setColor(color).run();
              }}
            />
            <button className='relative mt-1 grid h-7 w-7 place-items-center rounded-full bg-background-secondary shadow-md'>
              <input
                type='color'
                value={color}
                className='absolute h-8 w-8 cursor-pointer opacity-0'
                onChange={handleColorChange}
              />
              <PiPlusBold />
            </button>
          </>
        }
        trigger='click'
        interactive={true}
        arrow={false}
        placement='bottom'
        theme='bubbleMenu'
        maxWidth={175}
      >
        <div
          className='border border-border cursor-pointer rounded-sm px-1'
          style={{
            backgroundColor: disabled ? '#cacaca' : color,
          }}
          disabled={disabled}
        ></div>
      </CustomTippy>
    </div>
  );
}
