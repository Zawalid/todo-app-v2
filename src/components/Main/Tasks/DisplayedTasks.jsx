import { AddTask } from './AddTask';
import { Task } from './Task';

export function DisplayedTasks({
  todayTasks,
  onAdd,
  onOpen,
  onComplete,
  lists,
  tags,
  condition,
  activeTab,
}) {
  return (
    <>
      <div className='relative h-full'>
        <div className='flex flex-1 items-center gap-3 rounded-xl border border-background-tertiary px-5 py-1'>
          <i className='fa-solid fa-plus text-xl text-text-tertiary'></i>
          <AddTask onAdd={onAdd} />
        </div>
        {todayTasks.filter((task) => condition(task)).length > 0 && (
          <ul className='mt-3 space-y-2 overflow-y-auto'>
            {todayTasks
              .filter((task) => condition(task))
              .map((task) => (
                <Task
                  key={task.id}
                  task={task}
                  onOpen={() => onOpen(task)}
                  onComplete={(isCompleted) => onComplete(task.id, isCompleted)}
                  lists={lists}
                  tags={tags}
                />
              ))}
          </ul>
        )}
        {todayTasks.filter((task) => condition(task)).length === 0 && (
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
