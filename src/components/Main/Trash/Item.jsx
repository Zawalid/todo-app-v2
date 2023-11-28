import CustomTippy from "../../Common/CustomTippy";

export function Item({ title, onDelete, onRestore }) {
  return (
    <li className='flex items-center justify-between rounded-lg bg-background-secondary px-3 py-2'>
      <span className='text-sm font-medium text-text-secondary'>{title}</span>
      <div>
        <CustomTippy content='Restore' trigger='click'>
          <button
            className='mr-1 w-7 cursor-pointer rounded-sm text-text-tertiary transition-colors duration-300 hover:bg-text-secondary hover:text-white'
            onClick={onRestore}
          >
            <i className='fa-solid fa-rotate-left'></i>
          </button>
        </CustomTippy>
        <CustomTippy content='Delete Permanently'>
          <button
            className='w-7 cursor-pointer rounded-sm text-text-tertiary transition-colors duration-300 hover:bg-text-secondary hover:text-white'
            onClick={onDelete}
          >
            <i className='fa-solid fa-trash-can'></i>
          </button>
        </CustomTippy>
      </div>
    </li>
  );
}
