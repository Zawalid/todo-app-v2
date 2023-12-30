import { Colors } from '../../../Common/Colors';
import { useColorPicker } from '../../../../hooks/useColorPicker';

export function BackgroundColorPicker({ onChange }) {
  const colorsDiv = useColorPicker(onChange);

  return (
    <div className='flex h-auto flex-wrap gap-2 ' ref={colorsDiv}>
      <Colors customClass='w-6 h-6' />
    </div>
  );
}
