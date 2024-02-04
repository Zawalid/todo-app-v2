import { useEffect } from 'react';
import { useTasks } from '../../../hooks';
import { TasksSkeleton } from '../../Skeletons';
import { Title } from '../Title';
import TasksList from './TasksList';

export default function Inbox() {
  const { tasks, isTasksLoading } = useTasks();

  useEffect(() => {
    document.title = `I Do | Inbox`;
  }, []);

  return (
    <>
      <Title title='Inbox' count={tasks.length} />
      {isTasksLoading ? (
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
