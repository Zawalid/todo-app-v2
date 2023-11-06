import { createContext, useEffect, useReducer, useState } from 'react';
import { databases, appWriteConfig } from '../AppWrite';
import { ID } from 'appwrite';
import { remove$Properties } from '../utils/remove$Properties';
import { toast } from 'sonner';

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

export function TrashProvider({ children }) {
  const [currentTab, setCurrentTab] = useState('tasks');
  const [{ trash, isUpdated, $id }, dispatch] = useReducer(reducer, initialState);

  // --- Creation ---
  async function createTrash() {
    const response = await databases.createDocument(
      DATABASE_ID,
      TRASH_COLLECTION_ID,
      ID.unique(),
      initialState.trash,
    );
    dispatch({ type: 'LOAD_TRASH', payload: response });
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
    const element = formatItemName(type,true);
    try {
      // Delete the element permanently
      await deleteElement(type, itemId);
      // Delete the element from trash
      await deleteItem(type, itemId);
      toast.success(` ${element} deleted permanently`);
    } catch (err) {
      toast.error(`Failed to delete ${element}!`);
    }
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
    const element = formatItemName(type, true);
    try {
      // Restore the element
      await restoreElement(type, itemId);
      // Delete the element from trash
      await deleteItem(type, itemId);
      isUndo ||
        toast.success(`${element} restored successfully`, {
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
      toast.error(`Failed to restore ${element}!`);
    }
  }


  // --- Emptying ---
  async function handleEmptyType(type) {
    const element = formatItemName(type);
    const id = toast.loading(`Emptying ${element}...`);
    try {
      // Delete all elements of a type permanently
      for (const item of trash[type]) {
        await deleteElement(type, JSON.parse(item).id);
      }
      // Delete all elements of a type from trash
      dispatch({ type: 'EMPTY_TYPE', payload: type });
      toast.success(`${element} emptied successfully`, { id });
    } catch (err) {
      toast.error(`Failed to empty ${element}!`, { id });
    }
  }
  async function handleEmptyTrash() {
    const id = toast.loading(`Emptying trash...`);
    try {
      // Delete all elements from trash permanently
      for (const type of Object.keys(collectionsIds)) {
        const trashItems = trash[type];
        for (const item of trashItems) {
          await deleteElement(type, JSON.parse(item).id);
        }
      }
      // Delete all elements from trash
      dispatch({ type: 'EMPTY_TRASH' });
      toast.success('Trash emptied successfully', { id });
    } catch (err) {
      console.log(err);
      toast.error('Failed to empty trash!', { id });
    }
  }
  // get trash from database
  useEffect(() => {
    async function getTrash() {
      const response = await databases.listDocuments(DATABASE_ID, TRASH_COLLECTION_ID);
      const trash = { ...response.documents[0] };
      remove$Properties(trash);
      delete trash.owner;
      dispatch({
        type: 'LOAD_TRASH',
        payload: {
          trash,
          $id: response.documents[0].$id,
        },
      });
    }
    getTrash();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  return (
    <TrashContext.Provider
      value={{
        trash,
        currentTab,
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
