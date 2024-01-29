import { DropDown } from '../../Common/DropDown';

export function Actions({ trash, currentTab, trashLength, onDeleteAll, onRestoreAll, onEmptyTrash }) {
  return (
    <DropDown
      toggler={<i className='fa-solid fa-ellipsis-v'></i>}
      togglerClassName='icon-button not-active small'
      options={{ className: 'w-60 max-h-[100%]', shouldCloseOnClick: false }}
    >
      <DropDown.Button
        isDeleteButton={true}
        disabled={trash[currentTab]?.length === 0}
        onClick={onDeleteAll}
      >
        <i className='fa-solid fa-trash-can '></i>
        <span>Delete All</span>
      </DropDown.Button>
      <DropDown.Button disabled={trash[currentTab]?.length === 0} onClick={onRestoreAll}>
        <i className='fa-solid fa-trash-can '></i>
        <span>Restore All</span>
      </DropDown.Button>
      <DropDown.Button isDeleteButton={true} disabled={trashLength === 0} onClick={onEmptyTrash}>
        <i className='fa-solid fa-trash-can '></i>
        <span>Empty Trash</span>
      </DropDown.Button>
    </DropDown>
  );
}
