import { useEffect } from 'react';
import { TasksSkeleton } from '../../Skeletons';
import { Title } from '../Title';
import TasksList from './TasksList';
import { useTasks } from '../../../lib/react-query/queries';

export default function Inbox() {
  const { tasks, isLoading, error } = useTasks();

  useEffect(() => {
    document.title = `I Do | Inbox`;
  }, []);



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
          error={error}
        />
      )}
    </>
  );
}
