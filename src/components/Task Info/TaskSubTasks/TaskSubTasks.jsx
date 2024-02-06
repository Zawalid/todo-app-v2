import { useAutoAnimate } from '../../../hooks/useAutoAnimate';
import { AddTask } from '../../Main/Tasks/Task Components/AddTask';
import { SubTask } from './SubTask';

export function TaskSubTasks({
  taskSubtasks,
  handleAddSubTask,
  handleDeleteSubtask,
  handleUpdateSubtask,
  handleCompleteSubTask,
}) {
  const [parent] = useAutoAnimate({
    duration: 500,
  });

  return (
    <div className='mt-7 flex-shrink-0 pb-5 '>
      <h2 className='mb-4 text-xl font-bold text-text-secondary'>Subtasks :</h2>

      <AddTask onAdd={handleAddSubTask} className='' />

      <ul
        className='mt-3 max-h-[300px] space-y-2 overflow-auto overflow-x-hidden px-3'
        ref={parent}
      >
        {taskSubtasks?.map((subtask) => (
          <SubTask
            key={subtask.id}
            title={subtask.title}
            onDelete={() => handleDeleteSubtask(subtask.id)}
            onEdit={(title) => handleUpdateSubtask(subtask.id, title)}
            isCompleted={subtask.isCompleted}
            onComplete={(isCompleted) => handleCompleteSubTask(subtask.id, isCompleted)}
          />
        ))}
      </ul>
    </div>
  );
}
