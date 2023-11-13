import { appWriteConfig } from '../AppWrite';
import { toast } from 'sonner';
import { useTasks } from './useTasks';
import { useLists } from './useLists';
import { useTags } from './useTags';
import { useStickyNotes } from './useStickyNotes';
import { useLoadElements } from './useLoadElements';
import { useUserAuth } from './useUserAuth';

const { tasksCollectionId, listsCollectionId, tagsCollectionId, stickyNotesCollectionId } =
  appWriteConfig;

export function useFetchAllElements() {
  const { setTasks, setIsTasksLoading } = useTasks();
  const { setLists, setIsListsLoading } = useLists();
  const { setTags, setIsTagsLoading } = useTags();
  const { setStickyNotes } = useStickyNotes();
  const { handleLoadElements } = useLoadElements();
  const { getCurrentUser } = useUserAuth();


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
    elements.forEach(async (element) => {
      await handleLoadElements(user,element.collectionId, element.setElements, element.setIsLoading);
    });
  }
  return { handleFetchAllElements };
}
