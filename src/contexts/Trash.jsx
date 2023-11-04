import { createContext, useEffect, useState } from 'react';
import { databases, appWriteConfig } from '../AppWrite';
import { ID } from 'appwrite';
import { remove$Properties } from '../utils/remove$Properties';
import { useTasks } from '../hooks/useTasks';
import { useLists } from '../hooks/useLists';
import { useStickyNotes } from '../hooks/useStickyNotes';
import { useTags } from '../hooks/useTags';

const {
  databaseId: DATABASE_ID,
  trashCollectionId: TRASH_COLLECTION_ID,
  tasksCollectionId,
  listsCollectionId,
  tagsCollectionId,
  stickyNotesCollectionId,
} = appWriteConfig;

export const TrashContext = createContext();

export function TrashProvider({ children, trash, setTrash }) {
  const [currentTab, setCurrentTab] = useState('tasks');
  const { tasks } = useTasks();
  const { lists } = useLists();
  const { tags } = useTags();
  const { stickyNotes } = useStickyNotes();

  const data = {
    tasks,
    lists,
    tags,
    stickyNotes,
  };

  async function createTrash() {
    const response = await databases.createDocument(
      DATABASE_ID,
      TRASH_COLLECTION_ID,
      ID.unique(),
      trash,
    );
    setTrash(response);
  }
  async function handleUpdateTrash(data) {
    remove$Properties(data);
    await databases.updateDocument(DATABASE_ID, TRASH_COLLECTION_ID, trash.$id, data);
    await getTrash();
  }
  async function handleAddToTrash(type, item) {
    const newTrash = { ...trash };
    newTrash[type] = [...newTrash[type], JSON.stringify(item)];
    await handleUpdateTrash(newTrash);
  }

  async function deleteElement(collectionId, itemId) {
    await databases.deleteDocument(DATABASE_ID, collectionId, itemId);
  }
  async function handleDeleteFromTrash(type, item) {
    const newTrash = { ...trash };
    (newTrash[type] = newTrash[type]
      .map((el) => JSON.parse(el))
      .filter((i) => i.id !== item.id)
      .map((el) => JSON.stringify(el))),
      await handleUpdateTrash(newTrash);

    // Delete the element permanently
    switch (type) {
      case 'tasks':
        await deleteElement(tasksCollectionId, item.id);
        break;
      case 'lists':
        await deleteElement(listsCollectionId, item.id);
        break;
      case 'tags':
        await deleteElement(tagsCollectionId, item.id);
        break;
      case 'stickyNotes':
        await deleteElement(stickyNotesCollectionId, item.id);
        break;
    }
  }
  async function restoreElement(collectionId, itemId) {
    await databases.updateDocument(DATABASE_ID, collectionId, itemId, {
      isTrashed: false,
    });
  }
  async function handleRestoreFromTrash(type, itemId) {
    await handleDeleteFromTrash(type, itemId);
    // Restore the element
    const element = data[type].find((el) => el.$id === itemId);
    if (!element) return;
    switch (type) {
      case 'tasks':
        await restoreElement(tasksCollectionId, itemId);
        break;
      case 'lists':
        await restoreElement(listsCollectionId, itemId);
        break;
      case 'tags':
        await restoreElement(tagsCollectionId, itemId);
        break;
      case 'stickyNotes':
        await restoreElement(stickyNotesCollectionId, itemId);
        break;
    }
  }
  async function handleEmptyType(type) {
    const newTrash = { ...trash, [type]: [] };
    await handleUpdateTrash(newTrash);
  }
  async function handleEmptyTrash() {
    await handleUpdateTrash({
      tasks: [],
      lists: [],
      tags: [],
      stickyNotes: [],
    });
  }

  async function getTrash() {
    const response = await databases.listDocuments(DATABASE_ID, TRASH_COLLECTION_ID);
    setTrash(response.documents[0]);
  }

  useEffect(() => {
    getTrash();
  }, []);

  return (
    <TrashContext.Provider
      value={{
        trash,
        currentTab,
        setCurrentTab,
        createTrash,
        handleAddToTrash,
        handleDeleteFromTrash,
        handleEmptyType,
        handleEmptyTrash,
        handleRestoreFromTrash,
      }}
    >
      {children}
    </TrashContext.Provider>
  );
}
