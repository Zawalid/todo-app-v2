import { createContext, useState } from 'react';
import { databases, appWriteConfig, setPermissions } from '../lib/appwrite/config';
import { ID } from 'appwrite';
import { useDeleteElement } from '../hooks/useDeleteElement';
import { toast } from 'sonner';
import { getDeletionMessage, isElementEmpty } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDeleteSound } from '../hooks/useDeleteSound';

const DATABASE_ID = appWriteConfig.databaseId;
const STICKY_NOTES_COLLECTION_ID = appWriteConfig.stickyNotesCollectionId;

export const StickyNotesContext = createContext();

export default function StickyNotesProvider({ children }) {
  const [stickyNotes, setStickyNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [currentProcessedNote, setCurrentProcessedNote] = useState(null);
  const [isNotesLoading, setIsNotesLoading] = useState(true);
  const { handleDeleteElement } = useDeleteElement();
  const user = useSelector((state) => state.user.user);
  const { defaultColor } = useSelector((state) => state.settings.general.stickyNotes);
  const navigate = useNavigate();
  const playDeleteSound = useDeleteSound();

  async function handleAddStickyNote(note, duplicate) {
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
      if (duplicate) return toast.success('Sticky note duplicated successfully.');
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
      console.log(error);
      toast.error('Something went wrong.');
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
          playDeleteSound();
          return getDeletionMessage('sticky note', 'success', true);
        },
        error: () => {
          toast.dismiss(toastId);
          toast.error(getDeletionMessage('sticky note', 'error', true), {
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
    const toastId = toast.promise(
      Promise.all(
        stickyNotes.map(async (note) => {
          await handleDeleteStickyNote(note.$id, deletePermanently, true);
        }),
      ),
      {
        loading: 'Deleting sticky notes...',
        success: () => {
          playDeleteSound();
          return getDeletionMessage('sticky note', 'success', false, false);
        },
        error: () => {
          toast.dismiss(toastId);
          toast.error(getDeletionMessage('sticky note', 'error', false, false), {
            duration: 4000,
            action: {
              label: 'Try again',
              onClick: async () => {
                await handleDeleteAllNotes(deletePermanently);
              },
            },
          });
        },
        finally: () => setCurrentProcessedNote(null),
      },
    );
  }
  async function handleDeleteMultipleNotes(deletePermanently) {
    setCurrentProcessedNote('multiple');

    const toastId = toast.promise(
      Promise.all(
        selectedNotes.map(async (note) => {
          await handleDeleteStickyNote(note.$id, deletePermanently, true);
        }),
      ),
      {
        loading: 'Deleting sticky notes...',
        success: () => {
          playDeleteSound();
          return getDeletionMessage('sticky note', 'success', false, true, selectedNotes.length);
        },
        error: () => {
          toast.dismiss(toastId);
          toast.error(
            getDeletionMessage('sticky note', 'error', false, true, selectedNotes.length),
            {
              duration: 4000,
              action: {
                label: 'Try again',
                onClick: async () => {
                  await handleDeleteMultipleNotes(deletePermanently);
                },
              },
            },
          );
        },
        finally: () => setCurrentProcessedNote(null),
      },
    );
  }
  async function handleGetStickyNote(id) {
    if (id === 'new') {
      if (currentNote) return;
      const note = {
        title: '',
        content: '<p></p>',
        bgColor: defaultColor,
        textColor: '#fff',
        readonly: false,
        pinned: false,
        fontFamily: `'Lexend Deca', sans-serif`,
      };
      handleAddStickyNote(note);
      return setCurrentNote(note);
    }
    if (stickyNotes.length > 0) {
      const note = stickyNotes.find((n) => n.$id === id);
      if (note) return setCurrentNote(note);
    }
    try {
      const note = await databases.getDocument(DATABASE_ID, STICKY_NOTES_COLLECTION_ID, id);
      setCurrentNote(note);
    } catch (error) {
      toast.error(
        error.code === 404 ? 'Sticky note not found.' : 'Something went wrong while fetching note.',
        {
          duration: 4000,
          action: {
            label: 'Try again',
            onClick: async () => {
              await handleGetStickyNote();
            },
          },
        },
      );
      navigate('/app/sticky-wall');
    }
  }

  function handleBack($id, title, content) {
    setCurrentNote(null);
    if (!title && isElementEmpty(content)) handleDeleteStickyNote($id, true, true);
    navigate('/app/sticky-wall');
  }

  return (
    <StickyNotesContext.Provider
      value={{
        stickyNotes,
        currentNote,
        selectedNotes,
        isNotesLoading,
        setStickyNotes,
        setSelectedNotes,
        setIsNotesLoading,
        handleAddStickyNote,
        handleUpdateStickyNote,
        handleDeleteStickyNote,
        handleDeleteAllNotes,
        handleDeleteMultipleNotes,
        handleGetStickyNote,
        handleBack,
      }}
    >
      {children}
    </StickyNotesContext.Provider>
  );
}
