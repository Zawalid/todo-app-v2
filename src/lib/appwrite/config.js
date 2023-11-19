import { Client, Databases, Account, Avatars, Permission, Role } from 'appwrite';

export const appWriteConfig = {
  endpoint: import.meta.env.VITE_ENDPOINT,
  projectId: import.meta.env.VITE_PROJECT_ID,
  databaseId: import.meta.env.VITE_DATABASE_ID,
  tasksCollectionId: import.meta.env.VITE_TASKS_COLLECTION_ID,
  listsCollectionId: import.meta.env.VITE_LISTS_COLLECTION_ID,
  tagsCollectionId: import.meta.env.VITE_TAGS_COLLECTION_ID,
  stickyNotesCollectionId: import.meta.env.VITE_STICKY_NOTES_COLLECTION_ID,
  trashCollectionId: import.meta.env.VITE_TRASH_COLLECTION_ID,
  usersCollectionId: import.meta.env.VITE_USERS_COLLECTION_ID,
};
const client = new Client();
client.setEndpoint(appWriteConfig.endpoint).setProject(appWriteConfig.projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const avatars = new Avatars(client);

export function setPermissions(userId) {
  return [
    Permission.read(Role.user(userId)),
    Permission.update(Role.user(userId)),
    Permission.delete(Role.user(userId)),
  ];
}

