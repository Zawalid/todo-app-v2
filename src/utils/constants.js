import { appWriteConfig } from '../lib/appwrite/config';


export const DEFAULT_FONT_FAMILY = `'Lexend Deca', sans-serif`;
export const TRASH_CLEANUP_INTERVAL = 30 * 24 * 60 * 60 * 1000; //(30 days in milliseconds)

const { tasksCollectionId, listsCollectionId, tagsCollectionId, stickyNotesCollectionId } =
  appWriteConfig;

export const COLLECTIONS_IDS = {
  tasks: tasksCollectionId,
  lists: listsCollectionId,
  tags: tagsCollectionId,
  stickyNotes: stickyNotesCollectionId,
};


