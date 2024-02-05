import { useState } from 'react';
import { toast } from 'sonner';
import { LuServerOff } from "react-icons/lu";
import { appWriteConfig } from '../lib/appwrite/config';
import { useTasks } from './useTasks';
import { useLists } from './useLists';
import { useTags } from './useTags';
import { useStickyNotes } from './useStickyNotes';
import { useLoadElements } from './useLoadElements';

const { tasksCollectionId, listsCollectionId, tagsCollectionId, stickyNotesCollectionId } =
  appWriteConfig;

export function useFetchAllElements() {
  const { setTasks, setIsTasksLoading } = useTasks();
  const { setLists, setIsListsLoading } = useLists();
  const { setTags, setIsTagsLoading } = useTags();
  const { setStickyNotes, setIsNotesLoading } = useStickyNotes();
  const { handleLoadElements } = useLoadElements();
  const [isLoading, setIsLoading] = useState(false);
  const elements = [
    {
      collectionId: tasksCollectionId,
      setElements: setTasks,
      setIsLoading: setIsTasksLoading,
    },
    {
      collectionId: listsCollectionId,
      setElements: setLists,
      setIsLoading: setIsListsLoading,
    },
    {
      collectionId: tagsCollectionId,
      setElements: setTags,
      setIsLoading: setIsTagsLoading,
    },
    {
      collectionId: stickyNotesCollectionId,
      setElements: setStickyNotes,
      setIsLoading: setIsNotesLoading,
    },
  ];

  async function handleFetchAllElements() {
    try {
      setIsLoading(true);
       await Promise.all(
        elements.map(async (element) => {
          await handleLoadElements(
            element.collectionId,
            element.setElements,
            element.setIsLoading,
          );
        }),
      );
    } catch (error) {
      console.log(error);
      if (error.message === 'Server Error') {
        toast.error(' Server Error, Please try again later', {
          icon: <LuServerOff />
        });
      } else {
        toast.error('Something went wrong, Please try again later');
      }
    } finally {
      setIsLoading(false);
    }
  }

  function handleClearAllElements() {
    elements.forEach((element) => {
      element.setElements([]);
      element.setIsLoading && element.setIsLoading(true);
    });
  }
  return { handleFetchAllElements, handleClearAllElements, isLoading };
}
