import { createContext, useState } from 'react';
import { databases, appWriteConfig, setPermissions } from '../lib/appwrite/config';
import { ID } from 'appwrite';
import { remove$Properties } from '../utils/remove$Properties';
import { useDeleteElement } from '../hooks/useDeleteElement';
import { useLoadElements } from '../hooks/useLoadElements';
import { toast } from 'sonner';
import { useTrash } from '../hooks/useTrash';
import { useUserAuth } from '../hooks/useUserAuth';

const DATABASE_ID = appWriteConfig.databaseId;
const LISTS_COLLECTION_ID = '65422c65a17f95378d53';

// const SAMPLE_LISTS = [
//   {
//     title: 'Personal',
//     color: '#ff6b6b',
//     tasks: [
//       {
//         title: 'idk',
//         note: '',
//         dueDate: '',
//         listId: '65424b5a69fab6f186d2',
//         subtasks: [],
//         isCompleted: false,
//         tagsIds: [],
//         priority: 0,
//         index: 2,
//         $id: '65419d00b10b220d3f93',
//         $createdAt: '2023-11-01T00:34:08.726+00:00',
//         $updatedAt: '2023-11-01T00:34:08.726+00:00',
//         $permissions: [],
//         $databaseId: '654169b1a5c05d9c1e7e',
//         $collectionId: '65416a6c8f0a546d8b4b',
//       },
//     ],
//     number: 0,
//     index: 3,
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
//     tasks: [],
//     number: 0,
//     index: 4,
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
  const [lists, setLists] = useState([]);
  const [isListsLoading, setIsListsLoading] = useState(true);
  const { handleDeleteElement } = useDeleteElement();
  const { handleLoadElements } = useLoadElements();
  const { handleRestoreFromTrash } = useTrash();
  const { user } = useUserAuth();

  async function handleAddList(title, color, list) {
    const toastId = toast.loading('Adding list...');
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
        {
          ...newList,
          owner: user?.$id,
        },
        setPermissions(user?.$id),
      );
      toast.success('List has been successfully added.', { id: toastId });
      setLists((lists) => [...lists, response]);
    } catch (err) {
      toast.error('Failed to add the list.', {
        id: toastId,
        action: {
          label: 'Try again',
          onClick: async () => {
            await handleAddList(title, color, list);
          },
        },
      });
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
    await handleLoadElements(user,LISTS_COLLECTION_ID, setLists);
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
                await handleLoadElements(user,LISTS_COLLECTION_ID, setLists);
              },
            },
      });
    } catch (err) {
      toast.error('Failed to delete the list.', {
        id: toastId,
        action: {
          label: 'Try again',
          onClick: async () => {
            await handleDeleteList(id, deletePermanently);
          },
        },
      });
    }
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
        handleAddTaskToList,
        setLists,
      }}
    >
      {children}
    </ListsContext.Provider>
  );
}
export default ListsProvider;
