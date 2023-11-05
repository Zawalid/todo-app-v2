import { appWriteConfig, databases } from '../AppWrite';
import { useGet } from './useGet';
import { useTrash } from './useTrash';

const DATABASE_ID = appWriteConfig.databaseId;

export function useDelete() {
  const { handleAddToTrash } = useTrash();
  const { handleGetAllElements } = useGet();

  async function handleDeleteElement(
    id,
    collectionId,
    deletePermanently,
    elementsName,
    elements,
    setElements,
  ) {
    if (deletePermanently) {
      setElements((elements) => elements.filter((element) => element.$id !== id));
      await databases.deleteDocument(DATABASE_ID, collectionId, id);
    } else {
      await handleAddToTrash(elementsName, {
        id,
        title: elements.find((element) => element.$id === id).title,
      });
      await databases.updateDocument(DATABASE_ID, collectionId, id, {
        isTrashed: true,
      });
    }
    await handleGetAllElements(collectionId, setElements);
  }
  return { handleDeleteElement };
}
