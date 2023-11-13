import { createContext, useState } from 'react';
import { databases, appWriteConfig, setPermissions } from '../AppWrite';
import { ID } from 'appwrite';
import { remove$Properties } from '../utils/remove$Properties';
import { useDelete } from '../hooks/useDelete';
import { useLoadElements } from '../hooks/useLoadElements';
import { toast } from 'sonner';
import { useTrash } from '../hooks/useTrash';
import { useUserAuth } from '../hooks/useUserAuth';

const DATABASE_ID = appWriteConfig.databaseId;
const STICKY_NOTES_COLLECTION_ID = appWriteConfig.stickyNotesCollectionId;

export const StickyNotesContext = createContext();

 function StickyNotesProvider({ children }) {
  const [stickyNotes, setStickyNotes] = useState(null);
  const [currentNote, setCurrentNote] = useState(null);
  const [isStickyNoteOpened, setIsStickyNoteOpened] = useState(false);
  const [isStickyNoteEditorOpen, setIsStickyNoteEditorOpen] = useState(false);
  const { handleDeleteElement } = useDelete();
  const { handleLoadElements } = useLoadElements();
  const {handleRestoreFromTrash } = useTrash();
  const {user} = useUserAuth()

  async function handleAddStickyNote(note) {
    const toastId = toast.loading('Adding sticky note...')
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        STICKY_NOTES_COLLECTION_ID,
        ID.unique(),
        {
          ...note,
          owner : user.accountID,
        },
        setPermissions(user?.$id),
      );
      toast.success('Sticky note has been successfully added.',{id : toastId});
      setStickyNotes((notes) => [...notes, response]);
    } catch (err) {
      toast.error('Failed to add the sticky note.',{id : toastId,
      action: {
        label: 'Try again',
        onClick: async () => {
          await handleAddStickyNote(note);
        },
      },
      });
    }
  }
  async function handleUpdateStickyNote(id, note) {
    const toastId = toast.loading('Updating sticky note...')
    try {
      const updatedNote = { ...note };
      remove$Properties(updatedNote);
      await databases.updateDocument(DATABASE_ID, STICKY_NOTES_COLLECTION_ID, id, updatedNote);
      toast.success('Sticky note has been successfully updated.',{id : toastId});
    } catch (err) {
      toast.error('Failed to update the sticky note.',{id : toastId,
      action: {
        label: 'Try again',
        onClick: async () => {
          await handleUpdateStickyNote(id, note);
        },
      },
      });
    } finally {
      await handleLoadElements(user,STICKY_NOTES_COLLECTION_ID, setStickyNotes);
    }
  }
  async function handleDeleteStickyNote(id, deletePermanently) {
    const toastId = toast.loading('Deleting sticky note...')
    try {
      await handleDeleteElement(
        id,
        STICKY_NOTES_COLLECTION_ID,
        deletePermanently,
        'stickyNotes',
        stickyNotes,
        setStickyNotes,
      );
      toast.success('Sticky note has been successfully deleted.', {
        id : toastId,
        action: deletePermanently
        ? null
        :{
          label: 'Undo',
          onClick: async () => {
            await handleRestoreFromTrash('stickyNotes', id, true);
            await handleLoadElements(user,STICKY_NOTES_COLLECTION_ID, setStickyNotes);
          },
        },
      });
    } catch (err) {
      toast.error('Failed to delete the sticky note.',{id : toastId,
      action: {
        label: 'Try again',
        onClick: async () => {
          await handleDeleteStickyNote(id, deletePermanently);
        },
      },
      });
    }
  }


  return (
    <StickyNotesContext.Provider
      value={{
        stickyNotes,
        currentNote,
        isStickyNoteOpened,
        isStickyNoteEditorOpen,
        setCurrentNote,
        setIsStickyNoteOpened,
        setIsStickyNoteEditorOpen,
        handleAddStickyNote,
        handleUpdateStickyNote,
        handleDeleteStickyNote,
        setStickyNotes,
      }}
    >
      {children}
    </StickyNotesContext.Provider>
  );
}
export default StickyNotesProvider