import { useAutoAnimate } from '@formkit/auto-animate/react';
import { AddTask } from '../../Main/Tasks/AddTask';
import { SubTask } from './SubTask';

export function TaskSubTasks({
  taskSubtasks, handleAddSubTask, handleDeleteSubtask, handleUpdateSubtask, handleCompleteSubTask,
}) {
  const [parent] = useAutoAnimate({
    duration: 500,
  });


  return (
    <div className='mt-7 pb-5 flex-shrink-0 '>
      <h2 className='mb-4 text-xl font-bold text-text-secondary'>Subtasks :</h2>
      <div className='flex items-center gap-3 border-b border-zinc-200 px-3 py-1'>
        <i className='fa-solid fa-plus text-xl text-text-tertiary'></i>
        <AddTask onAdd={handleAddSubTask} />
      </div>
      <ul className='mt-3 max-h-[300px] overflow-auto overflow-x-hidden space-y-2 px-3'
      ref={parent}
      >
        {taskSubtasks?.map((subtask) => (
          <SubTask
            key={subtask.id}
            title={subtask.title}
            onDelete={() => handleDeleteSubtask(subtask.id)}
            onEdit={(title) => handleUpdateSubtask(subtask.id, title)}
            isCompleted={subtask.isCompleted}
            onComplete={(isCompleted) => handleCompleteSubTask(subtask.id, isCompleted)} />
        ))}
      </ul>
    </div>
  );
}
