import { PiCheckBold } from 'react-icons/pi';

export function TextColorPicker({ onChange, textColor }) {
  const color1 = getComputedStyle(document.documentElement)
    .getPropertyValue('--text-primary')
    .trim();
  const color2 = getComputedStyle(document.documentElement)
    .getPropertyValue('--background-secondary')
    .trim();

  return (
    <div className=' flex h-auto gap-2'>
      <span className='color h-6 w-6 bg-text-primary' onClick={() => onChange(color1)}>
        {textColor === color1 && <PiCheckBold size={14} style={{ color: color2 }} />}
      </span>
      <span
        className='color h-6 w-6 bg-background-primary'
        onClick={() => onChange(color2)}
      >
        {textColor === color2 && <PiCheckBold size={14} style={{ color: color1 }} />}
      </span>
    </div>
  );
}
