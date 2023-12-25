import { useEffect, useRef, useState } from 'react';
import { TaskTitleAndNote } from './TaskTitleAndNote';
import { TaskLists } from './TaskLists';
import { TaskDueDate } from './TaskDueDate/TaskDueDate';
import { TaskTags } from './TaskTags/TaskTags';
import { TaskSubTasks } from './TaskSubTasks/TaskSubTasks';
import { ConfirmationModal } from '../Common/ConfirmationModal';
import { TaskPriority } from './TaskPriority';
import { useTasks } from '../../hooks/useTasks';

export function TaskInfo() {
  const { currentTask, isTaskOpen, setIsTaskOpen, handleUpdateTask, handleDeleteTask } = useTasks();
  const [taskTitle, setTaskTitle] = useState();
  const [taskNote, setTaskNote] = useState();
  const [taskListId, setTaskListId] = useState('none');
  const [taskDueDate, setTaskDueDate] = useState();
  const [taskSubtasks, setTaskSubtasks] = useState();
  const [taskTagsIds, setTaskTagsIds] = useState();
  const [taskPriority, setTaskPriority] = useState(0);
  const [isChanged, setIsChanged] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePermanently, setDeletePermanently] = useState(false);
  const tagsDropDown = useRef(null);
  const tagsDropDownToggler = useRef(null);

  useEffect(() => {
    if (isTaskOpen) {
      setTaskTitle(currentTask?.title);
      setTaskNote(currentTask?.note);
      setTaskListId(currentTask?.listId);
      setTaskDueDate(currentTask?.dueDate);
      setTaskSubtasks(currentTask?.subtasks.map((el) => JSON.parse(el)));
      setTaskTagsIds(currentTask?.tagsIds);
      setTaskPriority(currentTask?.priority);
    } else {
      setTaskTitle('');
      setTaskNote('');
      setTaskListId('');
      setTaskDueDate('');
      setTaskSubtasks([]);
      setTaskTagsIds([]);
      setTaskPriority(0);
    }
  }, [currentTask, isTaskOpen]);
  useEffect(() => {
    if (isTaskOpen)
      currentTask?.title?.trim() !== taskTitle?.trim() ||
      currentTask?.note?.trim() !== taskNote?.trim() ||
      currentTask?.listId !== taskListId ||
      currentTask?.dueDate !== taskDueDate ||
      currentTask?.subtasks?.length !== taskSubtasks?.length ||
      currentTask?.subtasks
        .map((el) => JSON.parse(el))
        .some((subtask, index) => {
          return (
            subtask.title !== taskSubtasks[index].title ||
            subtask.isCompleted !== taskSubtasks[index].isCompleted
          );
        }) ||
      currentTask?.tagsIds?.length !== taskTagsIds?.length ||
      currentTask?.tagsIds.some((tagId, index) => tagId !== taskTagsIds[index]) ||
      currentTask?.priority !== taskPriority
        ? setIsChanged(true)
        : setIsChanged(false);
  }, [
    isTaskOpen,
    currentTask,
    taskTitle,
    taskNote,
    taskListId,
    taskDueDate,
    taskSubtasks,
    taskTagsIds,
    taskPriority,
  ]);
  useEffect(() => {
    function handleClickOutside(event) {
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
  function handleUpdateSubtask(id, title) {
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
      return prev.includes(tagId) ? prev : [...prev, tagId];
    });
  }
  function handleDeleteTagFromTask(tagId) {
    setTaskTagsIds((prev) => prev.filter((id) => id !== tagId));
  }
  function handleSaveChanges() {
    if (isChanged) {
      const editedTask = {
        ...currentTask,
        title: taskTitle.trim() ? taskTitle : 'Untitled Task',
        note: taskNote,
        listId: taskListId,
        dueDate: taskDueDate,
        subtasks: taskSubtasks.map((el) => JSON.stringify(el)), //cause appWrite takes only stings
        tagsIds: taskTagsIds,
        priority: taskPriority,
      };
      setIsTaskOpen(false);
      handleUpdateTask(currentTask.$id, editedTask);
    }
  }
  return (
    <aside
      className={
        'lg:relative ml-auto flex flex-col rounded-l-xl transition-[width,opacity] duration-500 ' +
        (isTaskOpen
          ? 'fixed right-0 top-0 z-10 h-full sm:w-1/2 w-full items-stretch bg-background-secondary p-4  lg:w-[30%]'
          : 'w-0 items-center bg-background-primary p-0')
      }
      id='taskInfo'
    >
      {isTaskOpen && (
        <>
          <div className='flex items-center justify-between pb-3'>
            <h2 className='text-xl font-bold text-text-secondary'>Task :</h2>
            <button onClick={() => setIsTaskOpen(false)} id='closeTaskInfo'>
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
            <div className='gap-x-5 grid grid-cols-[1fr_2fr] items-center space-y-2'>
              <TaskLists taskListId={taskListId} setTaskListId={setTaskListId} />
              <TaskDueDate taskDueDate={taskDueDate} setTaskDueDate={setTaskDueDate} />
              <TaskTags
                {...{
                  taskTagsIds,
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
                handleUpdateSubtask,
                handleCompleteSubTask,
              }}
            />
          </div>
          <div className='mt-auto flex gap-3 pt-3'>
            <button
              className='flex-1 cursor-pointer rounded-lg border  border-zinc-200 bg-red-500 py-2 text-center text-sm font-semibold text-background-secondary transition-colors duration-300 hover:bg-red-600'
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Delete Task
            </button>
            <button
              className={
                'flex-1 rounded-lg border border-zinc-200 py-2 text-center  text-sm font-semibold transition-colors duration-500 ' +
                (isChanged
                  ? 'cursor-pointer bg-indigo-600 text-background-secondary hover:bg-indigo-500 '
                  : 'cursor-not-allowed bg-background-tertiary text-text-tertiary')
              }
              onClick={handleSaveChanges}
            >
              Save Changes
            </button>
          </div>
        </>
      )}
      {isDeleteModalOpen && (
        <ConfirmationModal
          sentence='Are you sure you want to delete this task?'
          confirmText='Delete'
          onConfirm={() => {
            setIsDeleteModalOpen(false);
            handleDeleteTask(currentTask.$id, deletePermanently);
          }}
          onCancel={() => setIsDeleteModalOpen(false)}
          element='Task'
          checked={deletePermanently}
          setChecked={setDeletePermanently}
        />
      )}
    </aside>
  );
}
