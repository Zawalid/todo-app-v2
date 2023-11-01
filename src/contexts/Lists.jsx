import { createContext, useEffect, useState } from 'react';
import { databases } from '../AppWrite';
import { ID } from 'appwrite';
import { remove$Properties } from '../utils/remove$Properties';

export const DATABASE_ID = '654169b1a5c05d9c1e7e';
export const LISTS_COLLECTION_ID = '65422c65a17f95378d53';

export const ListsContext = createContext();

export function ListsProvider({ children }) {
  const [lists, setLists] = useState([
    {
      title: 'Personal',
      color: '#ff6b6b',
      tasks: [],
      number: 0,
      index: 3,
      $id: '65424b5a69fab6f186d2',
      $createdAt: '2023-11-01T12:58:02.435+00:00',
      $updatedAt: '2023-11-01T12:58:02.435+00:00',
      $permissions: [],
      $databaseId: '654169b1a5c05d9c1e7e',
      $collectionId: '65422c65a17f95378d53',
    },
    {
      title: 'Work',
      color: '#fffebe',
      tasks: [],
      number: 0,
      index: 4,
      $id: '65424b881a6f20cec5cd',
      $createdAt: '2023-11-01T12:58:48.109+00:00',
      $updatedAt: '2023-11-01T12:58:48.109+00:00',
      $permissions: [],
      $databaseId: '654169b1a5c05d9c1e7e',
      $collectionId: '65422c65a17f95378d53',
    },
    {
      title: 'no',
      color: '#ff6b6b',
      tasks: [],
      number: 0,
      index: 5,
      $id: '65424b9f1451b234e086',
      $createdAt: '2023-11-01T12:59:11.084+00:00',
      $updatedAt: '2023-11-01T12:59:11.084+00:00',
      $permissions: [],
      $databaseId: '654169b1a5c05d9c1e7e',
      $collectionId: '65422c65a17f95378d53',
    },
    {
      title: 'no',
      color: '#ff6b6b',
      tasks: [],
      number: 0,
      index: 5,
      $id: '65424ba9dcf2f29e1ca9',
      $createdAt: '2023-11-01T12:59:21.993+00:00',
      $updatedAt: '2023-11-01T12:59:21.993+00:00',
      $permissions: [],
      $databaseId: '654169b1a5c05d9c1e7e',
      $collectionId: '65422c65a17f95378d53',
    },
  ]);

  async function handleAddList(title, color) {
    const newList = {
      title,
      color,
      tasks: [],
      number: 0,
      index: lists.length,
    };
    const response = await databases.createDocument(
      DATABASE_ID,
      LISTS_COLLECTION_ID,
      ID.unique(),
      newList,
    );
    setLists((lists) => [...lists, response]);
  }
  async function handleAddTasksToList(listId, task) {
    if (!listId) return;
    const newLists = lists
      .map((list) => {
        const tasks = list.tasks.filter((t) => t.id !== task.id);
        return { ...list, tasks };
      })
      .map((list) => {
        return list.id === +listId ? { ...list, tasks: [...list.tasks, task] } : list;
      });
    setLists(newLists);
  }
  async function handleUpdateList(id, list, property, value) {
    const updatedList = { ...list, [property]: value };
    remove$Properties(updatedList);
    await databases.updateDocument(DATABASE_ID, LISTS_COLLECTION_ID, id, updatedList);
    await handleGetAllLists();
  }
  async function handleRenameList(id, list, title) {
    handleUpdateList(id, list, 'title', title);
  }
  async function handleChangeListColor(id, list, color) {
    handleUpdateList(id, list, 'color', color);
  }
  //   async function handleDuplicateList(id) {
  //     const listToDuplicate = lists.find((list) => list.id === id);
  //     handleUpdateList(id, listToDuplicate, 'number', listToDuplicate.number + 1);

  //     const newListId = ID.unique();
  //     const tasks = [] //fix
  //     const newListTasks = listToDuplicate.tasks.map((task) => {
  //       return {
  //         ...task,
  //         id: Math.random(),
  //         listId: newListId,
  //         index: tasks.length,
  //       };
  //     });
      // const duplicatedList = {
      //   ...listToDuplicate,
      //   id: newListId,
      //   title: `${listToDuplicate.title}   (${listToDuplicate.number})`,
      //   tasks: newListTasks,
      //   number: 0,
      //   index: lists.length,
      // };
      // setLists((prev) => [...prev, duplicatedList]);
  //   }
  async function handleDeleteList(id) {
    setLists((Lists) => Lists.filter((idea) => idea.$id !== id));
    await databases.deleteDocument(DATABASE_ID, LISTS_COLLECTION_ID, id);
  }
  async function handleGetAllLists() {
    const response = await databases.listDocuments(DATABASE_ID, LISTS_COLLECTION_ID);
    setLists(response.documents);
  }

  useEffect(() => {
    handleGetAllLists();
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
        handleAddTasksToList,
      }}
    >
      {children}
    </ListsContext.Provider>
  );
}
