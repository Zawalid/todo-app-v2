import { useParams } from 'react-router-dom';
import TipTap from './Tip Tap/TipTap';
import { SpinnerLoader } from '../../../Common/SpinnerLoader';
import { useStickyNoteById } from '../../../../lib/react-query/queries';
import Error from '../../../Common/Error';

export function StickyNoteEditor() {
  const { noteId } = useParams();
  const { stickyNote, isLoading, error, refetch } = useStickyNoteById(noteId);

  if (isLoading) return <SpinnerLoader />;
  if (error)
    return (
      <Error
        title={error.type === 'document_not_found' && 'No note found with the given ID.'}
        message={
          error.type === 'document_not_found'
            ? 'The note you are looking for does not exist or has been deleted.'
            : error.message
        }
      />
    );

  return (
    <div className='grid h-[calc(100vh-16px)] grid-rows-[40px_auto_42px] gap-5'>
      <TipTap currentNote={stickyNote} refetch={refetch} />
    </div>
  );
}
