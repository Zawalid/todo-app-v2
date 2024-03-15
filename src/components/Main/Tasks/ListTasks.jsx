import { useParams } from 'react-router-dom';
import { Title } from '../Title';
import TasksList from './TasksList';
import { TasksSkeleton } from '../../Skeletons';
import { useEffect } from 'react';
import { useListTasks, useLists } from '../../../lib/react-query/queries';

export default function ListTasks() {
  const { lists } = useLists();
  const { listName } = useParams();
  const listId = lists?.find(
    (list) => list.title.trim() === listName?.replace('%20', ' ').trim(),
  )?.$id;
  const listTitle = listName?.replace('%20', ' ');
  const { listTasks, isLoading, error } = useListTasks(listId);

  useEffect(() => {
    document.title = `I Do | ${listTitle}`;
  }, [listTitle]);

  return (
    <>
      <Title title={listTitle} count={listTasks?.length} />
      {isLoading ? (
        <TasksSkeleton number={6} />
      ) : (
        <TasksList
          tasks={listTasks}
          message={{
            noTasks: `You don't have any tasks in this list.`,
            noFilterPart: 'in this list',
          }}
          listId={listId}
          error={
            !listId
              ? {
                  title: `No list found with the name "${listTitle}"`,
                  message: 'The list you are looking for does not exist or has been deleted.',
                }
              : error
          }
        />
      )}
    </>
  );
}
