import { Query } from 'appwrite';
import { databases, appWriteConfig } from '../AppWrite';
import { toast } from 'sonner';

const DATABASE_ID = appWriteConfig.databaseId;

export function useGetAllElements() {
  async function handleGetAllElements(collectionId, setElements) {
    try {
      const response = await databases.listDocuments(DATABASE_ID, collectionId, [
        Query.equal('isTrashed', [false]),
      ]);
      setElements(response.documents);
    } catch (error) {
      if (error.message === 'Server Error') {
        toast.error(' Server Error, Please try again later', {
          icon: <i className='fa-solid fa-server text-lg'></i>,
        });
      }
    }
  }
  return { handleGetAllElements };
}
