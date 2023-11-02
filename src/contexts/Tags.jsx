import { createContext, useEffect, useState } from 'react';
import { databases } from '../AppWrite';
import { ID } from 'appwrite';

export const DATABASE_ID = '654169b1a5c05d9c1e7e';
export const TAGS_COLLECTION_ID = '6542b79c47bd7ff66622';

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
