import { Colors } from '../../Common/Colors';
import { DropDown } from '../../Common/DropDown';
import { useColorPicker } from '../../../hooks/useColorPicker';

export function ListAction({ onDelete, onChangeColor, onOpenRenameInput }) {
  const colorsDiv = useColorPicker(onChangeColor);

  return (
    <DropDown
      toggler={<i className='fas fa-ellipsis-vertical text-text-tertiary '></i>}
      togglerClassName='not-active small'
      options={{
        className: 'w-52',
      }}
    >
      <DropDown.Button onClick={onOpenRenameInput}>
        <i className='fa-solid fa-pen '></i>
        <span>Rename List</span>
      </DropDown.Button>

      <DropDown.NestedMenu
        toggler={
          <DropDown.Button>
            <i className='fa-solid fa-palette'></i>
            <span className='flex-1 text-start'>Change Color</span>
            <i className='fa-solid fa-chevron-down'></i>
          </DropDown.Button>
        }
        options={{ className: 'w-52', placement: 'bottom', shouldCloseOnClick: false }}
        togglerClassName='w-full'
      >
        <div className='flex h-20 flex-wrap items-center  gap-2 overflow-hidden' ref={colorsDiv}>
          <Colors />
        </div>
      </DropDown.NestedMenu>
      <DropDown.Button onClick={onDelete} isDeleteButton={true}>
        <i className='fa-solid fa-trash-can '></i>
        <span>Delete List</span>
      </DropDown.Button>
    </DropDown>
  );
}
