import { PiDotsThreeOutlineVerticalFill, PiTrash } from 'react-icons/pi';
import { DropDown } from '../../Common/DropDown';

export function Actions({ trash = {}, currentTab, trashLength, onDeleteAll, onRestoreAll, onEmptyTrash }) {
  return (
    <DropDown
      toggler={<PiDotsThreeOutlineVerticalFill />}
      togglerClassName='icon-button not-active small'
      options={{ className: 'w-60 max-h-[100%]', shouldCloseOnClick: false }}
    >
      <DropDown.Button
        isDeleteButton={true}
        disabled={trash[currentTab]?.length === 0}
        onClick={onDeleteAll}
      >
       <PiTrash />
        <span>Delete All</span>
      </DropDown.Button>
      <DropDown.Button disabled={trash[currentTab]?.length === 0} onClick={onRestoreAll}>
       <PiTrash />
        <span>Restore All</span>
      </DropDown.Button>
      <DropDown.Button isDeleteButton={true} disabled={trashLength === 0} onClick={onEmptyTrash}>
       <PiTrash />
        <span>Empty Trash</span>
      </DropDown.Button>
    </DropDown>
  );
}
