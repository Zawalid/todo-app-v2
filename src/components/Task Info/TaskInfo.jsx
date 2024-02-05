import { useEffect, useState } from 'react';
import { TaskTitleAndNote } from './TaskTitleAndNote';
import { TaskLists } from './TaskLists';
import { TaskDueDate } from './TaskDueDate';
import { TaskTags } from './TaskTags';
import { TaskSubTasks } from './TaskSubTasks/TaskSubTasks';
import { TaskPriority } from './TaskPriority';
import { useTasks } from '../../hooks/useTasks';
import Drawer from '../Common/Drawer';
import { copyToClipBoard, isTouchDevice } from '../../utils/helpers';
import { useHref } from 'react-router-dom';
import { useModal } from '../../hooks/useModal';
import { Actions } from './Actions';
import { Button } from '../Common/Button';
import { PiCheckBold, PiXBold } from 'react-icons/pi';

export function TaskInfo() {
  const {
    currentTask,
    isTaskOpen,
    setIsTaskOpen,
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask,
  } = useTasks();
  const [taskTitle, setTaskTitle] = useState();
  const [taskNote, setTaskNote] = useState();
  const [taskListId, setTaskListId] = useState('none');
  const [taskDueDate, setTaskDueDate] = useState();
  const [taskSubtasks, setTaskSubtasks] = useState();
  const [taskTagsIds, setTaskTagsIds] = useState();
  const [taskPriority, setTaskPriority] = useState(0);
  const [isChanged, setIsChanged] = useState(false);
  const activeTab = useHref().split('/app/')[1];
  const { openModal : confirmDelete  } = useModal();

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
      <div className='grid grid-cols-[auto_60px] items-center gap-5 pb-3'>
        <h2 className='truncate text-xl font-bold text-text-secondary'>
          {taskTitle ? taskTitle : 'Untitled'}
        </h2>
        {isTouchDevice() ? (
          <button
            className='flex h-7 w-7 items-center justify-center rounded-full bg-primary hover:bg-primary-hover'
            onClick={() => (isChanged ? handleSaveChanges() : setIsTaskOpen(false))}
            id='closeTaskInfo'
          >
            <PiCheckBold color='white' />
          </button>
        ) : (
          <div className='flex items-center gap-3'>
            <button
              className='icon-button not-active small absolute right-4 top-4'
              onClick={() => setIsTaskOpen(false)}
              id='closeTaskInfo'
            >
             <PiXBold />
            </button>
            <Actions
              date={{
                created: currentTask?.$createdAt,
                updated: currentTask?.$updatedAt,
              }}
              onCopy={() =>
                copyToClipBoard(
                  `Task Title: ${currentTask?.title}\n\nTask Note:\n${currentTask?.note}`,
                )
              }
              onDuplicate={() => {
                const task = {
                  title: `${currentTask?.title} (copy)`,
                  note: currentTask?.note,
                  dueDate: currentTask?.dueDate,
                  subtasks: currentTask?.subtasks,
                  tagsIds: currentTask?.tagsIds,
                  priority: currentTask?.priority,
                  listId: currentTask?.listId,
                };
                handleAddTask(task, true);
              }}
            />
          </div>
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
          <Button
            type='delete'
            className='flex-1'
            onClick={() =>
              confirmDelete({
                title: 'Delete Task',
                message: 'Are you sure you want to delete this task?',
                onConfirm: async () => handleDeleteTask(currentTask.$id),
              })
            }
          >
            Delete Task
          </Button>
          <Button disabled={!isChanged} className='flex-1' onClick={handleSaveChanges}>
            Save Changes
          </Button>
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
          className={` flex flex-col z-10 border bg-background-primary  transition-menu duration-500 lg:relative lg:rounded-xl lg:first-line:rounded-xl ${
            isTaskOpen
              ? 'fixed right-0 top-0 ml-3 h-full w-full items-stretch border-border p-4 shadow-md sm:w-[380px]'
              : 'w-0 items-center overflow-hidden  border-transparent p-0'
          }`}
          id='taskInfo'
        >
          {isTaskOpen && taskInfo}
        </aside>
      )}
    </>
  );
}
