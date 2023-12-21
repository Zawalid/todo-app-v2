import { createContext, useRef, useState } from 'react';
import { ID } from 'appwrite';
import { databases, appWriteConfig, setPermissions } from '../lib/appwrite/config';
import { toast } from 'sonner';
import { checkIfToday, checkIfTomorrow, isDateInCurrentWeek } from '../utils/Moment';
import { remove$Properties } from '../utils/helpers';
import { useDeleteElement, useLoadElements, useTrash, useUser } from '../hooks';

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
  const { handleDeleteElement } = useDeleteElement();
  const { handleLoadElements } = useLoadElements();
  const { handleRestoreFromTrash } = useTrash();
  const { user } = useUser();
  const [currentProcessedTask, setCurrentProcessedTask] = useState(null);

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

  async function handleAddTask(task) {
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
        loading: 'Adding task...',
        success: (task) => {
          setTasks((tasks) => [...tasks, task]);
          return 'Task has been successfully added.';
        },
        error: () => {
          toast.dismiss(toastId);
          toast.error('Failed to add the task.', {
            action: {
              label: 'Try again',
              onClick: async () => {
                await handleAddTask(task);
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
    const updatedTask = { ...task };
    remove$Properties(updatedTask);
    const toastId = toast.promise(
      databases.updateDocument(DATABASE_ID, TASKS_COLLECTION_ID, id, updatedTask),
      {
        loading: 'Updating task...',
        success: (updatedTask) => {
          setTasks((tasks) => tasks.map((task) => (task.$id === id ? updatedTask : task)));
          return 'Task has been successfully updated.';
        },
        error: () => {
          toast.dismiss(toastId);
          toast.error('Failed to update the task.', {
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
    try {
      await databases.updateDocument(DATABASE_ID, TASKS_COLLECTION_ID, id, {
        isCompleted,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDeleteTask(id, deletePermanently) {
    if (currentProcessedTask === id) return;
    setCurrentProcessedTask(id);
    setIsTaskOpen(false);
    const toastId = toast.promise(
      handleDeleteElement(id, TASKS_COLLECTION_ID, deletePermanently, 'tasks', tasks, setTasks),
      {
        loading: 'Deleting task...',
        success: () => {
          toast.dismiss(toastId);
          toast.success(getDeletionMessage('success', true), {
            action: deletePermanently
              ? null
              : {
                  label: 'Undo',
                  onClick: () => {
                    undoDelete(async () => handleRestoreFromTrash('tasks', id, true));
                  },
                },
          });
        },
        error: () => {
          toast.dismiss(toastId);
          toast.error(getDeletionMessage('error', true), {
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

  async function handleClearAllTasks(condition1, condition2, deletePermanently) {
    setCurrentProcessedTask('multiple');
    setIsTaskOpen(false);
    const deletedTasks = tasks.filter((task) => condition1(task) && condition2(task));

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
        loading: 'Clearing all tasks...',
        success: () => {
          toast.dismiss(toastId);
          toast.success(getDeletionMessage('success', false, false), {
            action: deletePermanently
              ? null
              : {
                  label: 'Undo',
                  onClick: () => {
                    undoDelete(async () => {
                      await Promise.all(
                        deletedTasks.map((task) => handleRestoreFromTrash('tasks', task.$id, true)),
                      );
                    });
                  },
                },
          });
        },
        error: () => {
          toast.dismiss(toastId);
          toast.error(getDeletionMessage('error', false, false), {
            action: {
              label: 'Try again',
              onClick: () => {
                handleClearAllTasks(condition1, condition2, deletePermanently);
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
    setIsTaskOpen(false);
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
          toast.dismiss(toastId);
          toast.success(getDeletionMessage('success', false, true, selectedTasks.length), {
            action: deletePermanently
              ? null
              : {
                  label: 'Undo',
                  onClick: () => {
                    undoDelete(async () => {
                      await Promise.all(
                        selectedTasks.map((task) =>
                          handleRestoreFromTrash('tasks', task.$id, true),
                        ),
                      );
                    });
                  },
                },
          });
        },
        error: () => {
          toast.dismiss(toastId);
          toast.error(getDeletionMessage('error', false, true, selectedTasks.length), {
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

  async function handleOpenTask(id) {
    if (currentProcessedTask === id || currentProcessedTask === 'multiple') return;
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
