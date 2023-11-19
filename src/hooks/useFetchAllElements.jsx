import { appWriteConfig } from '../lib/appwrite/config';
import { toast } from 'sonner';
import { useTasks } from './useTasks';
import { useLists } from './useLists';
import { useTags } from './useTags';
import { useStickyNotes } from './useStickyNotes';
import { useLoadElements } from './useLoadElements';
import { useUser } from './useUser';

const { tasksCollectionId, listsCollectionId, tagsCollectionId, stickyNotesCollectionId } =
  appWriteConfig;

export function useFetchAllElements() {
  const { setTasks, setIsTasksLoading } = useTasks();
  const { setLists, setIsListsLoading } = useLists();
  const { setTags, setIsTagsLoading } = useTags();
  const { setStickyNotes } = useStickyNotes();
  const { handleLoadElements } = useLoadElements();
  const { getCurrentUser } = useUser();

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
    },
  ];

  async function handleFetchAllElements() {
    const user = await getCurrentUser();
    try {
      elements.forEach(async (element) => {
        await handleLoadElements(
          user,
          element.collectionId,
          element.setElements,
          element.setIsLoading,
        );
      });
    } catch (error) {
      console.log(error);
      if (error.message === 'Server Error') {
        toast.error(' Server Error, Please try again later', {
          icon: <i className='fa-solid fa-server text-lg'></i>,
        });
      } else {
        toast.error('Something went wrong, Please try again later');
      }
    }
  }

  function handleClearAllElements() {
    elements.forEach((element) => {
      element.setElements([]);
      element.setIsLoading && element.setIsLoading(true);
    });
  }
  return { handleFetchAllElements, handleClearAllElements };
}
