import { appWriteConfig } from '../AppWrite';
import { useTasks } from './useTasks';
import { useTags } from './useTags';
import { useLists } from './useLists';
import { useStickyNotes } from './useStickyNotes';
import { useLoadElements } from './useLoadElements';
import { useUserAuth } from './useUserAuth';

const { tasksCollectionId, listsCollectionId, tagsCollectionId, stickyNotesCollectionId } =
  appWriteConfig;

const collectionsIds = {
  tasks: tasksCollectionId,
  lists: listsCollectionId,
  tags: tagsCollectionId,
  stickyNotes: stickyNotesCollectionId,
};

export function useRestoreElement() {
  const { setTasks } = useTasks();
  const { setTags } = useTags();
  const { setLists } = useLists();
  const { setStickyNotes } = useStickyNotes();
  const { handleLoadElements } = useLoadElements();
const { user } = useUserAuth();

  const setters = {
    tasks: setTasks,
    tags: setTags,
    lists: setLists,
    stickyNotes: setStickyNotes,
  };

  async function handleRestoreElement(type) {
    await handleLoadElements(user,collectionsIds[type], setters[type]);
  }
  return { handleRestoreElement };
}
