import { createContext, useEffect, useState } from 'react';
import { databases } from '../AppWrite';
import { ID } from 'appwrite';
import { checkIfToday, checkIfTomorrow, isDateInCurrentWeek } from '../utils/Moment';
import { remove$Properties } from '../utils/remove$Properties';

export const DATABASE_ID = '654169b1a5c05d9c1e7e';
export const TASKS_COLLECTION_ID = '65416a6c8f0a546d8b4b';

export const TasksContext = createContext();

export function TasksProvider({ children}) {
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

  async function handleAddTask( task) {
   
    const response = await databases.createDocument(
      DATABASE_ID,
      TASKS_COLLECTION_ID,
      ID.unique(),
      task,
    );
    setTasks((tasks) => [...tasks, response]);
  }
  async function handleUpdateTask(id, task, isCompleted) {
    const updatedTask = isCompleted ? { ...task, isCompleted } : { ...task };
    remove$Properties(updatedTask);
    await databases.updateDocument(DATABASE_ID, TASKS_COLLECTION_ID, id, updatedTask);
    await handleGetAllTasks();
  }
  async function handleCompleteTask(id, task, isCompleted) {
    handleUpdateTask(id, task, isCompleted);
  }
  async function handleDeleteTask(id) {
    await databases.deleteDocument(DATABASE_ID, TASKS_COLLECTION_ID, id);
    setTasks((tasks) => tasks.filter((idea) => idea.$id !== id));
  }
  async function handleClearAllTasks() {
    const response = await databases.listDocuments(DATABASE_ID, TASKS_COLLECTION_ID);
    response.documents.forEach(async (task) => {
      await databases.deleteDocument(DATABASE_ID, TASKS_COLLECTION_ID, task.$id);
    });
    setTasks([]);
  }
  async function handleOpenTask(id) {
    setCurrentTask(null);
    setIsTaskOpen(false);
    if (id) {
      const response = await databases.getDocument(DATABASE_ID, TASKS_COLLECTION_ID, id);
      setCurrentTask(response);
      setIsTaskOpen(true);
    }
  }
  async function handleGetAllTasks() {
    const response = await databases.listDocuments(DATABASE_ID, TASKS_COLLECTION_ID);
    setTasks(response.documents);
  }

  useEffect(() => {
    handleGetAllTasks();
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
        handleAddTask,
        handleUpdateTask,
        handleDeleteTask,
        handleCompleteTask,
        handleClearAllTasks,
        handleOpenTask,
        isTaskOpen,
        setIsTaskOpen,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}
