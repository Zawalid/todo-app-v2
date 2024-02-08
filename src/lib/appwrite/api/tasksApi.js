import { appWriteConfig, databases, setPermissions } from '../config';
import { deleteDocument, getAll } from '../api';
import { ID } from 'appwrite';

const { databaseId, tasksCollectionId } = appWriteConfig;

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
