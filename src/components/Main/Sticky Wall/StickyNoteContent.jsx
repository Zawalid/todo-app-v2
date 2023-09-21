import { useEffect } from 'react';

export function StickyNoteContent({ content, setContent, onType }) {
  useEffect(() => {
    onType(content);
  }, [content, onType]);
  return (
    <div className='flex-1'>
      <textarea
        className='h-full w-full  resize-none  bg-transparent p-5 focus:outline-none'
        placeholder='Start typing...'
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
    </div>
  );
}
