import { createContext, useState } from 'react';
import { databases, appWriteConfig, setPermissions } from '../lib/appwrite/config';
import { ID } from 'appwrite';
import { useDeleteElement } from '../hooks/useDeleteElement';
import { toast } from 'sonner';
import { useUser } from '../hooks/useUser';
import { isElementEmpty } from '../utils/helpers';

const DATABASE_ID = appWriteConfig.databaseId;
const STICKY_NOTES_COLLECTION_ID = appWriteConfig.stickyNotesCollectionId;

export const StickyNotesContext = createContext();

export default function StickyNotesProvider({ children }) {
  const [stickyNotes, setStickyNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [isStickyNoteOpened, setIsStickyNoteOpened] = useState(false);
  const [isStickyNoteEditorOpen, setIsStickyNoteEditorOpen] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [currentProcessedNote, setCurrentProcessedNote] = useState(null);
  const [isNotesLoading, setIsNotesLoading] = useState(true);

  const { handleDeleteElement } = useDeleteElement();
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
      toast.error('Failed to add the sticky note.', {
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
    setCurrentProcessedNote(id);
    try {
      setIsSaving(true);
      const newNote = await databases.updateDocument(
        DATABASE_ID,
        STICKY_NOTES_COLLECTION_ID,
        id,
        note,
      );
      setStickyNotes((notes) => notes.map((n) => (n.$id === id ? newNote : n)));
      if (currentNote?.$id === id) setCurrentNote(newNote);
    } catch (error) {
      toast.error('Failed to update the sticky note.', {
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
      setCurrentProcessedNote(null);
    }
  }

  async function handleDeleteStickyNote(id, deletePermanently, noToast) {
    if (currentProcessedNote === id || currentProcessedNote === 'multiple') return;
    setCurrentProcessedNote(id);

    if (noToast) {
      await handleDeleteElement(
        id,
        STICKY_NOTES_COLLECTION_ID,
        deletePermanently,
        'stickyNotes',
        stickyNotes,
        setStickyNotes,
      );
      return;
    }

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
        loading: 'Deleting note...',
        success: () => {
          toast.dismiss(toastId);
          toast.success('Sticky note has been successfully deleted.');
        },
        error: () => {
          toast.dismiss(toastId);
          toast.error('Failed to delete the sticky note.', {
            duration: 4000,
            action: {
              label: 'Try again',
              onClick: async () => {
                await handleDeleteStickyNote(id, deletePermanently);
              },
            },
          });
        },
        finally: () => setCurrentProcessedNote(null),
      },
    );
   
  }

  async function handleDeleteAllNotes(deletePermanently) {
    setCurrentProcessedNote('multiple');
    const toastId = toast.loading('Deleting notes...', {
      duration: 10000,
    });
    try {
      await Promise.all(
        stickyNotes.map(async (note) => {
          await handleDeleteStickyNote(note.$id, deletePermanently, true);
        }),
      );
      toast.success('Notes have been successfully deleted.', {
        id: toastId,
      });
    } catch (error) {
      toast.error('Failed to delete the notes.', {
        duration: 4000,
        id: toastId,
        action: {
          label: 'Try again',
          onClick: async () => {
            await handleDeleteAllNotes(deletePermanently);
          },
        },
      });
    } finally {
      setCurrentProcessedNote(null);
    }
  }

  async function handleDeleteMultipleNotes(deletePermanently) {
    setCurrentProcessedNote('multiple');
    const toastId = toast.loading('Deleting notes...', {
      duration: 10000,
    });
    try {
      await Promise.all(
        selectedNotes.map(async (note) => {
          await handleDeleteStickyNote(note.$id, deletePermanently, true);
        }),
      );
      toast.success('Notes have been successfully deleted.', {
        id: toastId,
      });
    } catch (error) {
      toast.error('Failed to delete the notes.', {
        duration: 4000,
        id: toastId,
        action: {
          label: 'Try again',
          onClick: async () => {
            await handleDeleteMultipleNotes(deletePermanently);
          },
        },
      });
    } finally {
      setCurrentProcessedNote(null);
    }
  }

  function handleBack($id, title, content) {
    if (!title && isElementEmpty(content)) handleDeleteStickyNote($id, true, true);
    setIsStickyNoteEditorOpen(false);
    setIsStickyNoteOpened(false);
    setCurrentNote(null);
  }

  return (
    <StickyNotesContext.Provider
      value={{
        stickyNotes,
        currentNote,
        isStickyNoteOpened,
        isStickyNoteEditorOpen,
        selectedNotes,
        setCurrentNote,
        setIsStickyNoteOpened,
        setIsStickyNoteEditorOpen,
        handleAddStickyNote,
        handleUpdateStickyNote,
        handleDeleteStickyNote,
        setStickyNotes,
        handleDeleteAllNotes,
        handleDeleteMultipleNotes,
        setSelectedNotes,
        isNotesLoading,
        setIsNotesLoading,
        handleBack,
      }}
    >
      {children}
    </StickyNotesContext.Provider>
  );
}

