import { createContext, useState } from 'react';
import { databases, appWriteConfig, setPermissions } from '../AppWrite';
import { ID } from 'appwrite';
import { useDeleteElement } from '../hooks/useDeleteElement';
import { useLoadElements } from '../hooks/useLoadElements';
import { toast } from 'sonner';
import { useTrash } from '../hooks/useTrash';
import { useUserAuth } from '../hooks/useUserAuth';

const DATABASE_ID = appWriteConfig.databaseId;
const TAGS_COLLECTION_ID = appWriteConfig.tagsCollectionId;

export const TagsContext = createContext();

function TagsProvider({ children }) {
  const [tags, setTags] = useState([
    // {
    //   $id: Math.random(),
    //   title: 'Tag 1',
    //   bgColor: '#d1eaed',
    //   textColor: '#444',
    //   index: 0,
    // },
  ]);
  const [isTagsLoading, setIsTagsLoading] = useState(true);
  const { handleDeleteElement } = useDeleteElement();
  const { handleLoadElements } = useLoadElements();
  const { handleRestoreFromTrash } = useTrash();
  const { user } = useUserAuth();

  async function handleAddTag(title, bgColor, textColor) {
    const toastId = toast.loading('Adding tag...');
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        TAGS_COLLECTION_ID,
        ID.unique(),
        {
          title,
          bgColor,
          textColor,
          owner: user?.$id,
        },
        setPermissions(user?.$id),
      );
      toast.success('Tag has been successfully added.', { id: toastId });
      setTags((notes) => [...notes, response]);
    } catch (err) {
      toast.error('Failed to add the tag.', {
        id: toastId,
        action: {
          label: 'Try Again',
          onClick: () => {
            handleAddTag(title, bgColor, textColor);
          },
        },
      });
    }
  }
  async function handleDeleteTag(id, deletePermanently) {
    const toastId = toast.loading('Deleting tag...');
    try {
      await handleDeleteElement(id, TAGS_COLLECTION_ID, deletePermanently, 'tags', tags, setTags);
      toast.success('Tag has been successfully deleted.', {
        id: toastId,
        action: deletePermanently
          ? null
          : {
              label: 'Undo',
              onClick: async () => {
                await handleRestoreFromTrash('tags', id, true);
                await handleLoadElements(user,TAGS_COLLECTION_ID, setTags);
              },
            },
      });
    } catch (err) {
      toast.error('Failed to delete the tag.', {
        id: toastId,
        action: {
          label: 'Try Again',
          onClick: () => {
            handleDeleteTag(id, deletePermanently);
          },
        },
      });
    }
  }



  return (
    <TagsContext.Provider
      value={{
        tags,
        isTagsLoading,
        setIsTagsLoading,
        handleAddTag,
        handleDeleteTag,
        setTags,
      }}
    >
      {children}
    </TagsContext.Provider>
  );
}
export default TagsProvider;
