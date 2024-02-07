import { useEffect } from 'react';
import { TasksSkeleton } from '../../Skeletons';
import { Title } from '../Title';
import TasksList from './TasksList';
import { useTodayTasks } from '../../../lib/react-query/queries';

export default function TodayTasks() {
  const { todayTasks, isLoading, isError, error } = useTodayTasks();

  useEffect(() => {
    document.title = `I Do | Today`;
  }, []);

  if (isError) {
    return <p>{error.message}</p>;
  }

  return (
    <>
      <Title title='Today' count={todayTasks?.length} />
      {isLoading ? (
        <TasksSkeleton number={6} />
      ) : (
        <TasksList
          tasks={todayTasks}
          message={{
            noTasks: 'You have no tasks scheduled for today.',
            noFilterPart: 'scheduled for today',
          }}
          dueDate={new Date().toISOString().split('T')[0]}
        />
      )}
    </>
  );
}
