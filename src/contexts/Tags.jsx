import { createContext, useEffect, useState } from 'react';
import { databases, appWriteConfig } from '../AppWrite';
import { ID } from 'appwrite';
import { useDelete } from '../hooks/useDelete';
import { useGetAllElements } from '../hooks/useGetAllElements';
import { toast } from 'sonner';
import { useTrash } from '../hooks/useTrash';

const DATABASE_ID = appWriteConfig.databaseId;
const TAGS_COLLECTION_ID = appWriteConfig.tagsCollectionId;

export const TagsContext = createContext();

export function TagsProvider({ children }) {
  const [tags, setTags] = useState([
    // {
    //   $id: Math.random(),
    //   title: 'Tag 1',
    //   bgColor: '#d1eaed',
    //   textColor: '#444',
    //   index: 0,
    // },
  ]);
  const { handleDeleteElement } = useDelete();
  const { handleGetAllElements } = useGetAllElements();
  const { handleRestoreFromTrash } = useTrash();

  async function handleAddTag(title, bgColor, textColor) {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        TAGS_COLLECTION_ID,
        ID.unique(),
        {
          title,
          bgColor,
          textColor,
        },
      );
      toast.success('Tag added successfully');
      setTags((notes) => [...notes, response]);
    } catch (err) {
      toast.error('Failed to add tag!');
    }
  }
  async function handleDeleteTag(id, deletePermanently) {
    try {
      await handleDeleteElement(id, TAGS_COLLECTION_ID, deletePermanently, 'tags', tags, setTags);
      toast.success('Tag deleted successfully', {
        action: deletePermanently
          ? null
          : {
              label: 'Undo',
              onClick: async () => {
                await handleRestoreFromTrash('tags', id, true);
                await handleGetAllElements(TAGS_COLLECTION_ID, setTags);
              },
            },
      });
    } catch (err) {
      toast.error('Failed to delete tag!');
    }
  }

  useEffect(() => {
    handleGetAllElements(TAGS_COLLECTION_ID, setTags);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <TagsContext.Provider
      value={{
        tags,
        handleAddTag,
        handleDeleteTag,
        setTags,
      }}
    >
      {children}
    </TagsContext.Provider>
  );
}
