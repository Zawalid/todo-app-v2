import { DropDown } from '../Common/DropDown';
import { TaskDates } from '../Main/Tasks/TaskDates';

export function Actions({ date, onCopy, onDuplicate }) {
  return (
    <DropDown
      toggler={<i className='fa-solid fa-ellipsis-v'></i>}
      togglerClassName='icon-button not-active small'
      options={{ className: 'w-64 max-h-[100%]', shouldCloseOnClick: false }}
    >
      <DropDown.Button onClick={onCopy}>
        <i className='fa-solid fa-copy text-text-secondary'></i>
        <span>Copy to clipboard</span>
      </DropDown.Button>
      <DropDown.Button onClick={onDuplicate}>
        <i className='fa-solid fa-copy text-text-secondary'></i>
        <span>Duplicate</span>
      </DropDown.Button>
      <DropDown.Divider />
      <div className='pt-2'>
        <TaskDates date={date} />
      </div>
    </DropDown>
  );
}
