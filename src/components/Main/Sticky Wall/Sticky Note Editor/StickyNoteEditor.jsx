import { useParams } from 'react-router-dom';
import TipTap from './Tip Tap/TipTap';
import { SpinnerLoader } from '../../../Common/SpinnerLoader';
import { useStickyNoteById } from '../../../../lib/react-query/queries';

export function StickyNoteEditor() {
  const { noteId } = useParams();
  const { stickyNote, isLoading, isError, error,refetch } = useStickyNoteById(noteId);

  if (isLoading) return <SpinnerLoader />;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className='grid h-[calc(100vh-16px)] grid-rows-[40px_auto_42px] gap-5'>
      <TipTap currentNote={stickyNote} refetch={refetch} />
    </div>
  );
}
