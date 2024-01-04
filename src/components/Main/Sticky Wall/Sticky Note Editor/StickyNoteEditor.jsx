import TipTap from './Tip Tap/TipTap';

export function StickyNoteEditor() {
  return (
    <>
      <div className=' grid flex-1 overflow-auto bg-background-primary' id='editor'>
        <div className='border- relative flex h-full flex-col overflow-hidden rounded-lg border-zinc-200 '>
          <TipTap />
        </div>
      </div>
    </>
  );
}
