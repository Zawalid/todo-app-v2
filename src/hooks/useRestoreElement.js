import { appWriteConfig } from '../lib/appwrite/config';
import { useTasks, useLists, useStickyNotes, useTags, useUser, useLoadElements } from './index';

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
  const { setLists } = useLists();
  const { setStickyNotes } = useStickyNotes();
  const { setTags } = useTags();
  const { user } = useUser();
  const { handleLoadElements } = useLoadElements();

  const setters = {
    tasks: setTasks,
    tags: setTags,
    lists: setLists,
    stickyNotes: setStickyNotes,
  };

  async function handleRestoreElement(type) {
    await handleLoadElements(user, collectionsIds[type], setters[type]);
  }
  return { handleRestoreElement };
}
