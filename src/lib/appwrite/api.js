import { ID, Query } from 'appwrite';
import { appWriteConfig, avatars, databases, setPermissions, storage } from './config';

const {
  imagesStorageId,
  databaseId,
  tasksCollectionId,
  listsCollectionId,
  tagsCollectionId,
  stickyNotesCollectionId,
  trashCollectionId,
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

export async function getAll(documentId, userId) {
  const res = await databases.listDocuments(databaseId, documentId, [
    Query.equal('owner', [userId]),
    Query.equal('isTrashed', [false]),
    Query.limit(300),
  ]);
  return res?.documents;
}

export async function deleteDocument(collectionId, documentId, deletePermanently) {
  if (deletePermanently)
    return await databases.deleteDocument(databaseId, collectionId, documentId);
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
}

export const updateList = async ({ id, list }) => {
  const res = await databases.updateDocument(databaseId, listsCollectionId, id, list);
  return res;
}

export const deleteList = async ({ id, deletePermanently }) => {
  deleteDocument(listsCollectionId, id, deletePermanently);
}

