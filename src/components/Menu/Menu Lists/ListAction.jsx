import { Colors } from '../../Common/Colors';
import { DropDown } from '../../Common/DropDown';

export function ListAction({ onDelete, onChangeColor, color, onOpenRenameInput }) {
  return (
    <DropDown
      toggler={<i className='fas fa-ellipsis-vertical w-  text-text-tertiary '></i>}
      togglerClassName='icon-button not-active small'
      options={{
        className: 'w-72 md:w-60',
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
        options={{ className: 'w-60 md:w-48',  shouldCloseOnClick: false }}
        togglerClassName='w-full'
      >
        <div className='flex flex-wrap items-center gap-2 overflow-hidden'>
          <Colors selectedColor={color} onSelect={(color) => onChangeColor(color)} />
        </div>
      </DropDown.NestedMenu>
      <DropDown.Button onClick={onDelete} isDeleteButton={true}>
        <i className='fa-solid fa-trash-can '></i>
        <span>Delete List</span>
      </DropDown.Button>
    </DropDown>
  );
}
