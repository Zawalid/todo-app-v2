import { useEffect, useRef } from 'react';
import { Button } from '../../Common/Button';

export function Tab({ children, saveButton, cancelButton }) {
  const parent = useRef(null);

  useEffect(() => {
    const tab = parent.current;

    // Disable all settings that aren't implemented yet
    tab.querySelectorAll('.setting')?.forEach((setting) => {
      if (!setting.classList.contains('not-done')) return;
      [...setting.children].forEach((child) => {
        child.style.pointerEvents = 'none';
      });
    });

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
      <div className='flex  justify-end gap-3'>
        {cancelButton && (
          <Button type='cancel' {...cancelButton}>
            Cancel
          </Button>
        )}
        <Button {...saveButton}>{saveButton.text || 'Save Changes'}</Button>
      </div>
    </div>
  );
}
