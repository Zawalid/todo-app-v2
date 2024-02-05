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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!currentNote) return <SpinnerLoader />;
  return (
    <div className='grid h-[calc(100vh-16px)] grid-rows-[40px_auto_42px] gap-5'>
      <TipTap />
    </div>
  );
}
