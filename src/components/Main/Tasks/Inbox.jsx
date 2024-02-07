import { useEffect } from 'react';
import { TasksSkeleton } from '../../Skeletons';
import { Title } from '../Title';
import TasksList from './TasksList';
import { useTasks } from '../../../lib/react-query/queries';

export default function Inbox() {
  const { tasks, isLoading, isError, error } = useTasks();

  useEffect(() => {
    document.title = `I Do | Inbox`;
  }, []);

  if (isError) {
    return <p>{error.message}</p>;
  }

  return (
    <>
      <Title title='Inbox' count={tasks?.length} />
      {isLoading ? (
        <TasksSkeleton number={6} />
      ) : (
        <TasksList
          tasks={tasks}
          message={{
            noTasks: `You don't have any tasks yet.`,
            noFilterPart: 'yet',
          }}
        />
      )}
    </>
  );
}
