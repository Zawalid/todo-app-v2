import { AddTask } from './AddTask';
import { Task } from './Task';

export function DisplayedTasks({
  onAdd,
  onOpen,
  onComplete,
  tasks,
  lists,
  tags,
  condition,
  activeTab,
}) {
  const allTasks = [...tasks.values()].flat();
  return (
    <>
      
      <div className='relative h-full'>
        <div className='flex  items-center gap-3 rounded-xl border border-background-tertiary px-5 py-1'>
          <i className='fa-solid fa-plus text-xl text-text-tertiary'></i>
          <AddTask onAdd={onAdd} />
        </div>
        {allTasks.filter((task) => condition(task)).length > 0 && (
          <ul className='mt-3 space-y-2 overflow-y-auto'>
            {allTasks
              .filter((task) => condition(task))
              .map((task,i) => (
                <Task
                  key={task.id}
                  task={task}
                  onOpen={() => onOpen(task)}
                  onComplete={(isCompleted) => onComplete(task.id, isCompleted, 'today')}
                  lists={lists}
                  tags={tags}
                  isLast={i === allTasks.filter((task) => condition(task)).length - 1}
                />
              ))}
          </ul>
        )}
        {allTasks.filter((task) => condition(task)).length === 0 && (
          <div className='absolute top-1/2 flex w-full flex-col items-center justify-center gap-2'>
            <h2 className='text-2xl font-semibold text-text-secondary'>
              {activeTab === 'today'
                ? 'You have no tasks scheduled for today.'
                : activeTab === 'upcoming'
                ? "You don't have any upcoming tasks"
                : "You don't have any tasks in this list"}
            </h2>
            <p className=' font-medium text-text-tertiary'>Add a new task to get started</p>
          </div>
        )}
      </div>
    </>
  );
}
