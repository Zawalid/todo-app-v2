import { createContext, useEffect, useRef, useState } from 'react';
import { databases, appWriteConfig } from '../AppWrite';
import { ID } from 'appwrite';
import { checkIfToday, checkIfTomorrow, isDateInCurrentWeek } from '../utils/Moment';
import { remove$Properties } from '../utils/remove$Properties';
import { useLists } from '../hooks/useLists';
import { useDelete } from '../hooks/useDelete';
import { useGetAllElements } from '../hooks/useGetAllElements';
import { toast } from 'sonner';

const DATABASE_ID = appWriteConfig.databaseId;
const TASKS_COLLECTION_ID = appWriteConfig.tasksCollectionId;

export const TasksContext = createContext();

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([
    // {
    //   title: 'idk',
    //   note: '',
    //   dueDate: '',
    //   listId: '65424b5a69fab6f186d2',
    //   subtasks: [],
    //   isCompleted: false,
    //   tagsIds: [],
    //   priority: 0,
    //   index: 2,
    //   $id: '65419d00b10b220d3f93',
    //   $createdAt: '2023-11-01T00:34:08.726+00:00',
    //   $updatedAt: '2023-11-01T00:34:08.726+00:00',
    //   $permissions: [],
    //   $databaseId: '654169b1a5c05d9c1e7e',
    //   $collectionId: '65416a6c8f0a546d8b4b',
    // },
    // {
    //   title: 'maybe',
    //   note: '',
    //   dueDate: '',
    //   listId: '65424b5a69fab6f186d2',
    //   subtasks: [],
    //   isCompleted: false,
    //   tagsIds: [],
    //   priority: 0,
    //   index: 3,
    //   $id: '65419d4fbf5731854f09',
    //   $createdAt: '2023-11-01T00:35:27.784+00:00',
    //   $updatedAt: '2023-11-01T00:35:27.784+00:00',
    //   $permissions: [],
    //   $databaseId: '654169b1a5c05d9c1e7e',
    //   $collectionId: '65416a6c8f0a546d8b4b',
    // },
    // {
    //   title: 'hey',
    //   note: '',
    //   dueDate: '',
    //   listId: 'none',
    //   subtasks: [],
    //   isCompleted: false,
    //   tagsIds: [],
    //   priority: 0,
    //   index: 4,
    //   $id: '65419d80e7066538faa7',
    //   $createdAt: '2023-11-01T00:36:16.947+00:00',
    //   $updatedAt: '2023-11-01T00:36:16.947+00:00',
    //   $permissions: [],
    //   $databaseId: '654169b1a5c05d9c1e7e',
    //   $collectionId: '65416a6c8f0a546d8b4b',
    // },
    // {
    //   title: 'today',
    //   note: '',
    //   dueDate: '2023-11-02',
    //   listId: 'none',
    //   subtasks: [],
    //   isCompleted: false,
    //   tagsIds: [],
    //   priority: 0,
    //   index: 5,
    //   $id: '65419d89d260193ab4a5',
    //   $createdAt: '2023-11-01T00:36:25.862+00:00',
    //   $updatedAt: '2023-11-01T00:50:37.255+00:00',
    //   $permissions: [],
    //   $databaseId: '654169b1a5c05d9c1e7e',
    //   $collectionId: '65416a6c8f0a546d8b4b',
    // },
    // {
    //   title: 'tomorrow',
    //   note: '',
    //   dueDate: '2023-11-02',
    //   listId: 'none',
    //   subtasks: [],
    //   isCompleted: false,
    //   tagsIds: [],
    //   priority: 0,
    //   index: 6,
    //   $id: '65419deec89deef4e5a4',
    //   $createdAt: '2023-11-01T00:38:06.823+00:00',
    //   $updatedAt: '2023-11-01T00:38:06.823+00:00',
    //   $permissions: [],
    //   $databaseId: '654169b1a5c05d9c1e7e',
    //   $collectionId: '65416a6c8f0a546d8b4b',
    // },
  ]);
  const [currentTask, setCurrentTask] = useState(null);
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const addNewTaskReference = useRef(null);
  const { lists, handleAddTaskToList, handleUpdateList } = useLists();
  const { handleDeleteElement } = useDelete();
  const { handleGetAllElements } = useGetAllElements();

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
    try {
      setIsAddingTask(true);
      const response = await databases.createDocument(
        DATABASE_ID,
        TASKS_COLLECTION_ID,
        ID.unique(),
        task,
      );
      toast.success('Task added successfully!');
      setTasks((tasks) => [...tasks, response]);
      if (listId) {
        handleAddTaskToList(listId, response.$id);
      }
    } catch (err) {
      toast.error('Failed to add task!');
    } finally {
      setIsAddingTask(false);
    }
  }
  async function handleUpdateTask(id, task, isCompleted) {
    try {
      const updatedTask = isCompleted ? { ...task, isCompleted } : { ...task };
      remove$Properties(updatedTask);
      await databases.updateDocument(DATABASE_ID, TASKS_COLLECTION_ID, id, updatedTask);
      isCompleted ?? toast.success('Task updated successfully!');
    } catch (err) {
      toast.error('Failed to update task!');
    } finally {
      await handleGetAllElements(TASKS_COLLECTION_ID, setTasks);
    }
  }
  async function handleCompleteTask(id, task, isCompleted) {
    handleUpdateTask(id, task, isCompleted);
  }
  async function handleDeleteTask(id, listId, deletePermanently, isClearing) {
    try {
      await handleDeleteElement(
        id,
        TASKS_COLLECTION_ID,
        deletePermanently,
        'tasks',
        tasks,
        setTasks,
      );
      if (!isClearing) {
        toast.success('Task deleted successfully!');
      }
    } catch (err) {
      !isClearing && toast.error('Failed to delete task!');
    }
    // Remove the deleted task from the list it was in
    if (listId === 'none') return;
    const list = lists.find((list) => list.$id === listId);
    if (!list) return;
    const newTasks = list.tasks.filter((taskId) => taskId !== id);
    await handleUpdateList(listId, 'tasks', newTasks);
  }
  async function handleClearAllTasks(condition1, condition2, deletePermanently) {
    const id = toast.loading('Clearing tasks...');
    try {
      const deletedTasks = tasks.filter((task) => condition1(task) && condition2(task));
      deletedTasks.forEach(async (task) => {
        await handleDeleteTask(task.$id, null, deletePermanently, true);
      });

      await Promise.all(
        lists.map(async (list) => {
          const newTasks = list.tasks.filter(
            (taskId) => !deletedTasks.map((task) => task.$id).includes(taskId),
          );
          await handleUpdateList(list.$id, 'tasks', newTasks);
        }),
      );
      toast.success('Tasks cleared successfully!', { id });
    } catch (err) {
      toast.error('Failed to clear tasks!', { id });
    }
  }
  async function handleOpenTask(id) {
    if (id && currentTask?.$id !== id) {
      const response = await databases.getDocument(DATABASE_ID, TASKS_COLLECTION_ID, id);
      setCurrentTask(response);
    }
    id && setIsTaskOpen(true);
  }

  useEffect(() => {
    handleGetAllElements(TASKS_COLLECTION_ID, setTasks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        currentTask,
        todayTasks,
        tomorrowTasks,
        thisWeekTasks,
        upcomingTasks,
        isTaskOpen,
        isAddingTask,
        addNewTaskReference,
        handleAddTask,
        handleUpdateTask,
        handleDeleteTask,
        handleCompleteTask,
        handleClearAllTasks,
        handleOpenTask,
        setIsTaskOpen,
        setTasks,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}
