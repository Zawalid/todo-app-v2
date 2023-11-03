import { createContext, useEffect, useState } from 'react';
import { databases,appWriteConfig } from '../AppWrite';
import { ID } from 'appwrite';

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

  async function handleAddTag(title, bgColor, textColor) {
    const response = await databases.createDocument(DATABASE_ID, TAGS_COLLECTION_ID, ID.unique(), {
      title,
      bgColor,
      textColor,
      index: tags.length,
    });
    setTags((notes) => [...notes, response]);
  }
  async function handleDeleteTag(id) {
    await databases.deleteDocument(DATABASE_ID, TAGS_COLLECTION_ID, id);
    setTags((notes) => notes.filter((note) => note.$id !== id));
  }
  async function handleGetAllTags() {
    const response = await databases.listDocuments(DATABASE_ID, TAGS_COLLECTION_ID);
    setTags(response.documents);
  }
  useEffect(() => {
    handleGetAllTags();
  }, []);
  return (
    <TagsContext.Provider
      value={{
        tags,
        handleAddTag,
        handleDeleteTag,
      }}
    >
      {children}
    </TagsContext.Provider>
  );
}
