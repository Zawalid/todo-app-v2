import Switch from '../../../../Common/Switch';
import { DropDown } from '../../../../Common/DropDown';
import { DEFAULT_FONT_FAMILY } from '../../../../../utils/constants';
import { useModal } from '../../../../../hooks/useModal';
import { Overlay } from '../../../../Common/Modal';
import { GiPin } from 'react-icons/gi';
import { TbPencilCancel } from 'react-icons/tb';
import { IoDuplicateOutline, IoCopyOutline } from 'react-icons/io5';
import { PiExport, PiTrash,PiFilePdf,PiFileHtml,PiFileText } from 'react-icons/pi';
import { BsMarkdown } from "react-icons/bs";

export function Actions({
  children,
  currentNote,
  isOpen,
  readonly,
  pinned,
  fontFamily,
  disabled,
  handlers: {
    onClose,
    onCopy,
    onDuplicate,
    onBack,
    onDelete,
    onReadOnly,
    onPin,
    onExport,
    onChangeFontFamily,
  },
}) {
  const { openModal: confirmDelete } = useModal();
  return (
    <>
      <Overlay isOpen={isOpen} onClose={onClose} />

      <div
        className={`fixed top-0 z-40 flex h-full w-full flex-col border border-border bg-background-primary p-3 shadow-md transition-[right] duration-500 sm:w-[300px]  ${
          isOpen ? 'right-0 ' : '-right-full'
        }`}
      >
        <div className='flex items-center justify-between pb-2'>
          <h3 className='m-0  text-lg font-semibold text-text-primary sm:text-xl'>Actions</h3>
          <button
            className='text-xs font-medium text-primary  hover:text-primary-hover'
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

          <div className='space-y-1'>
            <div
              className={`flex items-center justify-between rounded-md px-3 py-2  transition-colors duration-200  ${
                disabled
                  ? 'bg-background-disabled text-text-disabled'
                  : 'text-text-secondary hover:bg-background-secondary'
              }`}
            >
              <label
                className='grid grid-cols-[15px_auto] items-center gap-2 text-sm font-medium '
                htmlFor='pin'
              >
                <GiPin />
                Pin
              </label>
              <Switch id='pin' checked={pinned} onChange={onPin} disabled={disabled} />
            </div>
            <div
              className={`flex items-center justify-between rounded-md px-3 py-2  transition-colors duration-200  ${
                disabled
                  ? 'bg-background-disabled text-text-disabled'
                  : 'text-text-secondary hover:bg-background-secondary'
              }`}
            >
              <label
                className='grid grid-cols-[15px_auto] items-center gap-2 text-sm font-medium '
                htmlFor='readonly'
              >
                <TbPencilCancel />
                <span>Read only</span>
              </label>
              <Switch id='readonly' checked={readonly} onChange={onReadOnly} disabled={disabled} />
            </div>
          </div>
          <hr className='border border-border' />
          <div className='gap- flex flex-col gap-1'>
            <button
              className='grid grid-cols-[15px_auto] items-center gap-2 rounded-md px-3  py-2 text-sm font-medium text-text-secondary  transition-colors duration-200 hover:bg-background-secondary hover:text-text-primary disabled:bg-background-disabled disabled:text-text-disabled'
              onClick={onCopy}
              disabled={disabled}
            >
              <IoCopyOutline />
              <span className='text-start'>Copy Note</span>
            </button>
            <button
              className='grid grid-cols-[15px_auto] items-center gap-2 rounded-md px-3  py-2 text-sm font-medium text-text-secondary  transition-colors duration-200 hover:bg-background-secondary hover:text-text-primary disabled:bg-background-disabled disabled:text-text-disabled'
              onClick={onDuplicate}
              disabled={disabled}
            >
              <IoDuplicateOutline />
              <span className='text-start'>Duplicate Note</span>
            </button>

            <DropDown
              toggler={
                <>
                  <PiExport />
                  <span className='text-start'>Export As</span>
                </>
              }
              togglerClassName='grid grid-cols-[15px_auto] items-center gap-2 text-sm font-medium  text-text-secondary  hover:text-text-primary hover:bg-background-secondary transition-colors duration-200 py-2 px-3 rounded-md'
              options={{
                className: 'w-[260px]',
                placement: 'bottom-start',
              }}
              togglerDisabled={disabled}
            >
              <DropDown.Button  onClick={() => onExport('pdf')}>
              <PiFilePdf />
                              <span>PDF</span>
              </DropDown.Button>
              <DropDown.Button  onClick={() => onExport('text')}>
              <PiFileText /> 
                             <span>Text</span>
              </DropDown.Button>
              <DropDown.Button  onClick={() => onExport('html')}>
              <PiFileHtml /> 
                <span>HTML</span>
              </DropDown.Button>
              <DropDown.Button  onClick={() => onExport('markdown')}>
              <BsMarkdown /> 
                <span>Markdown</span>
              </DropDown.Button>
            </DropDown>
            <button
              className='grid grid-cols-[15px_auto] items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-red-500  transition-colors duration-200 hover:bg-background-secondary hover:text-red-500'
              onClick={() => {
                confirmDelete({
                  message: 'Are you sure you want to delete this sticky note?',
                  title: 'Delete Sticky Note',
                  onConfirm: async () => (onDelete(), onBack()),
                });
              }}
            >
              <PiTrash />
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
      </div>
    </>
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
          <div
            className='flex flex-col items-center gap-3'
            key={name}
            onClick={() => onChangeFontFamily(name)}
          >
            <button
              className={
                'transition-colorsors h-16 w-16 rounded-md border p-3 text-lg font-medium duration-200  hover:border-primary hover:text-primary sm:h-14 sm:w-14 ' +
                (fontFamily === name
                  ? 'border-primary text-primary'
                  : 'border-border text-text-secondary')
              }
              style={{ fontFamily: name }}
            >
              Ag
            </button>
            <span className='transition-colorsors text-xs text-text-tertiary  duration-200'>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
