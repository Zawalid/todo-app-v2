import { appWriteConfig, databases } from '../config';
import { getAll } from '../api';

const { databaseId, tasksCollectionId } = appWriteConfig;

export const getTasks = async (userId) => await getAll(tasksCollectionId, userId);

export const getTask = async (taskId) =>
  await databases.getDocument(databaseId, tasksCollectionId, taskId);
    