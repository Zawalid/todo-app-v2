import { useEffect } from 'react';
import { useTasks } from '../../../hooks';
import { checkIfToday } from '../../../utils/Moment';
import { TasksSkeleton } from '../../Skeletons';
import { Title } from '../Title';
import TasksList from './TasksList';

export default function TodayTasks() {
  const { tasks, isTasksLoading } = useTasks();
  const todayTasks = tasks.filter((task) => checkIfToday(task.dueDate));

  useEffect(() => {
    document.title = `I Do | Today`;
  }, []);

  return (
    <>
      <Title title='Today' count={todayTasks.length} />
      {isTasksLoading ? (
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
