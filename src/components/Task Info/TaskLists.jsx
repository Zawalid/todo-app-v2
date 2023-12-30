import { useLists } from '../../hooks/useLists';
import { DropDown }from '../Common/DropDown';

export function TaskLists({ taskListId, setTaskListId }) {
  const { lists } = useLists();
  return (
    <>
      <label className='text-sm justify-self-start text-text-tertiary'>List</label>
      <DropDown
        toggler={
          <DropDown.Toggler>
            <span> {lists?.find((list) => list.$id === taskListId)?.title || 'None'} </span>
            <i className='fa-solid fa-chevron-down text-xs'></i>
          </DropDown.Toggler>
        }
      >
        <DropDown.Button
          onClick={() => setTaskListId('none')}
          className={
            taskListId === 'none'
              ? 'bg-background-secondary text-text-secondary'
              : 'bg-background-primary text-text-tertiary'
          }
        >
          <span>None</span>
        </DropDown.Button>
        {lists?.map((list) => (
          <DropDown.Button
            key={list.$id}
            onClick={() => setTaskListId(list.$id)}
            className={
              taskListId === list.$id
                ? 'bg-background-secondary text-text-secondary'
                : 'bg-background-primary text-text-tertiary'
            }
          >
            <span>{list.title}</span>
          </DropDown.Button>
        ))}
      </DropDown>
    </>
  );
}
