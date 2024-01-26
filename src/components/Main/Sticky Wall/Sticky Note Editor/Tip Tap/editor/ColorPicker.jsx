import { useEffect } from 'react';
import CustomTippy from '../../../../../Common/CustomTippy';

function Colors({ onClick }) {
  const colors = [
    '#ff6b6b',
    '#da77f2',
    '#9775fa',
    '#64c37e',
    '#ffda77',
    '#ffc77f',
    '#c8ff2d',
    '#605050',
    '#000000',
    '#ffffff',
    '#f5222d',
    '#fa541c',
    '#fa8c16',
    '#faad14',
    '#fadb14',
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
    <div className='flex gap-1 rounded-md bg-background-tertiary'>
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
              <i className='fa-solid fa-plus text-text-secondary'></i>
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
          className='grid place-items-end rounded-sm bg-black px-[2px]'
          style={{
            backgroundColor: disabled ? '#cacaca' : color,
          }}
          disabled={disabled}
        >
          <i className='fa-solid fa-chevron-down cursor-pointer text-xs text-white '></i>
        </div>
      </CustomTippy>
    </div>
  );
}
