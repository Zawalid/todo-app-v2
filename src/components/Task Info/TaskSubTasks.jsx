import { AddTask } from '../Main/Tasks/AddTask';
import { SubTask } from './SubTask';

export function TaskSubTasks({
  taskSubtasks, handleAddSubTask, handleDeleteSubtask, handleEditSubtask, handleCompleteSubTask,
}) {
  return (
    <div className='mt-7 pb-5 flex-shrink-0 '>
      <h2 className='mb-4 text-xl font-bold text-text-secondary'>Subtasks:</h2>
      <div className='flex items-center gap-3 border-b border-background-tertiary px-3 py-1'>
        <i className='fa-solid fa-plus text-xl text-text-tertiary'></i>
        <AddTask onAdd={handleAddSubTask} />
      </div>
      <ul className='mt-3 max-h-[300px] overflow-y-auto space-y-2 px-3'>
        {taskSubtasks?.map((subtask) => (
          <SubTask
            key={subtask.id}
            title={subtask.title}
            onDelete={() => handleDeleteSubtask(subtask.id)}
            onEdit={(title) => handleEditSubtask(subtask.id, title)}
            isCompleted={subtask.isCompleted}
            onComplete={(isCompleted) => handleCompleteSubTask(subtask.id, isCompleted)} />
        ))}
      </ul>
    </div>
  );
}
