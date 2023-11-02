import { createContext, useEffect } from 'react';
import { databases } from '../AppWrite';
import { ID } from 'appwrite';
import { remove$Properties } from '../utils/remove$Properties';
import { useTasks } from '../hooks/useTasks';

export const DATABASE_ID = '654169b1a5c05d9c1e7e';
export const LISTS_COLLECTION_ID = '65422c65a17f95378d53';

export const ListsContext = createContext();

export function ListsProvider({ children, lists, setLists }) {
  const { handleAddTask, tasks } = useTasks();

  async function handleAddList(title, color, list, id) {
    const newList = list
      ? list
      : {
          title,
          color,
          tasks: [],
          number: 0,
          index: lists.length,
        };
    const response = await databases.createDocument(
      DATABASE_ID,
      LISTS_COLLECTION_ID,
      id ? id : ID.unique(),
      newList,
    );
    setLists((lists) => [...lists, response]);
  }
  async function handleUpdateList(id, list, property, value) {
    const updatedList = {
      ...list,
      [property]: Array.isArray(value) ? Array.from(value) : value,
    };
    remove$Properties(updatedList);
    console.log(list)
    console.log(updatedList)
    const res = await databases.updateDocument(DATABASE_ID, LISTS_COLLECTION_ID, id, updatedList);
    console.log(res);
    await handleGetAllLists();
  }
  async function handleRenameList(id, list, title) {
    handleUpdateList(id, list, 'title', title);
  }
  async function handleChangeListColor(id, list, color) {
    handleUpdateList(id, list, 'color', color);
  }
  async function handleAddTaskToList(listId, task) {
    if (!listId) return;
    const list = lists.find((l) => l.$id === listId);
    const newTasks = [...list.tasks, task]
    handleUpdateList(listId, list, 'tasks', newTasks);
  }
  async function handleDuplicateList(id) {
    const listToDuplicate = lists.find((list) => list.$id === id);
    handleUpdateList(id, listToDuplicate, 'number', listToDuplicate.number + 1);

    const duplicatedListId = ID.unique();
    const newListTasks = listToDuplicate.tasks.map((task) => {
      return {
        ...task,
        listId: duplicatedListId,
        index: tasks.length,
      };
    });
    const duplicatedList = {
      ...listToDuplicate,
      title: `${listToDuplicate.title}   (${listToDuplicate.number})`,
      tasks: newListTasks,
      number: 0,
      index: lists.length,
    };
    handleAddList(null, null, duplicatedList, duplicatedListId);
    newListTasks.forEach((task) => {
      handleAddTask(task);
    });
  }
  async function handleDeleteList(id) {
    setLists((Lists) => Lists.filter((list) => list.$id !== id));
    await databases.deleteDocument(DATABASE_ID, LISTS_COLLECTION_ID, id);
  }
  async function handleGetAllLists() {
    const response = await databases.listDocuments(DATABASE_ID, LISTS_COLLECTION_ID);
    setLists(response.documents);
  }

  useEffect(() => {
    handleGetAllLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ListsContext.Provider
      value={{
        lists,
        handleAddList,
        handleUpdateList,
        handleDeleteList,
        handleRenameList,
        handleChangeListColor,
        handleAddTaskToList,
        handleDuplicateList,
      }}
    >
      {children}
    </ListsContext.Provider>
  );
}
