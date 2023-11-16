import { createContext, useRef, useState } from 'react';
import { ID } from 'appwrite';
import { databases, appWriteConfig, setPermissions } from '../AppWrite';
import { toast } from 'sonner';
import { checkIfToday, checkIfTomorrow, isDateInCurrentWeek } from '../utils/Moment';
import { remove$Properties } from '../utils/remove$Properties';
import { useLists, useDeleteElement, useLoadElements, useTrash, useUserAuth } from '../hooks';

const DATABASE_ID = appWriteConfig.databaseId;
const TASKS_COLLECTION_ID = appWriteConfig.tasksCollectionId;

// const SAMPLE_TASKS = [
//   {
//     title: 'idk',
//     note: '',
//     dueDate: '',
//     listId: '65424b5a69fab6f186d2',
//     subtasks: [],
//     isCompleted: false,
//     tagsIds: [],
//     priority: 0,
//     index: 2,
//     $id: '65419d00b10b220d3f93',
//     $createdAt: '2023-11-01T00:34:08.726+00:00',
//   },
//   {
//     title: 'maybe',
//     note: '',
//     dueDate: '',
//     listId: '65424b5a69fab6f186d2',
//     subtasks: [],
//     isCompleted: false,
//     tagsIds: [],
//     priority: 0,
//     index: 3,
//     $id: '65419d4fbf5731854f09',
//     $createdAt: '2023-11-01T00:35:27.784+00:00',
//   },
//   {
//     title: 'hey',
//     note: '',
//     dueDate: '',
//     listId: 'none',
//     subtasks: [],
//     isCompleted: false,
//     tagsIds: [],
//     priority: 0,
//     index: 4,
//     $id: '65419d80e7066538faa7',
//     $createdAt: '2023-11-01T00:36:16.947+00:00',
//   },
//   {
//     title: 'today',
//     note: '',
//     dueDate: '2023-11-02',
//     listId: 'none',
//     subtasks: [],
//     isCompleted: false,
//     tagsIds: [],
//     priority: 0,
//     index: 5,
//     $id: '65419d89d260193sab4a5',
//     $createdAt: '2023-11-01T00:36:25.862+00:00',
//   },
//   {
//     title: 'tomorrow',
//     note: '',
//     dueDate: '2023-11-02',
//     listId: 'none',
//     subtasks: [],
//     isCompleted: false,
//     tagsIds: [],
//     priority: 0,
//     index: 6,
//     $id: '65419deec89deeef4e5a4',
//     $createdAt: '2023-11-01T00:38:06.823+00:00',
//   },
//   {
//     title: 'today',
//     note: '',
//     dueDate: '2023-11-02',
//     listId: 'none',
//     subtasks: [],
//     isCompleted: false,
//     tagsIds: [],
//     priority: 0,
//     index: 5,
//     $id: '65419d89d260d193ab4a5',
//     $createdAt: '2023-11-01T00:36:25.862+00:00',
//   },
//   {
//     title: 'tomorrow',
//     note: '',
//     dueDate: '2023-11-02',
//     listId: 'none',
//     subtasks: [],
//     isCompleted: false,
//     tagsIds: [],
//     priority: 0,
//     index: 6,
//     $id: '65419deec89dqeef4e5a4',
//     $createdAt: '2023-11-01T00:38:06.823+00:00',
//   },
//   {
//     title: 'tomorrow',
//     note: '',
//     dueDate: '2023-11-02',
//     listId: 'none',
//     subtasks: [],
//     isCompleted: false,
//     tagsIds: [],
//     priority: 0,
//     index: 6,
//     $id: '65419deec89dweef4e5a4',
//     $createdAt: '2023-11-01T00:38:06.823+00:00',
//   },
//   {
//     title: 'tomorrow',
//     note: '',
//     dueDate: '2023-11-02',
//     listId: 'none',
//     subtasks: [],
//     isCompleted: false,
//     tagsIds: [],
//     priority: 0,
//     index: 6,
//     $id: '65419deec89deef4e5a4',
//     $createdAt: '2023-11-01T00:38:06.823+00:00',
//   },
//   {
//     title: 'tomorrow',
//     note: '',
//     dueDate: '2023-11-02',
//     listId: 'none',
//     subtasks: [],
//     isCompleted: false,
//     tagsIds: [],
//     priority: 0,
//     index: 6,
//     $id: '65419deec89desef4e5a4',
//     $createdAt: '2023-11-01T00:38:06.823+00:00',
//   },
// ];

export const TasksContext = createContext();

function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [isTasksLoading, setIsTasksLoading] = useState(true);
  const [currentTask, setCurrentTask] = useState(null);
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const addNewTaskReference = useRef(null);
  const { lists, handleAddTaskToList, handleUpdateList } = useLists();
  const { handleDeleteElement } = useDeleteElement();
  const { handleLoadElements } = useLoadElements();
  const { handleRestoreFromTrash } = useTrash();
  const { user } = useUserAuth();

  const todayTasks = tasks?.filter((task) => checkIfToday(task.dueDate));
  const tomorrowTasks = tasks?.filter((task) => checkIfTomorrow(task.dueDate));
  const thisWeekTasks = tasks?.filter((task) => {
    if (!task.dueDate) return;
    return isDateInCurrentWeek(task.dueDate);
  });
  const upcomingTasks = [
    ...todayTasks,
    ...tomorrowTasks,
    ...thisWeekTasks.filter((t) => ![...todayTasks, ...tomorrowTasks].includes(t)),
  ];

  async function handleAddTask(task, listId) {
    const toastId = toast.loading('Adding task...');
    try {
      setIsAddingTask(true);
      const response = await databases.createDocument(
        DATABASE_ID,
        TASKS_COLLECTION_ID,
        ID.unique(),
        {
          ...task,
          owner: user?.$id,
        },
        setPermissions(user?.$id),
      );
      toast.success('Task has been successfully added.', { id: toastId });
      setTasks((tasks) => [...tasks, response]);
      if (listId) {
        handleAddTaskToList(listId, response.$id);
      }
    } catch (err) {
      toast.error('Failed to add the task.', {
        id: toastId,
        action: {
          label: 'Try again',
          onClick: () => {
            handleAddTask(task, listId);
          },
        },
      });
    } finally {
      setIsAddingTask(false);
    }
  }
  async function handleUpdateTask(id, task, isCompleted) {
    const toastId = isCompleted ?? toast.loading('Updating task...');
    try {
      const updatedTask = isCompleted ? { ...task, isCompleted } : { ...task };
      remove$Properties(updatedTask);
      await databases.updateDocument(DATABASE_ID, TASKS_COLLECTION_ID, id, updatedTask);
      isCompleted ?? toast.success('Task has been successfully updated.', { id: toastId });
    } catch (err) {
      toast.error('Failed to update the task.', {
        id: toastId,
        action: {
          label: 'Try again',
          onClick: () => {
            handleUpdateTask(id, task, isCompleted);
          },
        },
      });
    } finally {
      await handleLoadElements(user, TASKS_COLLECTION_ID, setTasks);
    }
  }
  async function handleCompleteTask(id, task, isCompleted) {
    handleUpdateTask(id, task, isCompleted);
  }
  async function handleDeleteTask(id, listId, deletePermanently, isClearing) {
    console.log(listId);
    const toastId = isClearing ? null : toast.loading('Deleting task...');
    try {
      await handleDeleteElement(
        id,
        TASKS_COLLECTION_ID,
        deletePermanently,
        'tasks',
        tasks,
        setTasks,
      );
      // Remove the deleted task from the list it was in
      if (listId !== 'none') {
        const list = lists.find((list) => list.$id === listId);
        const newTasks = list.tasks.filter((taskId) => taskId !== id);
        await handleUpdateList(listId, 'tasks', newTasks);
      }

      if (!isClearing) {
        toast.success(getDeletionMessage('success', true), {
          id: toastId,
          action: deletePermanently
            ? null
            : {
                label: 'Undo',
                onClick: () => {
                  undoDelete(async () => handleRestoreFromTrash('tasks', id, true));
                },
              },
        });
      }
    } catch (err) {
      !isClearing &&
        toast.error(getDeletionMessage('error', true), {
          id: toastId,
          action: {
            label: 'Try again',
            onClick: () => {
              handleDeleteTask(id, listId, deletePermanently, isClearing);
            },
          },
        });
    }
  }
  async function handleClearAllTasks(condition1, condition2, deletePermanently) {
    const id = toast.loading('Clearing all tasks...');
    try {
      const deletedTasks = tasks.filter((task) => condition1(task) && condition2(task));

      for (const task of deletedTasks) {
        await handleDeleteTask(task.$id, task.listId, deletePermanently, true);
      }

      toast.success(getDeletionMessage('success', false, false), {
        id,
        action: deletePermanently
          ? null
          : {
              label: 'Undo',
              onClick: () => {
                undoDelete(async () => {
                  for (const task of deletedTasks) {
                    await handleRestoreFromTrash('tasks', task.$id, true);
                  }
                });
              },
            },
      });
    } catch (err) {
      toast.error(getDeletionMessage('error', false, false), {
        id,
        action: {
          label: 'Try again',
          onClick: () => {
            handleClearAllTasks(condition1, condition2, deletePermanently);
          },
        },
      });
    }
  }
  async function handleDeleteMultipleTasks(deletePermanently) {
    const id =
      selectedTasks.length === 1
        ? toast.loading(`Deleting task...`)
        : toast.loading(`Deleting ${selectedTasks.length} tasks...`);

    try {
      for (const task of selectedTasks) {
        await handleDeleteTask(task.$id, task.listId, deletePermanently, true);
      }
      toast.success(getDeletionMessage('success', false, true, selectedTasks.length), {
        id,
        action: deletePermanently
          ? null
          : {
              label: 'Undo',
              onClick: () => {
                undoDelete(async () => {
                  for (const task of selectedTasks) {
                    await handleRestoreFromTrash('tasks', task.$id, true);
                  }
                });
              },
            },
      });
    } catch (err) {
      toast.error(getDeletionMessage('error', false, true, selectedTasks.length), { id });
    }
  }

  async function handleOpenTask(id) {
    if (id) {
      const response = await databases.getDocument(DATABASE_ID, TASKS_COLLECTION_ID, id);
      setCurrentTask(response);
      setIsTaskOpen(true);
    }
  }
  async function undoDelete(fn) {
    await fn();
    await handleLoadElements(user, TASKS_COLLECTION_ID, setTasks);
  }

  return (
    <TasksContext.Provider
      value={{
        tasks,
        isTasksLoading,
        currentTask,
        todayTasks,
        tomorrowTasks,
        thisWeekTasks,
        upcomingTasks,
        selectedTasks,
        isTaskOpen,
        isAddingTask,
        addNewTaskReference,
        setIsTasksLoading,
        handleAddTask,
        handleUpdateTask,
        handleDeleteTask,
        handleCompleteTask,
        handleClearAllTasks,
        handleDeleteMultipleTasks,
        handleOpenTask,
        setIsTaskOpen,
        setTasks,
        setSelectedTasks,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

function getDeletionMessage(status, singular, selected, number) {
  if (status === 'success') {
    if ((selected && number === 1) || singular) return `Task has been successfully deleted.`;
    if (selected && number > 1) return `${number} tasks have been successfully deleted`;
    return `All tasks have been successfully cleared.`;
  }
  if (status === 'error') {
    if ((selected && number === 1) || singular) return `Failed to delete the task.`;
    if (selected && number > 1) return `Failed to delete the tasks.`;
    return `Failed to clear all tasks.`;
  }
}
export default TasksProvider;
