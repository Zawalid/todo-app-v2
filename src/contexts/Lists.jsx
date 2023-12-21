import { createContext, useState } from 'react';
import { databases, appWriteConfig, setPermissions } from '../lib/appwrite/config';
import { ID } from 'appwrite';
import { remove$Properties } from '../utils/helpers';
import { useDeleteElement } from '../hooks/useDeleteElement';
import { useLoadElements } from '../hooks/useLoadElements';
import { toast } from 'sonner';
import { useTrash } from '../hooks/useTrash';
import { useUser } from '../hooks/useUser';

const DATABASE_ID = appWriteConfig.databaseId;
const LISTS_COLLECTION_ID = '65422c65a17f95378d53';

// const SAMPLE_LISTS = [
//   {
//     title: 'Personal',
//     color: '#ff6b6b',
//     $id: '65424b5a69fab6f186d2',
//     $createdAt: '2023-11-01T12:58:02.435+00:00',
//     $updatedAt: '2023-11-01T12:58:02.435+00:00',
//     $permissions: [],
//     $databaseId: '654169b1a5c05d9c1e7e',
//     $collectionId: '65422c65a17f95378d53',
//   },
//   {
//     title: 'Work',
//     color: '#fffebe',
//     $id: '65424b881a6f20cec5cd',
//     $createdAt: '2023-11-01T12:58:48.109+00:00',
//     $updatedAt: '2023-11-01T12:58:48.109+00:00',
//     $permissions: [],
//     $databaseId: '654169b1a5c05d9c1e7e',
//     $collectionId: '65422c65a17f95378d53',
//   },
// ];

export const ListsContext = createContext();

function ListsProvider({ children }) {
  const [lists, setLists] = useState();
  const [isListsLoading, setIsListsLoading] = useState(true);
  const { handleDeleteElement } = useDeleteElement();
  const { handleLoadElements } = useLoadElements();
  const { handleRestoreFromTrash } = useTrash();
  const { user } = useUser();
  const [currentProcessedList, setCurrentProcessedList] = useState(null);

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

    const list = lists?.find((list) => list.$id === id);
    const updatedList = {
      ...list,
      [property]: value,
    };
    remove$Properties(updatedList);

    const toastId = toast.loading('Updating list...');

    try {
      const res = await databases.updateDocument(DATABASE_ID, LISTS_COLLECTION_ID, id, updatedList);
      setLists((lists) => lists?.map((list) => (list.$id === id ? res : list)));
      toast.success('List has been successfully updated.', { id: toastId });
    } catch (error) {
      console.log(error);
      toast.error('Failed to update the list.', {
        action: {
          label: 'Try again',
          onClick: async () => {
            await handleUpdateList(id, property, value);
          },
        },
      });
    } finally {
      setCurrentProcessedList(null);
    }

    // const toastId = toast.promise(
    //   databases.updateDocument(DATABASE_ID, LISTS_COLLECTION_ID, id, updatedList),
    //   {
    //     loading: 'Updating list...',
    //     success: (updatedList) => {
    //       setLists((lists) => lists?.map((list) => (list.$id === id ? updatedList : list)));
    //       return 'List has been successfully updated.';
    //     },
    //     error: () => {
    //       toast.dismiss(toastId);
    //       toast.error('Failed to update the list.', {
    //         action: {
    //           label: 'Try again',
    //           onClick: async () => {
    //             await handleUpdateList(id, property, value);
    //           },
    //         },
    //       });
    //     },
    //     finally: () => setCurrentProcessedList(null),
    //   },
    // );
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
          toast.dismiss(toastId);
          toast.success('List has been successfully deleted.', {
            action: deletePermanently
              ? null
              : {
                  label: 'Undo',
                  onClick: async () => {
                    await handleRestoreFromTrash('lists', id, true);
                    await handleLoadElements(user, LISTS_COLLECTION_ID, setLists);
                  },
                },
          });
        },
        error: () => {
          toast.dismiss(toastId);
          toast.error('Failed to delete the list.', {
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
