import { PiDotsThreeOutlineVerticalFill, PiPalette, PiPencilSimple, PiTrash } from 'react-icons/pi';
import {IoChevronDownOutline} from 'react-icons/io5'
import { Colors } from '../../Common/Colors';
import { DropDown } from '../../Common/DropDown';

export function ListAction({ onDelete, onChangeColor, color, onOpenRenameInput }) {
  return (
    <DropDown
      toggler={<PiDotsThreeOutlineVerticalFill />}
      togglerClassName='icon-button not-active small'
      options={{
        className: 'w-68 md:w-60',
      }}
    >
      <DropDown.Button onClick={onOpenRenameInput}>
      <PiPencilSimple />
        <span>Rename List</span>
      </DropDown.Button>

      <DropDown.NestedMenu
        toggler={
          <DropDown.Button>
<PiPalette />
            <span className='text-start'>Change Color</span>
            <IoChevronDownOutline />
          </DropDown.Button>
        }
        options={{ className: 'w-58 md:w-48',  shouldCloseOnClick: false }}
        togglerClassName='w-full'
      >
        <div className='flex flex-wrap items-center gap-2 overflow-hidden'>
          <Colors selectedColor={color} onSelect={(color) => onChangeColor(color)} />
        </div>
      </DropDown.NestedMenu>
      <DropDown.Button onClick={onDelete} isDeleteButton={true}>
        <PiTrash />
        <span>Delete List</span>
      </DropDown.Button>
    </DropDown>
  );
}
