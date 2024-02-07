import { ID, Query } from 'appwrite';
import { appWriteConfig, avatars, databases, storage } from './config';

const { imagesStorageId, databaseId } = appWriteConfig;

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


export async function getAll(documentId,userId) {
  return await databases.listDocuments(databaseId, documentId, [
    Query.equal('owner', [userId]),
    Query.equal('isTrashed', [false]),
    Query.limit(300),
  ]);
}