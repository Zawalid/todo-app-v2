import { createContext, useState } from 'react';
import { databases, appWriteConfig } from '../AppWrite';
import { ID } from 'appwrite';

const DATABASE_ID = appWriteConfig.databaseId;
const TRASH_COLLECTION_ID = '6543abef2094933bb4bc';

export const TrashContext = createContext();

export function TrashProvider({ children }) {
  const [trash, setTrash] = useState({
    tasks: [],
    lists: [],
    tags: [],
    notes: [],
  });

  async function handleAddToTrash() {
    const response = await databases.listDocuments(DATABASE_ID, TRASH_COLLECTION_ID);
    setTrash(response.documents);
  }

  return (
    <TrashContext.Provider
      value={{
        trash,
        setTrash,
      }}
    >
      {children}
    </TrashContext.Provider>
  );
}
