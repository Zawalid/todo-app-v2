import { useState } from 'react';
import { Colors } from '../../Common/Colors';
import { DropDown } from '../../Common/DropDown';
import { useColorPicker } from '../../../hooks/useColorPicker';

export function ListAction({ onDelete, onChangeColor, onOpenRenameInput }) {
  const [isColorsOpen, setIsColorsOpen] = useState(false);
  const colorsDiv = useColorPicker(onChangeColor);

  return (
    <DropDown
      toggler={<i className='fas fa-ellipsis-vertical text-text-tertiary '></i>}
      togglerClassName='cursor-pinter  relative rounded-md px-2 text-center transition-colors duration-300 hover:bg-background-primary'
      options={{
        className: 'w-52',
      }}
      shouldCloseOnClick={false}
      onClose={() => isColorsOpen && setIsColorsOpen(false)}
    >
      <DropDown.Button onClick={onOpenRenameInput}>
        <i className='fa-solid fa-pen '></i>
        <span>Rename List</span>
      </DropDown.Button>

      <DropDown
        toggler={
          <DropDown.Button onClick={() => setIsColorsOpen(!isColorsOpen)}>
            <i className='fa-solid fa-palette'></i>
            <span className='flex-1 text-start'>Change Color</span>
            <i className='fa-solid fa-chevron-down'></i>
          </DropDown.Button>
        }
        options={{ className: 'w-52', placement: 'bottom' }}
        togglerClassName='w-full'
        shouldCloseOnClick={false}
      >
        <div
          className={
            'flex flex-wrap items-center gap-2  overflow-hidden  ' + (isColorsOpen ? 'h-20' : 'h-0')
          }
          ref={colorsDiv}
        >
          <Colors />
        </div>
      </DropDown>
      <DropDown.Button onClick={onDelete} className='hover:bg-red-500 hover:text-white'>
        <i className='fa-solid fa-trash-can '></i>
        <span>Delete List</span>
      </DropDown.Button>
    </DropDown>
  );
}
