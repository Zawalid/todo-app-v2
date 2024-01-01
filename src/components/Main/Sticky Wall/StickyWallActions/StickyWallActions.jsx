import { DropDown } from '../../../Common/DropDown';
import SortNotes from './SortNotes';

export default function StickyWallActions({
  options: {
    view,
    setView,
    sortBy,
    setSortBy,
    direction,
    setDirection,
    setIsConfirmationModalOpen,
    setIsSelecting
  },
}) {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex gap-3'>
        <button
          className={
            'h-8 w-8 rounded-full bg-background-primary transition-colors duration-300 hover:bg-background-secondary ' +
            (view === 'list'
              ? 'bg-background-secondary  text-text-secondary'
              : 'text-text-tertiary ')
          }
          onClick={() => setView('list')}
        >
          <i className='fa-solid fa-list'></i>
        </button>
        <button
          className={
            'grid h-8 w-8 place-content-center rounded-full bg-background-primary  transition-colors duration-300 hover:bg-background-secondary ' +
            (view === 'grid'
              ? 'bg-background-secondary  text-text-secondary'
              : 'text-text-tertiary ')
          }
          onClick={() => setView('grid')}
        >
          <svg
            stroke='currentColor'
            fill='currentColor'
            strokeWidth='0'
            viewBox='0 0 512 512'
            height='16px'
            width='16px'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path d='M204 240H68a36 36 0 01-36-36V68a36 36 0 0136-36h136a36 36 0 0136 36v136a36 36 0 01-36 36zm240 0H308a36 36 0 01-36-36V68a36 36 0 0136-36h136a36 36 0 0136 36v136a36 36 0 01-36 36zM204 480H68a36 36 0 01-36-36V308a36 36 0 0136-36h136a36 36 0 0136 36v136a36 36 0 01-36 36zm240 0H308a36 36 0 01-36-36V308a36 36 0 0136-36h136a36 36 0 0136 36v136a36 36 0 01-36 36z'></path>
          </svg>
        </button>
      </div>
      <div className='flex gap-3'>
        <button className='grid h-8 w-8 place-content-center rounded-full bg-background-primary text-text-tertiary transition-colors duration-300 hover:bg-background-secondary'
          onClick={() => setIsSelecting(prev => !prev)}
        >
          <svg
            stroke='currentColor'
            fill='currentColor'
            strokeWidth='0'
            viewBox='0 0 256 256'
            height='20px'
            width='20px'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path d='M228,128a12,12,0,0,1-12,12H128a12,12,0,0,1,0-24h88A12,12,0,0,1,228,128ZM128,76h88a12,12,0,0,0,0-24H128a12,12,0,0,0,0,24Zm88,104H128a12,12,0,0,0,0,24h88a12,12,0,0,0,0-24ZM79.51,39.51,56,63l-7.51-7.52a12,12,0,0,0-17,17l16,16a12,12,0,0,0,17,0l32-32a12,12,0,0,0-17-17Zm0,64L56,127l-7.51-7.52a12,12,0,1,0-17,17l16,16a12,12,0,0,0,17,0l32-32a12,12,0,0,0-17-17Zm0,64L56,191l-7.51-7.52a12,12,0,1,0-17,17l16,16a12,12,0,0,0,17,0l32-32a12,12,0,0,0-17-17Z'></path>
          </svg>
        </button>
        <DropDown
          toggler={<i className='fa-solid fa-ellipsis-v text-xl'></i>}
          togglerClassName='h-8 w-8 rounded-full bg-background-primary text-text-tertiary transition-colors duration-300 hover:bg-background-secondary'
          options={{ className: 'w-52', shouldCloseOnClick: false }}
        >
          <SortNotes
            options={{
              sortBy,
              setSortBy,
              direction,
              setDirection,
            }}
          />
          <DropDown.Divider />
          <DropDown.Button onClick={() => setIsConfirmationModalOpen(true)} isDeleteButton={true}>
            <i className='fa-solid fa-trash-can '></i>
            <span>Delete All</span>
          </DropDown.Button>
        </DropDown>
      </div>
    </div>
  );
}
