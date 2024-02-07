import { createContext, useState } from 'react';
import { databases, appWriteConfig, setPermissions } from '../lib/appwrite/config';
import { ID } from 'appwrite';
import { useDeleteElement } from '../hooks/useDeleteElement';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { useDeleteSound } from '../hooks/useDeleteSound';

const DATABASE_ID = appWriteConfig.databaseId;
const TAGS_COLLECTION_ID = appWriteConfig.tagsCollectionId;

export const TagsContext = createContext();

function TagsProvider({ children }) {
  const [tags, setTags] = useState([]);
  const [isTagsLoading, setIsTagsLoading] = useState(true);
  const { handleDeleteElement } = useDeleteElement();
  const user = useSelector((state) => state.user.user);
  const playDeleteSound = useDeleteSound();


  async function handleAddTag(title, bgColor, textColor) {
    const toastId = toast.promise(
      databases.createDocument(
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
      ),
      {
        loading: 'Adding tag...',
        success: (tag) => {
          setTags((tags) => [...tags, tag]);
          return 'Tag has been successfully added.';
        },
        error: () => {
          toast.dismiss(toastId);
          toast.error('Failed to add the tag.', {
            duration: 4000,
            action: {
              label: 'Try again',
              onClick: async () => {
                await handleAddTag(title, bgColor, textColor);
              },
            },
          });
        },
      },
    );
  }
  async function handleDeleteTag(id, deletePermanently) {
    const toastId = toast.promise(
      handleDeleteElement(id, TAGS_COLLECTION_ID, deletePermanently, 'tags', tags, setTags),
      {
        loading: 'Deleting tag...',
        success: () => {
          playDeleteSound();
          'Tag  has been successfully deleted.';
        },
        error: () => {
          toast.dismiss(toastId);
          toast.error('Failed to delete the tag .', {
            duration: 4000,
            action: {
              label: 'Try again',
              onClick: async () => {
                await handleDeleteTag(id, deletePermanently);
              },
            },
          });
        },
      },
    );
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
