import { useParams } from 'react-router-dom';
import { useLists, useTasks } from '../../../hooks';
import { Title } from '../Title';
import TasksList from './TasksList';
import { TasksSkeleton } from '../../Skeletons';
import { useEffect } from 'react';

export default function ListTasks() {
  const { tasks, isTasksLoading } = useTasks();
  const { lists } = useLists();
  const { listName } = useParams();
  const listId = lists?.find((list) => list.title === listName?.replace('%20', ' '))?.$id;
  const listTasks = tasks.filter((task) => task.listId === listId);
  const listTitle = listName?.replace('%20', ' ');

  useEffect(() => {
    document.title = `I Do | ${listTitle}`;
  }, [listTitle]);

  return (
    <>
      <Title title={listTitle} count={listTasks.length} />
      {isTasksLoading ? (
        <TasksSkeleton number={6} />
      ) : (
        <TasksList
          tasks={listTasks}
          message={{
            noTasks: `You don't have any tasks in this list.`,
            noFilterPart: 'in this list',
          }}
          listId={listId}
        />
      )}
    </>
  );
}
