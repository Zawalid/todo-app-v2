import { useSelector } from 'react-redux';
import { COLLECTIONS_IDS } from '../utils/constants';
import { useTasks, useLists, useStickyNotes, useTags,  useLoadElements } from './index';

//* Im using this hook to fetch the elements from the database and set them in the state once i restore them and the reason i can't use this function in the Trash context is the providers are not mounted yet 

export function useRestoreElement() {
  const { setTasks } = useTasks();
  const { setLists } = useLists();
  const { setStickyNotes } = useStickyNotes();
  const { setTags } = useTags();
  const { handleLoadElements } = useLoadElements();
  const user = useSelector((state) => state.user.user);


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
