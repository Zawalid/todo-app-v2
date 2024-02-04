import { useParams } from 'react-router-dom';
import TipTap from './Tip Tap/TipTap';
import { useStickyNotes } from '../../../../hooks';
import { useEffect } from 'react';
import { SpinnerLoader } from '../../../Common/SpinnerLoader';

export function StickyNoteEditor() {
  const { noteId } = useParams();
  const { handleGetStickyNote, currentNote } = useStickyNotes();

  useEffect(() => {
    handleGetStickyNote(noteId);
  }, []);

  if (!currentNote) return <SpinnerLoader />;
  return <TipTap />;
}
