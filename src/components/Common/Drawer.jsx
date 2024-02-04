import { Drawer as D } from 'vaul';

export default function Drawer({ children, open = true, onClose, shouldClose = true }) {
  return (
    <D.Root onClose={onClose} open={open} dismissible={shouldClose}>
      <D.Portal>
        <D.Overlay
          className='fixed inset-0 bg-black/40 dark:bg-black/70'
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        />
        <D.Content className='ark:bg-background-secondary fixed bottom-0 left-0 right-0 flex flex-col rounded-t-[10px] bg-background-primary p-3 outline-none'>
          <div className='z-10 mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-zinc-300' />
          {children}
        </D.Content>
      </D.Portal>
    </D.Root>
  );
}
