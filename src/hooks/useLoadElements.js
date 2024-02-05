import { Query } from 'appwrite';
import { databases, appWriteConfig } from '../lib/appwrite/config';
import { useSelector } from 'react-redux';

const DATABASE_ID = appWriteConfig.databaseId;

export function useLoadElements() {
  const user = useSelector((state) => state.user.user);

  // To make sure the data is loaded correctly, i will try to load it 2 times
  let times = 1;

  async function handleLoadElements(collectionId, setElements, setIsLoading) {
    try {
      if (!user) throw new Error('No user found');
      const response = await databases.listDocuments(DATABASE_ID, collectionId, [
        Query.equal('owner', [user?.$id]),
        Query.equal('isTrashed', [false]),
        Query.limit(300), // TODO : Change this to pagination
      ]);
      setElements(response.documents);

      if (times > 0) {
        times--;
        handleLoadElements(collectionId, setElements, setIsLoading);
      }
    } catch (error) {
      throw new Error(error);
    } finally {
      setIsLoading && setIsLoading(false);
    }
  }
  return { handleLoadElements };
}
