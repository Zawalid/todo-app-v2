import { useEffect } from 'react';
import { useTasks } from '../../../hooks';
import { TasksSkeleton } from '../../Skeletons';
import { Title } from '../Title';
import TasksList from './TasksList';

export default function CompletedTasks() {
  const { tasks, isTasksLoading } = useTasks();
  const completedTasks = tasks.filter((task) => task.isCompleted);

  useEffect(() => {
    document.title = `I Do | Completed Tasks`;
  }, []);

  return (
    <>
      <Title title='Completed' count={completedTasks.length} />
      {isTasksLoading ? (
        <TasksSkeleton number={6} />
      ) : (
        <TasksList
          tasks={completedTasks}
          message={{
            noTasks: "You haven't completed any tasks yet",
            description: 'You can view all your completed tasks here.',
          }}
          isOnlyCompletedTasks={true}
        />
      )}
    </>
  );
}
