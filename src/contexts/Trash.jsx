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

  // To delete a (task, list, tag, stickyNote) permanently:
  async function deleteElement(type, itemId) {
    await databases.deleteDocument(DATABASE_ID, collectionsIds[type], itemId);
  }
  // To delete an item from trash:
  async function deleteItemFromTrash(type, itemId) {
    const newTrash = { ...trash };
    (newTrash[type] = newTrash[type]
      .map((el) => JSON.parse(el))
      .filter((i) => i.id !== itemId)
      .map((el) => JSON.stringify(el))),
      await handleUpdateTrash(newTrash);
  }
  // To delete an item from trash and the corresponding element permanently:
  async function handleDeleteFromTrash(type, itemId) {
    // Delete the element permanently
    await deleteElement(type, itemId);
    // Delete the element from trash
    await deleteItemFromTrash(type, itemId);
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
    await deleteItemFromTrash(type, itemId);
  }

  async function handleEmptyType(type) {
    // Delete all elements of a type permanently
    trash[type].forEach(async (item) => {
      const { id } = JSON.parse(item);
      await deleteElement(type, id);
    });
    // Delete all elements of a type from trash
    const newTrash = { ...trash, [type]: [] };
    await handleUpdateTrash(newTrash);
  }
  async function handleEmptyTrash() {
    // Delete all elements from trash permanently
    Object.keys(collectionsIds).forEach(async (type) => {
      trash[type].forEach(async (item) => {
        const { id } = JSON.parse(item);
        await deleteElement(type, id);
      });
    });
    // Delete all elements from trash
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
