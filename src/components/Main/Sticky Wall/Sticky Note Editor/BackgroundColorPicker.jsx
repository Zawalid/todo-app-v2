import { Colors } from '../../../Common/Colors';
import CustomTippy from '../../../Common/CustomTippy';
import { useColorPicker } from './useColorPicker';

export function BackgroundColorPicker({ onChange }) {
  const { isOpen, setIsOpen, colorsDiv } = useColorPicker(onChange);

  return (
    <>
      <CustomTippy content='Change background color'>
        <button>
          <i
            className={'fas cursor-pointer ' + (isOpen ? 'fa-chevron-right' : 'fa-chevron-left')}
            onClick={() => setIsOpen(!isOpen)}
          ></i>
        </button>
      </CustomTippy>

      <div
        className={
          'absolute flex h-full items-center justify-center transition-[right] duration-500 ' +
          (isOpen ? 'right-8' : '-right-72')
        }
        ref={colorsDiv}
      >
        <Colors customClass='h-full rounded-none' />
      </div>
    </>
  );
}
