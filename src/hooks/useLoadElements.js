import { Query } from 'appwrite';
import { databases, appWriteConfig } from '../lib/appwrite/config';

const DATABASE_ID = appWriteConfig.databaseId;

export function useLoadElements() {
  async function handleLoadElements(user, collectionId, setElements, setIsLoading) {
    
    if (!user) return;
    try {
      const response = await databases.listDocuments(DATABASE_ID, collectionId, [
        Query.equal('owner', [user?.$id]),
        Query.equal('isTrashed', [false]),
        Query.limit(100), // TODO : Change this to pagination
      ]);
      
      setElements(response.documents);
      setIsLoading && setIsLoading(false);
    } catch (error) {
      throw new Error(error);
    }
  }
  return { handleLoadElements };
}
