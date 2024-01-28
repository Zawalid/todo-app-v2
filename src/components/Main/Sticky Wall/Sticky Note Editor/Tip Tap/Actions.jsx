import { useState } from 'react';
import Switch from '../../../../Common/Switch';
import { ConfirmationModal } from '../../../../Common/ConfirmationModal';
import { DropDown } from '../../../../Common/DropDown';
import { DEFAULT_FONT_FAMILY } from '../../../../../utils/constants';

export function Actions({
  children,
  currentNote,
  isOpen,
  readonly,
  pinned,
  fontFamily,
  handlers: {
    onClose,
    onCopy,
    onDelete,
    onBack,
    onReadOnly,
    onPin,
    onExport,
    onChangeFontFamily,
    onToggleDarkMode,
  },
}) {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [deletePermanently, setDeletePermanently] = useState(false);
  return (
    <div
      className={
        'fixed top-0 z-[10001] flex h-full w-full flex-col border bg-background-primary p-3 shadow-md transition-[right] sm:w-[300px]  ' +
        (isOpen ? 'right-0 duration-700' : '-right-full duration-[.9s] ')
      }
    >
      <div className='flex items-center justify-between pb-2'>
        <h3 className='m-0  text-lg font-semibold text-text-primary sm:text-xl'>Actions</h3>
        <button
          className='text-xs font-medium text-primary transition-colors duration-300 hover:text-primary-hover'
          onClick={onClose}
        >
          Done{' '}
        </button>
      </div>
      <hr className='border border-border' />
      <div className='mt-2 flex flex-1 flex-col gap-2 overflow-auto'>
        <div className='space-y-3'>
          <FontFamilies fontFamily={fontFamily} onChangeFontFamily={onChangeFontFamily} />
          {children}
        </div>
        <hr className='border border-border' />

        <div>
          <div className='flex items-center justify-between rounded-md px-3 py-2 transition-colors duration-300 hover:bg-background-secondary '>
            <label
              className=' grid grid-cols-[15px_auto] items-center gap-2 text-sm font-medium  text-text-secondary'
              htmlFor='pin'
            >
              <i className='fa-solid fa-thumbtack'></i> <span>Pin</span>
            </label>
            <Switch id='pin' checked={pinned} onChange={onPin} />
          </div>
          <div className='flex items-center justify-between rounded-md px-3 py-2 transition-colors duration-300 hover:bg-background-secondary '>
            <label
              className=' grid grid-cols-[15px_auto] items-center gap-2 text-sm font-medium  text-text-secondary'
              htmlFor='readonly'
            >
              <svg
                viewBox='0 0 24 24'
                width='17px'
                height='17px'
                className='text-text-secondary'
                fill='currentColor'
              >
                <path
                  className='text-text-secondary'
                  d='M16.1,9L17,9.9L7.9,19H7V18.1L16.1,9M19.7,3C19.5,3 19.2,3.1 19,3.3L17.2,5.1L20.9,8.9L22.7,7C23.1,6.6 23.1,6 22.7,5.6L20.4,3.3C20.2,3.1 19.9,3 19.7,3M16.1,6.2L5,17.2V21H8.8L19.8,9.9L16.1,6.2M8,5V4.5C8,3.1 6.9,2 5.5,2C4.1,2 3,3.1 3,4.5V5C2.4,5 2,5.4 2,6V10C2,10.6 2.4,11 3,11H8C8.6,11 9,10.6 9,10V6C9,5.4 8.6,5 8,5M7,5H4V4.5C4,3.7 4.7,3 5.5,3C6.3,3 7,3.7 7,4.5V5Z'
                ></path>
              </svg>
              <span>Read only</span>
            </label>
            <Switch id='readonly' checked={readonly} onChange={onReadOnly} />
          </div>
          <div className='flex items-center justify-between rounded-md px-3 py-2 transition-colors duration-300 hover:bg-background-secondary '>
            <label
              className=' grid grid-cols-[15px_auto] items-center gap-2 text-sm font-medium  text-text-secondary'
              htmlFor='darkMode'
            >
              <svg
                stroke='currentColor'
                fill='currentColor'
                strokeWidth='0'
                viewBox='0 0 16 16'
                height='1em'
                width='1em'
                className='text-text-secondary'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path d='M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z'></path>
                <path d='M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z'></path>
              </svg>
              <span>Dark Mode</span>
            </label>
            <Switch id='darkMode'  onChange={onToggleDarkMode} />
          </div>
        </div>
        <hr className='border border-border' />
        <div className='gap- flex flex-col'>
          <button
            className='grid grid-cols-[15px_auto] items-center gap-2 rounded-md px-3  py-2 text-sm font-medium text-text-secondary transition-colors duration-300 hover:bg-background-secondary hover:text-text-primary'
            onClick={onCopy}
          >
            <i className='fa-solid fa-clone'></i>
            <span className='text-start'>Copy Note</span>
          </button>

          <DropDown
            toggler={
              <>
                <i className='fa-solid fa-file-export'></i>
                <span className='text-start'>Export As</span>
              </>
            }
            togglerClassName='grid grid-cols-[15px_auto] items-center gap-2 text-sm font-medium  text-text-secondary transition-colors duration-300 hover:text-text-primary hover:bg-background-secondary py-2 px-3 rounded-md'
            options={{
              className: 'w-[260px]',
              placement: 'bottom-start',
            }}
          >
            <DropDown.Button className='text-center' onClick={() => onExport('pdf')}>
              <i className='fa-solid fa-file-pdf w-4'></i>
              <span>PDF</span>
            </DropDown.Button>
            <DropDown.Button className='text-center' onClick={() => onExport('text')}>
              <i className='fa-solid fa-file-lines w-4'></i>
              <span>Text</span>
            </DropDown.Button>
            <DropDown.Button className='text-center' onClick={() => onExport('html')}>
              <i className='fa-brands fa-html5 w-4'></i>
              <span>HTML</span>
            </DropDown.Button>
            <DropDown.Button className='text-center' onClick={() => onExport('markdown')}>
              <i className='fa-brands fa-markdown w-4'></i>
              <span>Markdown</span>
            </DropDown.Button>
          </DropDown>
          <button
            className='grid grid-cols-[15px_auto] items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-red-500 transition-colors duration-300 hover:bg-background-secondary hover:text-text-error'
            onClick={() => setIsConfirmationModalOpen(true)}
          >
            <i className='fa-solid fa-trash-can'></i>
            <span className='text-start'>Delete Note</span>
          </button>
        </div>

        <div className='mt-auto'>
          <hr className='mb-2 border border-border' />
          <p className='mb-1 text-xs font-medium text-text-secondary '>
            Created :{' '}
            {new Intl.DateTimeFormat('en-US', {
              dateStyle: 'medium',
              timeStyle: 'short',
            }).format(new Date(currentNote?.$createdAt || Date.now()))}
          </p>
          <p className='text-xs font-medium text-text-secondary '>
            Last modified :{' '}
            {new Intl.DateTimeFormat('en-US', {
              dateStyle: 'medium',
              timeStyle: 'short',
            }).format(new Date(currentNote?.$updatedAt || Date.now()))}
          </p>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        sentence='Are you sure you want to delete this sticky note?'
        confirmText='Delete'
        onConfirm={() => {
          onDelete(deletePermanently);
          setIsConfirmationModalOpen(false);
          onBack();
        }}
        onCancel={() => setIsConfirmationModalOpen(false)}
        element='Sticky Note'
        checked={deletePermanently}
        setChecked={setDeletePermanently}
      />
    </div>
  );
}

function FontFamilies({ fontFamily, onChangeFontFamily }) {
  const families = [
    {
      name: DEFAULT_FONT_FAMILY,
      label: 'Default',
    },
    {
      name: 'serif',
      label: 'Serif',
    },
    {
      name: 'monospace',
      label: 'Mono',
    },
    {
      name: 'cursive',
      label: 'Cursive',
    },
  ];
  return (
    <div className='space-y-2'>
      <span className='text-sm  font-medium text-text-secondary'>Font Family</span>
      <div className='flex gap-3'>
        {families.map(({ name, label }) => (
          <div className='text-center ' key={name} onClick={() => onChangeFontFamily(name)}>
            <button
              className={
                'h-16 w-16 rounded-md border p-3 text-lg font-medium transition-colors duration-300 hover:border-primary hover:text-primary sm:h-14 sm:w-14 ' +
                (fontFamily === name
                  ? 'border-primary text-primary'
                  : 'border-border text-text-secondary')
              }
              style={{ fontFamily: name }}
            >
              Ag
            </button>
            <span className='text-xs  text-text-tertiary'>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
