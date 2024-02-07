import { useEffect, useState } from 'react';
import _ from 'lodash';
import { TaskTitleAndNote } from './TaskTitleAndNote';
import { TaskLists } from './TaskLists';
import { TaskDueDate } from './TaskDueDate';
import { TaskTags } from './TaskTags';
import { TaskSubTasks } from './TaskSubTasks/TaskSubTasks';
import { TaskPriority } from './TaskPriority';
import Drawer from '../Common/Drawer';
import { copyToClipBoard, isTouchDevice } from '../../utils/helpers';
import { useHref, useNavigate, useParams } from 'react-router-dom';
import { useModal } from '../../hooks/useModal';
import { Actions } from './Actions';
import { Button } from '../Common/Button';
import { PiCheckBold, PiXBold } from 'react-icons/pi';
import { useTasks } from '../../lib/react-query/queries';
import { SpinnerLoader } from '../Common/SpinnerLoader';

const emptyInfo = {
  taskTitle: '',
  taskNote: '',
  taskListId: '',
  taskDueDate: '',
  taskSubtasks: '',
  taskTagsIds: '',
  taskPriority: '',
};

export function TaskInfo() {
  const { taskId } = useParams();
  const { tasks, isLoading, isError, error } = useTasks();
  const { handleAddTask, handleUpdateTask, handleDeleteTask } = useTasks();
  const currentTask = tasks?.find((task) => task.$id === taskId);

  const [taskInfo, setTaskInfo] = useState(emptyInfo);

  const [isChanged, setIsChanged] = useState(false);
  const { openModal: confirmDelete } = useModal();
  const currentTab = useHref().split('/')[2];
  const navigate = useNavigate();

  const { taskTitle, taskNote, taskListId, taskDueDate, taskTagsIds, taskPriority, taskSubtasks } =
    taskInfo;

  useEffect(() => {
    taskId
      ? setTaskInfo({
          taskTitle: currentTask?.title || '',
          taskNote: currentTask?.note || '',
          taskListId: currentTask?.listId || '',
          taskDueDate: currentTask?.dueDate || '',
          taskSubtasks: currentTask?.subtasks?.map((el) => JSON.parse(el)) || [],
          taskTagsIds: currentTask?.tagsIds || [],
          taskPriority: currentTask?.priority || 0,
        })
      : setTaskInfo(emptyInfo);
  }, [taskId, currentTask]);

  useEffect(() => {
    if (taskId) {
      const currentTaskCopy = {
        title: currentTask?.title?.trim(),
        note: currentTask?.note?.trim(),
        listId: currentTask?.listId,
        dueDate: currentTask?.dueDate,
        subtasks: currentTask?.subtasks?.map((el) => JSON.parse(el)),
        tagsIds: currentTask?.tagsIds,
        priority: currentTask?.priority,
      };

      const newTask = {
        title: taskTitle?.trim(),
        note: taskNote?.trim(),
        listId: taskListId,
        dueDate: taskDueDate,
        subtasks: taskSubtasks,
        tagsIds: taskTagsIds,
        priority: taskPriority,
      };

      setIsChanged(!_.isEqual(currentTaskCopy, newTask));
    }
  }, [
    taskId,
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
    setTaskInfo((prev) => ({ ...prev, taskSubtasks: [...prev.taskSubtasks, newSubtask] }));
  }
  function handleUpdateSubtask(id, title) {
    const newSubtasks = taskSubtasks
      .map((subtask) => (subtask.id === id ? { ...subtask, title } : subtask))
      .filter((subtask) => subtask.title !== '');
    setTaskInfo((prev) => ({ ...prev, taskSubtasks: newSubtasks }));
  }
  function handleDeleteSubtask(id) {
    const newSubtasks = taskSubtasks.filter((subtask) => subtask.id !== id);
    setTaskInfo((prev) => ({ ...prev, taskSubtasks: newSubtasks }));
  }
  function handleCompleteSubTask(id, isCompleted) {
    const newSubtasks = taskSubtasks.map((subtask) =>
      subtask.id === id ? { ...subtask, isCompleted } : subtask,
    );
    setTaskInfo((prev) => ({ ...prev, taskSubtasks: newSubtasks }));
  }
  function handleAddTagToTask(tagId) {
    setTaskInfo((prev) => ({ ...prev, taskTagsIds: [...prev.taskTagsIds, tagId] }));
  }
  function handleDeleteTagFromTask(tagId) {
    setTaskInfo((prev) => ({
      ...prev,
      taskTagsIds: prev.taskTagsIds.filter((id) => id !== tagId),
    }));
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
      // setIsTaskOpen(false);
      handleUpdateTask(currentTask.$id, editedTask);
    }
  }

  const render = () => {
    if (!taskId) return null;
    if (isLoading)
      return (
        <div className='relative h-full'>
          <SpinnerLoader />
        </div>
      );
    if (isError) return <div>Error: {error.message}</div>;
    return (
      <>
        <div className='grid grid-cols-[auto_60px] items-center gap-5 pb-3'>
          <h2 className='truncate text-xl font-bold text-text-secondary'>
            {taskTitle ? taskTitle : 'Untitled'}
          </h2>
          {isTouchDevice() ? (
            <button
              className='flex h-7 w-7 items-center justify-center rounded-full bg-primary hover:bg-primary-hover'
              onClick={() => (isChanged ? handleSaveChanges() : navigate(currentTab))}
              id='closeTaskInfo'
            >
              <PiCheckBold color='white' />
            </button>
          ) : (
            <div className='flex items-center gap-3'>
              <button
                className='icon-button not-active small absolute right-4 top-4'
                onClick={() => navigate(currentTab)}
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
            taskTitle={taskTitle}
            setTaskTitle={(taskTitle) => setTaskInfo((prev) => ({ ...prev, taskTitle }))}
            taskNote={taskNote}
            setTaskNote={(taskNote) => setTaskInfo((prev) => ({ ...prev, taskNote }))}
          />

          <div className='grid grid-cols-[1fr_2fr] items-center justify-items-end gap-x-5 space-y-2'>
            <TaskLists
              taskListId={taskListId}
              setTaskListId={(taskListId) => setTaskInfo((prev) => ({ ...prev, taskListId }))}
            />
            <TaskDueDate
              taskDueDate={taskDueDate}
              setTaskDueDate={(taskDueDate) => setTaskInfo((prev) => ({ ...prev, taskDueDate }))}
            />
            <TaskTags
              taskTagsIds={taskTagsIds}
              handleAddTagToTask={handleAddTagToTask}
              handleDeleteTagFromTask={handleDeleteTagFromTask}
            />
            <TaskPriority
              taskPriority={taskPriority}
              setTaskPriority={(taskPriority) => setTaskInfo((prev) => ({ ...prev, taskPriority }))}
            />
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
  };

  // if (!taskId) return null;
  // if (isLoading) return <div>Loading...</div>;
  // if (isError) return <div>Error: {error.message}</div>;

  return (
    <>
      {taskId && isTouchDevice() && (
        <Drawer onClose={() => navigate(currentTab)}>{render()}</Drawer>
      )}

      {!isTouchDevice() && (
        <aside
          className={`fixed z-10 flex flex-col border bg-background-primary  transition-menu duration-500 lg:relative lg:rounded-xl lg:first-line:rounded-xl ${
            taskId
              ? ' right-0 top-0 ml-3 h-full w-full items-stretch border-border p-4 shadow-md sm:w-[380px]'
              : 'w-0 items-center overflow-hidden  border-transparent p-0'
          }`}
          id='taskInfo'
        >
          {render()}
        </aside>
      )}
    </>
  );
}
