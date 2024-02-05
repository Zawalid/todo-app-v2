import { IoChevronDownOutline } from "react-icons/io5";
import { DropDown } from '../Common/DropDown';

export const TaskPriority = ({ taskPriority, setTaskPriority, inSettings }) => {
  const priorities = [
    {
      label: 'None',
      value: 0,
    },
    {
      label: 'Low',
      value: 1,
    },
    {
      label: 'Medium',
      value: 2,
    },
    {
      label: 'High',
      value: 3,
    },
  ];

  return (
    <>
      {inSettings || (
        <label className='justify-self-start text-sm text-text-tertiary'>Priority</label>
      )}

      <DropDown
        toggler={
          <DropDown.Toggler>
            <span> {priorities.find((priority) => priority.value === +taskPriority)?.label} </span>
            <IoChevronDownOutline />
          </DropDown.Toggler>
        }
      >
        {priorities?.map((priority) => (
          <DropDown.Button
            key={priority.label}
            onClick={() => setTaskPriority(priority.value)}
            isCurrent={taskPriority === priority.value}
          >
            <span>{priority.label}</span>
          </DropDown.Button>
        ))}
      </DropDown>
    </>
  );
};
