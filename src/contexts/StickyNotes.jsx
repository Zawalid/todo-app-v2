import { createContext, useEffect, useState } from 'react';
import { databases, appWriteConfig } from '../AppWrite';
import { ID } from 'appwrite';
import { remove$Properties } from '../utils/remove$Properties';
import { useDelete } from '../hooks/useDelete';
import { useGetAllElements } from '../hooks/useGetAllElements';
import { toast } from 'sonner';

const DATABASE_ID = appWriteConfig.databaseId;
const STICKY_NOTES_COLLECTION_ID = appWriteConfig.stickyNotesCollectionId;

export const StickyNotesContext = createContext();

export function StickyNotesProvider({ children }) {
  const [stickyNotes, setStickyNotes] = useState([
    // {
    //   id: Math.random(),
    //   title: 'Social Media',
    //   content: '- Plan social content - Build content calendar - Plan promotion and distribution',
    //   description: 'Social Media',
    //   bgColor: '#fdf2b3',
    //   textColor: '#444',
    //   creationDate: new Date().toLocaleDateString(),
    //   index: 0,
    // },
    // {
    //   id: Math.random(),
    //   title: 'Content Strategy',
    //   content:
    //     'Would need time to get insights (goals, personals, budget, audits), but after, it would be good to focus on assembling my team (start with SEO specialist, then perhaps an email marketer?). Also need to brainstorm on tooling.',
    //   description: 'Content Strategy',
    //   bgColor: '#d1eaed',
    //   textColor: '#444',
    //   creationDate: new Date().toLocaleDateString(),
    //   index: 1,
    // },
  ]);
  const [currentNote, setCurrentNote] = useState(null);
  const [isStickyNoteOpened, setIsStickyNoteOpened] = useState(false);
  const [isStickyNoteEditorOpen, setIsStickyNoteEditorOpen] = useState(false);
  const { handleDeleteElement } = useDelete();
  const { handleGetAllElements } = useGetAllElements();

  async function handleAddStickyNote(note) {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        STICKY_NOTES_COLLECTION_ID,
        ID.unique(),
        note,
      );
      toast.success('Sticky note added successfully');
      setStickyNotes((notes) => [...notes, response]);
    } catch (err) {
      toast.error('Failed to add sticky note!');
    }
  }
  async function handleUpdateStickyNote(id, note) {
    try {
      const updatedNote = { ...note };
      remove$Properties(updatedNote);
      await databases.updateDocument(DATABASE_ID, STICKY_NOTES_COLLECTION_ID, id, updatedNote);
      toast.success('Sticky note updated successfully');
    } catch (err) {
      toast.error('Failed to update sticky note!');
    } finally {
      await handleGetAllElements(STICKY_NOTES_COLLECTION_ID, setStickyNotes);
    }
  }
  async function handleDeleteStickyNote(id, deletePermanently) {
    try {
      await handleDeleteElement(
        id,
        STICKY_NOTES_COLLECTION_ID,
        deletePermanently,
        'stickyNotes',
        stickyNotes,
        setStickyNotes,
      );
      toast.success('Sticky note deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete sticky note!');
    }
  }

  useEffect(() => {
    handleGetAllElements(STICKY_NOTES_COLLECTION_ID, setStickyNotes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
