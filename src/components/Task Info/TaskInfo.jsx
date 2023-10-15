import { useEffect, useRef, useState } from 'react';
import { TaskTitleAndNote } from './TaskTitleAndNote';
import { TaskLists } from './TaskLists';
import { TaskDueDate } from './TaskDueDate/TaskDueDate';
import { TaskTags } from './TaskTags';
import { TaskSubTasks } from './TaskSubTasks';
import { ConfirmationModal } from './ConfirmationModal';
import { TaskPriority } from './TaskPriority';

export function TaskInfo({ isOpen, onClose, task, onEdit, onDelete, lists, onSelectList, tags }) {
  const [taskTitle, setTaskTitle] = useState();
  const [taskNote, setTaskNote] = useState();
  const [taskListId, setTaskListId] = useState('none');
  const [taskDueDate, setTaskDueDate] = useState();
  const [taskSubtasks, setTaskSubtasks] = useState();
  const [taskTagsIds, setTaskTagsIds] = useState();
  const [taskPriority, setTaskPriority] = useState(0);
  const [isSelectTagOpen, setIsSelectTagOpen] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const tagsDropDown = useRef(null);
  const tagsDropDownToggler = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTaskTitle(task?.title);
      setTaskNote(task?.note);
      setTaskListId(task?.listId);
      setTaskDueDate(task?.dueDate);
      setTaskSubtasks(task?.subtasks);
      setTaskTagsIds(task?.tagsIds);
      setTaskPriority(task?.priority);
    } else {
      setTaskTitle('');
      setTaskNote('');
      setTaskListId('');
      setTaskDueDate('');
      setTaskSubtasks([]);
      setTaskTagsIds([]);
      setTaskPriority(0);
    }
  }, [task, isOpen]);
  useEffect(() => {
    if (isOpen)
      task?.title?.trim() !== taskTitle?.trim() ||
      task?.note?.trim() !== taskNote?.trim() ||
      task?.listId !== taskListId ||
      task?.dueDate !== taskDueDate ||
      task?.subtasks?.length !== taskSubtasks?.length ||
      task?.subtasks.some((subtask, index) => {
        return (
          subtask.title !== taskSubtasks[index].title ||
          subtask.isCompleted !== taskSubtasks[index].isCompleted
        );
      }) ||
      task?.tagsIds?.length !== taskTagsIds?.length ||
      task?.tagsIds.some((tagId, index) => tagId !== taskTagsIds[index]) ||
      task?.priority !== taskPriority
        ? setIsChanged(true)
        : setIsChanged(false);
  }, [isOpen, task, taskTitle, taskNote, taskListId, taskDueDate, taskSubtasks, taskTagsIds,taskPriority]);
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        tagsDropDown.current &&
        !tagsDropDown.current.contains(event.target) &&
        tagsDropDownToggler.current &&
        !tagsDropDownToggler.current.contains(event.target)
      ) {
        setIsSelectTagOpen(false);
      }
      if (tagsDropDown.current && tagsDropDown.current.contains(event.target)) {
        const id = event.target.dataset.id;
        id && handleAddTagToTask(id);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [tagsDropDown]);

  function handleAddSubTask(title) {
    const newSubtask = {
      id: Math.random(),
      title,
      isCompleted: false,
    };
    setTaskSubtasks((prev) => [...prev, newSubtask]);
  }
  function handleSaveChanges() {
    if (isChanged) {
      const editedTask = {
        ...task,
        title: taskTitle.trim() ? taskTitle : 'Untitled Task',
        note: taskNote,
        listId: taskListId,
        dueDate: taskDueDate,
        subtasks: taskSubtasks,
        tagsIds: taskTagsIds,
        priority: taskPriority,
      };
      onEdit(editedTask, task.period);
      onSelectList(taskListId, editedTask);
    }
  }
  function handleEditSubtask(id, title) {
    const newSubtasks = taskSubtasks
      .map((subtask) => (subtask.id === id ? { ...subtask, title } : subtask))
      .filter((subtask) => subtask.title !== '');
    setTaskSubtasks(newSubtasks);
  }
  function handleDeleteSubtask(id) {
    const newSubtasks = taskSubtasks.filter((subtask) => subtask.id !== id);
    setTaskSubtasks(newSubtasks);
  }
  function handleCompleteSubTask(id, isCompleted) {
    const newSubtasks = taskSubtasks.map((subtask) =>
      subtask.id === id ? { ...subtask, isCompleted } : subtask,
    );
    setTaskSubtasks(newSubtasks);
  }
  function handleAddTagToTask(tagId) {
    setTaskTagsIds((prev) => {
      return prev.includes(+tagId) ? prev : [...prev, +tagId];
    });
  }
  function handleDeleteTagFromTask(tagId) {
    setTaskTagsIds((prev) => prev.filter((id) => id !== tagId));
  }
  return (
    <aside
      className={
        'relative ml-auto flex flex-col rounded-l-xl transition-[width] duration-500 ' +
        (isOpen
          ? 'w-[30%] items-stretch bg-background-secondary  p-4'
          : 'w-0 items-center bg-background-primary p-0')
      }
    >
      {isDeleteModalOpen && (
        <ConfirmationModal
          onDelete={() => {
            onDelete(task.id, task.period);
            setIsDeleteModalOpen(false);
          }}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      )}
      {isOpen && (
        <>
          <div className='flex items-center justify-between pb-3'>
            <h2 className='text-xl font-bold text-text-secondary'>Task :</h2>
            <button onClick={onClose}>
              <i className='fa-solid fa-xmark cursor-pointer text-xl text-text-secondary'></i>
            </button>
          </div>
          <div className='overflow-y-auto'>
            <TaskTitleAndNote
              {...{
                taskTitle,
                setTaskTitle,
                taskNote,
                setTaskNote,
              }}
            />
            <div className='grid grid-cols-[1fr_3fr] items-center space-y-2'>
              <TaskLists taskListId={taskListId} setTaskListId={setTaskListId} lists={lists} />
              <TaskDueDate taskDueDate={taskDueDate} setTaskDueDate={setTaskDueDate} />
              <TaskTags
                {...{
                  taskTagsIds,
                  tags,
                  isSelectTagOpen,
                  setIsSelectTagOpen,
                  tagsDropDown,
                  tagsDropDownToggler,
                  handleDeleteTagFromTask,
                }}
              />
              <TaskPriority taskPriority={taskPriority} setTaskPriority={setTaskPriority} />
            </div>
            <TaskSubTasks
              {...{
                taskSubtasks,
                handleAddSubTask,
                handleDeleteSubtask,
                handleEditSubtask,
                handleCompleteSubTask,
              }}
            />
          </div>
          <div className='mt-auto flex gap-3 pt-3'>
            <button
              className='flex-1 cursor-pointer rounded-lg border border-background-tertiary bg-red-500 py-2 text-center text-sm font-semibold text-background-secondary'
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Delete Task
            </button>
            <button
              className={
                'flex-1 rounded-lg border border-background-tertiary py-2 text-center  text-sm font-semibold transition-colors duration-500 ' +
                (isChanged
                  ? 'cursor-pointer bg-indigo-500 text-background-secondary '
                  : 'cursor-not-allowed bg-background-tertiary text-text-tertiary')
              }
              onClick={handleSaveChanges}
            >
              Save Changes
            </button>
          </div>
        </>
      )}
    </aside>
  );
}
