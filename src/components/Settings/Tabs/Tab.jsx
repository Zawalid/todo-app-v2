import { useEffect, useRef } from 'react';
import { Button } from '../../Common/Button';

export function Tab({ children, button }) {
  const parent = useRef(null);

  useEffect(() => {
    const tab = parent.current;
    setTimeout(() => {
      tab.classList.remove('opacity-0');
    }, 200);

    return () => tab.classList.add('opacity-0');
  }, []);
  return (
    <div
      className='flex flex-1 flex-col gap-3 overflow-hidden pb-4 pt-16 opacity-0 transition-opacity duration-500 child-padding '
      ref={parent}
    >
      <div className='flex-1 overflow-auto'>{children}</div>
      <div>
        <Button className='mr-0 px-3' text={button.text || 'Save Changes'} {...button} />
      </div>
    </div>
  );
}
