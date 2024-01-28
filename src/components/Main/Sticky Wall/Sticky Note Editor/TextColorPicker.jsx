import { useColorPicker } from '../../../../hooks/useColorPicker';

export function TextColorPicker({ onChange, textColor }) {
  const colorsDiv = useColorPicker(onChange, textColor);

  return (
    <div className=' flex h-auto gap-2' ref={colorsDiv}>
      <span
        className='color h-6 w-6 bg-text-primary'
        data-color={getComputedStyle(document.documentElement)
          .getPropertyValue('--text-primary')
          .trim()}
      ></span>
      <span
        className='color h-6 w-6 border  bg-background-primary'
        data-color={getComputedStyle(document.documentElement)
          .getPropertyValue('--background-primary')
          .trim()}
      ></span>
    </div>
  );
}
