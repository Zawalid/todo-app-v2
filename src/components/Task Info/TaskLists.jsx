import { useLists } from '../../lib/react-query/queries';
import { isTouchDevice } from '../../utils/helpers';
import { DropDown } from '../Common/DropDown';
import { IoChevronDownOutline } from 'react-icons/io5';


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
              {lists?.find((list) => list.$id === taskListId)?.title || 'None'}{' '}
            </span>
            <IoChevronDownOutline />
          </DropDown.Toggler>
        }
      >
        <DropDown.Button
          onClick={() => setTaskListId('none')}
          isCurrent={taskListId === 'none'}
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
