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

// account.listSessions().then((r) => console.log(r));

// {
//   "$id": "6552647d3b423436f8a2",
//   "$createdAt": "2023-11-13T18:01:33.447+00:00",
//   "userId": "6551599e67fb2adfc908",
//   "expire": "2024-11-12T18:01:33.447+00:00",
//   "provider": "email",
//   "providerUid": "walid.zakan@gmail.com",
//   "providerAccessToken": "",
//   "providerAccessTokenExpiry": "",
//   "providerRefreshToken": "",
//   "ip": "196.75.103.59",
//   "osCode": "WIN",
//   "osName": "Windows",
//   "osVersion": "10",
//   "clientType": "browser",
//   "clientCode": "YA",
//   "clientName": "Yandex Browser",
//   "clientVersion": "23.9",
//   "clientEngine": "Blink",
//   "clientEngineVersion": "116.0.5845.837",
//   "deviceName": "desktop",
//   "deviceBrand": "",
//   "deviceModel": "",
//   "countryCode": "ma",
//   "countryName": "Morocco",
//   "current": false
// }