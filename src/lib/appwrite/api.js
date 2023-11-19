import { ID } from 'appwrite';
import { appWriteConfig, avatars, storage } from './config';

export async function handleUploadFile(file) {
  try {
    const res = await storage.createFile(appWriteConfig.imagesStorageId, ID.unique(), file);
    const url = await storage.getFileDownload(appWriteConfig.imagesStorageId, res.$id);
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
    await storage.deleteFile(appWriteConfig.imagesStorageId, id);
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
