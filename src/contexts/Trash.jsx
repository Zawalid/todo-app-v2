import { createContext, useEffect, useState } from 'react';
import { databases, appWriteConfig } from '../AppWrite';
import { ID } from 'appwrite';
import { remove$Properties } from '../utils/remove$Properties';

const {
  databaseId: DATABASE_ID,
  trashCollectionId: TRASH_COLLECTION_ID,
  tasksCollectionId,
  listsCollectionId,
  tagsCollectionId,
  stickyNotesCollectionId,
} = appWriteConfig;

const collectionsIds = {
  tasks: tasksCollectionId,
  lists: listsCollectionId,
  tags: tagsCollectionId,
  stickyNotes: stickyNotesCollectionId,
};

export const TrashContext = createContext();

export function TrashProvider({ children, trash, setTrash }) {
  const [currentTab, setCurrentTab] = useState('tasks');
  const [isUpdated, setIsUpdated] = useState(false);

  async function createTrash() {
    const response = await databases.createDocument(
      DATABASE_ID,
      TRASH_COLLECTION_ID,
      ID.unique(),
      trash,
    );
    setTrash(response);
  }

  async function handleAddToTrash(type, item) {
    setTrash((trash) => {
      const newTrash = { ...trash };
      newTrash[type] = [...trash[type], JSON.stringify(item)];
      return newTrash;
    });
    setIsUpdated(true);
  }

  // To delete a (task, list, tag, stickyNote) permanently:
  async function deleteElement(type, itemId) {
    await databases.deleteDocument(DATABASE_ID, collectionsIds[type], itemId);
  }
  // To delete an item from trash:
  async function deleteItemFromTrash(type, itemId) {
    setTrash((trash) => {
      const newTrash = { ...trash };
      newTrash[type] = newTrash[type].filter((el) => JSON.parse(el).id !== itemId)
      return newTrash;
    });
    setIsUpdated(true);
  }
  // To delete an item from trash and the corresponding element permanently:
  async function handleDeleteFromTrash(type, itemId) {
    // Delete the element permanently
    await deleteElement(type, itemId);
    // Delete the element from trash
    deleteItemFromTrash(type, itemId);
  }
  // To update an element (task, list, tag, stickyNote) from trash (isTrashed: true)
  async function restoreElement(type, itemId) {
    await databases.updateDocument(DATABASE_ID, collectionsIds[type], itemId, {
      isTrashed: false,
    });
  }
  // To delete an item from trash and restore the corresponding element:
  async function handleRestoreFromTrash(type, itemId) {
    // Restore the element
    await restoreElement(type, itemId);
    // Delete the element from trash
    deleteItemFromTrash(type, itemId);
  }

  async function handleEmptyType(type) {
    // Delete all elements of a type permanently
    trash[type].forEach(async (item) => {
      await deleteElement(type, JSON.parse(item).id);
    });
    // Delete all elements of a type from trash
    setTrash((trash) => {
      const newTrash = { ...trash, [type]: [] };
      return newTrash;
    });
    setIsUpdated(true);
  }
  async function handleEmptyTrash() {
    // Delete all elements from trash permanently
    Object.keys(collectionsIds).forEach(async (type) => {
      trash[type].forEach(async (item) => {
        await deleteElement(type, JSON.parse(item).id);
      });
    });
    // Delete all elements from trash
    setTrash({
      ...trash,
      tasks: [],
      lists: [],
      tags: [],
      stickyNotes: [],
    });
    setIsUpdated(true);
  }

  // get trash from database
  useEffect(() => {
    async function getTrash() {
      const response = await databases.listDocuments(DATABASE_ID, TRASH_COLLECTION_ID);
      const trash = response.documents[0];
      setTrash(trash);
    }
    getTrash();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // update trash in database
  useEffect(() => {
    if ( isUpdated) {
      const newTrash = { ...trash };
      remove$Properties(newTrash);
      console.log(newTrash);
      databases.updateDocument(DATABASE_ID, TRASH_COLLECTION_ID, trash.$id, newTrash);
      setIsUpdated(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trash]);
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
