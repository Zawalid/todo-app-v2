import { Colors } from '../../../Common/Colors';
import { useColorPicker } from '../../../../hooks/useColorPicker';

export function BackgroundColorPicker({ onChange,bgColor }) {
  const colorsDiv = useColorPicker(onChange,bgColor);

  return (
    <div className='flex  flex-wrap gap-2 ' ref={colorsDiv}>
      <Colors customClass='w-6 h-6' />
    </div>
  );
}
