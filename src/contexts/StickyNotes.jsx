import { createContext, useState } from 'react';
import { databases, appWriteConfig, setPermissions } from '../lib/appwrite/config';
import { ID } from 'appwrite';
import { remove$Properties } from '../utils/remove$Properties';
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
    const toastId = toast.promise(
      databases.createDocument(
        DATABASE_ID,
        STICKY_NOTES_COLLECTION_ID,
        ID.unique(),
        {
          ...note,
          owner: user.accountID,
        },
        setPermissions(user?.$id),
      ),
      {
        loading: 'Adding sticky note...',
        success: (note) => {
          setStickyNotes((notes) => [...notes, note]);
          return 'Sticky note has been successfully added.';
        },
        error: () => {
          toast.dismiss(toastId);
          toast.error('Failed to add the sticky note.', {
            action: {
              label: 'Try again',
              onClick: async () => {
                await handleAddStickyNote(note);
              },
            },
          });
        },
      },
    );
  }
  async function handleUpdateStickyNote(id, note) {
    const updatedNote = { ...note };
    remove$Properties(updatedNote);
    const toastId = toast.promise(
      databases.updateDocument(DATABASE_ID, STICKY_NOTES_COLLECTION_ID, id, updatedNote),
      {
        loading: 'Updating sticky note ...',
        success: (updatedNote) => {
          setStickyNotes((notes) => notes.map((note) => (note.$id === id ? updatedNote : note)));
          return 'Sticky note has been successfully updated.';
        },
        error: () => {
          toast.dismiss(toastId);
          toast.error('Failed to update the sticky note.', {
            action: {
              label: 'Try again',
              onClick: async () => {
                await handleUpdateStickyNote(id, note);
              },
            },
          });
        },
      },
    );
  }
  async function handleDeleteStickyNote(id, deletePermanently) {
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
        loading: 'Deleting sticky note...',
        success: () => {
          toast.dismiss(toastId);
          toast.success('Sticky note  has been successfully deleted.', {
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
          toast.dismiss(toastId);
          toast.error('Failed to delete the sticky note .', {
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
