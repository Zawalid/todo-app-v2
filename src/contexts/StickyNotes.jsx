import { createContext, useEffect, useState } from 'react';
import { databases, appWriteConfig } from '../AppWrite';
import { ID } from 'appwrite';
import { remove$Properties } from '../utils/remove$Properties';
import { useDelete } from '../hooks/useDelete';
import { useGet } from '../hooks/useGet';

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
  const { handleGetAllElements } = useGet();


  async function handleAddStickyNote(note) {
    const response = await databases.createDocument(
      DATABASE_ID,
      STICKY_NOTES_COLLECTION_ID,
      ID.unique(),
      note,
    );
    setStickyNotes((notes) => [...notes, response]);
  }
  async function handleUpdateStickyNote(id, note) {
    console.log(777);
    const updatedNote = { ...note };
    remove$Properties(updatedNote);
    await databases.updateDocument(DATABASE_ID, STICKY_NOTES_COLLECTION_ID, id, updatedNote);
    await handleGetAllElements(STICKY_NOTES_COLLECTION_ID,setStickyNotes);
  }
  async function handleDeleteStickyNote(id,deletePermanently) {
    handleDeleteElement(
      id,
      STICKY_NOTES_COLLECTION_ID,
      deletePermanently,
      'stickyNotes',
      stickyNotes,
      setStickyNotes,
    );
  }

  useEffect(() => {
    handleGetAllElements(STICKY_NOTES_COLLECTION_ID,setStickyNotes);
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
      }}
    >
      {children}
    </StickyNotesContext.Provider>
  );
}
