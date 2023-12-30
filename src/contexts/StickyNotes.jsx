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
const STICKY_NOTES_COLLECTION_ID = appWriteConfig.stickyNotesCollectionId;

export const StickyNotesContext = createContext();

function StickyNotesProvider({ children }) {
  const [stickyNotes, setStickyNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [isStickyNoteOpened, setIsStickyNoteOpened] = useState(false);
  const [isStickyNoteEditorOpen, setIsStickyNoteEditorOpen] = useState(false);
  const { handleDeleteElement } = useDeleteElement();
  const { handleLoadElements } = useLoadElements();
  const { handleRestoreFromTrash } = useTrash();
  const { user } = useUser();

  async function handleAddStickyNote(note) {
    try {
      const newNote = await databases.createDocument(
        DATABASE_ID,
        STICKY_NOTES_COLLECTION_ID,
        ID.unique(),
        {
          ...note,
          owner: user.accountID,
        },
        setPermissions(user?.$id),
      );
      setStickyNotes((notes) => [...notes, newNote]);
      setCurrentNote(newNote);
    } catch (error) {
      toast.error('Failed to add the note.', {
        duration: 4000,
        action: {
          label: 'Try again',
          onClick: async () => {
            await handleAddStickyNote(note);
          },
        },
      });
    }
  }
  async function handleUpdateStickyNote(id, note, setIsSaving) {
    const updatedNote = { ...note };
    remove$Properties(updatedNote);

    try {
      setIsSaving(true);
      const newNote = await databases.updateDocument(
        DATABASE_ID,
        STICKY_NOTES_COLLECTION_ID,
        id,
        updatedNote,
      );
      setStickyNotes((notes) => notes.map((note) => (note.$id === id ? newNote : note)));
      if (currentNote?.$id === id) setCurrentNote(newNote);
    } catch (error) {
      toast.error('Failed to update the note.', {
        duration: 4000,
        action: {
          label: 'Try again',
          onClick: async () => {
            await handleUpdateStickyNote(id, note);
          },
        },
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteStickyNote(id, deletePermanently, noToast) {
    const toastId = toast.promise(
      handleDeleteElement(
        id,
        STICKY_NOTES_COLLECTION_ID,
        deletePermanently,
        'stickyNotes',
        stickyNotes,
        setStickyNotes,
      ),
      {
        loading: noToast ? null : 'Deleting note...',
        success: () => {
          if (noToast) return;
          toast.dismiss(toastId);
          toast.success('Note has been successfully deleted.', {
            duration: 4000,
            action: deletePermanently
              ? null
              : {
                  label: 'Undo',
                  onClick: async () => {
                    await handleRestoreFromTrash('stickyNotes', id, true);
                    await handleLoadElements(user, STICKY_NOTES_COLLECTION_ID, setStickyNotes);
                  },
                },
          });
        },
        error: () => {
          if (noToast) return;
          toast.dismiss(toastId);
          toast.error('Failed to delete the note .', {
            duration: 4000,
            action: {
              label: 'Try again',
              onClick: async () => {
                await handleDeleteStickyNote(id, deletePermanently);
              },
            },
          });
        },
      },
    );
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
export default StickyNotesProvider;
