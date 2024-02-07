import { createContext, useState } from 'react';
import { ID } from 'appwrite';
import { databases, appWriteConfig, setPermissions } from '../lib/appwrite/config';
import { toast } from 'sonner';
import { checkIfToday, checkIfTomorrow, isDateInCurrentWeek } from '../utils/Dates';
import { useDeleteElement } from '../hooks';
import { getDeletionMessage } from '../utils/helpers';
import { useSelector } from 'react-redux';

const DATABASE_ID = appWriteConfig.databaseId;
const TASKS_COLLECTION_ID = appWriteConfig.tasksCollectionId;

import completedSoundFile from '../assets/completed.mp3';
import { useDeleteSound } from '../hooks/useDeleteSound';
const completedSound = new Audio(completedSoundFile);

export const TasksContext = createContext();

export default function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [isTasksLoading, setIsTasksLoading] = useState(true);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const { handleDeleteElement } = useDeleteElement();
  const [currentProcessedTask, setCurrentProcessedTask] = useState(null);
  const user = useSelector((state) => state.user.user);
  const {
    preferences: { taskCompletionSound },
    dateAndTime: { weekStartsOn },
    tasks: { autoDeleteCompletedTasks, deletePermanently: autoDeletePermanently },
  } = useSelector((state) => state.settings.general);
  const playDeleteSound = useDeleteSound();

  const todayTasks = tasks?.filter((task) => checkIfToday(task.dueDate));
  const tomorrowTasks = tasks?.filter((task) => checkIfTomorrow(task.dueDate));
  const thisWeekTasks = tasks?.filter((task) => {
    if (!task.dueDate) return;
    return isDateInCurrentWeek(task.dueDate, weekStartsOn);
  });
  const upcomingTasks = [
    ...todayTasks,
    ...tomorrowTasks,
    ...thisWeekTasks.filter((t) => ![...todayTasks, ...tomorrowTasks].includes(t)),
  ];

  async function handleAddTask(task, duplicate) {
    setIsAddingTask(true);
    const toastId = toast.promise(
      databases.createDocument(
        DATABASE_ID,
        TASKS_COLLECTION_ID,
        ID.unique(),
        {
          ...task,
          owner: user?.$id,
        },
        setPermissions(user?.$id),
      ),
      {
        loading: duplicate ? 'Duplicating task...' : 'Adding task...',
        success: (task) => {
          setTasks((tasks) => [...tasks, task]);
          return `Task has been successfully ${duplicate ? 'duplicated' : 'added'}.`;
        },
        error: () => {
          toast.dismiss(toastId);
          toast.error(`Failed to ${duplicate ? 'duplicate' : 'add'} the task.`, {
            duration: 4000,
            action: {
              label: 'Try again',
              onClick: async () => {
                await handleAddTask(task, duplicate);
              },
            },
          });
        },
        finally: () => setIsAddingTask(false),
      },
    );
  }

  async function handleUpdateTask(id, task) {
    if (currentProcessedTask === id) return;
    setCurrentProcessedTask(id);
    const toastId = toast.promise(
      databases.updateDocument(DATABASE_ID, TASKS_COLLECTION_ID, id, task),
      {
        loading: 'Updating task...',
        success: (updatedTask) => {
          setTasks((tasks) => tasks.map((task) => (task.$id === id ? updatedTask : task)));
          return 'Task has been successfully updated.';
        },
        error: () => {
          toast.dismiss(toastId);
          toast.error('Failed to update the task.', {
            duration: 4000,
            action: {
              label: 'Try again',
              onClick: async () => {
                await handleUpdateTask(id, task);
              },
            },
          });
        },
        finally: () => setCurrentProcessedTask(null),
      },
    );
  }

  async function handleCompleteTask(id, isCompleted) {
    if (taskCompletionSound && isCompleted) completedSound.play();
    try {
      setTasks((tasks) => tasks.map((task) => (task.$id === id ? { ...task, isCompleted } : task)));
      await databases.updateDocument(DATABASE_ID, TASKS_COLLECTION_ID, id, {
        isCompleted,
      });
      if (autoDeleteCompletedTasks && isCompleted) handleDeleteTask(id, autoDeletePermanently);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDeleteTask(id, deletePermanently) {
    if (currentProcessedTask === id) return;
    setCurrentProcessedTask(id);
    const toastId = toast.promise(
      handleDeleteElement(id, TASKS_COLLECTION_ID, deletePermanently, 'tasks', tasks, setTasks),
      {
        loading: 'Deleting task...',
        success: () => {
          playDeleteSound();
          return getDeletionMessage('task', 'success', true);
        },
        error: () => {
          toast.dismiss(toastId);
          toast.error(getDeletionMessage('task', 'error', true), {
            duration: 4000,
            action: {
              label: 'Try again',
              onClick: () => {
                handleDeleteTask(id, deletePermanently);
              },
            },
          });
        },
        finally: () => setCurrentProcessedTask(null),
      },
    );
  }

  async function handleDeleteAllTasks(deletedTasks, deletePermanently) {
    setCurrentProcessedTask('multiple');

    const toastId = toast.promise(
      Promise.all(
        deletedTasks.map((task) =>
          handleDeleteElement(
            task.$id,
            TASKS_COLLECTION_ID,
            deletePermanently,
            'tasks',
            tasks,
            setTasks,
          ),
        ),
      ),
      {
        loading: 'Deleting all tasks...',
        success: () => {
          playDeleteSound();
          return getDeletionMessage('task', 'success', false, false);
        },
        error: () => {
          toast.dismiss(toastId);
          toast.error(getDeletionMessage('task', 'error', false, false), {
            duration: 4000,
            action: {
              label: 'Try again',
              onClick: () => {
                handleDeleteAllTasks(deletedTasks, deletePermanently);
              },
            },
          });
        },
        finally: () => setCurrentProcessedTask(null),
      },
    );
  }

  async function handleDeleteMultipleTasks(deletePermanently) {
    setCurrentProcessedTask('multiple');
    const toastId = toast.promise(
      Promise.all(
        selectedTasks.map((task) =>
          handleDeleteElement(
            task.$id,
            TASKS_COLLECTION_ID,
            deletePermanently,
            'tasks',
            tasks,
            setTasks,
          ),
        ),
      ),
      {
        loading:
          selectedTasks.length === 1
            ? 'Deleting task...'
            : `Deleting ${selectedTasks.length} tasks...`,
        success: () => {
          playDeleteSound();
          return getDeletionMessage('task', 'success', false, true, selectedTasks.length);
        },
        error: () => {
          toast.dismiss(toastId);
          toast.error(getDeletionMessage('task', 'error', false, true, selectedTasks.length), {
            duration: 4000,
            action: {
              label: 'Try again',
              onClick: () => {
                handleDeleteMultipleTasks(deletePermanently);
              },
            },
          });
        },
        finally: () => setCurrentProcessedTask(null),
      },
    );
  }

  return (
    <TasksContext.Provider
      value={{
        tasks,
        isTasksLoading,
        todayTasks,
        tomorrowTasks,
        thisWeekTasks,
        upcomingTasks,
        selectedTasks,
        isAddingTask,
        setIsTasksLoading,
        handleAddTask,
        handleUpdateTask,
        handleDeleteTask,
        handleCompleteTask,
        handleDeleteAllTasks,
        handleDeleteMultipleTasks,
        setTasks,
        setSelectedTasks,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}
