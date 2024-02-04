import { Colors } from '../../../Common/Colors';

export function BackgroundColorPicker({ onChange, bgColor }) {
  return (
    <div className='flex  flex-wrap gap-2 '>
      <Colors selectedColor={bgColor} onSelect={(color) => onChange(color)} customClass='w-6 h-6' />
    </div>
  );
}
