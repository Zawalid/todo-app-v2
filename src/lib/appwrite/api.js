import { ID, Query } from 'appwrite';
import { appWriteConfig, avatars, databases, setPermissions, storage } from './config';

const {
  imagesStorageId,
  databaseId,
  tasksCollectionId,
  listsCollectionId,
  tagsCollectionId,
  stickyNotesCollectionId,
} = appWriteConfig;

export async function handleUploadFile(file) {
  try {
    const res = await storage.createFile(imagesStorageId, ID.unique(), file);
    const url = await storage.getFileDownload(imagesStorageId, res.$id);
    return {
      id: res.$id,
      url: url.href,
    };
  } catch (error) {
    console.log(error);
  }
}

export async function handleDeleteFile(id) {
  try {
    await storage.deleteFile(imagesStorageId, id);
  } catch (error) {
    console.log(error);
  }
}

export async function getInitialsAvatar(name) {
  try {
    const avatarUrl = avatars.getInitials(name);
    return avatarUrl.href;
  } catch (error) {
    console.log(error);
  }
}

export async function getAll(collectionId, userId, trashed = false) {
  const res = await databases.listDocuments(databaseId, collectionId, [
    Query.equal('owner', [userId]),
    Query.equal('isTrashed', [trashed]),
    Query.limit(300),
  ]);
  return res?.documents;
}

export async function deleteDocument(collectionId, documentId, deletePermanently) {
  if (deletePermanently) {
    return await databases.deleteDocument(databaseId, collectionId, documentId);
  }
  return await databases.updateDocument(databaseId, collectionId, documentId, { isTrashed: true });
}

//* ------- Tasks Api ------- *//

export const getTasks = async (userId) => await getAll(tasksCollectionId, userId);

export const addTask = async ({ task, owner }) => {
  const res = await databases.createDocument(
    databaseId,
    tasksCollectionId,
    ID.unique(),
    { ...task, owner },
    setPermissions(owner),
  );
  return res;
};

export const updateTask = async ({ id, task }) => {
  const res = await databases.updateDocument(databaseId, tasksCollectionId, id, task);
  return res;
};

export const deleteTask = async ({ id, deletePermanently }) => {
  deleteDocument(tasksCollectionId, id, deletePermanently);
};

export const deleteTasks = async ({ deleted, deletePermanently }) => {
  deleted.forEach((id) => deleteTask({ id, deletePermanently }));
};

//* ------- Lists Api ------- *//

export const getLists = async (userId) => await getAll(listsCollectionId, userId);

export const addList = async ({ list, owner }) => {
  const res = await databases.createDocument(
    databaseId,
    listsCollectionId,
    ID.unique(),
    { ...list, owner },
    setPermissions(owner),
  );
  return res;
};

export const updateList = async ({ id, list }) => {
  const res = await databases.updateDocument(databaseId, listsCollectionId, id, list);
  return res;
};

export const deleteList = async ({ id, deletePermanently }) => {
  deleteDocument(listsCollectionId, id, deletePermanently);
};

// * ------- Tags Api ------- *//

export const getTags = async (userId) => await getAll(tagsCollectionId, userId);

export const addTag = async ({ tag, owner }) => {
  const res = await databases.createDocument(
    databaseId,
    tagsCollectionId,
    ID.unique(),
    { ...tag, owner },
    setPermissions(owner),
  );
  return res;
};

export const deleteTag = async ({ id, deletePermanently }) => {
  deleteDocument(tagsCollectionId, id, deletePermanently);
};

// * ------- Sticky Notes Api ------- *//

export const getStickyNotes = async (userId) => await getAll(stickyNotesCollectionId, userId);

export const getStickyNoteById = async (id) => {
  const res = await databases.getDocument(databaseId, stickyNotesCollectionId, id);
  return res;
};

export const addStickyNote = async ({ stickyNote, owner }) => {
  const res = await databases.createDocument(
    databaseId,
    stickyNotesCollectionId,
    ID.unique(),
    { ...stickyNote, owner },
    setPermissions(owner),
  );
  return res;
};

export const updateStickyNote = async ({ id, stickyNote }) => {
  const res = await databases.updateDocument(databaseId, stickyNotesCollectionId, id, stickyNote);
  return res;
};

export const deleteStickyNote = async ({ id, deletePermanently }) => {
  deleteDocument(stickyNotesCollectionId, id, deletePermanently);
};

export const deleteStickyNotes = async ({ deleted, deletePermanently }) => {
  deleted.forEach((id) => deleteStickyNote({ id, deletePermanently }));
};

// * ------- Trash Api ------- *//

// Get trashed items
export const getTrashedTasks = async (userId) => await getAll(tasksCollectionId, userId, true);
export const getTrashedLists = async (userId) => await getAll(listsCollectionId, userId, true);
export const getTrashedTags = async (userId) => await getAll(tagsCollectionId, userId, true);
export const getTrashedStickyNotes = async (userId) =>
  await getAll(stickyNotesCollectionId, userId, true);

// Restore trashed items
export const restoreTask = async ({ id }) => await updateTask({ id, task: { isTrashed: false } });
export const restoreList = async ({ id }) => await updateList({ id, task: { isTrashed: false } });
export const restoreTag = async ({ id }) => {
  const res = await databases.updateDocument(databaseId, tagsCollectionId, id, {
    isTrashed: false,
  });
  return res;
};

export const restoreStickyNote = async ({ id }) =>
  await updateStickyNote({ id, task: { isTrashed: false } });

// Delete trashed items permanently
export const deleteTaskPermanently = async ({ id }) => {
  await deleteTask({ id, deletePermanently: true });
};
export const deleteListPermanently = async ({ id }) => {
  await deleteList({ id, deletePermanently: true });
};
export const deleteTagPermanently = async ({ id }) =>
  await deleteTag({ id, deletePermanently: true });
export const deleteStickyNotePermanently = async ({ id }) => {
  await deleteStickyNote({ id, deletePermanently: true });
};
