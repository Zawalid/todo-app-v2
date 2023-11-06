import { createContext, useEffect } from 'react';
import { databases, appWriteConfig } from '../AppWrite';
import { ID } from 'appwrite';
import { remove$Properties } from '../utils/remove$Properties';
import { useDelete } from '../hooks/useDelete';
import { useGetAllElements } from '../hooks/useGetAllElements';
import { toast } from 'sonner';
import { useTrash } from '../hooks/useTrash';

const DATABASE_ID = appWriteConfig.databaseId;
const LISTS_COLLECTION_ID = '65422c65a17f95378d53';

export const ListsContext = createContext();

export function ListsProvider({ children, lists, setLists }) {
  const { handleDeleteElement } = useDelete();
  const { handleGetAllElements } = useGetAllElements();
  const { handleRestoreFromTrash } = useTrash();

  async function handleAddList(title, color, list) {
    const toastId = toast.loading('Deleting list...');
    try {
      const newList = list
        ? list
        : {
            title,
            color,
            tasks: [],
          };
      const response = await databases.createDocument(
        DATABASE_ID,
        LISTS_COLLECTION_ID,
        ID.unique(),
        newList,
      );
      toast.success('List has been successfully added.', { id: toastId });
      setLists((lists) => [...lists, response]);
    } catch (err) {
      toast.error('Failed to add the list. Please try again.', { id: toastId });
    }
  }
  async function handleUpdateList(id, property, value) {
    const list = lists.find((list) => list.$id === id);
    const updatedList = {
      ...list,
      [property]: value,
    };
    remove$Properties(updatedList);

    await databases.updateDocument(DATABASE_ID, LISTS_COLLECTION_ID, id, updatedList);
    await handleGetAllElements(LISTS_COLLECTION_ID, setLists);
  }
  async function handleRenameList(id, title) {
    handleUpdateList(id, 'title', title);
  }
  async function handleChangeListColor(id, color) {
    handleUpdateList(id, 'color', color);
  }
  async function handleAddTaskToList(listId, taskId) {
    const list = lists.find((l) => l.$id === listId);
    const newTasks = [...list.tasks, taskId];
    handleUpdateList(listId, 'tasks', newTasks);
  }
  async function handleDeleteList(id, deletePermanently) {
    const toastId = toast.loading('Deleting list...');
    try {
      await handleDeleteElement(
        id,
        LISTS_COLLECTION_ID,
        deletePermanently,
        'lists',
        lists,
        setLists,
      );
      toast.success('List has been successfully deleted.', {
        id: toastId,
        action: deletePermanently
          ? null
          : {
              label: 'Undo',
              onClick: async () => {
                await handleRestoreFromTrash('lists', id, true);
                await handleGetAllElements(LISTS_COLLECTION_ID, setLists);
              },
            },
      });
    } catch (err) {
      toast.error('Failed to delete the list. Please try again.', { id: toastId });
    }
  }

  useEffect(() => {
    handleGetAllElements(LISTS_COLLECTION_ID, setLists);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ListsContext.Provider
      value={{
        lists,
        handleAddList,
        handleUpdateList,
        handleDeleteList,
        handleRenameList,
        handleChangeListColor,
        handleAddTaskToList,
        setLists,
      }}
    >
      {children}
    </ListsContext.Provider>
  );
}
