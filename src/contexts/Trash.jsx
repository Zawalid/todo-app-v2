import { createContext, useEffect, useMemo, useReducer, useState } from 'react';
import { databases, appWriteConfig, setPermissions } from '../lib/appwrite/config';
import { ID, Query } from 'appwrite';
import { remove$Properties } from '../utils/remove$Properties';
import { toast } from 'sonner';
import { useUser } from '../hooks/useUser';

const {
  databaseId: DATABASE_ID,
  trashCollectionId: TRASH_COLLECTION_ID,
  tasksCollectionId,
  listsCollectionId,
  tagsCollectionId,
  stickyNotesCollectionId,
} = appWriteConfig;

const collectionsIds = {
  tasks: tasksCollectionId,
  lists: listsCollectionId,
  tags: tagsCollectionId,
  stickyNotes: stickyNotesCollectionId,
};

const TRASH_CLEANUP_INTERVAL = 30 * 24 * 60 * 60 * 1000; //(30 days in milliseconds)

export const TrashContext = createContext();

const initialState = {
  trash: {
    tasks: [],
    lists: [],
    tags: [],
    stickyNotes: [],
  },
  $id: '',
  isUpdated: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_TRASH':
      return {
        ...state,
        ...action.payload,
      };
    case 'ADD_TO_TRASH':
      return {
        ...state,
        isUpdated: true,
        trash: {
          ...state.trash,
          [action.payload.type]: [
            ...state.trash[action.payload.type],
            JSON.stringify(action.payload.item),
          ],
        },
      };
    case 'DELETE_FROM_TRASH':
      return {
        ...state,
        isUpdated: true,
        trash: {
          ...state.trash,
          [action.payload.type]: state.trash[action.payload.type].filter(
            (el) => JSON.parse(el).id !== action.payload.itemId,
          ),
        },
      };
    case 'EMPTY_TYPE':
      return {
        ...state,
        isUpdated: true,
        trash: { ...state.trash, [action.payload]: [] },
      };
    case 'EMPTY_TRASH':
      return {
        ...state,
        isUpdated: true,
        trash: initialState.trash,
      };
    case 'TRASH_UPDATED':
      return {
        ...state,
        isUpdated: false,
      };
    default:
      throw new Error(
        `Unknown action type: ${action.type}. Make sure to add the action type to the reducer.`,
      );
  }
}

function TrashProvider({ children }) {
  const [currentTab, setCurrentTab] = useState('tasks');
  const [{ trash, isUpdated, $id, creationDate, lastCleanedUp }, dispatch] = useReducer(
    reducer,
    initialState,
  );
  const trashLength = useMemo(
    () =>
      Object.keys(trash)
        .map((key) => trash[key]?.length)
        .reduce((acc, cur) => acc + cur, 0),
    [trash],
  );
  const { getCurrentUser, checkIsUserAuthenticated } = useUser();
  const [currentProcessedItem, setCurrentProcessedItem] = useState(null);

  // --- Creation ---
  async function createTrash() {
    try {
      const user = await getCurrentUser();
      const response = await databases.createDocument(
        DATABASE_ID,
        TRASH_COLLECTION_ID,
        ID.unique(),
        {
          ...initialState.trash,
          owner: user?.$id,
        },
        setPermissions(user?.$id),
      );
      dispatch({ type: 'LOAD_TRASH', payload: response });
    } catch (error) {
      return;
    }
  }
  async function handleAddToTrash(type, item) {
    dispatch({ type: 'ADD_TO_TRASH', payload: { type, item } });
  }

  // --- Deletion ---
  // To delete a (task, list, tag, stickyNote) permanently:
  async function deleteElement(type, itemId) {
    await databases.deleteDocument(DATABASE_ID, collectionsIds[type], itemId);
  }
  // To delete an item from trash:
  async function deleteItem(type, itemId) {
    dispatch({ type: 'DELETE_FROM_TRASH', payload: { type, itemId } });
  }
  // To delete an item from trash and the corresponding element permanently:
  async function handleDeleteFromTrash(type, itemId) {
    if (
      (currentProcessedItem?.itemId === itemId && currentProcessedItem?.type === type) ||
      currentProcessedItem === 'all'
    )
      return;
    setCurrentProcessedItem({ itemId, type });
    const element = formatItemName(type, true);
    const toastId = toast.promise(
      Promise.all([deleteElement(type, itemId), deleteItem(type, itemId)]),
      {
        loading: `Deleting ${element} permanently...`,
        success: () => {
          toast.success(` ${element} has been deleted permanently.`);
        },
        error: () => {
          toast.dismiss(toastId);
          toast.error(`Failed to delete ${element}!.`, {
            action: {
              label: 'Try Again',
              onClick: () => {
                handleDeleteFromTrash(type, itemId);
              },
            },
          });
        },
        finally: () => setCurrentProcessedItem(null),
      },
    );
  }
  // --- Restoration ---
  // To update an element (task, list, tag, stickyNote) from trash (isTrashed: true)
  async function restoreElement(type, itemId, revert) {
    await databases.updateDocument(DATABASE_ID, collectionsIds[type], itemId, {
      isTrashed: revert ? true : false,
    });
  }
  // To delete an item from trash and restore the corresponding element:
  async function handleRestoreFromTrash(type, itemId, isUndo, updateFunction) {
    if (
      (currentProcessedItem?.itemId === itemId && currentProcessedItem?.type === type) ||
      currentProcessedItem === 'all'
    )
      return;
    setCurrentProcessedItem({ itemId, type });

    const element = formatItemName(type, true);
    const toastId = isUndo ? null : toast.loading(`Restoring ${element}...`);
    try {
      // Restore the element
      await restoreElement(type, itemId);
      // Delete the element from trash
      await deleteItem(type, itemId);
      isUndo ||
        toast.success(`${element} has been successfully restored.`, {
          id: toastId,
          action: {
            label: 'Undo',
            onClick: async () => {
              await handleAddToTrash(
                type,
                JSON.parse(trash[type].find((el) => JSON.parse(el).id === itemId)),
              );
              // Revert the restore operation (isTrashed: true)
              await restoreElement(type, itemId, true);
              updateFunction(type);
            },
          },
        });
    } catch (err) {
      toast.error(`Failed to restore ${element}. Please try again`, {
        id: toastId,
        action: {
          label: 'Try Again',
          onClick: () => {
            handleRestoreFromTrash(type, itemId, isUndo, updateFunction);
          },
        },
      });
    } finally {
      setCurrentProcessedItem(null);
    }
  }
  // --- Emptying ---
  async function handleEmptyType(type) {
    if (currentProcessedItem?.type === type || currentProcessedItem === 'all') return;
    setCurrentProcessedItem({ type });

    const element = formatItemName(type);
    const toastId = toast.promise(
      Promise.all(trash[type].map((item) => deleteElement(type, JSON.parse(item).id))),
      {
        loading: `Emptying ${element} from trash...`,
        success: () => {
          dispatch({ type: 'EMPTY_TYPE', payload: type });
          return `${element} have been successfully emptied.`;
        },
        error: () => {
          toast.dismiss(toastId);
          toast.error(`Failed to empty ${element}. Please try again`, {
            action: {
              label: 'Try Again',
              onClick: () => {
                handleEmptyType(type);
              },
            },
          });
        },
        finally: () => setCurrentProcessedItem(null),
      },
    );
  }
  async function handleEmptyTrash(autoCleanUp) {
    if (currentProcessedItem) return;
    setCurrentProcessedItem('all');

    // const toastId = autoCleanUp ? null : toast.loading(`Emptying trash...`);
    // try {
    //   // Delete all elements from trash permanently
    //   for (const type of Object.keys(collectionsIds)) {
    //     const trashItems = trash[type];
    //     for (const item of trashItems) {
    //       await deleteElement(type, JSON.parse(item).id);
    //     }
    //   }
    //   // Delete all elements from trash
    //   dispatch({ type: 'EMPTY_TRASH' });
    //   !autoCleanUp && toast.success('Trash has been successfully emptied.', { id: toastId });
    // } catch (err) {
    //   !autoCleanUp &&
    //     toast.error('Failed to empty trash!. Please try again', {
    //       id: toastId,
    //       action: {
    //         label: 'Try Again',
    //         onClick: () => {
    //           handleEmptyTrash(autoCleanUp);
    //         },
    //       },
    //     });
    // } finally {
    //   setCurrentProcessedItem(null);
    // }
    const toastId = toast.promise(
      Promise.all(
        ['tasks', 'lists', 'tags', 'stickyNotes'].map((type) => {
          return Promise.all(
            trash[type].map(async (item) => await deleteElement(type, JSON.parse(item).id)),
          );
        }),
      ),

      {
        loading: 'Emptying trash...',
        success: () => {
          dispatch({ type: 'EMPTY_TRASH' });
          return autoCleanUp ? null : 'Trash has been successfully emptied.';
        },
        error: () => {
          toast.dismiss(toastId);
          !autoCleanUp &&
            toast.error('Failed to empty trash!. Please try again', {
              action: {
                label: 'Try Again',
                onClick: () => {
                  handleEmptyTrash(autoCleanUp);
                },
              },
            });
        },
        finally: () => setCurrentProcessedItem(null),
      },
    );
  }
  // get trash from database
  async function handleGetTrash() {
    try {
      const user = await getCurrentUser();
      if (!user) return;
      const response = await databases.listDocuments(DATABASE_ID, TRASH_COLLECTION_ID, [
        Query.equal('owner', [user?.$id]),
      ]);
      const trash = { ...response.documents[0] };
      if (!trash.$id) throw new Error('Trash not found');
      remove$Properties(trash);
      delete trash.owner;
      delete trash.lastCleanedUp;
      dispatch({
        type: 'LOAD_TRASH',
        payload: {
          trash,
          $id: response.documents[0].$id,
          creationDate: response.documents[0].$createdAt,
          lastCleanedUp: response.documents[0].lastCleanedUp,
        },
      });
    } catch (error) {
      return;
    }
  }
  // cleanup trash if it passed 30 days since last cleanup or creation date (if no cleanup was done)
  async function handleCleanUpTrash() {
    const lastCleanedUpTimeStamp =
      new Date(lastCleanedUp).getTime() || new Date(creationDate).getTime();
    const nowTimeStamp = Date.now();

    if (nowTimeStamp - lastCleanedUpTimeStamp >= TRASH_CLEANUP_INTERVAL) {
      await handleEmptyTrash(true);
      dispatch({ type: 'EMPTY_TRASH' });
      databases.updateDocument(DATABASE_ID, TRASH_COLLECTION_ID, $id, {
        lastCleanedUp: new Date().toISOString(),
      });
    }
  }

  // update trash in database
  useEffect(() => {
    if (isUpdated) {
      const newTrash = { ...trash };
      remove$Properties(newTrash);
      databases.updateDocument(DATABASE_ID, TRASH_COLLECTION_ID, $id, newTrash);
      dispatch({ type: 'TRASH_UPDATED' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trash]);

  useEffect(() => {
    async function init() {
      await handleGetTrash();
      lastCleanedUp !== undefined && (await handleCleanUpTrash());
    }
    checkIsUserAuthenticated() && init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastCleanedUp]);

  return (
    <TrashContext.Provider
      value={{
        trash,
        currentTab,
        trashLength,
        setCurrentTab,
        createTrash,
        handleAddToTrash,
        handleDeleteFromTrash,
        handleEmptyType,
        handleEmptyTrash,
        handleRestoreFromTrash,
      }}
    >
      {children}
    </TrashContext.Provider>
  );
}

function formatItemName(type, singular) {
  return type === 'stickyNotes'
    ? 'Sticky notes'
    : type[0].toUpperCase() + type.slice(1, type.length - (singular ? 1 : 0));
}
export default TrashProvider;
