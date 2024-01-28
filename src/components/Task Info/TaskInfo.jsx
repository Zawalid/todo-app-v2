import { useEffect, useState } from 'react';
import { TaskTitleAndNote } from './TaskTitleAndNote';
import { TaskLists } from './TaskLists';
import { TaskDueDate } from './TaskDueDate';
import { TaskTags } from './TaskTags';
import { TaskSubTasks } from './TaskSubTasks/TaskSubTasks';
import { TaskPriority } from './TaskPriority';
import { useTasks } from '../../hooks/useTasks';
import Drawer from '../Common/Drawer';
import { useDeleteTask } from '../Main/Tasks/useDeleteTask';
import { isTouchDevice } from '../../utils/helpers';
import { useHref } from 'react-router-dom';

export function TaskInfo() {
  const { currentTask, isTaskOpen, setIsTaskOpen, handleUpdateTask } = useTasks();
  const [taskTitle, setTaskTitle] = useState();
  const [taskNote, setTaskNote] = useState();
  const [taskListId, setTaskListId] = useState('none');
  const [taskDueDate, setTaskDueDate] = useState();
  const [taskSubtasks, setTaskSubtasks] = useState();
  const [taskTagsIds, setTaskTagsIds] = useState();
  const [taskPriority, setTaskPriority] = useState(0);
  const [isChanged, setIsChanged] = useState(false);
  const { Modal, openModal } = useDeleteTask(currentTask?.$id);
  const activeTab = useHref().split('/app/')[1];

  useEffect(() => {
    setIsTaskOpen(false);
  }, [activeTab, setIsTaskOpen]);

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
        title: taskTitle.trim() ? taskTitle : 'Untitled',
        note: taskNote,
        listId: taskListId,
        dueDate: taskDueDate,
        subtasks: taskSubtasks.map((el) => JSON.stringify(el)),
        tagsIds: taskTagsIds,
        priority: taskPriority,
      };
      setIsTaskOpen(false);
      handleUpdateTask(currentTask.$id, editedTask);
    }
  }
  const taskInfo = (
    <>
      <div className='grid grid-cols-[auto_40px] items-center gap-5 pb-3'>
        <h2 className='truncate text-xl font-bold text-text-secondary'>
          {taskTitle ? taskTitle : 'Untitled'}
        </h2>
        {isTouchDevice() ? (
          <button
            onClick={() => (isChanged ? handleSaveChanges() : setIsTaskOpen(false))}
            id='closeTaskInfo'
          >
            <i className='fa-solid fa-circle-check text-3xl text-primary hover:text-primary-hover '></i>
          </button>
        ) : (
          <button onClick={() => setIsTaskOpen(false)} id='closeTaskInfo'>
            <i className='fa-solid fa-xmark  text-xl text-text-secondary'></i>
          </button>
        )}
      </div>
      <div className='overflow-y-auto pr-3'>
        <TaskTitleAndNote
          {...{
            taskTitle,
            setTaskTitle,
            taskNote,
            setTaskNote,
          }}
        />
        <div className='grid grid-cols-[1fr_2fr] items-center justify-items-end gap-x-5 space-y-2'>
          <TaskLists taskListId={taskListId} setTaskListId={setTaskListId} />
          <TaskDueDate taskDueDate={taskDueDate} setTaskDueDate={setTaskDueDate} />
          <TaskTags
            taskTagsIds={taskTagsIds}
            handleAddTagToTask={handleAddTagToTask}
            handleDeleteTagFromTask={handleDeleteTagFromTask}
          />
          <TaskPriority taskPriority={taskPriority} setTaskPriority={setTaskPriority} />
        </div>
        <TaskSubTasks
          taskSubtasks={taskSubtasks}
          handleAddSubTask={handleAddSubTask}
          handleDeleteSubtask={handleDeleteSubtask}
          handleUpdateSubtask={handleUpdateSubtask}
          handleCompleteSubTask={handleCompleteSubTask}
        />
      </div>
      {!isTouchDevice() && (
        <div className='mt-auto flex gap-3 pt-3'>
          <button
            className='flex-1 cursor-pointer rounded-lg bg-red-500 py-2 text-center text-sm font-semibold text-white hover:bg-red-600'
            onClick={openModal}
          >
            Delete Task
          </button>
          <button
            className={
              'flex-1 rounded-lg border  py-2 text-center  text-sm font-semibold ' +
              (isChanged
                ? 'cursor-pointer border-primary bg-primary text-white hover:bg-primary-hover '
                : 'bg-background-disabled text-text-disabled cursor-not-allowed border-border')
            }
            onClick={handleSaveChanges}
          >
            Save Changes
          </button>
        </div>
      )}
    </>
  );
  return (
    <>
      {isTaskOpen && isTouchDevice() && (
        <Drawer onClose={() => setIsTaskOpen(false)}>{taskInfo}</Drawer>
      )}

      {!isTouchDevice() && (
        <aside
          className={`ml-auto lg:rounded-xl flex flex-col bg-background-primary transition-[width,opacity] duration-500 lg:relative lg:first-line:rounded-xl ${
            isTaskOpen
              ? 'fixed right-0 top-0 z-10 h-full w-full items-stretch  border border-border  p-4 shadow-md sm:w-[380px]'
              : 'w-0 items-center overflow-hidden  p-0'
          }`}
          id='taskInfo'
        >
          {isTaskOpen && taskInfo}
        </aside>
      )}

      {Modal}
    </>
  );
}
