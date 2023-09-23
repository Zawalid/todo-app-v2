import TipTap from '../Tip Tap/TipTap';

export function StickyNoteContent({ content, setContent,creationDate }) {
  return <TipTap onUpdateContent={setContent} content={content} creationDate={creationDate} />;
}
