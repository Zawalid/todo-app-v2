import { createContext, useEffect, useState } from 'react';
import { databases } from '../AppWrite';
import { ID } from 'appwrite';

export const DATABASE_ID = '654169b1a5c05d9c1e7e';
export const TASKS_COLLECTION_ID = '65416a6c8f0a546d8b4b';

export const TasksContext = createContext();

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [isTaskOpen, setIsTaskOpen] = useState(false);

  async function handleAddTask(title, dueDate, listId) {
    const newTask = {
      title,
      note: '',
      dueDate: dueDate || '',
      listId: listId || 'none',
      subtasks: [],
      isCompleted: false,
      tagsIds: [],
      priority: 0,
      index: tasks.length,
    };
    const response = await databases.createDocument(
      DATABASE_ID,
      TASKS_COLLECTION_ID,
      ID.unique(),
      newTask,
    );
    setTasks((tasks) => [...tasks, response].slice(0, 10));
  }
  async function handleEditTask(id, task) {
    const updatedTask = { ...task };
    remove$Properties(updatedTask);
    await databases.updateDocument(DATABASE_ID, TASKS_COLLECTION_ID, id, updatedTask);
    await handleGetAllTasks();
  }
  async function handleCompleteTask(id, task, isCompleted) {
    const updatedTask = { ...task, isCompleted };
    remove$Properties(updatedTask);
    await databases.updateDocument(DATABASE_ID, TASKS_COLLECTION_ID, id, updatedTask);
    await handleGetAllTasks();
  }
  async function handleDeleteTask(id) {
    await databases.deleteDocument(DATABASE_ID, TASKS_COLLECTION_ID, id);
    setTasks((tasks) => tasks.filter((idea) => idea.$id !== id));
    await handleGetAllTasks();
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
        handleAddTask,
        handleEditTask,
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

function remove$Properties(updatedTask) {
  for (let prop in updatedTask) {
    if (prop.startsWith('$')) {
      delete updatedTask[prop];
    }
  }
}
