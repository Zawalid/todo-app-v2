import { useColorPicker } from '../../../../hooks/useColorPicker';

export function TextColorPicker({ onChange, textColor }) {
  const colorsDiv = useColorPicker(onChange, textColor);

  return (
    <div className=' flex h-auto gap-2' ref={colorsDiv}>
      <span className='color h-6 w-6 bg-text-secondary' data-color='#444'></span>
      <span
        className='color h-6 w-6 border  bg-background-primary'
        data-color='#fff'
      ></span>
    </div>
  );
}
