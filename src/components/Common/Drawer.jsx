import { useEffect, useRef, useState } from 'react';
import { Drawer as D } from 'vaul';

export default function Drawer({ children, onClose, activeSnap, snapPoints }) {
  const [snap, setSnap] = useState(activeSnap);
  const [open, setOpen] = useState(true);
  const overlay = useRef(null);


  useEffect(() => {
    const ol = overlay.current;
    if (open && ol) ol.addEventListener('click', () => setOpen(false));

    return () => ol?.removeEventListener('click', () => setOpen(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overlay.current, open]);

  return (
    <D.Root
      snapPoints={snapPoints}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      onClose={onClose}
      open={open}
    >
      <D.Portal>
        <D.Overlay ref={overlay} className='fixed inset-0 z-[100] bg-black/40' />
        <D.Content className='fixed bottom-0 left-0 right-0 z-[100] mt-24 flex flex-col rounded-t-[10px] bg-background-primary p-3 outline-none'>
          <div className='mx-auto mb-8  h-1.5 w-12 flex-shrink-0 rounded-full bg-text-tertiary' />
          {children}
        </D.Content>
      </D.Portal>
    </D.Root>
  );
}
