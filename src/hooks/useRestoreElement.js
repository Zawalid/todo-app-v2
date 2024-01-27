import { COLLECTIONS_IDS } from '../utils/constants';
import { useTasks, useLists, useStickyNotes, useTags, useUser, useLoadElements } from './index';

//* Im using this hook to fetch the elements from the database and set them in the state once i restore them and the reason i can't use this function in the Trash context is the providers are not mounted yet 

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
    await handleLoadElements(user, COLLECTIONS_IDS[type], setters[type]);
  }
  return { handleRestoreElement };
}
