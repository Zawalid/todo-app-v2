import { SmallTitle } from '../Title';
import { AddTask } from './AddTask';
import { Task } from './Task';

const periods = [
  {
    title: 'Today',
    id: 'today',
  },
  {
    title: 'Tomorrow',
    id: 'tomorrow',
  },
  {
    title: 'This Week',
    id: 'thisWeek',
  },
  {
    title: 'This Month',
    id: 'thisMonth',
  },
  {
    title: 'This Year',
    id: 'thisYear',
  },
];
export function Upcoming({ tasks, onAdd, onOpen, onComplete, lists, tags }) {
  return (
    <div className='flex flex-wrap gap-5'>
      {periods.map((period) => (
        <PeriodTasks
          key={period.id}
          title={period.title}
          period={period.id}
          tasks={tasks}
          onAdd={onAdd}
          onOpen={onOpen}
          onComplete={onComplete}
          lists={lists}
          tags={tags}
        />
      ))}
    </div>
  );
}

function PeriodTasks({ title, period, tasks, onAdd, onOpen, onComplete, lists, tags }) {
  return (
    <div className='w-full rounded-lg  border border-background-tertiary p-4'>
      <SmallTitle title={title} />
      <AddTask
        onAdd={(title) => {
          onAdd(title, period);
        }}
      />
      <ul className='mt-3 space-y-2'>
        {tasks.get(period).map((task) => (
          <Task
            key={task.id}
            task={task}
            onOpen={() => onOpen(task)}
            onComplete={onComplete}
            lists={lists}
            tags={tags}
          />
        ))}
      </ul>
    </div>
  );
}
