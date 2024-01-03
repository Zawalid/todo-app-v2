import { useLists } from '../../hooks/useLists';
import { isTouchDevice } from '../../utils/helpers';
import { DropDown } from '../Common/DropDown';

export function TaskLists({ taskListId, setTaskListId }) {
  const { lists } = useLists();
  if (isTouchDevice()) return null;
  return (
    <>
      <label className='justify-self-start text-sm text-text-tertiary'>List</label>
      <DropDown
        toggler={
          <DropDown.Toggler>
            <span className='truncate'>
              {' '}
              {lists?.find((list) => list.$id === taskListId)?.title || 'None'}{' '}
            </span>
            <i className='fa-solid fa-chevron-down ml-2 text-xs'></i>
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
            isCurrent={taskListId === list.$id}
          >
            <span className='truncate'>{list.title}</span>
          </DropDown.Button>
        ))}
      </DropDown>
    </>
  );
}
