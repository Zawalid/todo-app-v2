import { PiDotsThreeOutlineVerticalFill } from 'react-icons/pi';
import { IoDuplicateOutline, IoCopyOutline } from 'react-icons/io5';
import { DropDown } from '../Common/DropDown';
import { TaskDates } from '../Main/Tasks/Task Components/TaskDates';

export function Actions({ date, onCopy, onDuplicate }) {
  return (
    <DropDown
    toggler={<PiDotsThreeOutlineVerticalFill />}
    togglerClassName='icon-button not-active small'
      options={{ className: 'w-64 max-h-[100%]', shouldCloseOnClick: false }}
    >
      <DropDown.Button onClick={onCopy}>
        <IoCopyOutline />
        <span>Copy to clipboard</span>
      </DropDown.Button>
      <DropDown.Button onClick={onDuplicate}>
        <IoDuplicateOutline />
        <span>Duplicate</span>
      </DropDown.Button>
      <DropDown.Divider />
      <div className='pt-2'>
        <TaskDates date={date} />
      </div>
    </DropDown>
  );
}
