import { Query } from 'appwrite';
import { databases, appWriteConfig } from '../AppWrite';

const DATABASE_ID = appWriteConfig.databaseId;

export function useGetAllElements() {
  async function handleGetAllElements(collectionId, setElements) {
    const response = await databases.listDocuments(DATABASE_ID, collectionId, [
      Query.equal('isTrashed', [false]),
    ]);
    setElements(response.documents);
  }
  return { handleGetAllElements };
}
