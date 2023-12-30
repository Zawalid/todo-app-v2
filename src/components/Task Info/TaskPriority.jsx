import { DropDown }from '../Common/DropDown';

export const TaskPriority = ({ taskPriority, setTaskPriority }) => {
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
      <label className='text-sm justify-self-start text-text-tertiary'>Priority</label>

      <DropDown
        toggler={
          <DropDown.Toggler>
            <span> {priorities.find((priority) => priority.value === +taskPriority).label} </span>
            <i className='fa-solid fa-chevron-down text-xs'></i>
          </DropDown.Toggler>
        }
      >
        {priorities?.map((priority) => (
          <DropDown.Button
            key={priority.label}
            onClick={() => setTaskPriority(priority.value)}
            className={
              taskPriority === priority.value
                ? 'bg-background-secondary text-text-secondary'
                : 'bg-background-primary text-text-tertiary'
            }
          >
            <span>{priority.label}</span>
          </DropDown.Button>
        ))}
      </DropDown>
    </>
  );
};
