import { useEffect } from 'react';
import { TasksSkeleton } from '../../Skeletons';
import { Title } from '../Title';
import TasksList from './TasksList';
import { useCompletedTasks } from '../../../lib/react-query/queries';

export default function CompletedTasks() {
  const { completedTasks, isLoading, error } = useCompletedTasks();

  useEffect(() => {
    document.title = `I Do | Completed Tasks`;
  }, []);

  return (
    <>
      <Title title='Completed' count={completedTasks?.length} />
      {isLoading ? (
        <TasksSkeleton number={6} />
      ) : (
        <TasksList
          tasks={completedTasks}
          message={{
            noTasks: "You haven't completed any tasks yet",
            description: 'You can view all your completed tasks here.',
          }}
          isOnlyCompletedTasks={true}
          error={error}
        />
      )}
    </>
  );
}
