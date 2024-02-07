import { createContext, useState } from 'react';
import { databases, appWriteConfig, setPermissions } from '../lib/appwrite/config';
import { ID } from 'appwrite';
import { useDeleteElement } from '../hooks/useDeleteElement';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { useDeleteSound } from '../hooks/useDeleteSound';

const DATABASE_ID = appWriteConfig.databaseId;
const LISTS_COLLECTION_ID = '65422c65a17f95378d53';

export const ListsContext = createContext();

function ListsProvider({ children }) {
  const [lists, setLists] = useState();
  const [isListsLoading, setIsListsLoading] = useState(true);
  const { handleDeleteElement } = useDeleteElement();
  const user = useSelector((state) => state.user.user);
  const [currentProcessedList, setCurrentProcessedList] = useState(null);
  const playDeleteSound = useDeleteSound();

  async function handleAddList(title, color, list) {
    const newList = list ? list : { title, color };
    const toastId = toast.promise(
      databases.createDocument(
        DATABASE_ID,
        LISTS_COLLECTION_ID,
        ID.unique(),
        {
          ...newList,
          owner: user?.$id,
        },
        setPermissions(user?.$id),
      ),
      {
        loading: 'Adding list...',
        success: (list) => {
          setLists((lists) => [...lists, list]);
          return 'List has been successfully added.';
        },
        error: () => {
          toast.dismiss(toastId);
          toast.error('Failed to add the list.', {
            duration: 4000,
            action: {
              label: 'Try again',
              onClick: async () => {
                await handleAddList(title, color, list);
              },
            },
          });
        },
      },
    );
  }
  async function handleUpdateList(id, property, value) {
    if (currentProcessedList === id) return;
    setCurrentProcessedList(id);

    const toastId = toast.promise(
      databases.updateDocument(DATABASE_ID, LISTS_COLLECTION_ID, id, {
        [property]: value,
      }),
      {
        loading: 'Updating list...',
        success: (updatedList) => {
          setLists((lists) => lists?.map((l) => (l.$id === id ? updatedList : l)));
          return 'List has been successfully deleted.';
        },
        error: () => {
          toast.dismiss(toastId);
          toast.error('Failed to update the list.', {
            duration: 4000,
            action: {
              label: 'Try again',
              onClick: () => {
                handleUpdateList(id, property, value);
              },
            },
          });
        },
        finally: () => setCurrentProcessedList(null),
      },
    );
  }
  async function handleRenameList(id, title) {
    await handleUpdateList(id, 'title', title);
  }
  async function handleChangeListColor(id, color) {
    handleUpdateList(id, 'color', color);
  }
  async function handleDeleteList(id, deletePermanently) {
    if (currentProcessedList === id) return;
    setCurrentProcessedList(id);

    const toastId = toast.promise(
      handleDeleteElement(id, LISTS_COLLECTION_ID, deletePermanently, 'lists', lists, setLists),
      {
        loading: 'Deleting list...',
        success: () => {
          playDeleteSound();
          return 'List has been successfully deleted.';
        },
        error: () => {
          toast.dismiss(toastId);
          toast.error('Failed to delete the list.', {
            duration: 4000,
            action: {
              label: 'Try again',
              onClick: async () => {
                await handleDeleteList(id, deletePermanently);
              },
            },
          });
        },
        finally: () => setCurrentProcessedList(null),
      },
    );
  }

  return (
    <ListsContext.Provider
      value={{
        lists,
        isListsLoading,
        setIsListsLoading,
        handleAddList,
        handleUpdateList,
        handleDeleteList,
        handleRenameList,
        handleChangeListColor,
        setLists,
      }}
    >
      {children}
    </ListsContext.Provider>
  );
}
export default ListsProvider;
